"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addYouTubeVideo(instituteId: string, videoUrl: string) {
    try {
        if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
            return { success: false, error: "Please enter a valid YouTube URL." };
        }

        await prisma.institute.update({
            where: { id: instituteId },
            data: { youtubeVideos: { push: videoUrl } }
        });

        revalidatePath(`/manager/${instituteId}/profile`,'layout');
        return { success: true, message: "Video added successfully!" };
    } catch (error) {
        return { success: false, error: "Failed to add video." };
    }
}

export async function removeYouTubeVideo(instituteId: string, videoUrlToRemove: string) {
    try {
        const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
        if (!institute) return { success: false, error: "Not found." };

        const updatedVideos = institute.youtubeVideos.filter(url => url !== videoUrlToRemove);

        await prisma.institute.update({
            where: { id: instituteId },
            data: { youtubeVideos: updatedVideos }
        });

        revalidatePath(`/manager/${instituteId}/profile`,'layout');
        return { success: true, message: "Video removed." };
    } catch (error) {
        return { success: false, error: "Failed to remove video." };
    }
}