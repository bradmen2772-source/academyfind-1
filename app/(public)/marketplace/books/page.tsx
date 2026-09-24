import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, ArrowLeft, Coins, Sparkles, Plus, BookMarked } from "lucide-react";
import { getBookListings, getMyBookListings } from "@/lib/community/books";
import { getRelevantInstitutesForCommunity } from "@/lib/community/lead-funnel";
import { getSession } from "@/lib/auth/getSession";
import { BookListingCard } from "@/components/community/BookListingCard";
import { BookFilter } from "@/components/community/BookFilter";
import { CreateBookModal } from "@/components/community/CreateBookModal";
import { CommunityLeadBanner } from "@/components/community/CommunityLeadBanner";
import { FeaturedInstitutesRail } from "@/components/community/FeaturedInstitutesRail";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Used Books & Coaching Modules Exchange | AcademyFind",
  description:
    "Buy, sell, or donate second-hand coaching modules (Allen, FIITJEE, Resonance, Aakash) and textbooks with students near you on AcademyFind.",
};

interface BooksPageProps {
  searchParams: Promise<{
    exam?: string;
    city?: string;
    free?: string;
    q?: string;
    page?: string;
    tab?: string;
  }>;
}

export default async function BooksMarketplacePage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const examCategory = params.exam || "ALL";
  const city = params.city || "ALL";
  const isFree = params.free === "true";
  const search = params.q || "";
  const page = params.page ? parseInt(params.page, 10) : 1;
  const activeTab = params.tab === "my" ? "my" : "browse";

  const session = await getSession();
  const isLoggedIn = !!session?.user;

  const [
    { listings = [], total = 0 },
    { institutes = [] },
    myListingsResult,
  ] = await Promise.all([
    getBookListings({
      examCategory,
      city,
      isFree,
      search,
      page,
      limit: 18,
    }),
    getRelevantInstitutesForCommunity(examCategory, city, 4),
    isLoggedIn ? getMyBookListings() : Promise.resolve({ success: true, listings: [] }),
  ]);

  const myListings = myListingsResult.listings || [];
  const pendingCount = myListings.filter((b: (typeof myListings)[number]) => b.status === "PENDING_APPROVAL").length;
  const rejectedCount = myListings.filter((b: (typeof myListings)[number]) => b.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Banner & Header */}
      <div className="border-b border-border/60 bg-linear-to-b from-orange-50/50 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link href="/community" className="hover:text-amber-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Community Hub
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Book Exchange</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <BookMarked className="w-3.5 h-3.5" />
                Student P2P Marketplace
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Used Books & Coaching Modules
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Buy, sell, or donate second-hand study material with peers in your coaching hub.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <CreateBookModal />
            </div>
          </div>

          {/* Navigation Tabs (Browse vs My Listings) */}
          <div className="flex items-center gap-2 mt-6 pt-2 border-t border-slate-200/60">
            <Link
              href="/marketplace/books"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "browse"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Browse Marketplace
            </Link>

            {isLoggedIn && (
              <Link
                href="/marketplace/books?tab=my"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "my"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-amber-50/50 hover:border-amber-200 hover:text-amber-700"
                }`}
              >
                <span>My Listings</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === "my" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {myListings.length}
                </span>
                {pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title={`${pendingCount} pending approval`} />
                )}
              </Link>
            )}
          </div>

          {/* Search & Filter Bar (Only on browse tab) */}
          {activeTab === "browse" && (
            <div className="mt-5">
              <BookFilter />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {activeTab === "my" ? (
          /* ─── MY LISTINGS TAB ─── */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Manage Your Listings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update, mark as sold, or delete your posted materials. Changes undergo admin verification before going live.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {pendingCount} Pending Approval
                  </span>
                )}
                {rejectedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    {rejectedCount} Needs Revision
                  </span>
                )}
              </div>
            </div>

            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myListings.map((listing: (typeof myListings)[number]) => (
                  <BookListingCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      isOwner: true,
                      seller: {
                        id: session?.user?.id || "",
                        name: session?.user?.name || "You",
                        image: session?.user?.image || null,
                      },
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">You haven&apos;t listed any books yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Earn AcademyFind coins and help junior aspirants by passing down your old coaching modules, DPPs, and textbooks.
                </p>
                <div className="pt-2">
                  <CreateBookModal />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── BROWSE MARKETPLACE TAB ─── */
          <>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-5">
              <span>Showing {listings.length} of {total} available books & modules</span>
              {isFree && (
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Free / Donate Only
                </span>
              )}
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((listing: (typeof listings)[number]) => (
                  <BookListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3 mt-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">No Listings Found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  No matching books found for this search. Clear filters or be the first to list your used coaching material!
                </p>
                <div className="pt-2">
                  <CreateBookModal />
                </div>
              </div>
            )}

            {/* ─── Community Lead Generation Funnel ────────────────── */}
            <div className="mt-14 space-y-8">
              <CommunityLeadBanner
                examCategory={examCategory !== "ALL" ? examCategory : "JEE & NEET"}
                city={city !== "ALL" ? city : "your city"}
                defaultInstitute={institutes[0] || null}
                availableInstitutes={institutes}
              />
              <FeaturedInstitutesRail
                institutes={institutes}
                examCategory={examCategory !== "ALL" ? examCategory : "Competitive Exams"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

