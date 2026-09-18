"use client";

import Image from "next/image";
import Link from "next/link";

import { CheckCircle2, Globe, } from "lucide-react";

import type { BlogAuthorProfile } from "@/app/generated/prisma/client";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
interface AuthorCardProps {
  author: Pick<
    BlogAuthorProfile,
    | "displayName"
    | "username"
    | "designation"
    | "bio"
    | "avatarUrl"
    | "specialization"
    | "experience"
    | "isVerified"
    | "followerCount"
    | "twitterUrl"
    | "linkedinUrl"
    | "websiteUrl"
  >;
}

export default function AuthorCard({
  author,
}: AuthorCardProps) {
  return (
    <section
      aria-labelledby="author-card-title"
      className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-8 sm:p-10">

        <div className="flex flex-col gap-8 md:flex-row">

          {/* Avatar */}

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

                <h2
                id="author-card-title"
                className="text-2xl font-bold text-slate-900"
                >
                {author.displayName}
                </h2>

                {author.isVerified && (
                <CheckCircle2 className="h-5 w-5 fill-sky-500 text-white" />
                )}

            </div>

            {author.designation && (
                <p className="mt-2 text-slate-600">
                {author.designation}
                </p>
            )}

            {(author.specialization || author.experience) && (
                <div className="mt-4 flex flex-wrap gap-3">

                {author.specialization && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                    {author.specialization}
                    </span>
                )}

                {author.experience && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {author.experience}+ Years Experience
                    </span>
                )}

                </div>
            )}

            {author.bio && (
                <p className="mt-6 leading-8 text-slate-600">
                {author.bio}
                </p>
            )}<div className="mt-8 flex flex-wrap items-center gap-4">

            <Link
                href={`/blog/author/${author.username}`}
                className="rounded-xl bg-amber-500 px-5 py-2.5 font-medium text-white transition hover:bg-amber-600"
            >
                View Profile
            </Link>

            <span className="text-sm text-slate-500">
                {Intl.NumberFormat("en-IN").format(author.followerCount)}
                {" "}Followers
            </span>

            </div>

            <div className="mt-8 flex items-center gap-4">

            {author.websiteUrl && (
                <Link
                href={author.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 p-2.5 transition hover:bg-slate-50"
                >
                <Globe className="h-5 w-5" />
                </Link>
            )}

            {author.linkedinUrl && (
                <Link
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 p-2.5 transition hover:bg-slate-50"
                >
                <FaLinkedin className="h-5 w-5" />
                </Link>
            )}

            {author.twitterUrl && (
                <Link
                href={author.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 p-2.5 transition hover:bg-slate-50"
                >
                <FaTwitter className="h-5 w-5" />
                </Link>
            )}

            </div>

            </div>
        </div>
      </div>
    </section>
  );
}