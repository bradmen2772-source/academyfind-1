"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toggleShortlist } from "@/lib/User/user/user-activity";
import toast from "react-hot-toast";

interface SaveButtonProps {
  instituteId: string; // ✅ ab sirf yahi prop chahiye
}

export default function SaveButton({ instituteId }: SaveButtonProps) {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false); // ✅ pehla fetch complete hua ya nahi

  // ✅ Mount hote hi apna session + saved status khud fetch karega
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/institute-status?instituteId=${instituteId}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setUserId(d.userId);
        setIsSaved(!!d.saved);
      })
      .catch(() => {
        // fail-safe: guest treat karo, button still usable rahega (login prompt dega)
      })
      .finally(() => {
        if (!cancelled) setStatusLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [instituteId]);

  const handleToggleSave = async () => {
    if (!userId) {
      toast.error("Please login to save!");
      return;
    }

    const previous = isSaved;
    setIsSaved(!isSaved);
    setIsLoading(true);

    try {
      const res = await toggleShortlist(userId, instituteId);

      if (!res.success) {
        setIsSaved(previous); // ✅ pehle bug tha — `setIsSaved(isSaved)` stale closure use karta tha
        console.error(res.error);
      }
    } catch (error) {
      setIsSaved(previous); // ✅ yahan bhi fix
      console.error("Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 cursor-pointer">
      <button
        onClick={handleToggleSave}
        disabled={isLoading || !statusLoaded}
        className="p-3 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bookmark
          className={`w-7 h-7 transition-all cursor-pointer ${
            isSaved ? "fill-amber-500 text-amber-500" : "text-slate-400 hover:text-slate-600"
          }`}
        />
      </button>

      <span
        className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
          isSaved ? "text-amber-600" : "text-slate-400"
        }`}
      >
        {isSaved ? "Saved" : "Save"}
      </span>
    </div>
  );
}