import AppError from "../appError";

export function handleMulterError(error: any): AppError {
  if (error.code === "LIMIT_FILE_SIZE") {
    return new AppError("File size exceeds 5MB limit", 400);
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError("Too many files uploaded", 400);
  }

  if (error.message === "Invalid file type") {
    return new AppError("Only JPEG, PNG, and WebP images are allowed", 400);
  }

  return new AppError("File upload failed. Please try again.", 500);
}

export function handleCloudinaryError(error: any): AppError {
  // Cloudinary-specific errors
  if (error.http_code === 401) {
    return new AppError("Cloud storage authentication failed", 500);
  }

  if (error.http_code === 420) {
    return new AppError("Rate limit exceeded. Please try again later.", 429);
  }

  if (error.message?.includes("File size too large")) {
    return new AppError("Image file is too large", 400);
  }

  return new AppError("Failed to save image. Please try again.", 500);
}

export function handleSharpError(error: any): AppError {
  // Sharp throws errors with specific messages
  if (
    error.message?.includes("Input buffer contains unsupported image format")
  ) {
    return new AppError(
      "Unsupported image format. Please upload JPEG, PNG, or WebP.",
      400
    );
  }

  if (error.message?.includes("Input file is missing")) {
    return new AppError("No image file provided", 400);
  }

  if (error.message?.includes("Input file contains unsupported image format")) {
    return new AppError("Corrupted or invalid image file", 400);
  }

  if (error.message?.includes("Expected valid JPEG")) {
    return new AppError("Invalid JPEG image", 400);
  }

  // Generic Sharp error
  return new AppError(
    "Failed to process image. Please try a different file.",
    400
  );
}
