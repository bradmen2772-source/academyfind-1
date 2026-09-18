import {
  ShieldCheck,
  Scale,
  MapPinned,
} from "lucide-react";

const features = [
  {
    title: "Verified Information",
    description:
      "Reliable institute details and information.",
    icon: ShieldCheck,
  },
  {
    title: "Compare Institutes",
    description:
      "Side-by-side comparisons to make better decisions.",
    icon: Scale,
  },
  {
    title: "Explore Cities",
    description:
      "Discover coaching institutes across India.",
    icon: MapPinned,
  },
];

export default function WhyChooseUs() {
  return (
    <section>
      <div className="text-center">
        <h2 className="text-4xl font-bold">
          Why AcademyFind?
        </h2>

        <p className="mt-3 text-muted-foreground">
          Everything you need to discover the right institute.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="
              rounded-3xl
              border
              border-amber-100
              bg-white
              p-8
              shadow-sm
              transition-all
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <feature.icon className="h-10 w-10 text-amber-500" />

            <h3 className="mt-5 text-xl font-semibold">
              {feature.title}
            </h3>

            <p className="mt-3 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}