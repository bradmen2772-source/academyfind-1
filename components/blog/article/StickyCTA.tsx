
"use client";

import Link from "next/link";
import { ArrowRight, Building2, Search, Scale } from "lucide-react";

interface StickyCTAProps {
  instituteSlug?: string;
  compareHref?: string;
}

export default function StickyCTA({
  instituteSlug,
  compareHref="/compare",
}: StickyCTAProps) {
  return (
    <aside className="sticky top-24 hidden lg:block">
      <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm">
        <div className="p-6">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            AcademyFind
          </span>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Find the Right Coaching Institute
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Compare institutes, explore verified reviews, fees, facilities and
            make an informed decision.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/search"
              className="flex items-center justify-between rounded-xl bg-amber-500 px-4 py-3 font-medium text-white transition hover:bg-amber-600"
            >
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Explore Institutes
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={compareHref}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Compare Institutes
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {instituteSlug && (
              <Link
                href={`/institute/${instituteSlug}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  View Related Institute
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 text-center">
            <p className="text-sm text-slate-600">
              Trusted by students to discover coaching institutes across India.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
