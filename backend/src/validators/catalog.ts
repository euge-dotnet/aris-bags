import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80).optional(),
  description: z.string().max(400).optional(),
  isActive: z.boolean().optional(),
});

export const productInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).optional(),
  description: z.string().min(4).max(4000),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "newest"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
});

export const drawingAttachSchema = z.object({
  publicId: z.string().min(3),
});

export const imageInputSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().optional(),
  alt: z.string().min(2).max(180),
  sortOrder: z.number().int().min(0).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
