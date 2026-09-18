    import Image from "next/image";
import { BookOpen, Eye, Heart, MessageCircle } from "lucide-react";

type CategoryHeroProps = {
  category: {
    name: string;
    description: string | null;
    coverImage: string | null;
    color: string | null;
    icon: string | null;
    postCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
};

export default function CategoryHero({
  category,
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-72 w-full">
        {category.coverImage ? (
          <>
            <Image
              src={category.coverImage}
              alt={category.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300" />
        )}
      </div>

      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-8 text-white md:p-12">
          <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            <BookOpen className="mr-2 h-4 w-4" />
            Blog Category
          </div>

          <h1 className="mt-5 text-4xl font-bold md:text-5xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              {category.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-6">
            <Stat
              icon={<BookOpen className="h-5 w-5" />}
              label="Articles"
              value={category.postCount}
            />

            <Stat
              icon={<Eye className="h-5 w-5" />}
              label="Views"
              value={category.totalViews.toLocaleString()}
            />

            <Stat
              icon={<Heart className="h-5 w-5" />}
              label="Likes"
              value={category.totalLikes.toLocaleString()}
            />

            <Stat
              icon={<MessageCircle className="h-5 w-5" />}
              label="Comments"
              value={category.totalComments.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type StatProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function Stat({
  icon,
  label,
  value,
}: StatProps) {
  return (
    <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-white">
        {icon}

        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-200">
        {label}
      </p>
    </div>
  );
}