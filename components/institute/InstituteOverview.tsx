import { CheckCircle2 } from "lucide-react";

const features = [
  "Experienced Faculty",
  "Structured Study Material",
  "Regular Test Series",
  "Doubt Solving Sessions",
  "Scholarship Programs",
  "Personal Mentorship",
];

export default function InstituteOverview() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          About Institute
        </h2>

        <p className="mt-2 text-slate-600">
          Why students choose this institute.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-8">
          <p className="leading-8 text-slate-600">
            Allen Career Institute has been one of India's most
            trusted coaching institutes for engineering and medical
            entrance examinations. With expert faculty,
            comprehensive study material and excellent results,
            the institute has helped lakhs of students achieve
            their academic goals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-2xl border bg-white p-5"
            >
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}