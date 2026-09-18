"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import type { BlogComment, User } from "@/app/generated/prisma/client";
import { addBlogComment } from "@/lib/User/user/blog/comment";
import toast from "react-hot-toast";

type CommentItem = Pick<
  BlogComment,
  "id" | "content" | "createdAt"
> & {
  user: Pick<User, "name" | "image">;
};

interface CommentsProps {
  postId: string;
  comments: CommentItem[];
  canComment?: boolean;
}

export default function Comments({
  postId,
  comments,
  canComment = false,
}: CommentsProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentComments, setCurrentComments] = useState<CommentItem[]>(comments);

  // Keep local comments in sync if server props change
  useEffect(() => {
    setCurrentComments(comments);
  }, [comments]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await addBlogComment(postId, trimmed);
      if (res.success && res.comment) {
        // Optimistically prepend the comment to the list
        setCurrentComments((prev) => [res.comment as CommentItem, ...prev]);
        setContent("");
        toast.success("Comment posted successfully!");
      } else {
        toast.error(res.error || "Failed to post comment.");
      }
    } catch (err) {
      toast.error("An error occurred while posting the comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="comments-section"
      className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8scroll-mt-24"
    >
      <div className="mb-8 flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Comments ({currentComments.length})
          </h2>
          <p className="text-sm text-slate-500">
            Join the discussion.
          </p>
        </div>
      </div>

      {canComment ? (
        <form onSubmit={submit} className="mb-10 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-amber-600">
            Sign in
          </Link>{" "}
          to join the discussion.
        </div>
      )}

      <div className="space-y-6">
        {currentComments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No comments yet. Be the first to comment.
          </div>
        ) : (
          currentComments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {comment.user.name ?? "Anonymous"}
                  </h3>
                  <time className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(new Date(comment.createdAt))}
                  </time>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
                {comment.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
