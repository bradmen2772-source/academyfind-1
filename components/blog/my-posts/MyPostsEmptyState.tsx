import Link from "next/link";
import { FilePenLine, Plus } from "lucide-react";

export default function MyPostsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <FilePenLine className="h-10 w-10 text-amber-600" />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-slate-900">
        No Posts Yet
      </h2>

      <p className="mt-4 max-w-xl text-lg leading-7 text-slate-600">
        You haven't written any blog posts yet. Start sharing your
        knowledge with students by creating your first article.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          <Plus className="h-5 w-5" />
          Write Your First Post
        </Link>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Explore Blog
        </Link>
      </div>
    </div>
  );
}