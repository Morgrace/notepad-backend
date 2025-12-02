import sharp from "sharp";
import AppError from "./appError";

interface ProcessImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

export const processImage = async (
  buffer: Buffer,
  options: ProcessImageOptions
): Promise<Buffer> => {
  const { width = 800, height = 800, quality = 80, format = "webp" } = options;

  const processedImage = await sharp(buffer)
    .rotate()
    .resize(width, height, {
      fit: "inside", // maintains aspect ration
      withoutEnlargement: true, // don't upscale small images
    })
    .toFormat(format, { quality })
    .toBuffer();

  return processedImage;
};
