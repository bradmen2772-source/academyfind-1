import {
  FilePenLine,
  Globe,
  Clock3,
  Archive,
} from "lucide-react";

type MyPostsStatsProps = {
  draft: number;
  published: number;
  scheduled: number;
  archived: number;
  rejected: number;
  pendingReview: number;
};

export default function MyPostsStats({
  draft,
  published,
  scheduled,
  archived,
  pendingReview,
  rejected

}: MyPostsStatsProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Drafts"
        value={draft}
        icon={<FilePenLine className="h-6 w-6" />}
        color="amber"
      />

      <StatCard
        title="Pending Review"
        value={pendingReview}
        icon={<Globe className="h-6 w-6" />}
        color="violet"
      />

      <StatCard
        title="Published"
        value={published}
        icon={<Globe className="h-6 w-6" />}
        color="emerald"
      />

      <StatCard
        title="Scheduled"
        value={scheduled}
        icon={<Clock3 className="h-6 w-6" />}
        color="blue"
      />

      <StatCard
        title="Rejected"
        value={rejected}
        icon={<Archive className="h-6 w-6" />}
        color="red"
      />

      <StatCard
        title="Archived"
        value={archived}
        icon={<Archive className="h-6 w-6" />}
        color="slate"
      />

      <StatCard
        title="Total"
        value={draft + published + scheduled + archived + rejected + pendingReview}
        icon={<Globe className="h-6 w-6" />}
        color="slate"
      />
    </section>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "emerald" | "blue" | "slate" | "red" | "violet";
};

const colorClasses = {
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    border: "border-violet-200",
  },
};

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  const styles = colorClasses[color];

  return (
    <div
      className={`rounded-2xl border ${styles.border} bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.bg} ${styles.text}`}
      >
        {icon}
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold text-slate-900">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {title}
        </p>
      </div>
    </div>
  );
}