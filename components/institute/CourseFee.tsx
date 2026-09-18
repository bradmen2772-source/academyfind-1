import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "JEE Advanced",
    duration: "2 Years",
    mode: "Offline",
    fees: "₹1,20,000",
  },
  {
    title: "NEET UG",
    duration: "2 Years",
    mode: "Offline",
    fees: "₹1,15,000",
  },
  {
    title: "Foundation",
    duration: "1 Year",
    mode: "Offline",
    fees: "₹75,000",
  },
];

export default function CoursesFees() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Courses & Fees
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.title}
            className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">
              {course.title}
            </h3>

            <div className="mt-6 space-y-2 text-slate-600">
              <p>Duration: {course.duration}</p>
              <p>Mode: {course.mode}</p>
            </div>

            <div className="mt-6 text-3xl font-bold text-amber-500">
              {course.fees}
            </div>

            <Button className="mt-6 w-full bg-amber-400 text-black hover:bg-amber-500">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}