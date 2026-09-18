"use client";

import { ArrowDown } from "lucide-react";

export default function ScrollIndicator() {
  const scrollToContent = () => {
    const section = document.getElementById("featured-posts");

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      onClick={scrollToContent}
      aria-label="Scroll to featured articles"
      className="group inline-flex flex-col items-center gap-3 text-slate-500 transition-all duration-300 hover:text-amber-600"
    >
      <span className="text-sm font-medium tracking-wide">
        Explore Articles
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:shadow-lg">
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </div>
    </button>
  );
}