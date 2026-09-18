import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { trackVisitHistory } from "@/lib/User/user/user-activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const instituteId = req.nextUrl.searchParams.get("instituteId");
  if (!instituteId) return NextResponse.json({ saved: false }, { status: 400 });

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ saved: false, loggedIn: false });

  trackVisitHistory(session.user.id, instituteId).catch(console.error); // fire-and-forget

  const savedEntry = await prisma.userShortlist.findUnique({
    where: { userId_instituteId: { userId: session.user.id, instituteId } },
  });

  return NextResponse.json({ saved: !!savedEntry, loggedIn: true, userId: session.user.id });
}