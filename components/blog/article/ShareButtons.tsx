"use client";

import Link from "next/link";
import { Link2, Share2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa"; // 🚀 WhatsApp added

interface ShareButtonsProps {
  title: string;
  slug: string;
  url?: string; 
}

export default function ShareButtons({ title, slug, url: customUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Safely get the URL (Avoids SSR Hydration Error)
  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    return customUrl || `${window.location.origin}/blog/${slug}`;
  }, [slug, customUrl]);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [url]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-slate-900">Share this article</h3>
      </div>

      {/* Grid updated for 5 buttons (or you can keep 4 and drop FB) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        
        {/* 🚀 WhatsApp Added */}
        <Link
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer" // 🔒 Security Add
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600"
        >
          <FaWhatsapp className="h-4 w-4" />
          WhatsApp
        </Link>

        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <FaLinkedin className="h-4 w-4" />
          LinkedIn
        </Link>

        <Link
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
        >
          <FaTwitter className="h-4 w-4" />
          X (Twitter)
        </Link>

        <button
          onClick={copyLink}
          className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors ${
            copied
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Link2 className="h-4 w-4" />
          {copied ? "Copied!" : "Copy Link"}
        </button>

      </div>
    </section>
  );
}