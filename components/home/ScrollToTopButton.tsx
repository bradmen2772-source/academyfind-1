"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollToTopButton({ className , content}: { className?: string, content?: string }) {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button onClick={handleScroll} className={className}>
      {content}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}