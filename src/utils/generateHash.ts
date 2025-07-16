import { randomBytes, createHash } from "crypto";

/**
 * Generates a secure hash for guide publicId
 * Creates a URL-safe, unique identifier that's not easily guessable
 */
export function generateGuideHash(guideId: number, userId: number): string {
  // Create a unique seed using guideId, userId, and random bytes
  const seed = `${guideId}-${userId}-${randomBytes(16).toString("hex")}`;

  // Generate SHA-256 hash
  const hash = createHash("sha256").update(seed).digest("hex");

  // Take first 12 characters for a shorter, URL-friendly ID
  // This gives us 48 bits of entropy (12 hex chars = 48 bits)
  return hash.substring(0, 12);
}

/**
 * Alternative: Generate a more readable hash using base64
 * Creates a shorter, more readable but still secure identifier
 */
export function generateReadableHash(guideId: number, userId: number): string {
  const seed = `${guideId}-${userId}-${randomBytes(8).toString("hex")}`;
  const hash = createHash("sha256").update(seed).digest("base64url");

  // Take first 8 characters for a shorter ID
  return hash.substring(0, 8);
}
