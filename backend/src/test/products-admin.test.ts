import { describe, expect, it, vi } from "vitest";

const { findUnique, create } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    category: { findUnique },
    product: { create },
  },
}));

import { createProduct } from "../services/productService.js";

describe("creación de productos", () => {
  it("crea un producto admin con slug generado", async () => {
    findUnique.mockResolvedValue({
      id: "c1",
      name: "Totebags",
      slug: "totebags",
      description: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    create.mockResolvedValue({
      id: "p1",
      name: "Tote demo",
      slug: "tote-demo",
      description: "Demo",
      price: 1500,
      stock: 3,
      isActive: true,
      isFeatured: false,
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
    });

    const product = await createProduct({
      name: "Tote demo",
      description: "Demo",
      price: 1500,
      stock: 3,
      categoryId: "c1",
    });

    expect(product.slug).toBe("tote-demo");
    expect(product.price).toBe(1500);
  });
});
