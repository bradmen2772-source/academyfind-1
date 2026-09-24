"use server";

import { adminApproveBookListing, adminRejectBookListing, adminDeleteBookListing } from "@/lib/community/books";
import { revalidatePath } from "next/cache";

export async function approveBookAction(id: string) {
  try {
    const res = await adminApproveBookListing(id);
    revalidatePath("/af-ass-manage/books");
    revalidatePath("/marketplace/books");
    return res;
  } catch (error: any) {
    console.error("Error approving book:", error);
    return { success: false, error: "Failed to approve listing" };
  }
}

export async function rejectBookAction(id: string, reason?: string) {
  try {
    const res = await adminRejectBookListing(id, reason);
    revalidatePath("/af-ass-manage/books");
    revalidatePath("/marketplace/books");
    return res;
  } catch (error: any) {
    console.error("Error rejecting book:", error);
    return { success: false, error: "Failed to reject listing" };
  }
}

export async function deleteBookAction(id: string) {
  try {
    const res = await adminDeleteBookListing(id);
    revalidatePath("/af-ass-manage/books");
    revalidatePath("/marketplace/books");
    return res;
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete listing" };
  }
}
