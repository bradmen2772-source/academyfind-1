"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { ReactionType } from "@/app/generated/prisma/client";

export interface ToggleReactionResult {
  success: boolean;
  reacted: boolean;
  reaction: ReactionType | null;
  likeCount: number;
  message?: string;
}

export async function toggleReaction(
  postId: string,
  slug: string,
  reaction: ReactionType = "LIKE"
): Promise<ToggleReactionResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, reacted: false, reaction: null, likeCount: 0, message: "Unauthorized" };
    }

    const userId = session.user.id;

    const existingReaction = await prisma.blogReaction.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    // Remove Reaction (Toggle OFF)
    if (existingReaction?.type === reaction) {
      const [, post] = await prisma.$transaction([
        prisma.blogReaction.delete({ where: { id: existingReaction.id } }),
        prisma.blogPost.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true },
        }),
      ]);

      revalidatePath(`/blog/${slug}`);
      return { success: true, reacted: false, reaction: null, likeCount: post.likeCount };
    }

    // Change Reaction Type (e.g. LIKE to LOVE)
    if (existingReaction) {
      await prisma.blogReaction.update({
        where: { id: existingReaction.id },
        data: { type: reaction },
      });

      const post = await prisma.blogPost.findUniqueOrThrow({
        where: { id: postId }, select: { likeCount: true },
      });

      revalidatePath(`/blog/${slug}`);
      return { success: true, reacted: true, reaction, likeCount: post.likeCount };
    }

    // New Reaction (Toggle ON)
    const [, post] = await prisma.$transaction([
      prisma.blogReaction.create({ data: { postId, userId, type: reaction } }),
      prisma.blogPost.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
        select: { likeCount: true },
      }),
    ]);

    revalidatePath(`/blog/${slug}`);
    return { success: true, reacted: true, reaction, likeCount: post.likeCount };

  } catch (error) {
    console.error("Error toggling reaction:", error);
    return { success: false, reacted: false, reaction: null, likeCount: 0, message: "Something went wrong." };
  }
}