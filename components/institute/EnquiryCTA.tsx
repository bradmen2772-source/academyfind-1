import { Button } from "@/components/ui/button";

export default function EnquiryCTA() {
  return (
    <section className="rounded-[32px] bg-linear-to-r from-amber-400 to-amber-500 p-12 text-center">
      <h2 className="text-4xl font-bold text-black">
        Get Admission Guidance
      </h2>

      <p className="mt-4 text-black/80">
        Connect with experts and compare top institutes.
      </p>

      <Button
        size="lg"
        className="mt-8 bg-black text-white hover:bg-slate-900"
      >
        Request Callback
      </Button>
    </section>
  );
}