import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookListingStatus } from "@/app/generated/prisma/enums";
import { BookOpen, CheckCircle, XCircle, Filter, Sparkles, MapPin, Tag } from "lucide-react";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import { AdminRejectBookModal } from "@/components/admin/AdminRejectBookModal";
import { approveBookAction, deleteBookAction } from "./actions";

interface AdminBooksPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  const params = await searchParams;
  const currentFilter = params.status || "PENDING_APPROVAL";

  const whereCondition: any = {};
  if (currentFilter !== "ALL") {
    whereCondition.status = currentFilter as BookListingStatus;
  }

  const [books, pendingCount, liveCount, rejectedCount] = await Promise.all([
    prisma.bookListing.findMany({
      where: whereCondition,
      include: {
        seller: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bookListing.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.bookListing.count({ where: { status: "AVAILABLE" } }),
    prisma.bookListing.count({ where: { status: "REJECTED" } }),
  ]);

  const filterOptions = [
    { label: "Pending Approval", value: "PENDING_APPROVAL", count: pendingCount },
    { label: "Live / Approved", value: "AVAILABLE", count: liveCount },
    { label: "Rejected", value: "REJECTED", count: rejectedCount },
    { label: "All Listings", value: "ALL", count: null },
  ];

  return (
    <div className="p-4 sm:p-8 w-full min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Book Exchange Moderation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify student book listings before they go live on the public P2P marketplace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {pendingCount} Pending Review
            </span>
          )}
          <div className="bg-stone-100 text-stone-800 px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0">
            Total Shown: {books.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </div>
        {filterOptions.map((opt: { label: string; value: string; count: number | null }) => (
          <Link
            key={opt.value}
            href={`/af-ass-manage/books?status=${opt.value}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentFilter === opt.value
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== null && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  currentFilter === opt.value
                    ? "bg-white/20 text-white"
                    : opt.value === "PENDING_APPROVAL" && opt.count > 0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {opt.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Main Table / Empty State */}
      {books.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center shadow-xs mt-4">
          <BookOpen className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">All caught up!</h3>
          <p className="text-slate-500 text-sm mt-1">
            No listings found with status &ldquo;{currentFilter.toLowerCase()}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mt-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/70 border-b border-stone-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-4">Study Material</th>
                  <th className="p-4">Student Seller</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {books.map((book: (typeof books)[number]) => {
                  const isPending = book.status === "PENDING_APPROVAL";
                  const isApproved = book.status === "AVAILABLE";
                  const isRejected = book.status === "REJECTED";

                  return (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Material info */}
                      <td className="p-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {book.examCategory && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                              {book.examCategory}
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                            {book.condition}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug line-clamp-2">
                          {book.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {book.instituteName ? `Module: ${book.instituteName}` : book.author || book.subject}
                        </p>
                        {book.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 italic">
                            &ldquo;{book.description}&rdquo;
                          </p>
                        )}
                        {book.rejectionReason && (
                          <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                            <strong>Reason:</strong> {book.rejectionReason}
                          </div>
                        )}
                      </td>

                      {/* Seller details */}
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{book.seller?.name || "Student"}</p>
                        <p className="text-xs text-slate-500">{book.seller?.email || "No email"}</p>
                        {book.seller?.phone && (
                          <p className="text-xs text-slate-400 mt-0.5">{book.seller.phone}</p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>
                            {book.locality ? `${book.locality}, ` : ""}
                            {book.city}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        {book.isFree ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                            FREE / DONATE
                          </span>
                        ) : (
                          <div>
                            <span className="font-extrabold text-slate-900">₹{book.price}</span>
                            {book.originalPrice && (
                              <span className="text-xs text-slate-400 line-through ml-1.5">
                                ₹{book.originalPrice}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                            isPending
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : isApproved
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isRejected
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {book.status === "PENDING_APPROVAL"
                            ? "PENDING"
                            : book.status === "AVAILABLE"
                            ? "APPROVED"
                            : book.status}
                        </span>
                      </td>

                      {/* Moderation Actions */}
                      <td className="p-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              {/* Approve Button */}
                              <form
                                action={async () => {
                                  "use server";
                                  await approveBookAction(book.id);
                                }}
                              >
                                <button
                                  type="submit"
                                  title="Approve Listing"
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold cursor-pointer"
                                >
                                  <CheckCircle className="h-4 w-4" /> Approve
                                </button>
                              </form>

                              {/* Reject Modal */}
                              <AdminRejectBookModal
                                listingId={book.id}
                                bookTitle={book.title}
                              />
                            </>
                          )}

                          {isRejected && (
                            <form
                              action={async () => {
                                "use server";
                                await approveBookAction(book.id);
                              }}
                            >
                              <button
                                type="submit"
                                title="Re-approve Listing"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all text-xs font-bold cursor-pointer"
                              >
                                <CheckCircle className="h-3.5 w-3.5" /> Re-approve
                              </button>
                            </form>
                          )}

                          {isApproved && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                              Live
                            </span>
                          )}

                          {/* Delete Action */}
                          <AdminDeleteButton
                            id={book.id}
                            onDelete={deleteBookAction}
                            title="Delete this book listing?"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
