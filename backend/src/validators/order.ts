import { z } from "zod";
import { bagColorIds } from "../lib/bagColors.js";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(20),
  drawingPublicId: z.string().min(1),
  bagColor: z.enum(bagColorIds).default("natural"),
});

export const cartQuoteSchema = z.object({
  items: z.array(cartItemSchema).min(1),
});

export const orderInputSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6).max(40),
  shippingAddress: z.string().min(4).max(400),
  deliveryMethod: z.enum(["pickup", "shipping"]),
  paymentMethod: z.enum(["transfer", "cash", "pending_gateway"]),
  notes: z.string().max(500).optional(),
  items: z.array(cartItemSchema).min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "shipped",
    "completed",
    "cancelled",
  ]),
});
