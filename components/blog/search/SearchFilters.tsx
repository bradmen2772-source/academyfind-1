"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchFiltersProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];

  tags: {
    id: string;
    name: string;
    slug: string;
    postCount: number;
  }[];
};

export default function SearchFilters({
  categories,
  tags,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Filters
        </h2>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Sort By
        </label>

        <select
          value={searchParams.get("sort") ?? "relevance"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="relevance">Relevance</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Category
        </label>

        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tag */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Tag
        </label>

        <select
          value={searchParams.get("tag") ?? ""}
          onChange={(e) => updateParam("tag", e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="">All Tags</option>

          {tags.map((tag) => (
            <option
              key={tag.id}
              value={tag.slug}
            >
              {tag.name} ({tag.postCount})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => router.push(pathname)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Clear Filters
      </button>
    </aside>
  );
}