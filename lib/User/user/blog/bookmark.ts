"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export interface ToggleBookmarkResult {
  success: boolean;
  bookmarked: boolean;
  bookmarkCount: number;
  message?: string;
}

export async function toggleBookmark(postId: string, slug: string): Promise<ToggleBookmarkResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, bookmarked: false, bookmarkCount: 0, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if bookmark exists
    const existingBookmark = await prisma.blogBookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingBookmark) {
      // Un-bookmark transaction
      const [, post] = await prisma.$transaction([
        prisma.blogBookmark.delete({ where: { id: existingBookmark.id } }),
        prisma.blogPost.update({
          where: { id: postId },
          data: { bookmarkCount: { decrement: 1 } },
          select: { bookmarkCount: true },
        }),
      ]);

      revalidatePath(`/blog/${slug}`);
      return { success: true, bookmarked: false, bookmarkCount: post.bookmarkCount };
    }

    // Create bookmark transaction
    const [, post] = await prisma.$transaction([
      prisma.blogBookmark.create({ data: { userId, postId } }),
      prisma.blogPost.update({
        where: { id: postId },
        data: { bookmarkCount: { increment: 1 } },
        select: { bookmarkCount: true },
      }),
    ]);

    revalidatePath(`/blog/${slug}`);
    return { success: true, bookmarked: true, bookmarkCount: post.bookmarkCount };
    
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return {
      success: false, bookmarked: false, bookmarkCount: 0,
      message: "An error occurred while toggling the bookmark.",
    };
  }
}