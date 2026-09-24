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
import { updateMyBuddyPreferences } from "@/lib/community/buddies";
import { UserCheck, Sparkles, MapPin, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EXAM_PRESETS = [
  "JEE",
  "NEET",
  "UPSC",
  "CAT",
  "GATE",
  "CUET",
  "CLAT",
  "SSC",
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

interface EditBuddyProfileModalProps {
  initialData?: {
    targetExam?: string | null;
    targetYear?: number | null;
    city?: string | null;
    locality?: string | null;
    headline?: string | null;
    bio?: string | null;
    lookingForBuddy?: boolean;
  };
  trigger?: React.ReactNode;
}

export function EditBuddyProfileModal({ initialData, trigger }: EditBuddyProfileModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [targetExam, setTargetExam] = useState(initialData?.targetExam || "JEE");
  const [targetYear, setTargetYear] = useState(initialData?.targetYear || 2026);
  const [city, setCity] = useState(initialData?.city || "Kota");
  const [locality, setLocality] = useState(initialData?.locality || "");
  const [headline, setHeadline] = useState(initialData?.headline || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [lookingForBuddy, setLookingForBuddy] = useState(
    initialData?.lookingForBuddy !== undefined ? initialData.lookingForBuddy : true
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      toast.error("Please provide your city or coaching hub.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateMyBuddyPreferences({
        targetExam,
        targetYear: Number(targetYear) || undefined,
        city,
        locality: locality.trim() || undefined,
        headline: headline.trim() || undefined,
        bio: bio.trim() || undefined,
        lookingForBuddy,
      });

      if (res.success) {
        toast.success("Study profile updated! You are now discoverable to nearby aspirants.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Please sign in to update your study preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="rounded-full gap-2 text-xs font-semibold border-amber-200 text-amber-800 bg-amber-50/50 hover:bg-amber-100 hover:text-amber-900">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            Set My Study Preferences
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Study Buddy Matching
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Study Preferences & Location
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            Set your target exam and location so aspirants in your coaching cluster can find and connect with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Exam & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                Target Exam *
              </Label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
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
              <Label className="text-xs font-semibold text-slate-700">Target Year</Label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {[2025, 2026, 2027, 2028].map((y: number) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
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
              <Label className="text-xs font-semibold text-slate-700">Locality / Area</Label>
              <Input
                placeholder="e.g. Vigyan Nagar, Mukherjee Nagar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="rounded-xl border-slate-200 text-sm focus-visible:ring-amber-500"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <Label htmlFor="headline" className="text-xs font-semibold text-slate-700">
              Study Focus Headline
            </Label>
            <Input
              id="headline"
              placeholder="e.g. Solving 40 daily Physics numericals & DPPs"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={100}
              className="rounded-xl border-slate-200 text-sm focus-visible:ring-amber-500"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">
              About Your Preparation Style
            </Label>
            <Textarea
              id="bio"
              placeholder="Share what kind of study partner you're seeking (e.g. serious revision partner, library study buddy, doubt exchange)..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              maxLength={300}
              className="rounded-xl border-slate-200 text-xs focus-visible:ring-amber-500"
            />
          </div>

          {/* Discovery Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Show in Study Buddies Search
              </p>
              <p className="text-[11px] text-slate-500">
                Allow peers in your area to discover you and send buddy requests.
              </p>
            </div>
            <Switch checked={lookingForBuddy} onCheckedChange={setLookingForBuddy} />
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
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium min-w-[130px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
