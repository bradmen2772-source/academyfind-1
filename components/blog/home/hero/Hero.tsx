import { HeroHeading, HeroStats, ScrollIndicator, TrendingTopics, SearchBar} from "@/components/blog/home/hero/index";


export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-amber-50 via-white to-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl" />

        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-amber-100/20 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right,#0f172a 1px,transparent 1px),
            linear-gradient(to bottom,#0f172a 1px,transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <HeroHeading />

        <div className="mt-12">
          <SearchBar />
        </div>

        <div className="mt-8">
          <TrendingTopics />
        </div>

        <div className="mt-16">
          <HeroStats />
        </div>

        <div className="mt-14 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}