import {
  Library,
  Bus,
  Laptop,
  Building,
  Trophy,
  Bed,
} from "lucide-react";

const facilities = [
  { icon: Library, label: "Library" },
  { icon: Laptop, label: "Computer Labs" },
  { icon: Building, label: "Smart Classrooms" },
  { icon: Bed, label: "Hostel" },
  { icon: Bus, label: "Transport" },
  { icon: Trophy, label: "Sports" },
];

export default function Facilities() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Facilities
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => {
          const Icon = facility.icon;

          return (
            <div
              key={facility.label}
              className="rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:border-amber-300"
            >
              <Icon className="h-8 w-8 text-amber-500" />

              <h3 className="mt-4 font-semibold">
                {facility.label}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}