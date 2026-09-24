"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { requireAuth } from "@/lib/auth/requireAuth";
import { getOrCreateDm } from "@/lib/chat/createDm";
import { creditWallet } from "@/lib/wallet/credit";

// ─── Input Validation Schemas ──────────────────────────────────────────

const createBookSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  author: z.string().trim().max(60).optional(),
  instituteName: z.string().trim().max(60).optional(),
  examCategory: z.string().trim().min(2).max(40),
  subject: z.string().trim().max(50).optional().default("General"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).default("LIKE_NEW"),
  price: z.number().int().min(0).max(50000).default(0),
  originalPrice: z.number().int().min(0).max(50000).optional(),
  isFree: z.boolean().default(false),
  description: z.string().trim().max(800).optional(),
  images: z.array(z.string().url()).max(5).optional().default([]),
  city: z.string().trim().min(2).max(60),
  locality: z.string().trim().max(60).optional(),
});

export type CreateBookInput = z.input<typeof createBookSchema>;

// ─── 1. Create Book Listing ────────────────────────────────────────────

export async function createBookListing(data: CreateBookInput) {
  const session = await requireAuth();
  const sellerId = session.user.id;

  const parsed = createBookSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const {
    title,
    author,
    instituteName,
    examCategory,
    subject,
    condition,
    price,
    originalPrice,
    isFree,
    description,
    images,
    city,
    locality,
  } = parsed.data;

  const finalIsFree = isFree || price === 0;
  const finalPrice = finalIsFree ? 0 : price;

  try {
    const listing = await prisma.bookListing.create({
      data: {
        sellerId,
        title,
        author: author || null,
        instituteName: instituteName || null,
        examCategory: examCategory.toUpperCase(),
        subject: subject || "General",
        condition,
        price: finalPrice,
        originalPrice: originalPrice || null,
        isFree: finalIsFree,
        description: description || null,
        images: images || [],
        city,
        locality: locality || null,
        status: "PENDING_APPROVAL", // Requires admin approval before going live
      },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return {
      success: true,
      listing,
      message: "Book listing submitted for review! It will be live once approved by an admin.",
    };
  } catch (error: any) {
    console.error("Error creating book listing:", error);
    return { success: false, error: "Failed to list book. Please try again." };
  }
}

// ─── 1b. Edit Book Listing (Requires Admin Re-Approval) ─────────────────

export async function editBookListing(listingId: string, data: CreateBookInput) {
  const session = await requireAuth();
  const currentUserId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const parsed = createBookSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  try {
    const existing = await prisma.bookListing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    });

    if (!existing) {
      return { success: false, error: "Listing not found." };
    }

    if (existing.sellerId !== currentUserId && !isAdmin) {
      return { success: false, error: "You are not authorized to edit this listing." };
    }

    const {
      title,
      author,
      instituteName,
      examCategory,
      subject,
      condition,
      price,
      originalPrice,
      isFree,
      description,
      images,
      city,
      locality,
    } = parsed.data;

    const finalIsFree = isFree || price === 0;
    const finalPrice = finalIsFree ? 0 : price;

    const updated = await prisma.bookListing.update({
      where: { id: listingId },
      data: {
        title,
        author: author || null,
        instituteName: instituteName || null,
        examCategory: examCategory.toUpperCase(),
        subject: subject || "General",
        condition,
        price: finalPrice,
        originalPrice: originalPrice || null,
        isFree: finalIsFree,
        description: description || null,
        images: images || [],
        city,
        locality: locality || null,
        // Any edit resets status to PENDING_APPROVAL so admin must approve the change before going live again
        status: "PENDING_APPROVAL",
        rejectionReason: null,
      },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return {
      success: true,
      listing: updated,
      message: "Listing updated! It will be live again after admin verification.",
    };
  } catch (error: any) {
    console.error("Error editing book listing:", error);
    return { success: false, error: "Failed to update listing." };
  }
}

// ─── 1c. Delete Book Listing (Instant Deletion by Seller or Admin) ──────

export async function deleteBookListing(listingId: string) {
  const session = await requireAuth();
  const currentUserId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  try {
    const existing = await prisma.bookListing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    });

    if (!existing) {
      return { success: false, error: "Listing not found." };
    }

    if (existing.sellerId !== currentUserId && !isAdmin) {
      return { success: false, error: "You are not authorized to delete this listing." };
    }

    await prisma.bookListing.delete({
      where: { id: listingId },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return { success: true, message: "Listing deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting book listing:", error);
    return { success: false, error: "Failed to delete listing." };
  }
}

// ─── 1d. Get My Book Listings (For Logged-in User) ──────────────────────

export async function getMyBookListings() {
  const session = await requireAuth();
  const sellerId = session.user.id;

  try {
    const listings = await prisma.bookListing.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        sellerId: true,
        title: true,
        author: true,
        instituteName: true,
        examCategory: true,
        subject: true,
        condition: true,
        price: true,
        originalPrice: true,
        isFree: true,
        description: true,
        images: true,
        city: true,
        locality: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, listings };
  } catch (error) {
    console.error("Error fetching user's book listings:", error);
    return { success: false, listings: [], error: "Failed to load your listings." };
  }
}

// ─── 2. Get Book Listings (Public - Only Live AVAILABLE) ─────────────────

export interface GetBookListingsParams {
  examCategory?: string;
  city?: string;
  subject?: string;
  condition?: string;
  isFree?: boolean;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export async function getBookListings(params: GetBookListingsParams = {}) {
  const {
    examCategory,
    city,
    subject,
    condition,
    isFree,
    search,
    sortBy = "newest",
    page = 1,
    limit = 18,
  } = params;

  const skip = (page - 1) * limit;

  // Public marketplace ONLY shows approved, live books
  const where: any = {
    status: "AVAILABLE",
  };

  if (examCategory && examCategory !== "ALL") {
    where.examCategory = { equals: examCategory, mode: "insensitive" };
  }

  if (city && city !== "ALL") {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (subject && subject !== "ALL") {
    where.subject = { contains: subject, mode: "insensitive" };
  }

  if (condition && condition !== "ALL") {
    where.condition = condition;
  }

  if (isFree === true) {
    where.isFree = true;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { instituteName: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };

  try {
    const session = await getSession();
    const currentUserId = session?.user?.id;

    const [listings, total] = await Promise.all([
      prisma.bookListing.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          sellerId: true,
          title: true,
          author: true,
          instituteName: true,
          examCategory: true,
          subject: true,
          condition: true,
          price: true,
          originalPrice: true,
          isFree: true,
          description: true,
          images: true,
          city: true,
          locality: true,
          status: true,
          rejectionReason: true,
          createdAt: true,
          seller: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      }),
      prisma.bookListing.count({ where }),
    ]);

    const formatted = listings.map((item: (typeof listings)[number]) => ({
      ...item,
      isOwner: currentUserId === item.sellerId,
    }));

    return {
      success: true,
      listings: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching book listings:", error);
    return {
      success: false,
      listings: [],
      total: 0,
      page: 1,
      totalPages: 0,
      error: "Failed to load book listings.",
    };
  }
}

// ─── 3. Contact Book Seller ────────────────────────────────────────────

export async function contactBookSeller(listingId: string) {
  const session = await requireAuth();
  const currentUserId = session.user.id;

  try {
    const listing = await prisma.bookListing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        sellerId: true,
        title: true,
        price: true,
        isFree: true,
        city: true,
      },
    });

    if (!listing) return { success: false, error: "Listing not found." };
    if (listing.sellerId === currentUserId) {
      return { success: false, error: "You cannot buy your own listing." };
    }

    // Get or create DM
    const conversation = await getOrCreateDm(currentUserId, listing.sellerId);

    // Post introductory inquiry message
    const priceText = listing.isFree ? "Free/Donate" : `₹${listing.price}`;
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: currentUserId,
        content: `Hi! I'm interested in your book listing: "${listing.title}" (${priceText}) in ${listing.city}. Is it still available for local pickup?`,
        type: "TEXT",
      },
    });

    revalidatePath(`/chat/${conversation.id}`);

    return {
      success: true,
      conversationId: conversation.id,
    };
  } catch (error) {
    console.error("Error initiating seller contact:", error);
    return { success: false, error: "Failed to start conversation." };
  }
}

// ─── 4. Update Listing Status (Owner toggle: e.g. SOLD) ─────────────────

export async function updateBookStatus(listingId: string, status: "AVAILABLE" | "RESERVED" | "SOLD" | "DONATED") {
  const session = await requireAuth();
  const currentUserId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  try {
    const listing = await prisma.bookListing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    });

    if (!listing || (listing.sellerId !== currentUserId && !isAdmin)) {
      return { success: false, error: "Unauthorized or not found." };
    }

    await prisma.bookListing.update({
      where: { id: listingId },
      data: { status },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");
    return { success: true };
  } catch (error) {
    console.error("Error updating book status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

// ─── 5. Admin Moderation Actions ───────────────────────────────────────

export async function adminApproveBookListing(listingId: string) {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  try {
    const listing = await prisma.bookListing.findUnique({
      where: { id: listingId },
      select: { id: true, title: true, sellerId: true, isFree: true, status: true },
    });

    if (!listing) {
      return { success: false, error: "Listing not found." };
    }

    await prisma.bookListing.update({
      where: { id: listingId },
      data: {
        status: "AVAILABLE",
        rejectionReason: null,
      },
    });

    // Credit coins if approved for the first time
    try {
      await creditWallet(
        listing.sellerId,
        30,
        listing.isFree ? "BOOK_DONATED" : "BOOK_LISTED",
        `Earned 30 coins for verified study material: ${listing.title}`,
        listing.id
      );
    } catch (walletErr) {
      // Wallet entry might already exist, continue safely
      console.warn("Wallet credit notice:", walletErr);
    }

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return { success: true };
  } catch (error: any) {
    console.error("Error approving book listing:", error);
    return { success: false, error: "Failed to approve listing." };
  }
}

export async function adminRejectBookListing(listingId: string, reason?: string) {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  try {
    await prisma.bookListing.update({
      where: { id: listingId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "Listing does not comply with community guidelines.",
      },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting book listing:", error);
    return { success: false, error: "Failed to reject listing." };
  }
}

export async function adminDeleteBookListing(listingId: string) {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  try {
    await prisma.bookListing.delete({
      where: { id: listingId },
    });

    revalidatePath("/marketplace/books");
    revalidatePath("/community");
    revalidatePath("/af-ass-manage/books");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting book listing:", error);
    return { success: false, error: "Failed to delete listing." };
  }
}

