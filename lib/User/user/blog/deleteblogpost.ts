"use server";

import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteBlogPostFromMeili } from "./meilisync";
import { revalidatePath } from "next/cache";

export async function deleteBlogPost(postId: string) {
  try {
    if (!postId) {
      return { success: false, error: "Post ID is required." };
    }

    const session = await getCachedSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please login to delete." };
    }

    // Find the post and check that the current user is the author
    const post = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        authorProfile: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        slug: true,
        categoryId: true,
      },
    });

    if (!post) {
      return { success: false, error: "Post not found or you are not authorized to delete it." };
    }

    // Delete post from DB
    await prisma.blogPost.delete({
      where: { id: postId },
    });

    // Delete post from Meilisearch
    await deleteBlogPostFromMeili(postId);

    // Revalidate paths for instant UI updates
    revalidatePath("/blog");
    revalidatePath("/blog/my-posts");
    revalidatePath("/blog/search");
    revalidatePath(`/blog/${post.slug}`);
    if (post.categoryId) {
      const cat = await prisma.blogCategory.findUnique({ where: { id: post.categoryId }, select: { slug: true } });
      if (cat?.slug) {
        revalidatePath(`/blog/category/${cat.slug}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post." };
  }
}
