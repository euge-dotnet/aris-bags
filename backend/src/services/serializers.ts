import type { Category, Product, ProductImage } from "@prisma/client";
import { money } from "../lib/money.js";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export function serializeCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  };
}

export function serializeImage(image: ProductImage) {
  return {
    id: image.id,
    url: image.url,
    publicId: image.publicId,
    alt: image.alt,
    sortOrder: image.sortOrder,
    width: image.width,
    height: image.height,
    isPlaceholder: !image.publicId || image.publicId.startsWith("demo/"),
  };
}

export function serializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: money(product.price),
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    available: product.stock > 0 && product.isActive,
    category: serializeCategory(product.category),
    images: product.images.map(serializeImage),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
