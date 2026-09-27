import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors.js";
import { money } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";
import { quoteCart, type CartItemInput } from "./cartService.js";

const shippingCostByMethod = {
  pickup: 0,
  shipping: 3500,
};

export async function createOrder(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryMethod: "pickup" | "shipping";
  paymentMethod: "transfer" | "cash" | "pending_gateway";
  notes?: string;
  items: CartItemInput[];
}) {
  const quote = await quoteCart(input.items);
  const shippingCost = shippingCostByMethod[input.deliveryMethod];
  const total = money(quote.subtotal + shippingCost);

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count !== 1) {
          throw new AppError(409, "INSUFFICIENT_STOCK", "El stock cambió. Revisá el carrito.");
        }
      }

      return tx.order.create({
        data: {
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          deliveryMethod: input.deliveryMethod,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
          subtotal: quote.subtotal,
          shippingCost,
          total,
          items: {
            create: quote.items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
              drawingPublicId: item.drawing.publicId,
              drawingUrl: item.drawing.url,
              bagColor: item.bagColor,
            })),
          },
        },
        include: { items: true },
      });
    });

    return serializeOrder(order);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(409, "ORDER_CONFLICT", "No se pudo confirmar el pedido");
    }
    throw error;
  }
}

export async function getPublicOrder(id: string, email: string) {
  const order = await prisma.order.findFirst({
    where: { id, customerEmail: email },
    include: { items: true },
  });
  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Pedido no encontrado");
  }
  return serializeOrder(order);
}

export async function listOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(serializeOrder);
}

export async function getAdminOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Pedido no encontrado");
  }
  return serializeOrder(order);
}

export async function updateOrderStatus(
  id: string,
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "completed"
    | "cancelled",
) {
  await getAdminOrder(id);
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });
  return serializeOrder(order);
}

function serializeOrder(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  subtotal: Prisma.Decimal;
  shippingCost: Prisma.Decimal;
  total: Prisma.Decimal;
  deliveryMethod: string;
  paymentMethod: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    drawingPublicId: string | null;
    drawingUrl: string | null;
    bagColor: string | null;
  }>;
}) {
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    status: order.status,
    subtotal: money(order.subtotal),
    shippingCost: money(order.shippingCost),
    total: money(order.total),
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: money(item.unitPrice),
      subtotal: money(item.subtotal),
      drawingPublicId: item.drawingPublicId,
      drawingUrl: item.drawingUrl,
      bagColor: item.bagColor,
    })),
  };
}
