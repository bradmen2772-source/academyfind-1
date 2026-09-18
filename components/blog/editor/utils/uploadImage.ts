"use server"; // FIX 4: Explicitly force execution strictly on the secure Node runtime container environment

import { v2 as cloudinary } from "cloudinary";

export type UploadImageResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

// FIX 3: Replaced the client-exposed NEXT_PUBLIC flag with secure server-only config bindings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(
  file: File, 
  folderName: string, 
  idPrefix: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: `academyfind/${folderName}`,
    public_id: `${idPrefix}-${Date.now()}`,
    overwrite: true,
    format: "webp", // Automatically optimizes storage sizes using modern formatting conversions
  });

  return uploadResult.secure_url;
}

export async function uploadImage(
  file: File,
): Promise<UploadImageResponse> {
  try {
    if (!file || file.size === 0) {
      return {
        success: false,
        error: "No file provided or the file is completely empty.",
      };
    }

    // FIX 2: Removed browser-native FormData loops and non-existent 'response' object fetches entirely
    const secureUrl = await uploadImageToCloudinary(
      file, 
      "blogs", 
      `blog-${Date.now()}`
    );

    return {
      success: true,
      url: secureUrl,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong while uploading.",
    };
  }
}
