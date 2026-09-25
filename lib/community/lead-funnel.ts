"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { requireAuth } from "@/lib/auth/requireAuth";
import { validateIndianPhoneNumber } from "@/lib/phone-validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { creditWallet } from "@/lib/wallet/credit";
import { triggerCRMWebhooks } from "@/lib/crm/webhooks";
import { notifyAdminsPush, sendExpoPushNotification } from "@/lib/pushNotifications";
import { sendEmail } from "@/lib/notifications/email";
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
      isActive: true,
      NOT: [
        { name: { contains: "test", mode: "insensitive" } },
        { slug: { contains: "test", mode: "insensitive" } },
        { description: { contains: "test listing", mode: "insensitive" } },
      ],
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

    // Strictly order by: ULTRA (4) -> PREMIUM (3) -> VERIFIED (2) -> BASIC (1)
    const institutes = await prisma.institute.findMany({
      where,
      take: limit,
      orderBy: [
        { planWeight: "desc" },
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
        subscriptionPlan: true,
        planWeight: true,
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
        subscriptionPlan: inst.subscriptionPlan,
        planWeight: inst.planWeight,
        feeRange: inst.feeInfo || (inst.feeMin && inst.feeMax ? `₹${inst.feeMin.toLocaleString('en-IN')} - ₹${inst.feeMax.toLocaleString('en-IN')}` : null),
      })),
    };
  } catch (error) {
    console.error("Error fetching community institutes:", error);
    return { success: false, institutes: [] };
  }
}

// ─── 2. Submit Community Lead / Institute Callback ─────────────────────

export async function submitCommunityLead(formData: FormData) {
  try {
    const session = await getSession();

    // Rate Limiting (max 4 per minute per IP)
    const rateLimit = await checkRateLimit("community-enquiry", 4, 60000);
    if (!rateLimit.success) {
      return { success: false, error: rateLimit.message || "Too many requests. Please wait a moment." };
    }

    const name = ((formData.get("name") as string) || session?.user?.name || "").trim();
    const phoneInput = (formData.get("phone") as string) || (session?.user as any)?.phone || "";
    const email = ((formData.get("email") as string) || session?.user?.email || "").trim() || null;
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
      ? `[Admission Callback - ${examCategory}] ${customMessage}`
      : `Requested direct admission callback for ${examCategory}. Submitted via AcademyFind Community.`;

    // 1. Create official Institute Enquiry (Callback)
    const enquiry = await prisma.instituteEnquiry.create({
      data: {
        name,
        phone,
        email,
        instituteId,
        message: formattedMessage,
        status: "NEW",
        source: "COMMUNITY_ADMISSION_CALLBACK",
        sourceDetails: {
          type: "INSTITUTE_CALLBACK",
          submittedByUserId: session?.user?.id || null,
          source: "COMMUNITY_STUDY_GROUP",
          examCategory,
          studyGroupId,
        },
      },
      include: {
        institute: {
          select: { id: true, name: true, phone: true, email: true, slug: true },
        },
      },
    });

    // 2. Create Admin Notification (Shows up in Institute Callbacks in Admin Dashboard)
    await prisma.adminNotification.create({
      data: {
        type: "NEW_INSTITUTE_ENQUIRY",
        title: "New Institute Callback",
        message: `${name} (${phone}) requested admission callback for institute: ${enquiry.institute.name} via Community (${examCategory})`,
      },
    }).catch(() => null);

    // 3. Notify Admins via Expo Push
    notifyAdminsPush({
      title: "📞 New Institute Callback!",
      body: `${name} (${phone}) requested admission callback for ${enquiry.institute.name}`,
      data: { screen: '(admin)/callbacks', url: `/af-ass-manage/enquiries` },
    }).catch(() => null);

    // 4. Trigger CRM Webhooks
    triggerCRMWebhooks(enquiry.instituteId, "ENQUIRY", {
      enquiryId: enquiry.id,
      instituteId: enquiry.instituteId,
      instituteName: enquiry.institute.name,
      studentName: enquiry.name,
      studentPhone: enquiry.phone,
      studentEmail: enquiry.email,
      message: enquiry.message,
      source: "Community Admission Callback",
      createdAt: enquiry.createdAt,
    }).catch(() => null);

    // 5. Send Async Notifications (Institute email, Student confirmation email, Manager push)
    (async () => {
      try {
        const instituteName = enquiry.institute.name;
        const instituteSlug = enquiry.institute.slug || "";
        const institutePageLink = `https://academyfind.com/institute/${instituteSlug}`;

        // (a) Notify Student Confirmation Email
        if (email) {
          sendEmail(
            email,
            `Your Admission Callback Request for ${instituteName} - AcademyFind`,
            `<p>Hi ${name} 👋</p>
            <p>Thank you for using AcademyFind! 🎓</p>
            <p>Your admission callback request for <strong>${instituteName}</strong> has been sent to their admissions counselor desk. They have been requested to call you back shortly regarding ${examCategory} batches, trial lectures, and fee structures.</p>
            <p><em>Haven’t heard back?</em> Reply to this email and the AcademyFind team will assist you.</p>
            <br/>
            <p>Team AcademyFind<br/>🌐 www.academyfind.com<br/>📞 9045699938</p>`
          ).catch((err) => console.error("Student email callback error:", err));
        }

        // (b) Notify Institute Email
        if (enquiry.institute.email) {
          sendEmail(
            enquiry.institute.email,
            `New Admission Callback Request from ${name} - AcademyFind`,
            `<p>Hello <strong>${instituteName}</strong> 👋</p>
            <p>We received an admission callback request from <strong>${name}</strong> on the AcademyFind Community Hub. 🎓</p>
            <p><strong>Student Name:</strong> ${name}</p>
            <p><strong>Contact Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
            <p><strong>Target Exam / Course:</strong> ${examCategory}</p>
            <p><strong>Message / Requirement:</strong> ${customMessage || "Interested in admission counseling, demo batches, and fee details."}</p>
            <br/>
            <p>Please contact ${name} promptly to assist them with admission guidance.</p>
            <p>🔗 <a href="${institutePageLink}">View Your Profile on AcademyFind</a></p>
            <br/>
            <p>Team AcademyFind<br/>🌐 www.academyfind.com | 📞 9045699938</p>`
          ).catch((err) => console.error("Institute email callback error:", err));
        }

        // (c) Notify Institute Managers (Push Notification)
        const managers = await prisma.instituteManager.findMany({
          where: { instituteId },
          include: { user: { select: { pushToken: true } } },
        });

        managers.forEach((manager) => {
          if (manager.user?.pushToken) {
            sendExpoPushNotification({
              pushToken: manager.user.pushToken,
              title: `📞 New Admission Callback: ${name}`,
              body: `${name} (${phone}) requested callback for ${examCategory} at ${instituteName}.`,
              data: { screen: '(manager)', instituteId },
            }).catch((err) => console.error("Manager push error:", err));
          }
        });
      } catch (asyncErr) {
        console.error("Async callback notification error:", asyncErr);
      }
    })();

    // 6. Reward student with +20 AcademyFind coins for requesting admission callback (if logged in)
    if (session?.user?.id) {
      await creditWallet(
        session.user.id,
        20,
        "COMPLETE_PROFILE",
        `Earned 20 coins for requesting admission callback at ${enquiry.institute.name}`,
        enquiry.id
      ).catch(() => null);
    }

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
