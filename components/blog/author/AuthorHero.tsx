import Image from "next/image";
import { BadgeCheck, Briefcase, Sparkles } from "lucide-react";

type AuthorHeroProps = {
  author: {
    displayName: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
    designation: string | null;
    specialization: string | null;
    experience: number | null;
    isVerified: boolean;
  };
};

export default function AuthorHero({ author }: AuthorHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300" />

      <div className="px-8 pb-10">
        <div className="-mt-16 flex flex-col items-center text-center lg:flex-row lg:items-end lg:text-left">
          {/* Avatar */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
            <Image
              src={author.avatarUrl || "/images/avatar-placeholder.png"}
              alt={author.displayName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="mt-6 lg:ml-8 lg:mt-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {author.displayName}
              </h1>

              {author.isVerified && (
                <BadgeCheck className="h-6 w-6 fill-sky-500 text-white" />
              )}
            </div>

            <p className="mt-2 text-lg text-slate-500">
              @{author.username}
            </p>

            {author.designation && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <Briefcase className="h-4 w-4" />
                {author.designation}
              </div>
            )}

            {author.specialization && (
              <div className="mt-3 flex items-center justify-center gap-2 text-amber-700 lg:justify-start">
                <Sparkles className="h-4 w-4" />

                <span className="font-medium">
                  {author.specialization}
                </span>
              </div>
            )}

            {author.experience && (
              <p className="mt-3 text-sm text-slate-500">
                {author.experience}+ years of professional experience
              </p>
            )}

            {author.bio && (
              <p className="mt-6 max-w-3xl leading-8 text-slate-700">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}