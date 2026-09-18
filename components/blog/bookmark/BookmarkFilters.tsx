"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

type BookmarkFiltersProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export default function BookmarkFilters({
  categories,
}: BookmarkFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(
    searchParams.get("q") ?? ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-amber-500"
          />
        </div>

        {/* Category */}
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(value: string) => updateParam("category", value === "all" ? "" : value)}
        >
            <SelectTrigger className="h-auto py-3 px-4 border-slate-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-left">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: { id: string; name: string; slug: string }) => (                
                    <SelectItem  key={category.id} value={category.slug}>
                        {category.name}
                    </SelectItem>
          ))}
            </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={searchParams.get("sort") ?? "saved"}
          onValueChange={(value: string) => updateParam("sort", value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-auto py-3 px-4 border-slate-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-left">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saved">Recently Saved</SelectItem>
            <SelectItem value="latest">Recently Published</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
            <SelectItem value="liked">Most Liked</SelectItem>
            <SelectItem value="comments">Most Discussed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}