import Link from "next/link";
import { TrendingUp } from "lucide-react";

const topics = [
  "JEE",
  "NEET",
  "CUET",
  "UPSC",
  "CAT",
  "SSC",
  "CLAT",
  "NDA",
];

export default function TrendingTopics() {
  return (
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3">
      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
        <TrendingUp className="h-4 w-4 text-amber-500" />
        Trending Searches
      </div>

      {topics.map((topic) => (
        <Link
          key={topic}
          href={`/blog/search?q=${encodeURIComponent(topic)}`}
          className="group rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md"
        >
          {topic}
        </Link>
      ))}
    </div>
  );
}