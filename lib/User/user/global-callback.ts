"use server";

import { prisma } from "@/lib/prisma";
import { notifyAdminsPush } from "@/lib/pushNotifications";
import { getSession } from "@/lib/auth/getSession";
import { validateIndianPhoneNumber } from "@/lib/phone-validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function requestGlobalCallback(formData: FormData) {
    try {
        // 1. Enforce Authentication
        const session = await getSession();
        if (!session?.user) {
            return { success: false, error: "Please log in to request a callback." };
        }

        // 2. Honeypot Check (Silently drop bots)
        const honeypot = formData.get("website_hp") as string;
        if (honeypot) {
            return { success: true };
        }

        // 3. Rate Limiting (max 3 per minute per IP)
        const rateLimit = await checkRateLimit("global-callback", 3, 60000);
        if (!rateLimit.success) {
            return { success: false, error: rateLimit.message || "Too many requests. Please try again shortly." };
        }

        const name = (formData.get("name") as string || session.user.name || "").trim();
        const phoneInput = formData.get("phone") as string || (session.user as any).phone || "";
        const sourceUrl = formData.get("sourceUrl") as string || ""; 
        const userMessage = formData.get("message") as string;

        if (!name) {
            return { success: false, error: "Name is required." };
        }

        // 4. Strict Indian Phone Validation
        const phoneResult = validateIndianPhoneNumber(phoneInput);
        if (!phoneResult.isValid) {
            return { success: false, error: phoneResult.error || "Please enter a valid 10-digit mobile number." };
        }
        const phone = phoneResult.cleanedPhone!;

        const messageParts = [];
        if (userMessage?.trim()) messageParts.push(userMessage.trim());
        if (sourceUrl) messageParts.push(`Callback requested from page: ${sourceUrl}`);

        await prisma.lifeCoachRequest.create({
            data: {
                fullName: name,
                phone: phone,
                email: session.user.email || null,
                message: messageParts.join(" | ") || null,
                status: "PENDING"
            }
        });

        const notifText = userMessage?.trim()
            ? `${name} (${phone}) requested a callback: "${userMessage.trim()}"`
            : `${name} (${phone}) requested a general callback.`;

        await prisma.adminNotification.create({
            data: {
                type: "NEW_CALLBACK_REQUEST",
                title: "New Callback Request",
                message: notifText,
                actionUrl: "/af-ass-manage/life-coach"
            }
        });

        notifyAdminsPush({
            title: "📞 New Callback Request!",
            body: notifText,
            data: { screen: '(admin)/life-coach' }
        });

        return { success: true };
    } catch (error) {
        console.error("Global Callback Error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}