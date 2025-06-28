import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

interface CachedImage {
  path: string;
  mimeType: string;
  createdAt: number;
  size: number;
}

interface CacheManifest {
  images: Record<string, CachedImage>;
}

const CACHE_DIR = path.join(process.cwd(), "cache");
const MANIFEST_PATH = path.join(CACHE_DIR, "manifest.json");

export async function ensureCacheDir(): Promise<void> {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function readManifest(): Promise<CacheManifest> {
  try {
    const manifestContent = await fs.readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(manifestContent);
  } catch {
    return { images: {} };
  }
}

export async function writeManifest(manifest: CacheManifest): Promise<void> {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

export function generateCacheFileName(
  imageUrl: string,
  mimeType: string
): string {
  const timestamp = Date.now();
  const hash = crypto.createHash("md5").update(imageUrl).digest("hex");
  const extension = mimeType.split("/")[1];
  return `${timestamp}-${hash}.${extension}`;
}

export async function validateCachedFile(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    const stats = await fs.stat(filePath);
    return stats.size > 0;
  } catch {
    return false;
  }
}
