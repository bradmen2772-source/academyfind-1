"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, MapPin, Sparkles, MessageCircle, Tag, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { contactBookSeller, updateBookStatus } from "@/lib/community/books";
import { EditBookModal } from "@/components/community/EditBookModal";
import { DeleteBookButton } from "@/components/community/DeleteBookButton";
import toast from "react-hot-toast";

interface BookListingCardProps {
  listing: {
    id: string;
    title: string;
    author?: string | null;
    instituteName?: string | null;
    examCategory?: string | null;
    subject?: string | null;
    condition: string;
    price: number;
    originalPrice?: number | null;
    isFree: boolean;
    description?: string | null;
    images?: string[];
    city: string;
    locality?: string | null;
    status?: string;
    rejectionReason?: string | null;
    isOwner?: boolean;
    seller?: {
      id: string;
      name?: string | null;
      username?: string | null;
      image?: string | null;
    };
  };
}

export function BookListingCard({ listing }: BookListingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "NEW":
        return "Brand New";
      case "LIKE_NEW":
        return "Like New";
      case "GOOD":
        return "Good Condition";
      case "FAIR":
        return "Acceptable";
      default:
        return condition;
    }
  };

  const handleContact = async () => {
    if (listing.isOwner) {
      toast("This is your own listing.", { icon: "ℹ️" });
      return;
    }

    setLoading(true);
    try {
      const res = await contactBookSeller(listing.id);
      if (res.success && res.conversationId) {
        toast.success("Inquiry sent! Opening chat room...");
        router.push(`/chat/${res.conversationId}`);
      } else {
        toast.error(res.error || "Could not start chat.");
      }
    } catch (err) {
      toast.error("Please sign in to contact the seller.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSold = async () => {
    const newStatus = listing.status === "SOLD" ? "AVAILABLE" : "SOLD";
    setStatusLoading(true);
    try {
      const res = await updateBookStatus(listing.id, newStatus);
      if (res.success) {
        toast.success(newStatus === "SOLD" ? "Marked as Sold!" : "Marked as Available!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status.");
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const isPending = listing.status === "PENDING_APPROVAL";
  const isRejected = listing.status === "REJECTED";
  const isSold = listing.status === "SOLD";

  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
      isPending
        ? "border-amber-300/80 bg-amber-50/20"
        : isRejected
        ? "border-rose-200/90 bg-rose-50/20"
        : "border-slate-200/90 hover:border-amber-300"
    }`}>
      <div>
        {/* Owner Moderation Banner */}
        {listing.isOwner && (
          <div className="mb-3">
            {isPending && (
              <div className="rounded-xl bg-amber-100/80 border border-amber-300/60 px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  Pending Admin Approval
                </span>
                <span className="text-[10px] text-amber-700 font-normal">Not live yet</span>
              </div>
            )}

            {isRejected && (
              <div className="rounded-xl bg-rose-100/90 border border-rose-200 px-3 py-2 text-xs text-rose-900">
                <div className="font-bold flex items-center justify-between">
                  <span>❌ Listing Needs Revision</span>
                  <span className="text-[10px] font-normal uppercase">Rejected</span>
                </div>
                {listing.rejectionReason && (
                  <p className="mt-1 text-[11px] text-rose-700 leading-snug">
                    <strong>Reason:</strong> {listing.rejectionReason}
                  </p>
                )}
              </div>
            )}

            {listing.status === "AVAILABLE" && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200/70 px-3 py-1 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Live in Marketplace
                </span>
                <button
                  type="button"
                  onClick={handleToggleSold}
                  disabled={statusLoading}
                  className="text-[10px] text-slate-500 hover:text-slate-900 underline font-normal cursor-pointer"
                >
                  Mark as Sold
                </button>
              </div>
            )}

            {isSold && (
              <div className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Sold Out</span>
                <button
                  type="button"
                  onClick={handleToggleSold}
                  disabled={statusLoading}
                  className="text-[10px] text-amber-700 hover:underline font-normal cursor-pointer"
                >
                  Re-list as Available
                </button>
              </div>
            )}
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {listing.examCategory && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {listing.examCategory}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {getConditionLabel(listing.condition)}
            </span>
          </div>

          {/* Price or Free Pill */}
          {listing.isFree ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              FREE / DONATE
            </span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-slate-900">
                ₹{listing.price}
              </span>
              {listing.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{listing.originalPrice}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors mb-1">
          {listing.title}
        </h3>

        {/* Author or Coaching Institute */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {listing.instituteName
              ? `Module: ${listing.instituteName}`
              : listing.author
              ? `Author: ${listing.author}`
              : listing.subject || "Study Material"}
          </span>
        </div>

        {/* Location tag */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">
            {listing.locality ? `${listing.locality}, ` : ""}
            {listing.city}
          </span>
        </div>

        {/* Description */}
        {listing.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {listing.description}
          </p>
        )}
      </div>

      {/* Seller & Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
            {listing.seller?.name?.charAt(0) || "S"}
          </div>
          <span className="text-xs text-slate-500 truncate font-medium">
            {listing.seller?.name || "Student"}
          </span>
        </div>

        {listing.isOwner ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <EditBookModal listing={listing} />
            <DeleteBookButton listingId={listing.id} bookTitle={listing.title} />
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleContact}
            disabled={loading}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 h-8 gap-1.5 shrink-0"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                Chat to Pick Up
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

