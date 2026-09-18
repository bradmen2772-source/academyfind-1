import { Hash, Eye, Heart, MessageCircle, FileText } from "lucide-react";

type TagHeroProps = {
  tag: {
    name: string;
    postCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
};

export default function TagHero({
  tag,
}: TagHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">
      <div className="p-8 md:p-12">
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
          <Hash className="mr-2 h-4 w-4" />
          Blog Tag
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          #{tag.name}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Browse all articles tagged with <strong>{tag.name}</strong>. Discover
          curated content, guides, tutorials, and insights related to this
          topic.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            value={tag.postCount.toLocaleString()}
            label="Articles"
          />

          <StatCard
            icon={<Eye className="h-5 w-5" />}
            value={tag.totalViews.toLocaleString()}
            label="Views"
          />

          <StatCard
            icon={<Heart className="h-5 w-5" />}
            value={tag.totalLikes.toLocaleString()}
            label="Likes"
          />

          <StatCard
            icon={<MessageCircle className="h-5 w-5" />}
            value={tag.totalComments.toLocaleString()}
            label="Comments"
          />
        </div>
      </div>
    </section>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        {icon}
      </div>

      <div className="text-2xl font-bold text-slate-900">
        {value}
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}