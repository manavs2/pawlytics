export type SizeCategory = "small" | "medium" | "large" | "giant";

export interface BreedInfo {
  size: SizeCategory;
  traits: string[];
}

export const BREED_DATA: Record<string, BreedInfo> = {
  "Labrador Retriever": { size: "large", traits: ["floppy_ears"] },
  "French Bulldog": { size: "small", traits: ["brachycephalic"] },
  "Golden Retriever": { size: "large", traits: ["floppy_ears", "long_coat"] },
  "German Shepherd": { size: "large", traits: ["double_coat"] },
  "Poodle (Standard)": { size: "medium", traits: ["long_coat"] },
  "Poodle (Miniature)": { size: "small", traits: ["long_coat"] },
  "Bulldog": { size: "medium", traits: ["brachycephalic"] },
  "Beagle": { size: "medium", traits: ["floppy_ears"] },
  "Rottweiler": { size: "large", traits: [] },
  "German Shorthaired Pointer": { size: "large", traits: ["floppy_ears"] },
  "Dachshund": { size: "small", traits: ["floppy_ears"] },
  "Pembroke Welsh Corgi": { size: "small", traits: [] },
  "Australian Shepherd": { size: "medium", traits: ["double_coat"] },
  "Yorkshire Terrier": { size: "small", traits: ["long_coat"] },
  "Cavalier King Charles Spaniel": { size: "small", traits: ["floppy_ears", "long_coat"] },
  "Doberman Pinscher": { size: "large", traits: [] },
  "Boxer": { size: "large", traits: ["brachycephalic"] },
  "Great Dane": { size: "giant", traits: [] },
  "Miniature Schnauzer": { size: "small", traits: [] },
  "Siberian Husky": { size: "medium", traits: ["double_coat"] },
  "Bernese Mountain Dog": { size: "giant", traits: ["long_coat", "double_coat"] },
  "Shih Tzu": { size: "small", traits: ["long_coat", "brachycephalic"] },
  "Boston Terrier": { size: "small", traits: ["brachycephalic"] },
  "Pomeranian": { size: "small", traits: ["double_coat", "long_coat"] },
  "Havanese": { size: "small", traits: ["long_coat"] },
  "Cocker Spaniel": { size: "medium", traits: ["floppy_ears", "long_coat"] },
  "Border Collie": { size: "medium", traits: ["double_coat"] },
  "Shetland Sheepdog": { size: "small", traits: ["long_coat", "double_coat"] },
  "Basset Hound": { size: "medium", traits: ["floppy_ears"] },
  "Pug": { size: "small", traits: ["brachycephalic"] },
  "Maltese": { size: "small", traits: ["long_coat"] },
  "Chihuahua": { size: "small", traits: [] },
  "Mastiff": { size: "giant", traits: [] },
  "Samoyed": { size: "medium", traits: ["double_coat", "long_coat"] },
  "Alaskan Malamute": { size: "large", traits: ["double_coat"] },
  "Saint Bernard": { size: "giant", traits: ["long_coat"] },
  "Newfoundland": { size: "giant", traits: ["long_coat", "double_coat"] },
  "Bloodhound": { size: "large", traits: ["floppy_ears"] },
  "Irish Setter": { size: "large", traits: ["floppy_ears", "long_coat"] },
  "Weimaraner": { size: "large", traits: [] },
  "Akita": { size: "large", traits: ["double_coat"] },
  "Vizsla": { size: "medium", traits: [] },
  "Whippet": { size: "medium", traits: [] },
  "Greyhound": { size: "large", traits: [] },
  "Jack Russell Terrier": { size: "small", traits: [] },
  "Mixed Breed": { size: "medium", traits: [] },
  "Other": { size: "medium", traits: [] },
};

export const BREED_NAMES = Object.keys(BREED_DATA).sort();

export function getBreedInfo(breed: string): BreedInfo {
  return BREED_DATA[breed] || { size: "medium", traits: [] };
}
