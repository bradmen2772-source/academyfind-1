import { BookOpen, Sparkles } from "lucide-react";

export default function HeroHeading() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
        <Sparkles className="h-4 w-4" />
        AcademyFind Knowledge Hub
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-tight">
        Learn Smarter.
        <span className="block text-amber-400">
          Choose the Right Coaching.
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl">
        Explore expert-written guides, coaching reviews, admission updates,
        preparation strategies, career advice and exam insights to make better
        academic decisions.
      </p>

      {/* Highlights */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {[
          "JEE",
          "NEET",
          "CUET",
          "UPSC",
          "CAT",
          "Government Exams",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Small Info */}
      <div className="mt-8 inline-flex items-center gap-2 text-sm text-slate-500">
        <BookOpen className="h-4 w-4 text-amber-500" />
        Trusted articles to help students choose the best coaching institutes
        across India.
      </div>
    </div>
  );
}