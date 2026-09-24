"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { requireAuth } from "@/lib/auth/requireAuth";
import { validateIndianPhoneNumber } from "@/lib/phone-validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { creditWallet } from "@/lib/wallet/credit";
import { triggerCRMWebhooks } from "@/lib/crm/webhooks";
import { notifyAdminsPush } from "@/lib/pushNotifications";
import { revalidatePath } from "next/cache";

// ─── 1. Get Relevant Institutes For Community Context ──────────────────

export async function getRelevantInstitutesForCommunity(
  examCategory?: string,
  city?: string,
  limit: number = 4
) {
  try {
    const where: any = {
      isPublished: true,
    };

    if (city && city !== "ALL" && city !== "Online / Pan-India") {
      where.city = { name: { contains: city, mode: "insensitive" } };
    }

    if (examCategory && examCategory !== "ALL") {
      where.OR = [
        { categories: { some: { category: { name: { contains: examCategory, mode: "insensitive" } } } } },
        { name: { contains: examCategory, mode: "insensitive" } },
        { description: { contains: examCategory, mode: "insensitive" } },
      ];
    }

    const institutes = await prisma.institute.findMany({
      where,
      take: limit,
      orderBy: [
        { isVerified: "desc" },
        { isFeatured: "desc" },
        { averageRating: "desc" },
        { reviewCount: "desc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        city: { select: { name: true } },
        address: true,
        logo: true,
        imageUrl: true,
        averageRating: true,
        reviewCount: true,
        isVerified: true,
        isFeatured: true,
        feeMin: true,
        feeMax: true,
        feeInfo: true,
      },
    });

    return {
      success: true,
      institutes: institutes.map((inst: (typeof institutes)[number]) => ({
        id: inst.id,
        name: inst.name,
        slug: inst.slug,
        city: inst.city?.name || null,
        area: inst.address || null,
        logoUrl: inst.logo || inst.imageUrl || null,
        rating: inst.averageRating,
        reviewCount: inst.reviewCount,
        isVerified: inst.isVerified,
        isFeatured: inst.isFeatured,
        feeRange: inst.feeInfo || (inst.feeMin && inst.feeMax ? `₹${inst.feeMin.toLocaleString('en-IN')} - ₹${inst.feeMax.toLocaleString('en-IN')}` : null),
      })),
    };
  } catch (error) {
    console.error("Error fetching community institutes:", error);
    return { success: false, institutes: [] };
  }
}

// ─── 2. Submit Community Lead / Institute Enquiry ──────────────────────

export async function submitCommunityLead(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "Please sign in to request institute counseling." };
    }

    // Rate Limiting (max 4 per minute per IP)
    const rateLimit = await checkRateLimit("community-enquiry", 4, 60000);
    if (!rateLimit.success) {
      return { success: false, error: rateLimit.message || "Too many requests. Please wait a moment." };
    }

    const name = ((formData.get("name") as string) || session.user.name || "").trim();
    const phoneInput = (formData.get("phone") as string) || (session.user as any).phone || "";
    const email = ((formData.get("email") as string) || session.user.email || "").trim() || null;
    const instituteId = formData.get("instituteId") as string;
    const examCategory = (formData.get("examCategory") as string) || "General";
    const studyGroupId = (formData.get("studyGroupId") as string) || null;
    const customMessage = (formData.get("message") as string) || "";

    if (!name || !instituteId) {
      return { success: false, error: "Name and target coaching center are required." };
    }

    // Validate phone number
    const phoneResult = validateIndianPhoneNumber(phoneInput);
    if (!phoneResult.isValid) {
      return { success: false, error: phoneResult.error || "Please provide a valid 10-digit mobile number." };
    }
    const phone = phoneResult.cleanedPhone!;

    const formattedMessage = customMessage
      ? `[Community Lead - ${examCategory}] ${customMessage}`
      : `Interested in admission counseling for ${examCategory}. Requested via AcademyFind Community.`;

    const enquiry = await prisma.instituteEnquiry.create({
      data: {
        name,
        phone,
        email,
        instituteId,
        message: formattedMessage,
        status: "NEW",
        sourceDetails: {
          submittedByUserId: session.user.id,
          source: "COMMUNITY_STUDY_GROUP",
          examCategory,
          studyGroupId,
        },
      },
      include: {
        institute: {
          select: { id: true, name: true, phone: true, email: true },
        },
      },
    });

    // Notify institute managers / admins
    notifyAdminsPush({
      title: "🎓 New Community Lead!",
      body: `${name} enquired for ${examCategory} at ${enquiry.institute.name}`,
      data: { url: `/manager/enquiries` },
    }).catch(() => null);

    // Trigger CRM Webhooks
    triggerCRMWebhooks(enquiry.instituteId, "ENQUIRY", {
      enquiryId: enquiry.id,
      instituteId: enquiry.instituteId,
      instituteName: enquiry.institute.name,
      studentName: enquiry.name,
      studentPhone: enquiry.phone,
      studentEmail: enquiry.email,
      message: enquiry.message,
      createdAt: enquiry.createdAt,
    }).catch(() => null);

    // Reward student with +20 AcademyFind coins for booking an admission demo
    await creditWallet(
      session.user.id,
      20,
      "COMPLETE_PROFILE",
      `Earned 20 coins for requesting counseling at ${enquiry.institute.name}`,
      enquiry.id
    ).catch(() => null);

    revalidatePath("/community");
    revalidatePath("/community/groups");

    return {
      success: true,
      instituteName: enquiry.institute.name,
    };
  } catch (error: any) {
    console.error("Error submitting community lead:", error);
    return { success: false, error: "Failed to submit enquiry. Please try again." };
  }
}
