import { Star } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Student Reviews
      </h2>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border bg-white p-8 text-center">
          <div className="text-6xl font-bold text-amber-500">
            4.7
          </div>

          <div className="mt-3 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <p className="mt-3 text-slate-600">
            Based on 2430 reviews
          </p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((review) => (
            <div
              key={review}
              className="rounded-3xl border bg-white p-6"
            >
              <h4 className="font-semibold">
                Student Name
              </h4>

              <p className="mt-3 text-slate-600">
                Excellent faculty and study material. Test
                series was extremely helpful.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}