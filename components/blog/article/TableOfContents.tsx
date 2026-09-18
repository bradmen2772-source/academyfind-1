"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export default function TableOfContents({
  items,
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  const headingIds = useMemo(
    () => items.map((item: TOCItem) => item.id),
    [items]
  );

  useEffect(() => {
    if (!headingIds.length) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const visible = entries
          .filter((entry: IntersectionObserverEntry) => entry.isIntersecting)
          .sort(
            (a: IntersectionObserverEntry, b: IntersectionObserverEntry) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0.15, 0.5, 1],
      }
    );

    headingIds.forEach((id: string) => {
      const el = document.getElementById(id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  if (!items.length) return null;

  return (
    <aside
      className={clsx(
    "sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:block",
    className
)}
    >
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-900">
        Table of Contents
      </h2>

      <nav aria-label="Table of contents">
        <ol className="space-y-2">{items.map((item: TOCItem) => {
  const isActive = activeId === item.id;

  return (
    <li
      key={item.id}
      className={clsx(
        item.level === 2 && "ml-0",
        item.level === 3 && "ml-4",
        item.level === 4 && "ml-8",
        item.level >= 5 && "ml-12"
      )}
    >
      <Link
        href={`#${encodeURIComponent(item.id)}`}
        scroll={false}
        prefetch={false}
        className={clsx(
          "block rounded-lg border-l-2 py-1.5 pl-3 pr-2 text-sm transition-all duration-200",

          isActive
            ? "border-amber-500 bg-amber-50 font-semibold text-amber-700"
            : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <span className="line-clamp-2">
          {item.text}
        </span>
      </Link>
    </li>
  );
})}
</ol>
        </nav>
    </aside>
  );
}
        