"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBookListing } from "@/lib/community/books";
import toast from "react-hot-toast";

interface DeleteBookButtonProps {
  listingId: string;
  bookTitle: string;
  trigger?: React.ReactNode;
}

export function DeleteBookButton({ listingId, bookTitle, trigger }: DeleteBookButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteBookListing(listingId);
      if (res.success) {
        toast.success(res.message || "Listing removed successfully.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to remove listing.");
      }
    } catch (err) {
      toast.error("Failed to delete listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full text-xs font-semibold h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-2.5"
            title="Remove listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-slate-900">
            Remove this book listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-800">&ldquo;{bookTitle}&rdquo;</span>? This will permanently remove the listing from the marketplace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={loading} className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              "Yes, Remove Listing"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
