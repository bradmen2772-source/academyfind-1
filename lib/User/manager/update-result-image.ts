"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🛠️ HELPER: File Buffer to Cloudinary Uploader
async function uploadImageToCloudinary(file: File, folderName: string, idPrefix: string) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Cloudinary SDK requires a Data URI for buffers
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: `academyfind/${folderName}`,
        public_id: `${idPrefix}-${Date.now()}`, // Unique ID
        overwrite: true,
        format: "webp", // Optimization
    });

    return uploadResult.secure_url;
}

export async function addResultImage(instituteId: string, formData: FormData) {
    try {
        const imageFile = formData.get("imageFile") as File;
        if (!imageFile || imageFile.size === 0) return { success: false, error: "No image found." };

        // Server side par Cloudinary upload
        const secureUrl = await uploadImageToCloudinary(imageFile, "results", `inst-${instituteId}-res`);

        await prisma.institute.update({
            where: { id: instituteId },
            data: { gallery: { push: secureUrl } }
        });

        revalidatePath(`/manager/${instituteId}/profile`,'layout');
        return { success: true, message: "Result image uploaded!" };
    } catch (error) {
        return { success: false, error: "Failed to upload image." };
    }
}

export async function removeResultImage(instituteId: string, imageUrlToRemove: string) {
    try {
        const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
        if (!institute) return { success: false, error: "Not found." };

        const updatedImages = institute.gallery.filter(url => url !== imageUrlToRemove);

        await prisma.institute.update({
            where: { id: instituteId },
            data: { gallery: updatedImages }
        });

        revalidatePath(`/manager/${instituteId}/profile`,'layout');
        return { success: true, message: "Result image removed." };
    } catch (error) {
        return { success: false, error: "Failed to remove image." };
    }
}