"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyPostsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("q", search.trim());
      } else {
        params.delete("q");
      }

      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, pathname, router, searchParams]); 

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all-status") {
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
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your posts..."
            className="h-auto py-3 pl-11 pr-4 border-slate-300 rounded-xl focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500"
          />
        </div>

        <Select
          value={searchParams.get("status") ?? "all-status"}
          onValueChange={(value: string) => updateParam("status", value)}
        >
          <SelectTrigger className="h-auto py-3 px-4 border-slate-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-left">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter Dropdown */}
        <Select
          value={searchParams.get("sort") ?? "latest"}
          onValueChange={(value: string) => updateParam("sort", value)}
        >
          <SelectTrigger className="h-auto py-3 px-4 border-slate-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-left">
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="latest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="updated">Recently Updated</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
