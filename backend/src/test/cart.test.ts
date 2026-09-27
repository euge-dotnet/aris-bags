import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    product: { findMany },
  },
}));

vi.mock("../services/cloudinaryService.js", () => ({
  resolveDrawing: vi.fn(async (id: string) => ({
    key: "imagen-1",
    publicId: id,
    url: "https://res.cloudinary.com/demo/image/upload/imagen-1.jpg",
  })),
}));

import { quoteCart } from "../services/cartService.js";

describe("carrito", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("usa el precio del servidor y calcula el subtotal", async () => {
    findMany.mockResolvedValue([
      {
        id: "p1",
        name: "Tote demo",
        slug: "tote-demo",
        price: 1000,
        stock: 5,
        isActive: true,
        images: [],
      },
    ]);

    const quote = await quoteCart([
      { productId: "p1", quantity: 2, drawingPublicId: "aris-bags/drawings/imagen-1", bagColor: "natural" },
    ]);
    expect(quote.subtotal).toBe(2000);
    expect(quote.items[0]?.unitPrice).toBe(1000);
    expect(quote.items[0]?.drawing.publicId).toBe("aris-bags/drawings/imagen-1");
  });

  it("rechaza stock insuficiente", async () => {
    findMany.mockResolvedValue([
      {
        id: "p1",
        name: "Tote demo",
        slug: "tote-demo",
        price: 1000,
        stock: 1,
        isActive: true,
        images: [],
      },
    ]);

    await expect(
      quoteCart([{ productId: "p1", quantity: 3, drawingPublicId: "aris-bags/drawings/imagen-1", bagColor: "natural" }]),
    ).rejects.toMatchObject({
      code: "INSUFFICIENT_STOCK",
    });
  });

  it("rechaza productos inexistentes", async () => {
    findMany.mockResolvedValue([]);
    await expect(
      quoteCart([{ productId: "missing", quantity: 1, drawingPublicId: "aris-bags/drawings/imagen-1", bagColor: "natural" }]),
    ).rejects.toMatchObject({
      code: "PRODUCT_NOT_FOUND",
    });
  });
});
