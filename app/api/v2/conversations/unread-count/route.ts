import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ count: 0 });

  const userId = session.user.id;

  try {
    // 1. Check unread chat message notifications
    const notifCount = await prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
        type: "MESSAGE",
      },
    });

    // 2. Check active conversations where a new message arrived after user's lastReadAt
    const activeParticipants = await prisma.conversationParticipant.findMany({
      where: {
        userId,
        status: "ACTIVE",
        conversation: {
          lastMessageAt: { not: null },
        },
      },
      select: {
        lastReadAt: true,
        conversation: {
          select: {
            id: true,
            lastMessageAt: true,
            lastMessage: {
              select: {
                senderId: true,
              },
            },
          },
        },
      },
    });

    const unreadConvos = activeParticipants.filter((p: any) => {
      // If current user sent the last message, don't count as unread for them
      if (p.conversation.lastMessage?.senderId === userId) return false;
      if (!p.conversation.lastMessageAt) return false;
      if (!p.lastReadAt) return true;
      return new Date(p.conversation.lastMessageAt) > new Date(p.lastReadAt);
    });

    const count = Math.max(notifCount, unreadConvos.length);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching conversation unread count:", error);
    return NextResponse.json({ count: 0 });
  }
}
