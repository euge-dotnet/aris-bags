import { OrderStatus } from "@prisma/client";
import { money } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";

export async function getDashboard() {
  const [productCount, activeProducts, orderCount, pendingOrders, sales] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.pending } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: OrderStatus.cancelled } },
      }),
    ]);

  return {
    productCount,
    activeProducts,
    orderCount,
    pendingOrders,
    sales: money(sales._sum.total ?? 0),
  };
}
