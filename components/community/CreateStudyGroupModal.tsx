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
import { createStudyGroup } from "@/lib/community/study-groups";
import { Users, Plus, Loader2, Sparkles, MapPin, BookOpen, Hash } from "lucide-react";
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
  "Online / Pan-India",
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
];

interface CreateStudyGroupModalProps {
  trigger?: React.ReactNode;
}

export function CreateStudyGroupModal({ trigger }: CreateStudyGroupModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examCategory, setExamCategory] = useState("JEE");
  const [subject, setSubject] = useState("All Subjects");
  const [city, setCity] = useState("Online / Pan-India");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["doubts", "study-targets"]);
  const [rules, setRules] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "").toLowerCase();
      if (val && !tags.includes(val) && tags.length < 6) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t: string) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      toast.error("Please provide a title of at least 3 characters.");
      return;
    }
    if (!description.trim() || description.length < 10) {
      toast.error("Please add a brief description (at least 10 characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await createStudyGroup({
        title,
        description,
        examCategory,
        subject,
        city,
        tags,
        rules: rules.trim() || undefined,
      });

      if (res.success && res.group) {
        toast.success("Study group created successfully!");
        setOpen(false);
        // Reset form
        setTitle("");
        setDescription("");
        setRules("");
        router.push(`/chat/${res.group.id}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create group.");
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold gap-2 shadow-md shadow-amber-500/20 transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            <span>Create Study Group</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Peer Learning Community
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Create a New Study Group
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            Form an active study circle for your target exam, city, or subject. Invite peers, share notes, and clear doubts together.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="group-title" className="text-xs font-semibold text-slate-700">
              Group Name *
            </Label>
            <Input
              id="group-title"
              placeholder="e.g., JEE Advanced 2026 Physics Solvers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
              className="rounded-xl border-slate-200 focus-visible:ring-amber-500"
            />
          </div>

          {/* Exam & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Target Exam *
              </Label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
              >
                {EXAM_PRESETS.map((exam: string) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-600" />
                Focus Subject
              </Label>
              <Input
                placeholder="e.g., Physics, Organic Chem, All"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={50}
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Location / City */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Target Location / Hub
            </Label>
            <div className="flex gap-2">
              <select
                value={CITY_PRESETS.includes(city) ? city : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") setCity(e.target.value);
                }}
                className="w-1/2 h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CITY_PRESETS.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="custom">Other City / Locality</option>
              </select>
              <Input
                placeholder="Type city or locality name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-1/2 rounded-xl border-slate-200 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="group-desc" className="text-xs font-semibold text-slate-700">
              Description & Objectives *
            </Label>
            <Textarea
              id="group-desc"
              placeholder="What is the daily focus of this group? e.g., Solving 30 numericals daily, sharing Kota coaching DPPs, weekend mock test discussions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={600}
              required
              className="rounded-xl border-slate-200 text-sm focus-visible:ring-amber-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Tags (Press Enter or comma to add)
            </Label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {tags.length < 6 && (
              <Input
                placeholder="Add tags: pyq, allen, revision, daily-quiz..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="rounded-xl border-slate-200 text-xs focus-visible:ring-amber-500"
              />
            )}
          </div>

          {/* Group Guidelines (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="group-rules" className="text-xs font-semibold text-slate-700">
              Community Guidelines / Rules (Optional)
            </Label>
            <Input
              id="group-rules"
              placeholder="e.g., Strictly academic queries only; be respectful; no promotional links."
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              maxLength={200}
              className="rounded-xl border-slate-200 text-xs focus-visible:ring-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold min-w-[140px] shadow-sm shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-1.5" />
                  Launch Group
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
