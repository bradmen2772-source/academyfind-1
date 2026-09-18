"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BlogFAQ } from "@/app/generated/prisma/client";

interface FAQSectionProps {
  faqs: Pick<BlogFAQ, "id" | "question" | "answer" | "order">[];
  title?: string;
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
}: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(
    faqs.length ? faqs[0].id : null
  );

  if (!faqs.length) return null;

  const sorted = [...faqs].sort((a: Pick<BlogFAQ, "id" | "question" | "answer" | "order">, b: Pick<BlogFAQ, "id" | "question" | "answer" | "order">) => a.order - b.order);

  return (
    <section
      aria-labelledby="faq-heading"
      className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2
        id="faq-heading"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        {title}
      </h2>

      <div className="mt-8 divide-y divide-slate-200">
        {sorted.map((faq: Pick<BlogFAQ, "id" | "question" | "answer" | "order">) => {
          const open = openId === faq.id;

          return (
            <div key={faq.id} className="py-2">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() =>
                  setOpenId((current) => (current === faq.id ? null : faq.id))
                }
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-base font-semibold text-slate-900">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-panel-${faq.id}`}
                hidden={!open}
                className="pb-4"
              >
                <p className="leading-7 text-slate-600 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}