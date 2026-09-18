import { MapPin, Phone } from "lucide-react";

export default function ContactMap() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Contact & Location
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-8">
          <div className="flex gap-3">
            <MapPin />
            <span>Kota, Rajasthan</span>
          </div>

          <div className="mt-4 flex gap-3">
            <Phone />
            <span>+91 9876543210</span>
          </div>
        </div>

        <div className="h-80 rounded-3xl bg-slate-200" />
      </div>
    </section>
  );
}