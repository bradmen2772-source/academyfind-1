import {
  Building2,
  Users,
  GraduationCap,
  School,
} from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "1988",
    label: "Founded",
  },
  {
    icon: Users,
    value: "12L+",
    label: "Students",
  },
  {
    icon: GraduationCap,
    value: "800+",
    label: "Faculty",
  },
  {
    icon: School,
    value: "45+",
    label: "Branches",
  },
];

export default function QuickFacts() {
  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                <Icon className="h-6 w-6 text-amber-600" />
              </div>

              <h3 className="mt-4 text-3xl font-bold">
                {item.value}
              </h3>

              <p className="text-slate-600">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}