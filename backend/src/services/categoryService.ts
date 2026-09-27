import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { slugify } from "../lib/slug.js";
import { serializeCategory } from "./serializers.js";

export async function listPublicCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return categories.map(serializeCategory);
}

export async function listAdminCategories() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return categories.map(serializeCategory);
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}) {
  const category = await prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug ?? slugify(input.name),
      description: input.description,
      isActive: input.isActive ?? true,
    },
  });
  return serializeCategory(category);
}

export async function updateCategory(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
  }>,
) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Categoría no encontrada");
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...input,
      slug: input.slug ?? (input.name ? slugify(input.name) : undefined),
    },
  });
  return serializeCategory(category);
}
