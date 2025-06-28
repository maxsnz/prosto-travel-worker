// downloadAndConvertToBase64.ts;
import fetch from "node-fetch";
import fileTypeFromBuffer from "image-type";
import sharp from "sharp";
import { warn, error, log } from "./logger"; // Import logger functions
import fs from "fs/promises";
import path from "path";
import {
  ensureCacheDir,
  readManifest,
  writeManifest,
  generateCacheFileName,
  validateCachedFile,
} from "./imageCache";
import { IMAGE_MAX_WIDTH } from "./constants";

/**
 * Downloads an image from a URL, converts it to a Base64 string, and returns its dimensions.
 * If the image is WebP, it converts it to PNG before encoding.
 * Uses cache to avoid re-downloading and re-converting images.
 * Resizes images to 100px width.
 * @param imageUrl The URL of the image to download.
 * @returns A Promise that resolves to an object containing the Base64 string, width, and height, or null if an error occurs.
 */
export async function downloadAndConvertToBase64(
  imageUrl: string
): Promise<{ base64: string; width: number; height: number } | null> {
  log(`[Image Process] Starting to process image: ${imageUrl}`);

  try {
    // Ensure cache directory exists
    await ensureCacheDir();

    // Check cache
    const manifest = await readManifest();
    const cachedImage = manifest.images[imageUrl];

    if (cachedImage) {
      log(`[Cache] Found cached image for: ${imageUrl}`);
      const isValid = await validateCachedFile(cachedImage.path);

      if (isValid) {
        log(`[Cache] Using cached image from: ${cachedImage.path}`);
        const buffer = await fs.readFile(cachedImage.path);
        const imageSharp = sharp(buffer);
        const metadata = await imageSharp.metadata();

        if (!metadata.width || !metadata.height) {
          warn(`[Cache] Invalid cached image dimensions for ${imageUrl}`);
          return null;
        }

        const base64 = buffer.toString("base64");
        return {
          base64: `data:${cachedImage.mimeType};base64,${base64}`,
          width: metadata.width,
          height: metadata.height,
        };
      } else {
        log(`[Cache] Cached image invalid, will re-download: ${imageUrl}`);
      }
    }

    // Download and process image
    log(`[Image Download] Attempting to download image from: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      warn(
        `[Image Download] Failed to download image from ${imageUrl}: ${response.statusText} (Status: ${response.status})`
      );
      return null;
    }
    log(`[Image Download] Successfully downloaded image from: ${imageUrl}`);

    const arrayBuffer = await response.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer);

    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType) {
      warn(
        `[Image Convert] Could not determine file type for image from ${imageUrl}. Skipping.`
      );
      return null;
    }
    log(`[Image Convert] Detected file type: ${fileType.mime}`);

    let mimeType = fileType.mime;
    let imageMetadata;

    // Use sharp to get metadata and potentially convert
    try {
      log(`[Image Process] Processing image with sharp: ${imageUrl}`);
      const imageSharp = sharp(buffer);
      imageMetadata = await imageSharp.metadata();

      if (!imageMetadata.width || !imageMetadata.height) {
        warn(
          `[Image Process] Could not get dimensions for image from ${imageUrl}`
        );
        return null;
      }

      // Resize image to IMAGE_MAX_WIDTH (100px)
      log(
        `[Image Resize] Resizing image from ${imageMetadata.width}px to ${IMAGE_MAX_WIDTH}px width`
      );
      buffer = await imageSharp
        .resize({
          width: IMAGE_MAX_WIDTH,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Get new metadata after resize
      imageMetadata = await sharp(buffer).metadata();

      if (mimeType === "image/webp") {
        log(`[Image Convert] Converting WebP image from ${imageUrl} to PNG.`);
        buffer = await imageSharp.png().toBuffer();
        mimeType = "image/png";
      }
    } catch (sharpError) {
      error(
        `[Image Process] Error processing image with sharp ${imageUrl}:`,
        sharpError
      );
      return null;
    }

    if (!imageMetadata || !imageMetadata.width || !imageMetadata.height) {
      warn(
        `[Image Process] Could not get dimensions for image from ${imageUrl}. Metadata: ${JSON.stringify(
          imageMetadata
        )}`
      );
      return null;
    }

    // Save to cache
    const cacheFileName = generateCacheFileName(imageUrl, mimeType);
    const cacheFilePath = path.join(process.cwd(), "cache", cacheFileName);

    await fs.writeFile(cacheFilePath, buffer);

    // Update manifest
    manifest.images[imageUrl] = {
      path: cacheFilePath,
      mimeType,
      createdAt: Date.now(),
      size: buffer.length,
    };
    await writeManifest(manifest);

    const base64 = buffer.toString("base64");
    return {
      base64: `data:${mimeType};base64,${base64}`,
      width: imageMetadata.width,
      height: imageMetadata.height,
    };
  } catch (err) {
    error(`[Image Process] Error processing image ${imageUrl}:`, err);
    return null;
  }
}
