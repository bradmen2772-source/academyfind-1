import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Users, Plus, ArrowLeft, Layers } from "lucide-react";
import { getStudyGroups } from "@/lib/community/study-groups";
import { getRelevantInstitutesForCommunity } from "@/lib/community/lead-funnel";
import { StudyGroupCard } from "@/components/community/StudyGroupCard";
import { CreateStudyGroupModal } from "@/components/community/CreateStudyGroupModal";
import { StudyGroupsFilter } from "@/components/community/StudyGroupsFilter";
import { CommunityLeadBanner } from "@/components/community/CommunityLeadBanner";
import { FeaturedInstitutesRail } from "@/components/community/FeaturedInstitutesRail";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Browse Study Groups & Peer Circles | AcademyFind",
  description:
    "Explore peer study groups by target exam (JEE, NEET, UPSC, CAT) and city (Kota, Delhi, Pune, Hyderabad). Join real-time discussion rooms on AcademyFind.",
};

interface GroupsPageProps {
  searchParams: Promise<{
    exam?: string;
    city?: string;
    subject?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function StudyGroupsCatalogPage({ searchParams }: GroupsPageProps) {
  const params = await searchParams;
  const examCategory = params.exam || "ALL";
  const city = params.city || "ALL";
  const subject = params.subject || "ALL";
  const search = params.q || "";
  const page = params.page ? parseInt(params.page, 10) : 1;

  const [
    { groups = [], total = 0 },
    { institutes = [] },
  ] = await Promise.all([
    getStudyGroups({
      examCategory,
      city,
      subject,
      search,
      page,
      limit: 18,
    }),
    getRelevantInstitutesForCommunity(examCategory, city, 4),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header */}
      <div className="border-b border-border/60 bg-linear-to-b from-amber-50/70 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link href="/community" className="hover:text-amber-600 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Community Hub
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Study Groups</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Peer Study Groups
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Find your tribe. Join targeted circles organized by exam, coaching cluster, or subject.
              </p>
            </div>

            <CreateStudyGroupModal
              trigger={
                <Button className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold gap-2 shadow-md shadow-amber-500/20 shrink-0 transition-all hover:-translate-y-0.5">
                  <Plus className="w-4 h-4" />
                  Create Study Group
                </Button>
              }
            />
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6">
            <StudyGroupsFilter />
          </div>
        </div>
      </div>

      {/* Main Groups Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-5">
          <span>Showing {groups.length} of {total} study groups</span>
          {examCategory !== "ALL" && (
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
              Exam: {examCategory}
            </span>
          )}
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group: (typeof groups)[number]) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white/90 backdrop-blur-md p-10 sm:p-14 text-center shadow-[0_8px_30px_rgb(0,0,0,0.03)] mt-4">
            <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 bg-amber-400/10 rounded-full blur-2xl" />
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">No Study Groups Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              No public study groups matched your current filters. Be the first to start a circle for this category!
            </p>
            <CreateStudyGroupModal />
          </div>
        )}

        {/* ─── Community Lead Generation Funnel ────────────────── */}
        <div className="mt-14 space-y-8">
          <CommunityLeadBanner
            examCategory={examCategory !== "ALL" ? examCategory : "JEE & NEET"}
            city={city !== "ALL" ? city : "your hub"}
            defaultInstitute={institutes[0] || null}
            availableInstitutes={institutes}
          />
          <FeaturedInstitutesRail
            institutes={institutes}
            examCategory={examCategory !== "ALL" ? examCategory : "Competitive Exams"}
          />
        </div>
      </div>
    </div>
  );
}
