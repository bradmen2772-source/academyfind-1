"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const POLL_INTERVAL = 15_000; // 15 seconds

export function ChatNavButton({ className = "" }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/v2/conversations/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count ?? 0);
      }
    } catch {
      // Ignore network errors
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // When user is viewing /chat, refresh unread count after a moment to clear badge
  useEffect(() => {
    if (pathname.startsWith("/chat")) {
      const timer = setTimeout(fetchUnreadCount, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname, fetchUnreadCount]);

  return (
    <Link
      href="/chat"
      title={unreadCount > 0 ? `Messages (${unreadCount} new)` : "Messages"}
      aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : "Messages"}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 ${className}`}
    >
      <MessageCircle className="size-4" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white leading-none shadow-xs animate-in zoom-in-75 duration-200">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
