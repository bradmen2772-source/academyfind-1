"use client";

import React from "react";
import { BadgeCheck, ShieldCheck, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  instituteName?: string;
  variant?: "header" | "card" | "pill" | "icon-only";
  className?: string;
  showTooltip?: boolean;
}

export function VerifiedBadge({
  instituteName,
  variant = "header",
  className,
  showTooltip = true,
}: VerifiedBadgeProps) {
  const badgeContent = (
    <div
      className={cn(
        // Base styling for modern, trendy badge
        "group relative inline-flex items-center gap-1.5 rounded-full transition-all duration-300 select-none",
        variant === "header" &&
          "px-3 py-1 bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/15 hover:from-sky-500/20 hover:to-indigo-500/25 border border-sky-300/80 hover:border-sky-400 shadow-[0_2px_10px_rgba(14,165,233,0.15)] hover:shadow-[0_4px_18px_rgba(14,165,233,0.28)] backdrop-blur-md cursor-pointer hover:scale-[1.04] active:scale-[0.98]",
        variant === "card" &&
          "px-2.5 py-0.5 bg-sky-50/90 hover:bg-sky-100/90 border border-sky-200/90 text-sky-700 shadow-2xs cursor-pointer",
        variant === "pill" &&
          "px-2 py-0.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 text-sky-800 text-[10px] font-bold shadow-2xs",
        variant === "icon-only" &&
          "p-1 rounded-full hover:bg-sky-50 transition-colors cursor-pointer",
        className
      )}
      title="Officially Verified by AcademyFind"
    >
      {/* Subtle ambient light sweep across the badge */}
      {variant === "header" && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          aria-hidden="true"
        />
      )}

      {/* Verified Rosette Icon (Twitter/Instagram/Stripe standard) */}
      <span className="relative flex items-center justify-center shrink-0">
        <BadgeCheck
          className={cn(
            "fill-sky-500 text-white shrink-0 drop-shadow-[0_1px_2px_rgba(14,165,233,0.5)] transition-transform duration-300 group-hover:rotate-6",
            variant === "header" ? "w-4 h-4" : "w-3.5 h-3.5"
          )}
        />
      </span>

      {/* Verified Typography */}
      {variant !== "icon-only" && (
        <span
          className={cn(
            "font-black tracking-wider uppercase",
            variant === "header"
              ? "text-[11px] sm:text-xs bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
              : "text-[10px] font-bold text-sky-700"
          )}
        >
          Verified
        </span>
      )}

      {/* Live Authenticated Indicator Dot (only on header & large variants) */}
      {variant === "header" && (
        <span className="relative flex h-1.5 w-1.5 ml-0.5 shrink-0" title="Active Authentication">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      )}
    </div>
  );

  // If tooltip/popover is disabled, return plain badge
  if (!showTooltip) {
    return badgeContent;
  }

  // Interactive Radix Popover explaining what Verified means
  return (
    <Popover>
      <PopoverTrigger asChild>{badgeContent}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-76 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200/80 shadow-xl shadow-sky-950/10 z-50 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-500/25">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-slate-900">
                Verified Institute
              </h4>
              <BadgeCheck className="w-4 h-4 fill-sky-500 text-white" />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">
              Authenticated by AcademyFind
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          {instituteName ? (
            <>
              <strong className="text-slate-900">{instituteName}</strong> has been officially authenticated.
            </>
          ) : (
            "This coaching institute has been officially authenticated."
          )}{" "}
          Physical premises, curriculum, and direct admission channels have been validated by the AcademyFind team.
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Official Management Claimed</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Direct Student Enquiries (Zero Spam)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Authentic Batch & Fee Transparency</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default VerifiedBadge;
