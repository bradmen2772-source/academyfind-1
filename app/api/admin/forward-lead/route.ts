import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { originalEnquiryId, targetInstituteIds, adminNote } = body;

    if (!originalEnquiryId || !targetInstituteIds || targetInstituteIds.length === 0) {
      return NextResponse.json({ error: "Invalid request: missing required fields" }, { status: 400 });
    }

    const originalEnquiry = await prisma.instituteEnquiry.findUnique({
      where: { id: originalEnquiryId },
    });
    if (!originalEnquiry) {
      return NextResponse.json({ error: "Original enquiry not found" }, { status: 404 });
    }

    // Defensive server-side check — drop any target that already has this lead
    const existing = await prisma.instituteEnquiry.findMany({
      where: { parentId: originalEnquiryId, instituteId: { in: targetInstituteIds } },
      select: { instituteId: true },
    });
    const existingSet = new Set(existing.map((e: { instituteId: string }) => e.instituteId));
    const targetIds = targetInstituteIds.filter((id: string) => !existingSet.has(id));

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "All selected institutes already have this lead" }, { status: 400 });
    }

    await prisma.instituteEnquiry.update({
      where: { id: originalEnquiryId },
      data: { status: "FORWARDED" },
    });

    const result = await prisma.instituteEnquiry.createMany({
      data: targetIds.map((instituteId: string) => ({
        instituteId,
        name: originalEnquiry.name,
        phone: originalEnquiry.phone,
        message: originalEnquiry.message,
        parentId: originalEnquiryId,
        status: "NEW",
        isForwarded: true,
        adminNote: adminNote ? `[Forwarded] ${adminNote}` : undefined,
      })),
    });
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session?.user?.id) {
      await prisma.leadDistributionLog.create({
        data: {
          enquiryId: originalEnquiryId,
          adminId: session.user.id,
          mode: "individual",
          targetInstituteIds: targetIds,
          targetCount: targetIds.length,
          adminNote,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Lead forwarded to ${result.count} institutes`,
      count: result.count,
      skipped: existingSet.size,
    });
  } catch (error) {
    console.error("Error forwarding lead:", error);
    return NextResponse.json({ error: "Failed to forward lead" }, { status: 500 });
  }
}