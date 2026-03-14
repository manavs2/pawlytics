export const DOG_IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const DOG_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

function breedToSlug(breed: string) {
  return (breed || "mixed-breed")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");
}

/** Returns the path to the static breed avatar SVG in /public/breeds/. */
export function getBreedFallbackImage(breed: string) {
  return `/breeds/${breedToSlug(breed)}.svg`;
}

/**
 * Returns the URL to display for a dog.
 * User-uploaded photo takes priority; otherwise falls back to the breed avatar.
 */
export function getDogDisplayImage(
  imageUrl: string | null | undefined,
  breed: string
) {
  if (imageUrl && !isGeneratedBreedFallback(imageUrl)) return imageUrl;
  return getBreedFallbackImage(breed);
}

/**
 * Detects any previously-stored fallback values so they get replaced
 * by the current breed avatar at display time.
 */
export function isGeneratedBreedFallback(imageUrl: string | null | undefined) {
  return Boolean(
    imageUrl?.includes("pawlytics-breed-fallback") ||
      imageUrl?.startsWith("/api/breed-avatar/") ||
      imageUrl?.startsWith("/breeds/")
  );
}

export async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}
