import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(import.meta.dirname, "..", "public", "breeds");
mkdirSync(OUT_DIR, { recursive: true });

// Each breed gets a unique color palette + face config derived from its traits
const BREED_DATA = {
  "Labrador Retriever":    { size: "large",  traits: ["floppy_ears"], fur: "#D4A853", nose: "#3B2314", bg: "#FDF3E0" },
  "French Bulldog":        { size: "small",  traits: ["brachycephalic"], fur: "#C4A67D", nose: "#3B2314", bg: "#F8EDE0" },
  "Golden Retriever":      { size: "large",  traits: ["floppy_ears", "long_coat"], fur: "#D4993B", nose: "#3B2314", bg: "#FDF0D8" },
  "German Shepherd":       { size: "large",  traits: ["double_coat"], fur: "#8B6F47", nose: "#2B1810", bg: "#F0E6D6" },
  "Poodle (Standard)":     { size: "medium", traits: ["long_coat"], fur: "#E8DDD0", nose: "#3B2314", bg: "#FAF5EF" },
  "Poodle (Miniature)":    { size: "small",  traits: ["long_coat"], fur: "#D4B896", nose: "#3B2314", bg: "#FAF0E6" },
  "Bulldog":               { size: "medium", traits: ["brachycephalic"], fur: "#D9C4A8", nose: "#3B2314", bg: "#F5EDE0" },
  "Beagle":                { size: "medium", traits: ["floppy_ears"], fur: "#C8A06A", nose: "#2B1810", bg: "#F8ECD8" },
  "Rottweiler":            { size: "large",  traits: [], fur: "#2B2220", nose: "#1A0F0A", bg: "#E8DFDA" },
  "German Shorthaired Pointer": { size: "large", traits: ["floppy_ears"], fur: "#7B5B3A", nose: "#3B2314", bg: "#EDE3D6" },
  "Dachshund":             { size: "small",  traits: ["floppy_ears"], fur: "#8B5E3C", nose: "#3B2314", bg: "#F0E0D0" },
  "Pembroke Welsh Corgi":  { size: "small",  traits: [], fur: "#D4903B", nose: "#2B1810", bg: "#FDE8D0" },
  "Australian Shepherd":   { size: "medium", traits: ["double_coat"], fur: "#6B7B8B", nose: "#2B2B2B", bg: "#E8ECF0" },
  "Yorkshire Terrier":     { size: "small",  traits: ["long_coat"], fur: "#9B8A6B", nose: "#3B2B1B", bg: "#F0EAE0" },
  "Cavalier King Charles Spaniel": { size: "small", traits: ["floppy_ears", "long_coat"], fur: "#B87333", nose: "#3B2314", bg: "#F5E6D6" },
  "Doberman Pinscher":     { size: "large",  traits: [], fur: "#2B2220", nose: "#1A0F0A", bg: "#E0D8D4" },
  "Boxer":                 { size: "large",  traits: ["brachycephalic"], fur: "#C8943B", nose: "#3B2314", bg: "#F5E8D0" },
  "Great Dane":            { size: "giant",  traits: [], fur: "#8B8B7B", nose: "#3B3B2B", bg: "#ECECE6" },
  "Miniature Schnauzer":   { size: "small",  traits: [], fur: "#7B7B7B", nose: "#2B2B2B", bg: "#E8E8E8" },
  "Siberian Husky":        { size: "medium", traits: ["double_coat"], fur: "#9BABB8", nose: "#2B2B2B", bg: "#E8EEF2" },
  "Bernese Mountain Dog":  { size: "giant",  traits: ["long_coat", "double_coat"], fur: "#1E1E1E", nose: "#1A0F0A", bg: "#E0DDD8" },
  "Shih Tzu":              { size: "small",  traits: ["long_coat", "brachycephalic"], fur: "#D4C4A8", nose: "#3B2B1B", bg: "#F8F0E6" },
  "Boston Terrier":        { size: "small",  traits: ["brachycephalic"], fur: "#1E2B1E", nose: "#1A0F0A", bg: "#DEE4DE" },
  "Pomeranian":            { size: "small",  traits: ["double_coat", "long_coat"], fur: "#D4783B", nose: "#3B2314", bg: "#FDE4D0" },
  "Havanese":              { size: "small",  traits: ["long_coat"], fur: "#E0D0C0", nose: "#3B2B1B", bg: "#FAF4EE" },
  "Cocker Spaniel":        { size: "medium", traits: ["floppy_ears", "long_coat"], fur: "#C48B3B", nose: "#3B2314", bg: "#F5E6D0" },
  "Border Collie":         { size: "medium", traits: ["double_coat"], fur: "#1E1E1E", nose: "#1A0F0A", bg: "#DDDDD8" },
  "Shetland Sheepdog":     { size: "small",  traits: ["long_coat", "double_coat"], fur: "#B48B5B", nose: "#3B2314", bg: "#F0E6DA" },
  "Basset Hound":          { size: "medium", traits: ["floppy_ears"], fur: "#C4A878", nose: "#3B2314", bg: "#F5ECD8" },
  "Pug":                   { size: "small",  traits: ["brachycephalic"], fur: "#D4C090", nose: "#1A0F0A", bg: "#F8F0E0" },
  "Maltese":               { size: "small",  traits: ["long_coat"], fur: "#F0EAE4", nose: "#2B1B1B", bg: "#FAFAF8" },
  "Chihuahua":             { size: "small",  traits: [], fur: "#D4A870", nose: "#3B2314", bg: "#F8ECD8" },
  "Mastiff":               { size: "giant",  traits: [], fur: "#C4A070", nose: "#3B2314", bg: "#F0E4D4" },
  "Samoyed":               { size: "medium", traits: ["double_coat", "long_coat"], fur: "#F5F0EA", nose: "#1A1A1A", bg: "#FAFAF8" },
  "Alaskan Malamute":      { size: "large",  traits: ["double_coat"], fur: "#8B9BA8", nose: "#2B2B2B", bg: "#E6ECF0" },
  "Saint Bernard":         { size: "giant",  traits: ["long_coat"], fur: "#B87B4B", nose: "#3B2314", bg: "#F0E2D2" },
  "Newfoundland":          { size: "giant",  traits: ["long_coat", "double_coat"], fur: "#1E1E1E", nose: "#0F0F0F", bg: "#D8D4D0" },
  "Bloodhound":            { size: "large",  traits: ["floppy_ears"], fur: "#A07040", nose: "#3B2314", bg: "#EEE0D0" },
  "Irish Setter":          { size: "large",  traits: ["floppy_ears", "long_coat"], fur: "#A04020", nose: "#3B1510", bg: "#F0DCD0" },
  "Weimaraner":            { size: "large",  traits: [], fur: "#9B9B8B", nose: "#4B4B3B", bg: "#ECECEA" },
  "Akita":                 { size: "large",  traits: ["double_coat"], fur: "#C89060", nose: "#3B2314", bg: "#F2E6D8" },
  "Vizsla":                { size: "medium", traits: [], fur: "#C47830", nose: "#5B3020", bg: "#F5E2CC" },
  "Whippet":               { size: "medium", traits: [], fur: "#C4B8A4", nose: "#4B3B2B", bg: "#F2EDE6" },
  "Greyhound":             { size: "large",  traits: [], fur: "#8B8B80", nose: "#3B3B30", bg: "#E8E8E4" },
  "Jack Russell Terrier":  { size: "small",  traits: [], fur: "#F0E4D4", nose: "#3B2B1B", bg: "#FAF6F0" },
  "Mixed Breed":           { size: "medium", traits: [], fur: "#C0A880", nose: "#3B2B1B", bg: "#F2EAE0" },
  "Other":                 { size: "medium", traits: [], fur: "#B8A890", nose: "#3B2B1B", bg: "#F0EAE2" },
};

function buildDogFaceSVG(breed, info) {
  const { traits, fur, nose, bg } = info;
  const isBrachy = traits.includes("brachycephalic");
  const isFloppy = traits.includes("floppy_ears");
  const isLongCoat = traits.includes("long_coat");

  // Face shape
  const faceRx = isBrachy ? 90 : 75;
  const faceRy = isBrachy ? 80 : 90;
  const faceY = isBrachy ? 270 : 260;

  // Muzzle
  const muzzleW = isBrachy ? 50 : 38;
  const muzzleH = isBrachy ? 28 : 40;
  const muzzleY = isBrachy ? 290 : 285;
  const muzzleR = isBrachy ? 25 : 20;

  // Nose
  const noseY = isBrachy ? 282 : 278;
  const noseW = isBrachy ? 18 : 14;

  // Eyes
  const eyeY = isBrachy ? 248 : 240;
  const eyeSpread = isBrachy ? 32 : 28;
  const eyeR = isBrachy ? 9 : 7;

  // Ears
  let earsMarkup = "";
  if (isFloppy) {
    // Floppy hanging ears
    earsMarkup = `
      <ellipse cx="180" cy="225" rx="32" ry="60" fill="${fur}" transform="rotate(-12 180 225)" opacity="0.9"/>
      <ellipse cx="180" cy="225" rx="22" ry="50" fill="${fur}" transform="rotate(-12 180 225)" opacity="0.4"/>
      <ellipse cx="332" cy="225" rx="32" ry="60" fill="${fur}" transform="rotate(12 332 225)" opacity="0.9"/>
      <ellipse cx="332" cy="225" rx="22" ry="50" fill="${fur}" transform="rotate(12 332 225)" opacity="0.4"/>
    `;
  } else if (isBrachy) {
    // Small rounded ears (bat-like for frenchies, pugs)
    earsMarkup = `
      <ellipse cx="198" cy="195" rx="24" ry="32" fill="${fur}" transform="rotate(-15 198 195)" />
      <ellipse cx="198" cy="195" rx="16" ry="22" fill="${bg}" transform="rotate(-15 198 195)" opacity="0.4" />
      <ellipse cx="314" cy="195" rx="24" ry="32" fill="${fur}" transform="rotate(15 314 195)" />
      <ellipse cx="314" cy="195" rx="16" ry="22" fill="${bg}" transform="rotate(15 314 195)" opacity="0.4" />
    `;
  } else {
    // Pointed/pricked ears
    earsMarkup = `
      <path d="M200 200 L185 150 L220 195 Z" fill="${fur}" />
      <path d="M205 198 L193 160 L218 196 Z" fill="${bg}" opacity="0.3" />
      <path d="M312 200 L327 150 L292 195 Z" fill="${fur}" />
      <path d="M307 198 L319 160 L294 196 Z" fill="${bg}" opacity="0.3" />
    `;
  }

  // Long coat fur texture around face
  let furMarkup = "";
  if (isLongCoat) {
    furMarkup = `
      <ellipse cx="256" cy="${faceY + 10}" rx="${faceRx + 18}" ry="${faceRy + 15}" fill="${fur}" opacity="0.3" />
      <ellipse cx="256" cy="${faceY + 5}" rx="${faceRx + 10}" ry="${faceRy + 8}" fill="${fur}" opacity="0.15" />
    `;
  }

  // Mouth
  const mouthY = isBrachy ? 304 : 308;

  // Tongue peeking out for certain breeds
  const showTongue = isBrachy || isFloppy;
  const tongueMarkup = showTongue
    ? `<ellipse cx="256" cy="${mouthY + 8}" rx="7" ry="5" fill="#E88B8B" />`
    : "";

  // Cheek highlights
  const cheekY = isBrachy ? 270 : 262;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="256" fill="${bg}"/>
  ${furMarkup}
  ${earsMarkup}
  <ellipse cx="256" cy="${faceY}" rx="${faceRx}" ry="${faceRy}" fill="${fur}"/>
  <ellipse cx="230" cy="${cheekY}" rx="18" ry="14" fill="white" opacity="0.15"/>
  <ellipse cx="282" cy="${cheekY}" rx="18" ry="14" fill="white" opacity="0.15"/>
  <ellipse cx="256" cy="${muzzleY}" rx="${muzzleW}" ry="${muzzleH}" fill="white" opacity="0.85"/>
  <ellipse cx="${256 - eyeSpread}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR + 1}" fill="${nose}"/>
  <circle cx="${256 - eyeSpread + 2}" cy="${eyeY - 1}" r="2.5" fill="white" opacity="0.7"/>
  <ellipse cx="${256 + eyeSpread}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR + 1}" fill="${nose}"/>
  <circle cx="${256 + eyeSpread + 2}" cy="${eyeY - 1}" r="2.5" fill="white" opacity="0.7"/>
  <ellipse cx="256" cy="${noseY}" rx="${noseW}" ry="10" fill="${nose}" />
  <ellipse cx="256" cy="${noseY - 1}" rx="${noseW - 3}" ry="4" fill="white" opacity="0.15" />
  <path d="M248 ${mouthY} Q256 ${mouthY + 7} 264 ${mouthY}" stroke="${nose}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${tongueMarkup}
</svg>`;
}

let count = 0;
for (const [breed, info] of Object.entries(BREED_DATA)) {
  const slug = breed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  const svg = buildDogFaceSVG(breed, info);
  writeFileSync(join(OUT_DIR, `${slug}.svg`), svg);
  count++;
}

console.log(`Generated ${count} breed avatars in public/breeds/`);
