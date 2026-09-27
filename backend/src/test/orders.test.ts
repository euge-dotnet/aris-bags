import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMany, create, transaction, findMany } = vi.hoisted(() => ({
  updateMany: vi.fn(),
  create: vi.fn(),
  transaction: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock("../services/cloudinaryService.js", () => ({
  resolveDrawing: vi.fn(async () => ({
    key: "imagen-1",
    publicId: "aris-bags/drawings/imagen-1",
    url: "https://res.cloudinary.com/demo/image/upload/imagen-1.jpg",
  })),
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    product: { findMany, updateMany },
    $transaction: (fn: (tx: { product: { updateMany: typeof updateMany }; order: { create: typeof create } }) => unknown) =>
      transaction(fn),
  },
}));

import { createOrder } from "../services/orderService.js";

describe("pedidos", () => {
  beforeEach(() => {
    findMany.mockReset();
    updateMany.mockReset();
    create.mockReset();
    transaction.mockReset();
  });

  it("crea el pedido con precio de servidor y descuenta stock", async () => {
    findMany.mockResolvedValue([
      {
        id: "p1",
        name: "Tote demo",
        slug: "tote-demo",
        price: 18500,
        stock: 4,
        isActive: true,
        images: [],
      },
    ]);
    updateMany.mockResolvedValue({ count: 1 });
    create.mockResolvedValue({
      id: "o1",
      customerName: "Ana",
      customerEmail: "ana@example.com",
      customerPhone: "111",
      shippingAddress: "Calle 1, CABA",
      status: "pending",
      subtotal: 18500,
      shippingCost: 0,
      total: 18500,
      deliveryMethod: "pickup",
      paymentMethod: "transfer",
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "oi1",
          productId: "p1",
          productName: "Tote demo",
          quantity: 1,
          unitPrice: 18500,
          subtotal: 18500,
          drawingPublicId: "aris-bags/drawings/imagen-1",
          drawingUrl: "https://res.cloudinary.com/demo/image/upload/imagen-1.jpg",
          bagColor: "natural",
        },
      ],
    });
    transaction.mockImplementation(async (fn) =>
      fn({ product: { updateMany }, order: { create } }),
    );

    const order = await createOrder({
      customerName: "Ana",
      customerEmail: "ana@example.com",
      customerPhone: "111",
      shippingAddress: "Calle 1, CABA",
      deliveryMethod: "pickup",
      paymentMethod: "transfer",
      items: [{ productId: "p1", quantity: 1, drawingPublicId: "aris-bags/drawings/imagen-1", bagColor: "natural" }],
    });

    expect(order.total).toBe(18500);
    expect(order.items[0]?.productName).toBe("Tote demo");
    expect(updateMany).toHaveBeenCalled();
  });
});
