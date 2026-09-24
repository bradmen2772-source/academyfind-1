"use client";

import React from "react";
import { GraduationCap, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityLeadModal } from "@/components/community/CommunityLeadModal";

interface CommunityLeadBannerProps {
  examCategory?: string;
  city?: string;
  defaultInstitute?: {
    id: string;
    name: string;
    city?: string | null;
  } | null;
  availableInstitutes?: Array<{
    id: string;
    name: string;
    city?: string | null;
  }>;
}

export function CommunityLeadBanner({
  examCategory = "JEE & NEET",
  city = "your city",
  defaultInstitute,
  availableInstitutes = [],
}: CommunityLeadBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Decorative ambient amber & orange glows */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Verified Admissions & Scholarship Desk
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Partner Coaching Centers
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Preparing for {examCategory !== "ALL" ? examCategory : "Competitive Exams"}?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Get up to <strong className="text-slate-900">40% fee scholarship guidance</strong>, verified batch fee comparisons, and book free classroom trial sessions with top institutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <CommunityLeadModal
            institute={defaultInstitute}
            availableInstitutes={availableInstitutes}
            defaultExam={examCategory !== "ALL" ? examCategory : "JEE"}
            trigger={
              <Button className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-7 h-12 gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
                <GraduationCap className="w-4 h-4" />
                <span>Get Free Counseling</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
