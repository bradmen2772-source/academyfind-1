"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, Loader2 } from "lucide-react";
import { rejectBookAction } from "@/app/(af-ass-manage)/af-ass-manage/books/actions";
import toast from "react-hot-toast";

const PRESET_REASONS = [
  "Inappropriate or irrelevant material not related to exams/studies.",
  "Unclear title, missing edition details or incomplete module set.",
  "Suspicious pricing or prohibited commercial advertisement.",
  "Duplicate listing already posted.",
];

interface AdminRejectBookModalProps {
  listingId: string;
  bookTitle: string;
}

export function AdminRejectBookModal({ listingId, bookTitle }: AdminRejectBookModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState(PRESET_REASONS[0]);

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    setLoading(true);
    try {
      const res = await rejectBookAction(listingId, reason.trim());
      if (res.success) {
        toast.success("Listing marked as rejected.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reject listing.");
      }
    } catch {
      toast.error("An error occurred while rejecting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Reject Listing"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all text-xs font-bold cursor-pointer"
        >
          <XCircle className="h-4 w-4" /> Reject
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Reject Book Listing
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Provide the student with clear feedback on why &ldquo;{bookTitle}&rdquo; was rejected so they can edit and resubmit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReject} className="space-y-3.5 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Quick Presets</Label>
            <div className="flex flex-col gap-1.5">
              {PRESET_REASONS.map((preset: string) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-left text-xs p-2 rounded-lg border transition-all cursor-pointer ${
                    reason === preset
                      ? "bg-rose-50 border-rose-300 text-rose-900 font-medium"
                      : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Custom Feedback to Student</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="text-xs rounded-xl border-slate-200"
              placeholder="Explain what the student needs to fix..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
