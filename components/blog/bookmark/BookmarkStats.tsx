import {
  Bookmark,
  Eye,
  Heart,
  Layers3,
} from "lucide-react";

type BookmarkStatsProps = {
  totalBookmarks: number;
  totalViews: number;
  totalLikes: number;
  totalCategories: number;
};

export default function BookmarkStats({
  totalBookmarks,
  totalViews,
  totalLikes,
  totalCategories,
}: BookmarkStatsProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Saved Articles"
        value={totalBookmarks}
        icon={<Bookmark className="h-6 w-6" />}
        color="amber"
      />

      <StatCard
        title="Total Views"
        value={totalViews}
        icon={<Eye className="h-6 w-6" />}
        color="blue"
      />

      <StatCard
        title="Total Likes"
        value={totalLikes}
        icon={<Heart className="h-6 w-6" />}
        color="rose"
      />

      <StatCard
        title="Categories"
        value={totalCategories}
        icon={<Layers3 className="h-6 w-6" />}
        color="emerald"
      />
    </section>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "blue" | "rose" | "emerald";
};

const styles = {
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    border: "border-rose-200",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
};

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  const style = styles[color];

  return (
    <div
      className={`rounded-2xl border ${style.border} bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg} ${style.text}`}
      >
        {icon}
      </div>

      <div className="mt-5">
        <h3 className="text-3xl font-bold text-slate-900">
          {value.toLocaleString()}
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {title}
        </p>
      </div>
    </div>
  );
}