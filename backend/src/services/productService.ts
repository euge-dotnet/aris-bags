import type { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { slugify } from "../lib/slug.js";
import { serializeProduct } from "./serializers.js";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

export async function listPublicProducts(query: {
  q?: string;
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  featured?: string;
}) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: { isActive: true },
  };

  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = { isActive: true, slug: query.category };
  }

  if (query.featured === "true") {
    where.isFeatured = true;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    query.sort === "price-asc"
      ? { price: "asc" }
      : query.sort === "price-desc"
        ? { price: "desc" }
        : query.sort === "newest"
          ? { createdAt: "desc" }
          : { isFeatured: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy,
  });

  return products.map(serializeProduct);
}

export async function getPublicProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true, category: { isActive: true } },
    include: productInclude,
  });

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
  }

  return serializeProduct(product);
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
  }
  return serializeProduct(product);
}

export async function listAdminProducts() {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: { updatedAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function createProduct(input: {
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) {
    throw new AppError(400, "CATEGORY_NOT_FOUND", "La categoría no existe");
  }

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug ?? slugify(input.name),
      description: input.description,
      price: input.price,
      stock: input.stock,
      categoryId: input.categoryId,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
    },
    include: productInclude,
  });

  return serializeProduct(product);
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    isActive: boolean;
    isFeatured: boolean;
  }>,
) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...input,
      slug: input.slug ?? (input.name ? slugify(input.name) : undefined),
    },
    include: productInclude,
  });

  return serializeProduct(product);
}

export async function deactivateProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
  }

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
    include: productInclude,
  });

  return serializeProduct(product);
}
