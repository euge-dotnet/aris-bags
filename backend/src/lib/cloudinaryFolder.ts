import { slugify } from "./slug.js";

export function productMediaFolder(rootFolder: string, slug: string) {
  const root = rootFolder.replace(/^\/+|\/+$/g, "") || "aris-bags";
  return `${root}/products/${slug}`;
}

export function unsyncedResources<T extends { public_id: string }>(
  resources: T[],
  existingPublicIds: Iterable<string>,
) {
  const known = new Set(existingPublicIds);
  return resources.filter((resource) => !known.has(resource.public_id));
}

export function drawingsFolder(rootFolder: string) {
  const root = rootFolder.replace(/^\/+|\/+$/g, "") || "aris-bags";
  return `${root}/drawings`;
}

export function drawingPublicId(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "");
  return slugify(base);
}

export function drawingKeyFromPublicId(publicId: string) {
  return publicId.split("/").pop() ?? publicId;
}

export function drawingPublicIdFromKey(rootFolder: string, key: string) {
  if (key.includes("/")) {
    return key;
  }
  return `${drawingsFolder(rootFolder)}/${key}`;
}

export function isOwnedProductImage(rootFolder: string, publicId: string) {
  const root = rootFolder.replace(/^\/+|\/+$/g, "") || "aris-bags";
  return publicId.startsWith(`${root}/products/`);
}
