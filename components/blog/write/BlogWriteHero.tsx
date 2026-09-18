import {
  FilePenLine,
  Save,
  Sparkles,
} from "lucide-react";

type WriteHeroProps = {
  authorName: string;
};

export default function WriteHero({
  authorName,
}: WriteHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
            <FilePenLine className="h-4 w-4" />
            Blog Editor
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Write a New Article
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Share your knowledge with thousands of AcademyFind readers.
            Write in Markdown, optimize your SEO, preview your article,
            and submit it for publishing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
              <Sparkles className="h-5 w-5 text-amber-500" />

              <div>
                <p className="text-xs text-slate-500">
                  Writing as
                </p>

                <p className="font-semibold text-slate-900">
                  {authorName}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <Save className="h-4 w-4" />
              Auto-save Enabled
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm lg:w-80">
          <h3 className="text-lg font-semibold text-slate-900">
            Publishing Flow
          </h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Draft
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                Step 1
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Review
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                Step 2
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Published
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
                Step 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}