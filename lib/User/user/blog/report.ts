"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { ReportReason } from "@/app/generated/prisma/client";

export interface ReportPostInput {
  postId: string;
  reason: ReportReason;
  message?: string;
}

export async function reportPost({
  postId,
  reason,
  message,
}: ReportPostInput): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized. Please login to report." };
    }

    const userId = session.user.id;

    // Check if user already reported this post (Pending status)
    const existing = await prisma.blogReport.findFirst({
      where: { postId, userId, status: "PENDING" },
    });

    if (existing) {
      return { success: false, message: "You have already reported this post. We are reviewing it." };
    }

    await prisma.blogReport.create({
      data: {
        postId,
        userId,
        reason,
        message: message?.trim() || undefined,
      },
    });

    return { success: true, message: "Report submitted successfully. Thank you!" };
  } catch (error) {
    console.error("Error reporting post:", error);
    return { success: false, message: "Something went wrong." };
  }
}