/**
 * Social Media Image Optimization Utility
 *
 * Uses Astro's built-in Sharp optimization to create social media-friendly images
 * specifically optimized for WhatsApp, Facebook, Twitter, and LinkedIn sharing.
 *
 * Key optimizations:
 * - JPEG format (maximum compatibility)
 * - Optimized file size (under 300KB for WhatsApp)
 * - Correct dimensions (1200x630)
 * - Quality optimized for social media
 */

import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

interface SocialImageOptions {
  src: ImageMetadata | string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Optimize an image for social media sharing
 * Returns an optimized JPEG version suitable for Open Graph meta tags
 */
export async function optimizeSocialImage({
  src,
  width = 1200,
  height = 630,
  quality = 85, // Optimized for social media - good quality, reasonable file size
}: SocialImageOptions) {
  try {
    const optimizedImage = await getImage({
      src,
      width,
      height,
      format: "jpeg", // JPEG for maximum social media compatibility
      quality,
    });

    return {
      src: optimizedImage.src,
      width: optimizedImage.attributes.width,
      height: optimizedImage.attributes.height,
    };
  } catch (error) {
    console.error("Failed to optimize social image:", error);
    // Return fallback values
    return {
      src: typeof src === "string" ? src : src.src,
      width,
      height,
    };
  }
}

/**
 * Generate an optimized social image URL for use in meta tags
 * This function handles both imported assets and external URLs
 */
export async function getSocialImageUrl(
  src: ImageMetadata | string,
  siteUrl: string,
): Promise<string> {
  if (typeof src === "string") {
    // If it's already a URL, return as-is
    return src.startsWith("http") ? src : `${siteUrl}${src}`;
  }

  // For imported assets, optimize them
  const optimized = await optimizeSocialImage({ src });
  return `${siteUrl}${optimized.src}`;
}
