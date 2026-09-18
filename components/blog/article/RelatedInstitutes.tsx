"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import type { City, Institute } from "@/app/generated/prisma/client";

type RelatedInstitute = Pick<
  Institute,
  | "id"
  | "slug"
  | "name"
  | "logo"
  | "coverImage"
  | "googleRating"
  | "reviewCount"
  | "address"
> & {
  city: Pick<City, "name" | "slug">;
};

interface RelatedInstituteProps {
  institute: RelatedInstitute | null;
}

export default function RelatedInstitute({
  institute,
}: RelatedInstituteProps) {
  if (!institute) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Related Institute
          </h2>
          <p className="mt-2 text-slate-600">
            Explore the institute related to this article.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          Explore more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {institute && (
          <article
            key={institute.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/institute/${institute.slug}`}>
              <div className="relative aspect-[16/6] bg-slate-100">
                {institute.coverImage ? (
                  <Image
                    src={institute.coverImage}
                    alt={institute.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:1024px)100vw,50vw"
                  />
                ) : null}
              </div>
            </Link>

            <div className="flex gap-4 p-5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white">
                {institute.logo ? (
                  <Image
                    src={institute.logo}
                    alt={institute.name}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <Link href={`/institute/${institute.slug}`}>
                  <h3 className="truncate text-xl font-semibold text-slate-900 group-hover:text-amber-600">
                    {institute.name}
                  </h3>
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {institute.googleRating?.toFixed(1) ?? "N/A"}
                    {institute.reviewCount ? ` (${institute.reviewCount})` : ""}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {institute.city.name}
                  </span>
                </div>

                {institute.address && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {institute.address}
                  </p>
                )}

                <Link
                  href={`/institute/${institute.slug}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                >
                  View Institute
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

        )}
      </div>
    </section>
  );
}     