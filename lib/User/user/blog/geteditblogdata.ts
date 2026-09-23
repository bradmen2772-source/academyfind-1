import { notFound, redirect } from "next/navigation";

import type { BlogEditorInitialData } from "@/components/blog/editor/types";
import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function getEditBlogData(
  postId: string,
  targetUserId?: string,
): Promise<BlogEditorInitialData | null> {
  let userId = targetUserId;
  let isAdmin = false;
  if (!userId) {
    const session = await getCachedSession();
    if (!session?.user?.id) {
      return null;
    }
    userId = session.user.id;
    isAdmin = session.user.role === "ADMIN";
  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    isAdmin = user?.role === "ADMIN";
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      id: postId,
      ...(isAdmin ? {} : { authorProfile: { userId } }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      contentHtml: true,
      coverImage: true,
      categoryId: true,
      brandId: true,
      metaTitle: true,
      metaDescription: true,
      focusKeyword: true,
      status: true,
      visibility: true,
      canonicalUrl: true,
      robotsIndex: true,
      robotsFollow: true,
      isFeatured: true,
      featuredOrder: true,
      isPinned: true,
      allowComments: true,
      scheduledAt: true,
      rejectionReason: true,
      relatedInstituteId: true,
      authorProfileId: true,
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      faqs: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          question: true,
          answer: true,
          order: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return post;
}
