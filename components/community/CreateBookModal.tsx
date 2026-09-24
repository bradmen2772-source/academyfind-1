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
import { createBookListing } from "@/lib/community/books";
import { BookOpen, Plus, Coins, MapPin, Sparkles, Loader2 } from "lucide-react";
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

interface CreateBookModalProps {
  trigger?: React.ReactNode;
}

export function CreateBookModal({ trigger }: CreateBookModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [examCategory, setExamCategory] = useState("JEE");
  const [subject, setSubject] = useState("Physics");
  const [condition, setCondition] = useState<"NEW" | "LIKE_NEW" | "GOOD" | "FAIR">("LIKE_NEW");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(250);
  const [originalPrice, setOriginalPrice] = useState(700);
  const [city, setCity] = useState("Kota");
  const [locality, setLocality] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      toast.error("Please provide the book/module title.");
      return;
    }

    setLoading(true);
    try {
      const res = await createBookListing({
        title,
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
        toast.success(
          res.message || "Book listing submitted for review! It will go live once verified by an admin."
        );
        setOpen(false);
        // Reset form
        setTitle("");
        setAuthor("");
        setInstituteName("");
        setDescription("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to list book.");
      }
    } catch (err) {
      toast.error("Please sign in to list second-hand books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-2 shadow-xs">
            <Plus className="w-4 h-4" />
            List a Used Book
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            P2P Book Exchange &bull; Earn 30 Coins on Approval
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            List Second-Hand Study Material
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            Pass down coaching modules and reference books. All listings are verified by our team to protect students from spam.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="book-title" className="text-xs font-semibold text-slate-700">
              Book / Module Title *
            </Label>
            <Input
              id="book-title"
              placeholder="e.g. Allen Kota Physics Modules (Class 11 & 12 Complete Set)"
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
                Coaching Institute / Publisher
              </Label>
              <Input
                placeholder="e.g. Allen, FIITJEE, Resonance"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Author / Subject</Label>
              <Input
                placeholder="e.g. HC Verma, DC Pandey"
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
                  Help an aspirant without charging; fosters good karma and community rank.
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
                placeholder="e.g. Vigyan Nagar, Mukherjee Nagar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="book-desc" className="text-xs font-semibold text-slate-700">
              Details (Edition, Inclusions, Condition)
            </Label>
            <Textarea
              id="book-desc"
              placeholder="e.g., 2024-2025 Edition modules. Includes 10 booklets with solved DPPs and test papers. No missing pages."
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
                  Listing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Post Listing
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
