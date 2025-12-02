// import { UploadApiResponse } from "cloudinary";
// import cloudinary from "./cloudinaryConfig";

// interface UploadOptions {
//   folder: string;
//   public_id: string;
//   overwrite?: boolean;
//   invalidate?: boolean;
//   resource_type?: "image" | "video" | "raw" | "auto";
//   timeout?: number;
// }

// export const uploadBufferToCloudinary = (
//   buffer: Buffer,
//   options: UploadOptions
// ): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         ...options,
//         timeout: options.timeout || 60000, // Default 60s timeout
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else if (result) {
//           resolve(result);
//         } else {
//           reject(new Error("Upload failed: No result returned"));
//         }
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };
import { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinaryConfig";

interface UploadOptions {
  folder: string;
  public_id: string;
  overwrite?: boolean;
  invalidate?: boolean;
  resource_type?: "image" | "video" | "raw" | "auto";
  timeout?: number;
}

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  options: UploadOptions
): Promise<UploadApiResponse> => {
  // ✅ Use Cloudinary's native upload (returns a proper Promise)
  const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;

  return await cloudinary.uploader.upload(base64Image, {
    folder: options.folder,
    public_id: options.public_id,
    overwrite: options.overwrite ?? true,
    invalidate: options.invalidate ?? true,
    resource_type: options.resource_type ?? "image",
    timeout: options.timeout ?? 60000,
  });
};
