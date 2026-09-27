export const bagColors = [
  { id: "tilo", label: "Tilo", swatch: "#C8D36A" },
  { id: "natural", label: "Natural", swatch: "#E6D2B0" },
  { id: "blanco", label: "Blanco", swatch: "#F4F1EA" },
  { id: "azul", label: "Azul", swatch: "#3A6EA8" },
] as const;

export type BagColorId = (typeof bagColors)[number]["id"];

export const bagStyles = [
  { id: "tote", label: "Tote", faceClass: "tote-face-classic" },
  { id: "tote-ancha", label: "Tote ancha", faceClass: "tote-face-wide" },
  { id: "shopper", label: "Shopper", faceClass: "tote-face-shopper" },
  { id: "tote-fuelle", label: "Tote con fuelle", faceClass: "tote-face-side" },
  { id: "mochila", label: "Mochila", faceClass: "tote-face-mochila" },
] as const;

export type BagStyleId = (typeof bagStyles)[number]["id"];

const productStyles: Record<string, BagStyleId> = {
  "tote-jardin-secreto": "tote",
  "tote-manana-clara": "tote-ancha",
  "tote-ciudad-color": "shopper",
  "tote-fuelle": "tote-fuelle",
  "mochila-cuerdas": "mochila",
};

export function isBagColor(value: string): value is BagColorId {
  return bagColors.some((color) => color.id === value);
}

export function bagById(id: string) {
  return bagColors.find((color) => color.id === id) ?? bagColors[1];
}

export function styleForProduct(slug: string): BagStyleId {
  return productStyles[slug] ?? "tote";
}

export function bagSrc(style: BagStyleId, color: BagColorId) {
  return `/bags/${style}-${color}.png`;
}
