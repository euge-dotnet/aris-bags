import { describe, expect, it, vi } from "vitest";

const { findMany, findFirst } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    product: { findMany, findFirst },
  },
}));

import { getPublicProduct, listPublicProducts } from "../services/productService.js";

describe("productos", () => {
  it("lista productos activos", async () => {
    findMany.mockResolvedValue([
      {
        id: "p1",
        name: "Tote demo",
        slug: "tote-demo",
        description: "Demo",
        price: 1000,
        stock: 2,
        isActive: true,
        isFeatured: true,
        categoryId: "c1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "c1",
          name: "Totebags",
          slug: "totebags",
          description: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        images: [],
      },
    ]);

    const products = await listPublicProducts({});
    expect(products).toHaveLength(1);
    expect(products[0]?.price).toBe(1000);
  });

  it("falla si el producto no existe", async () => {
    findFirst.mockResolvedValue(null);
    await expect(getPublicProduct("no-existe")).rejects.toMatchObject({
      code: "PRODUCT_NOT_FOUND",
    });
  });
});
