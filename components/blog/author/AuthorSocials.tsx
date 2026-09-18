// components/blog/author/AuthorSocials.tsx

import Link from "next/link";
import {
  Globe,
  ExternalLink,
  LucideProps,
} from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";


type AuthorSocialsProps = {
  websiteUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
};

export default function AuthorSocials({
  websiteUrl,
  twitterUrl,
  linkedinUrl,
}: AuthorSocialsProps) {
  const links = [
    {
      href: websiteUrl,
      label: "Website",
      icon: Globe,
    },
    {
      href: twitterUrl,
      label: "Twitter",
      icon: FaTwitter,
    },
    {
      href: linkedinUrl,
      label: "LinkedIn",
      icon: FaLinkedin,
    },
  ].filter((item: any) => item.href);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-900">
        Connect
      </h3>

      <div className="space-y-3">
        {links.map((link: any) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.label}
              href={link.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-amber-300 hover:bg-amber-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="font-medium text-slate-700 group-hover:text-slate-900">
                  {link.label}
                </span>
              </div>

              <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-amber-600" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}