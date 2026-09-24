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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { editBookListing } from "@/lib/community/books";
import { Pencil, MapPin, Sparkles, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const EXAM_PRESETS = [
  "JEE",
  "NEET",
  "UPSC",
  "CAT",
  "GATE",
  "CUET",
  "CLAT",
  "FOUNDATION",
  "OTHER",
];

const CITY_PRESETS = [
  "Kota",
  "Delhi / NCR",
  "Hyderabad",
  "Pune",
  "Bangalore",
  "Mumbai",
  "Patna",
  "Lucknow",
  "Jaipur",
  "Kolkata",
  "Online / Pan-India",
];

interface EditBookModalProps {
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
    city: string;
    locality?: string | null;
  };
  trigger?: React.ReactNode;
}

export function EditBookModal({ listing, trigger }: EditBookModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(listing.title);
  const [author, setAuthor] = useState(listing.author || "");
  const [instituteName, setInstituteName] = useState(listing.instituteName || "");
  const [examCategory, setExamCategory] = useState(listing.examCategory || "JEE");
  const [subject, setSubject] = useState(listing.subject || "General");
  const [condition, setCondition] = useState<"NEW" | "LIKE_NEW" | "GOOD" | "FAIR">(
    (listing.condition as any) || "LIKE_NEW"
  );
  const [isFree, setIsFree] = useState(listing.isFree);
  const [price, setPrice] = useState(listing.price || 0);
  const [originalPrice, setOriginalPrice] = useState(listing.originalPrice || 0);
  const [city, setCity] = useState(listing.city || "Kota");
  const [locality, setLocality] = useState(listing.locality || "");
  const [description, setDescription] = useState(listing.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      toast.error("Please provide a valid title.");
      return;
    }

    setLoading(true);
    try {
      const res = await editBookListing(listing.id, {
        title: title.trim(),
        author: author.trim() || undefined,
        instituteName: instituteName.trim() || undefined,
        examCategory,
        subject,
        condition,
        price: isFree ? 0 : Number(price) || 0,
        originalPrice: Number(originalPrice) || undefined,
        isFree,
        city,
        locality: locality.trim() || undefined,
        description: description.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message || "Changes submitted! Admin will review and make it live.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update listing.");
      }
    } catch (err) {
      toast.error("An error occurred while updating the listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-xs font-semibold h-8 gap-1.5 border-slate-200 hover:border-amber-400 hover:text-amber-700"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Edit Book Listing
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Update Listing Details
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            Note: Any updates will be submitted for admin verification before going live again.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Saving changes will temporarily set this listing to <strong>Pending Approval</strong> until verified by our moderators.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title" className="text-xs font-semibold text-slate-700">
              Book / Module Title *
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              className="rounded-xl border-slate-200"
            />
          </div>

          {/* Institute / Author */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Coaching / Publisher
              </Label>
              <Input
                placeholder="e.g. Allen, FIITJEE"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Author / Subject</Label>
              <Input
                placeholder="e.g. HC Verma"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Exam & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Target Exam *</Label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {EXAM_PRESETS.map((exam: string) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Condition *</Label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="NEW">Brand New (Unused)</option>
                <option value="LIKE_NEW">Like New (Barely used)</option>
                <option value="GOOD">Good (Light pencil markings)</option>
                <option value="FAIR">Fair (Readable, worn covers)</option>
              </select>
            </div>
          </div>

          {/* Free Donation Toggle & Price */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Donate for Free to a Junior</p>
                <p className="text-[11px] text-amber-700">
                  Offer study material to aspirants for free.
                </p>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>

            {!isFree && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Your Selling Price (₹) *</Label>
                  <Input
                    type="number"
                    min={0}
                    max={50000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="rounded-xl border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Original MRP (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={50000}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="rounded-xl border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* City & Locality */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                City / Hub *
              </Label>
              <select
                value={CITY_PRESETS.includes(city) ? city : "Kota"}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CITY_PRESETS.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Locality / Pickup Hub</Label>
              <Input
                placeholder="e.g. Vigyan Nagar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc" className="text-xs font-semibold text-slate-700">
              Details (Edition, Inclusions, Condition)
            </Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={400}
              className="rounded-xl border-slate-200 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Resubmit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
