import { isBagColor, type BagColorId } from "./bagColors";

const key = "aris-bags-cart";

export type CartLine = {
  productId: string;
  quantity: number;
  drawingPublicId: string;
  bagColor: BagColorId;
};

export function lineKey(line: Pick<CartLine, "productId" | "drawingPublicId" | "bagColor">) {
  return `${line.productId}::${line.drawingPublicId}::${line.bagColor}`;
}

export function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<CartLine>>;
    return parsed.filter(
      (item): item is CartLine =>
        Boolean(item.productId) &&
        Boolean(item.drawingPublicId) &&
        Boolean(item.bagColor) &&
        isBagColor(String(item.bagColor)) &&
        Number.isInteger(item.quantity) &&
        (item.quantity ?? 0) > 0,
    );
  } catch {
    return [];
  }
}

export function writeCart(items: CartLine[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function cartCount(items: CartLine[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
