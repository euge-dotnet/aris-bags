import type { BagColorId } from "../lib/bagColors.js";
import { AppError } from "../lib/errors.js";
import { money, multiply } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";
import { resolveDrawing } from "./cloudinaryService.js";

export type CartItemInput = {
  productId: string;
  quantity: number;
  drawingPublicId: string;
  bagColor: BagColorId;
};

export async function quoteCart(items: CartItemInput[]) {
  const ids = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const quoted = [];
  for (const item of items) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product || !product.isActive) {
      throw new AppError(400, "PRODUCT_NOT_FOUND", "Hay un producto que ya no está disponible");
    }
    if (item.quantity < 1) {
      throw new AppError(400, "INVALID_QUANTITY", "La cantidad no es válida");
    }
    if (product.stock < item.quantity) {
      throw new AppError(
        409,
        "INSUFFICIENT_STOCK",
        `Stock insuficiente para ${product.name}`,
      );
    }

    const drawing = await resolveDrawing(item.drawingPublicId);

    quoted.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      quantity: item.quantity,
      unitPrice: money(product.price),
      subtotal: multiply(product.price, item.quantity),
      stock: product.stock,
      image: product.images[0]
        ? { url: product.images[0].url, alt: product.images[0].alt }
        : null,
      drawing,
      bagColor: item.bagColor,
    });
  }

  const subtotal = money(quoted.reduce((sum, item) => sum + item.subtotal, 0));
  return { items: quoted, subtotal, total: subtotal };
}
