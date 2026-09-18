import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function AuthorEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <FileText className="h-10 w-10 text-amber-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No articles published yet
      </h2>

      <p className="mt-3 max-w-lg text-slate-600">
        This author hasn't published any public articles yet. Check back later
        for new insights, guides, and updates.
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