import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";

type BookmarkHeroProps = {
  totalBookmarks: number;
};

export default function BookmarkHero({
  totalBookmarks,
}: BookmarkHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">
      <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Articles
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            My Bookmarks
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Keep track of the articles you want to revisit later. Your saved
            blog posts are available here anytime.
          </p>

          <div className="mt-6 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="mr-2 font-bold text-amber-600">
              {totalBookmarks}
            </span>
            Saved Article{totalBookmarks !== 1 && "s"}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
          >
            Explore Blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}