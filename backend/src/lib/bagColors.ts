export const bagColorIds = ["tilo", "natural", "blanco", "azul"] as const;

export type BagColorId = (typeof bagColorIds)[number];

export function isBagColor(value: string): value is BagColorId {
  return (bagColorIds as readonly string[]).includes(value);
}
