import {
  Star,
  MapPin,
  Calendar,
  Users,
  BadgeCheck,
  Heart,
  Scale,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function InstituteHero() {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-b from-amber-50 via-white to-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="overflow-hidden rounded-3xl bg-linear-to-r from-slate-800 to-slate-900 h-64" />

        <div className="relative -mt-14 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="rounded-3xl border bg-white p-6 shadow-xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="h-28 w-28 rounded-3xl border-4 border-white bg-slate-100 shadow-lg" />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                      Allen Career Institute
                    </h1>

                    <BadgeCheck className="h-6 w-6 text-amber-500" />
                  </div>

                  <p className="mt-2 text-slate-600">
                    JEE • NEET • Foundation
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      4.7 (2430 Reviews)
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Kota, Rajasthan
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. 1988
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      12L+ Students
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-amber-400 text-black hover:bg-amber-500">
                  Enquire Now
                </Button>

                <Button variant="outline">
                  <Scale className="mr-2 h-4 w-4" />
                  Compare
                </Button>

                <Button variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-lg">
              <h3 className="text-xl font-bold">
                Get Admission Guidance
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Fees, scholarships and admission help.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  className="w-full rounded-xl border p-3"
                  placeholder="Your Name"
                />

                <input
                  className="w-full rounded-xl border p-3"
                  placeholder="Phone Number"
                />

                <Button className="w-full bg-amber-400 text-black hover:bg-amber-500">
                  Request Callback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}