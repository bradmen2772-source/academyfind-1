import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

type SearchEmptyStateProps = {
  query?: string;
};

export default function SearchEmptyState({
  query,
}: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <SearchX className="h-10 w-10 text-amber-600" />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-slate-900">
        No Results Found
      </h2>

      <p className="mt-4 max-w-xl leading-7 text-slate-600">
        {query ? (
          <>
            We couldn't find any articles matching{" "}
            <span className="font-semibold text-slate-900">
              "{query}"
            </span>
            . Try a different keyword or browse all blog articles.
          </>
        ) : (
          <>
            Start typing in the search box to discover articles,
            guides, tutorials, and expert insights.
          </>
        )}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse All Articles
        </Link>
      </div>
    </div>
  );
}