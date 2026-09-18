const results = [
  {
    value: "AIR 1",
    label: "JEE Advanced",
  },
  {
    value: "AIR 4",
    label: "NEET UG",
  },
  {
    value: "1250+",
    label: "IIT Selections",
  },
  {
    value: "3000+",
    label: "MBBS Admissions",
  },
];

export default function ResultsAchievements() {
  return (
    <section className="rounded-[32px] bg-slate-900 p-10 text-white">
      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          Results & Achievements
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {results.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-800 bg-slate-800/50 p-6"
          >
            <div className="text-4xl font-bold text-amber-400">
              {item.value}
            </div>

            <p className="mt-2 text-slate-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}