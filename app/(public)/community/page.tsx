import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Users,
  Compass,
  ArrowRight,
  Plus,
  Flame,
  BookMarked,
  Coins,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { getStudyGroups } from "@/lib/community/study-groups";
import { getRelevantInstitutesForCommunity } from "@/lib/community/lead-funnel";
import { StudyGroupCard } from "@/components/community/StudyGroupCard";
import { CreateStudyGroupModal } from "@/components/community/CreateStudyGroupModal";
import { CommunityLeadBanner } from "@/components/community/CommunityLeadBanner";
import { FeaturedInstitutesRail } from "@/components/community/FeaturedInstitutesRail";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Student Community & Peer Study Hub | AcademyFind",
  description:
    "Join verified peer study circles for JEE, NEET, UPSC, and Foundation exams. Find serious study partners near you, trade coaching modules, and clear daily doubts.",
};

export default async function CommunityHubPage() {
  const [{ groups = [] }, { institutes = [] }] = await Promise.all([
    getStudyGroups({ limit: 6 }),
    getRelevantInstitutesForCommunity("ALL", "ALL", 4),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/40 pb-24">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-amber-50/80 via-background to-background pt-14 pb-16 px-4 sm:px-6">
        {/* Ambient Warm Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-200/35 blur-[90px] sm:h-96 sm:w-96"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-amber-800 shadow-2xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            AcademyFind Peer Community & Study Hub
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.16]">
            Never Prep Alone. <br />
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Study With Aspirants Near You.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Form local study circles, exchange tough numericals, connect with serious study partners in your city, and trade second-hand coaching modules with zero middlemen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <CreateStudyGroupModal
              trigger={
                <Button className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-7 h-11 gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
                  <Plus className="w-4 h-4" />
                  <span>Start a Study Group</span>
                </Button>
              }
            />

            <Link href="/community/groups">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 h-11 font-semibold shadow-2xs transition-all hover:-translate-y-0.5"
              >
                Browse Study Groups
                <ArrowRight className="w-4 h-4 ml-1.5 text-slate-400 group-hover:text-amber-500" />
              </Button>
            </Link>
          </div>

          {/* Quick Pillars Grid (3D Glassmorphic Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <Link href="/community/groups" className="block group">
              <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:border-amber-300/80 hover:bg-white hover:shadow-[0_20px_45px_rgba(251,191,36,0.12)] hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3 group-hover:bg-amber-100 transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    Study Circles
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Exam-focused peer groups for daily targets & doubt clearing
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <span>Explore circles</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/community/buddies" className="block group">
              <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:border-emerald-300/80 hover:bg-white hover:shadow-[0_20px_45px_rgba(16,185,129,0.12)] hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3 group-hover:bg-emerald-100 transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Nearby Buddies
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Find serious aspirants in your city or coaching cluster
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <span>Find peers</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/marketplace/books" className="block group">
              <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:border-orange-300/80 hover:bg-white hover:shadow-[0_20px_45px_rgba(249,115,22,0.12)] hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold mb-3 group-hover:bg-orange-100 transition-colors">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    Book Exchange
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Used coaching modules (Allen, FIITJEE) & notes exchange
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-600">
                  <span>Browse books</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/how-to-earn-coins" className="block group">
              <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:border-purple-300/80 hover:bg-white hover:shadow-[0_20px_45px_rgba(168,85,247,0.12)] hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 group-hover:bg-purple-100 transition-colors">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                    Earn Coins
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Get rewarded with wallet coins for peer doubts & book sharing
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-600">
                  <span>Learn how</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trending Study Groups Section ──────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Active Now Across Hubs
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Study Groups
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Join active peer groups to participate in live problem solving, formula revisions, and test discussions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <CreateStudyGroupModal
              trigger={
                <Button size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 h-9 shadow-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Create Group
                </Button>
              }
            />
            <Link href="/community/groups">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 h-9 shadow-2xs"
              >
                View All Groups ({groups.length}+)
              </Button>
            </Link>
          </div>
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group: (typeof groups)[number]) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white/90 backdrop-blur-md p-10 sm:p-14 text-center shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 bg-amber-400/10 rounded-full blur-2xl" />
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Be the First to Create a Study Group!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Start a circle for JEE 2026, NEET, or UPSC. Invite friends and study partners to collaborate on daily targets.
            </p>
            <CreateStudyGroupModal />
          </div>
        )}

        {/* ─── Community Lead Generation Funnel ────────────────── */}
        <div className="mt-14 space-y-8">
          <CommunityLeadBanner
            examCategory="JEE, NEET & UPSC"
            defaultInstitute={institutes[0] || null}
            availableInstitutes={institutes}
          />
          <FeaturedInstitutesRail
            institutes={institutes}
            examCategory="JEE & NEET"
          />
        </div>
      </section>

      {/* ─── Value Propositions ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Peer Learning Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
              Why Aspirants Prepare on AcademyFind
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Competitive exam preparation is a marathon. Staying accountable with serious peers boosts consistency, clears tricky doubts faster, and reduces preparation stress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hyperlocal Peer Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Connect with aspirants studying in the same coaching center or locality (e.g. Kota, Kalu Sarai Delhi, Hyderabad).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Free Peer Doubt Solving</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Stuck on a tricky physics numerical or organic reaction? Post it in your subject circle for prompt student explanations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">AcademyFind Coins Economy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every good deed counts. Helping peers, sharing books, and maintaining study streaks earns you wallet coins for mentor calls.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
