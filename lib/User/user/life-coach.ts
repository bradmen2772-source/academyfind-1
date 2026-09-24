"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { sendLifeCoachSubmissionNotifications } from "@/lib/notifications/lifeCoachNotifications";
import { validateIndianPhoneNumber } from "@/lib/phone-validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function submitLifeCoachRequest(formData: FormData) {
    // 1. Optional Session (supports both logged-in and guest users)
    const session = await getSession();

    // 2. Honeypot check (silently trap bots)
    const honeypot = formData.get("website_hp") as string;
    if (honeypot) {
        return { success: true, message: "Request received!" };
    }

    // 3. Rate limiting per IP (max 3 requests per minute)
    const rateLimit = await checkRateLimit("life-coach-request", 3, 60000);
    if (!rateLimit.success) {
        return { success: false, error: rateLimit.message || "Too many requests. Please try again later." };
    }

    const fullName = (formData.get("fullName") as string || session?.user?.name || "").trim();
    const phoneInput = formData.get("phone") as string || (session?.user as any)?.phone || "";
    const email = (formData.get("email") as string || session?.user?.email || "").trim();
    const message = formData.get("message") as string;

    if (!fullName) {
        return { success: false, error: "Full Name is required." };
    }

    // 4. Strict Indian Phone Validation
    const phoneResult = validateIndianPhoneNumber(phoneInput);
    if (!phoneResult.isValid) {
        return { success: false, error: phoneResult.error || "Please enter a valid 10-digit mobile number." };
    }
    const phone = phoneResult.cleanedPhone!;

    try {
        await prisma.lifeCoachRequest.create({
            data: {
                fullName,
                phone,
                email: email || null,
                message: message?.trim() ? message.trim() : null,
            }
        });

        await prisma.adminNotification.create({
            data: {
                type: "NEW_LIFE_COACH_REQUEST",
                title: "New Life Coach Request",
                message: `${fullName} (${phone}) requested a life coach.`,
                userId: session?.user?.id || null,
            }
        });

        // 🚀 Automatically send personalized WhatsApp and Email confirmation to the applicant
        sendLifeCoachSubmissionNotifications({
            fullName,
            phone,
            email,
            message: message || null,
        }).catch((err) => {
            console.error("Failed to send life coach submission notifications:", err);
        });

        return { success: true, message: "Request logged inside admin queue!" };
    } catch (error) {
        console.error("Life Coach Submit Error:", error);
        return { success: false, error: "Failed to submit request due to pipeline error." };
    }
}