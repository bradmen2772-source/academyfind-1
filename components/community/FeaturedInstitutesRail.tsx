"use client";

import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { CommunityLeadModal } from "@/components/community/CommunityLeadModal";
import { Button } from "@/components/ui/button";

interface FeaturedInstitutesRailProps {
  institutes: Array<{
    id: string;
    name: string;
    slug: string;
    city?: string | null;
    area?: string | null;
    logoUrl?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    isVerified?: boolean;
    isFeatured?: boolean;
    feeRange?: string | null;
  }>;
  examCategory?: string;
}

export function FeaturedInstitutesRail({
  institutes,
  examCategory = "JEE",
}: FeaturedInstitutesRailProps) {
  if (!institutes || institutes.length === 0) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Top Verified Coaching Institutes for {examCategory !== "ALL" ? examCategory : "Students"}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Verified coaching centers offering batch counseling, demo lectures, and scholarship test dates.
          </p>
        </div>

        <Link
          href={`/?q=${encodeURIComponent(examCategory !== "ALL" ? examCategory : "coaching")}`}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {institutes.map((inst: (typeof institutes)[number]) => (
          <div
            key={inst.id}
            className="group flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-white shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-center font-extrabold text-slate-800 text-xs uppercase overflow-hidden shrink-0">
                  {inst.logoUrl ? (
                    <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover" />
                  ) : (
                    inst.name.charAt(0)
                  )}
                </div>

                {inst.rating && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{Number(inst.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              <Link
                href={`/institute/${inst.slug}`}
                className="font-bold text-sm text-slate-900 line-clamp-1 hover:text-amber-600 transition-colors"
              >
                {inst.name}
              </Link>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 mb-2">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">{inst.area ? `${inst.area}, ` : ""}{inst.city || "India"}</span>
              </div>

              {inst.feeRange && (
                <p className="text-[11px] font-medium text-slate-600 mb-3 truncate">
                  Fees: <span className="text-slate-800 font-semibold">{inst.feeRange}</span>
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <CommunityLeadModal
                institute={inst}
                defaultExam={examCategory !== "ALL" ? examCategory : "JEE"}
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-full text-xs font-semibold border-slate-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 h-8 transition-colors"
                  >
                    Inquire Admission
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
