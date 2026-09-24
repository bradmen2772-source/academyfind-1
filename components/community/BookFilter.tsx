"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, MapPin, X, Sparkles, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";

const EXAMS = [
  { id: "ALL", label: "All Exams" },
  { id: "JEE", label: "JEE Main & Adv" },
  { id: "NEET", label: "NEET-UG" },
  { id: "UPSC", label: "UPSC CSE" },
  { id: "CAT", label: "CAT / MBA" },
  { id: "GATE", label: "GATE" },
  { id: "CUET", label: "CUET" },
  { id: "FOUNDATION", label: "Class 9-10" },
];

const CITIES = [
  "ALL",
  "Kota",
  "Delhi / NCR",
  "Hyderabad",
  "Pune",
  "Bangalore",
  "Patna",
  "Jaipur",
  "Lucknow",
];

export function BookFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentExam = searchParams.get("exam") || "ALL";
  const currentCity = searchParams.get("city") || "ALL";
  const currentFree = searchParams.get("free") === "true";
  const currentSearch = searchParams.get("q") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleFree = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentFree) {
      params.delete("free");
    } else {
      params.set("free", "true");
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    updateParam("q", query.trim());
  };

  return (
    <div className="space-y-4">
      {/* Search & City / Free row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            name="q"
            defaultValue={currentSearch}
            placeholder="Search books, coaching modules (e.g. Allen Physics, HC Verma, FIITJEE)..."
            className="pl-10 pr-9 h-11 rounded-full border-slate-200 bg-white text-sm focus-visible:ring-amber-500 shadow-xs"
          />
          {currentSearch && (
            <button
              type="button"
              onClick={() => updateParam("q", "")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {/* Free / Donate toggle */}
          <button
            type="button"
            onClick={toggleFree}
            className={`h-11 px-4 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
              currentFree
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Free / Donate
          </button>

          {/* City select */}
          <div className="relative shrink-0">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 pointer-events-none" />
            <select
              value={currentCity}
              onChange={(e) => updateParam("city", e.target.value)}
              className="h-11 pl-9 pr-8 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            >
              <option value="ALL">All Cities & Hubs</option>
              {CITIES.filter((c: string) => c !== "ALL").map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exam Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {EXAMS.map((exam: { id: string; label: string }) => {
          const active = currentExam === exam.id;
          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => updateParam("exam", exam.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                active
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {exam.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
