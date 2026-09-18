const institutes = [
  "Motion",
  "Resonance",
  "Vibrant Academy",
  "Nucleus",
];

export default function NearbyInstitutes() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Similar Institutes
      </h2>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {institutes.map((item) => (
          <div
            key={item}
            className="rounded-3xl border bg-white p-6 transition hover:border-amber-400 hover:shadow-lg"
          >
            <h3 className="font-semibold">{item}</h3>

            <p className="mt-2 text-sm text-slate-600">
              Compare courses, fees and reviews.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}