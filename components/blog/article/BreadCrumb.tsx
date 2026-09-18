"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 overflow-x-auto"
    >
      <ol className="flex min-w-max items-center gap-2 text-sm text-slate-500">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md transition-colors hover:text-amber-600"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {isLast || !item.href ? (
                  <span
                    className="font-medium text-slate-900"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-amber-600"
                  >
                    {item.label}
                  </Link>
                )}
              </li>

              {!isLast && (
                <ChevronRight className="h-4 w-4 text-slate-300" />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}