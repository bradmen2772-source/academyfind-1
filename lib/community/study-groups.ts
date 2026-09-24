"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { requireAuth } from "@/lib/auth/requireAuth";

// ─── Input Validation Schemas ──────────────────────────────────────────

const createStudyGroupSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(80),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(600),
  examCategory: z.string().trim().min(2).max(40),
  subject: z.string().trim().max(50).optional().default("All Subjects"),
  city: z.string().trim().max(60).optional().default("Online / Pan-India"),
  tags: z.array(z.string().trim().min(1).max(25)).max(8).optional().default([]),
  rules: z.string().trim().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  maxMembers: z.number().int().min(5).max(2000).optional().default(500),
});

export type CreateStudyGroupInput = z.input<typeof createStudyGroupSchema>;

// ─── 1. Create Study Group ─────────────────────────────────────────────

export async function createStudyGroup(data: CreateStudyGroupInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = createStudyGroupSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data.",
    };
  }

  const {
    title,
    description,
    examCategory,
    subject,
    city,
    tags,
    rules,
    imageUrl,
    maxMembers,
  } = parsed.data;

  try {
    const conversation = await prisma.conversation.create({
      data: {
        type: "GROUP",
        visibility: "PUBLIC",
        isStudyGroup: true,
        title,
        description,
        examCategory: examCategory.toUpperCase(),
        subject: subject || "All Subjects",
        city: city || "Online / Pan-India",
        tags,
        rules: rules || null,
        imageUrl: imageUrl || null,
        maxMembers,
        createdById: userId,
        memberCount: 1,
        participants: {
          create: {
            userId,
            role: "OWNER",
            status: "ACTIVE",
          },
        },
        messages: {
          create: {
            senderId: userId,
            content: `Welcome to ${title}! Feel free to introduce yourself, ask doubts, and share study notes.`,
            type: "SYSTEM",
          },
        },
      },
      select: {
        id: true,
        title: true,
        examCategory: true,
      },
    });

    revalidatePath("/community");
    revalidatePath("/community/groups");
    return { success: true, group: conversation };
  } catch (error: any) {
    console.error("Error creating study group:", error);
    return { success: false, error: "Failed to create study group. Please try again." };
  }
}

// ─── 2. Get Study Groups (With Search, Exam & City Filters) ─────────────

export interface GetStudyGroupsParams {
  examCategory?: string;
  city?: string;
  subject?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getStudyGroups(params: GetStudyGroupsParams = {}) {
  const {
    examCategory,
    city,
    subject,
    search,
    page = 1,
    limit = 18,
  } = params;

  const skip = (page - 1) * limit;

  const where: any = {
    isStudyGroup: true,
    visibility: "PUBLIC",
  };

  if (examCategory && examCategory !== "ALL") {
    where.examCategory = { equals: examCategory, mode: "insensitive" };
  }

  if (city && city !== "ALL") {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (subject && subject !== "ALL") {
    where.subject = { contains: subject, mode: "insensitive" };
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { examCategory: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
    ];
  }

  try {
    const session = await getSession();
    const currentUserId = session?.user?.id;

    const [groups, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { memberCount: "desc" },
          { lastActivityAt: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          examCategory: true,
          subject: true,
          city: true,
          tags: true,
          memberCount: true,
          maxMembers: true,
          createdAt: true,
          createdById: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
            },
          },
          participants: currentUserId
            ? {
                where: { userId: currentUserId, status: "ACTIVE" },
                select: { role: true },
              }
            : false,
        },
      }),
      prisma.conversation.count({ where }),
    ]);

    const formattedGroups = groups.map((g: (typeof groups)[number]) => {
      const isMember = currentUserId
        ? Array.isArray(g.participants) && g.participants.length > 0
        : false;
      const userRole = isMember ? (g.participants as any[])[0]?.role : null;
      return {
        ...g,
        isMember,
        userRole,
        isOwner: g.createdById === currentUserId,
      };
    });

    return {
      success: true,
      groups: formattedGroups,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching study groups:", error);
    return {
      success: false,
      groups: [],
      total: 0,
      page: 1,
      totalPages: 0,
      error: "Failed to load study groups.",
    };
  }
}

// ─── 3. Join Study Group ───────────────────────────────────────────────

export async function joinStudyGroup(conversationId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  try {
    const group = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        title: true,
        isStudyGroup: true,
        visibility: true,
        memberCount: true,
        maxMembers: true,
      },
    });

    if (!group || !group.isStudyGroup) {
      return { success: false, error: "Study group not found." };
    }

    if (group.maxMembers && group.memberCount >= group.maxMembers) {
      return { success: false, error: "This study group has reached its maximum member capacity." };
    }

    // Check if participant record already exists
    const existing = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (existing && existing.status === "ACTIVE") {
      return { success: true, alreadyMember: true, conversationId };
    }

    if (existing) {
      await prisma.conversationParticipant.update({
        where: { id: existing.id },
        data: {
          status: "ACTIVE",
          joinedAt: new Date(),
          leftAt: null,
        },
      });
    } else {
      await prisma.conversationParticipant.create({
        data: {
          conversationId,
          userId,
          role: "MEMBER",
          status: "ACTIVE",
        },
      });
    }

    // Recalculate or increment member count
    const count = await prisma.conversationParticipant.count({
      where: { conversationId, status: "ACTIVE" },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        memberCount: count,
        lastActivityAt: new Date(),
      },
    });

    // Send system join notice
    await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: `${session.user.name || "A new student"} joined the study group.`,
        type: "SYSTEM",
      },
    }).catch(() => null);

    revalidatePath("/community");
    revalidatePath("/community/groups");
    revalidatePath(`/chat/${conversationId}`);

    return { success: true, conversationId };
  } catch (error: any) {
    console.error("Error joining study group:", error);
    return { success: false, error: "Unable to join study group. Please try again." };
  }
}

// ─── 4. Leave Study Group ──────────────────────────────────────────────

export async function leaveStudyGroup(conversationId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  try {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant || participant.status !== "ACTIVE") {
      return { success: true };
    }

    if (participant.role === "OWNER") {
      // Check if there are other members to promote or warn
      const otherMembers = await prisma.conversationParticipant.count({
        where: { conversationId, status: "ACTIVE", userId: { not: userId } },
      });
      if (otherMembers > 0) {
        return {
          success: false,
          error: "As the group creator/owner, please assign another admin before leaving.",
        };
      }
    }

    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        status: "DELETED",
        leftAt: new Date(),
      },
    });

    const count = await prisma.conversationParticipant.count({
      where: { conversationId, status: "ACTIVE" },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { memberCount: count },
    });

    revalidatePath("/community");
    revalidatePath("/community/groups");

    return { success: true };
  } catch (error: any) {
    console.error("Error leaving study group:", error);
    return { success: false, error: "Failed to leave group." };
  }
}

// ─── 5. Get User's Joined Study Groups ─────────────────────────────────

export async function getMyStudyGroups() {
  const session = await getSession();
  if (!session?.user) return { success: true, groups: [] };

  try {
    const participants = await prisma.conversationParticipant.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        conversation: {
          isStudyGroup: true,
        },
      },
      select: {
        role: true,
        conversation: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            examCategory: true,
            subject: true,
            city: true,
            memberCount: true,
            lastMessageAt: true,
          },
        },
      },
      orderBy: {
        conversation: {
          lastActivityAt: "desc",
        },
      },
    });

    return {
      success: true,
      groups: participants.map((p: (typeof participants)[number]) => ({
        ...p.conversation,
        userRole: p.role,
      })),
    };
  } catch (error) {
    console.error("Error fetching user's study groups:", error);
    return { success: false, groups: [] };
  }
}

// ─── 6. Get Study Group Details ────────────────────────────────────────

export async function getStudyGroupDetails(groupId: string) {
  try {
    const session = await getSession();
    const currentUserId = session?.user?.id;

    const group = await prisma.conversation.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        examCategory: true,
        subject: true,
        city: true,
        tags: true,
        rules: true,
        memberCount: true,
        maxMembers: true,
        createdAt: true,
        createdById: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        participants: {
          where: { status: "ACTIVE" },
          take: 12,
          select: {
            role: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!group) return null;

    const isMember = currentUserId
      ? group.participants.some((p) => p.user.id === currentUserId)
      : false;

    return {
      ...group,
      isMember,
      isOwner: group.createdById === currentUserId,
    };
  } catch (error) {
    console.error("Error fetching study group details:", error);
    return null;
  }
}
