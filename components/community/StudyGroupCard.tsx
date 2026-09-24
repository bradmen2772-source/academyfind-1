"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { Users, MapPin, BookOpen, ArrowRight, Check, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinStudyGroup, leaveStudyGroup } from "@/lib/community/study-groups";
import toast from "react-hot-toast";

interface StudyGroupCardProps {
  group: {
    id: string;
    title?: string | null;
    description?: string | null;
    examCategory?: string | null;
    subject?: string | null;
    city?: string | null;
    tags?: string[];
    memberCount: number;
    maxMembers?: number | null;
    isMember?: boolean;
    isOwner?: boolean;
    createdBy?: {
      id: string;
      name?: string | null;
      username?: string | null;
      image?: string | null;
    } | null;
  };
  onMembershipChange?: () => void;
}

export function StudyGroupCard({ group, onMembershipChange }: StudyGroupCardProps) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(group.isMember || false);
  const [memberCount, setMemberCount] = useState(group.memberCount);
  const [loading, setLoading] = useState(false);

  const getExamColor = (category?: string | null) => {
    switch (category?.toUpperCase()) {
      case "JEE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "NEET":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPSC":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CAT":
      case "GATE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CUET":
      case "CLAT":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await joinStudyGroup(group.id);
      if (res.success) {
        setIsMember(true);
        setMemberCount((prev) => prev + 1);
        toast.success(`Joined ${group.title}!`);
        if (onMembershipChange) onMembershipChange();
        router.push(`/chat/${group.id}`);
      } else {
        toast.error(res.error || "Could not join group.");
      }
    } catch (err) {
      toast.error("Please log in to join this study group.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    router.push(`/chat/${group.id}`);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md">
      <div>
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {group.examCategory && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border tracking-wide uppercase ${getExamColor(
                  group.examCategory
                )}`}
              >
                <Sparkles className="w-3 h-3" />
                {group.examCategory}
              </span>
            )}
            {group.subject && group.subject !== "All Subjects" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <BookOpen className="w-3 h-3 text-slate-400" />
                {group.subject}
              </span>
            )}
          </div>

          {/* Member Count */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>{memberCount}</span>
            {group.maxMembers && (
              <span className="text-slate-400 font-normal">/{group.maxMembers}</span>
            )}
          </div>
        </div>

        {/* Group Title */}
        <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {group.title}
        </h3>

        {/* Location tag */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="line-clamp-1">{group.city || "Online / Pan-India"}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {group.description || "Active community of aspirants discussing daily doubts and study goals."}
        </p>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {group.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-slate-500 bg-slate-100/70 hover:bg-slate-100 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium px-1">
                +{group.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
            {group.createdBy?.name ? group.createdBy.name.charAt(0) : "S"}
          </div>
          <span className="text-xs text-slate-500 truncate font-medium">
            {group.createdBy?.name || "Student Leader"}
          </span>
        </div>

        {isMember ? (
          <Button
            size="sm"
            onClick={handleEnter}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 gap-1.5 h-8 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Enter Room
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleJoin}
            disabled={loading}
            className="rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 gap-1.5 h-8 shrink-0 shadow-xs transition-colors"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Join Group</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
