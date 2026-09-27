import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "../config/env.js";
import {
  drawingKeyFromPublicId,
  drawingPublicIdFromKey,
  drawingsFolder,
  isOwnedProductImage,
  productMediaFolder,
  unsyncedResources,
} from "../lib/cloudinaryFolder.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { serializeImage } from "./serializers.js";

type UploadFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

export function isCloudinaryConfigured() {
  return Boolean(
    env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
  );
}

export function getCloudinaryStatus() {
  return {
    configured: isCloudinaryConfigured(),
    folder: env.cloudinaryFolder || "aris-bags",
  };
}

function configure() {
  if (!isCloudinaryConfigured()) {
    throw new AppError(
      503,
      "CLOUDINARY_NOT_CONFIGURED",
      "Cloudinary todavía no está configurado",
    );
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

export function optimizedUrl(publicId: string, width: number) {
  if (!isCloudinaryConfigured()) return null;
  configure();
  return cloudinary.url(publicId, {
    width,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });
}

async function getProductOrThrow(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
  }
  return product;
}

function uploadBuffer(file: UploadFile, folder: string) {
  configure();
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("No se pudo subir la imagen"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(file.buffer);
  });
}

export async function addProductImage(
  productId: string,
  input: {
    url: string;
    publicId?: string;
    alt: string;
    sortOrder?: number;
    width?: number;
    height?: number;
  },
) {
  const product = await getProductOrThrow(productId);

  return prisma.productImage.create({
    data: {
      productId,
      url: input.url,
      publicId: input.publicId,
      alt: input.alt,
      sortOrder: input.sortOrder ?? product.images.length,
      width: input.width,
      height: input.height,
    },
  });
}

export async function uploadProductImages(productId: string, files: UploadFile[]) {
  if (files.length === 0) {
    throw new AppError(400, "VALIDATION_ERROR", "Elegí al menos una imagen");
  }

  const product = await getProductOrThrow(productId);
  const folder = productMediaFolder(env.cloudinaryFolder, product.slug);
  const created = [];

  for (const [index, file] of files.entries()) {
    const uploaded = await uploadBuffer(file, folder);
    const image = await prisma.productImage.create({
      data: {
        productId,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        alt: `${product.name} ${product.images.length + index + 1}`,
        sortOrder: product.images.length + index,
        width: uploaded.width,
        height: uploaded.height,
      },
    });
    created.push(serializeImage(image));
  }

  return {
    folder,
    uploaded: created.length,
    images: created,
  };
}

export async function importProductImagesFromCloudinary(productId: string) {
  const product = await getProductOrThrow(productId);
  configure();
  const folder = productMediaFolder(env.cloudinaryFolder, product.slug);
  const listed = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: 50,
    resource_type: "image",
  });

  const incoming = unsyncedResources(
    listed.resources as Array<{
      public_id: string;
      secure_url: string;
      width?: number;
      height?: number;
    }>,
    product.images
      .map((image) => image.publicId)
      .filter((value): value is string => Boolean(value)),
  );

  const created = [];
  for (const [index, resource] of incoming.entries()) {
    const image = await prisma.productImage.create({
      data: {
        productId,
        url: resource.secure_url,
        publicId: resource.public_id,
        alt: `${product.name} ${product.images.length + index + 1}`,
        sortOrder: product.images.length + index,
        width: resource.width,
        height: resource.height,
      },
    });
    created.push(serializeImage(image));
  }

  return {
    folder,
    imported: created.length,
    skipped: listed.resources.length - incoming.length,
    images: created,
  };
}

type DrawingRecord = {
  key: string;
  publicId: string;
  url: string;
  width?: number;
  height?: number;
};

type DrawingsPayload = {
  folder: string;
  count: number;
  images: DrawingRecord[];
};

let drawingsCache: { at: number; data: DrawingsPayload } | null = null;
const drawingsCacheMs = 5 * 60 * 1000;

function toDrawing(resource: {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}): DrawingRecord {
  return {
    key: drawingKeyFromPublicId(resource.public_id),
    publicId: resource.public_id,
    url: resource.secure_url,
    width: resource.width,
    height: resource.height,
  };
}

export async function listDrawings() {
  if (drawingsCache && Date.now() - drawingsCache.at < drawingsCacheMs) {
    return drawingsCache.data;
  }

  configure();
  const folder = drawingsFolder(env.cloudinaryFolder);
  const listed = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: 500,
    resource_type: "image",
  });

  const data = {
    folder,
    count: listed.resources.length,
    images: listed.resources.map((resource: {
      public_id: string;
      secure_url: string;
      width?: number;
      height?: number;
    }) => toDrawing(resource)),
  };
  drawingsCache = { at: Date.now(), data };
  return data;
}

export async function resolveDrawing(keyOrPublicId: string) {
  configure();
  const publicId = drawingPublicIdFromKey(env.cloudinaryFolder, keyOrPublicId);
  const folder = drawingsFolder(env.cloudinaryFolder);
  if (!publicId.startsWith(`${folder}/`)) {
    throw new AppError(400, "INVALID_DRAWING", "Ese dibujo no forma parte de la biblioteca");
  }

  try {
    const resource = await cloudinary.api.resource(publicId);
    return toDrawing(resource);
  } catch {
    throw new AppError(404, "DRAWING_NOT_FOUND", "Dibujo no encontrado");
  }
}

export async function getDrawing(key: string) {
  return resolveDrawing(key);
}

export async function attachDrawingToProduct(productId: string, publicId: string) {
  const product = await getProductOrThrow(productId);
  const folder = drawingsFolder(env.cloudinaryFolder);
  if (!publicId.startsWith(`${folder}/`)) {
    throw new AppError(400, "INVALID_DRAWING", "Ese archivo no está en la biblioteca de dibujos");
  }
  if (product.images.some((image) => image.publicId === publicId)) {
    throw new AppError(409, "IMAGE_EXISTS", "Ese dibujo ya está en el producto");
  }

  configure();
  const resource = await cloudinary.api.resource(publicId);
  const image = await prisma.productImage.create({
    data: {
      productId,
      url: resource.secure_url,
      publicId: resource.public_id,
      alt: product.name,
      sortOrder: product.images.length,
      width: resource.width,
      height: resource.height,
    },
  });

  return serializeImage(image);
}

export async function removeProductImage(productId: string, imageId: string) {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });
  if (!image) {
    throw new AppError(404, "IMAGE_NOT_FOUND", "Imagen no encontrada");
  }

  if (
    image.publicId &&
    isCloudinaryConfigured() &&
    isOwnedProductImage(env.cloudinaryFolder, image.publicId)
  ) {
    configure();
    await cloudinary.uploader.destroy(image.publicId);
  }

  await prisma.productImage.delete({ where: { id: image.id } });
  return { id: image.id };
}
