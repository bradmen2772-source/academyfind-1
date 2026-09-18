import { CheckCircle2 } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
      {/* Left Side: Mission Text */}
      <div className="space-y-6">
        <div>
          {/* Badge style for tag */}
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            Our Mission
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Making Institute Discovery Simple
          </h2>
        </div>

        {/* Clean, readable paragraphs */}
        <div className="space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed">
          <p>
            <strong className="font-semibold text-slate-800">
              Finding the right place to learn shouldn't be a struggle.
            </strong>{" "}
            Information is often scattered across multiple websites, social media pages, and local directories, making it frustrating and time-consuming to compare your options.
          </p>
          
          <p>
            AcademyFind brings this fragmented ecosystem together. Whether you're preparing for a competitive exam, seeking academic support, or pursuing a new hobby, our platform lets you explore opportunities through intuitive search and filtering tools.
          </p>
          
          <p>
            We exist to organize the learning landscape, making educational and extracurricular opportunities easily discoverable, searchable, and accessible for everyone.
          </p>
        </div>
      </div>

      {/* Right Side: Values Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-orange-50 p-8 sm:p-10 shadow-sm">
        {/* Decorative background blur/glow */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

        <h3 className="relative z-10 text-2xl font-bold text-slate-900">
          What We Believe
        </h3>

        {/* Upgraded List with Icons */}
        <ul className="relative z-10 mt-8 space-y-5">
          {[
            "Students deserve transparent information",
            "Comparisons should be fair and unbiased",
            "Discovery should be simple and fast",
            "Quality education should be easier to find",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <div className="mt-0.5 shrink-0 rounded-full bg-amber-200/50 p-1">
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              </div>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}