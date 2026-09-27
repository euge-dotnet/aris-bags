import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("AdminDemo123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@arisbags.local" },
    update: {},
    create: {
      email: "admin@arisbags.local",
      passwordHash,
      name: "Administración demo",
      role: "ADMIN",
    },
  });

  const tote = await prisma.category.upsert({
    where: { slug: "totebags" },
    update: {},
    create: {
      name: "Totebags",
      slug: "totebags",
      description: "Bolsas de uso diario. Datos de demostración.",
    },
  });

  await prisma.category.upsert({
    where: { slug: "neceseres" },
    update: { isActive: false },
    create: {
      name: "Bandoleras",
      slug: "neceseres",
      description: "Bolsas de un asa, para llevar al hombro.",
      isActive: false,
    },
  });

  await prisma.product.updateMany({
    where: { slug: { in: ["neceser-luna-suave", "hobo-luna-suave"] } },
    data: { isActive: false, isFeatured: false },
  });

  const backpacks = await prisma.category.upsert({
    where: { slug: "mochilas" },
    update: {},
    create: {
      name: "Mochilas",
      slug: "mochilas",
      description: "Mochilas de cuerdas y piezas para la espalda.",
    },
  });

  const illustrated = await prisma.category.upsert({
    where: { slug: "ilustradas" },
    update: {},
    create: {
      name: "Ilustradas",
      slug: "ilustradas",
      description: "Diseños con más presencia del dibujo. Datos de demostración.",
    },
  });

  const products = [
    {
      slug: "tote-jardin-secreto",
      name: "Tote Jardín secreto",
      description: "Tote clásica de lona, con dos asas. Este producto es un dato de demostración.",
      price: 18500,
      stock: 8,
      isFeatured: true,
      categoryId: tote.id,
      image: "/bags/tote-natural.png",
    },
    {
      slug: "tote-ciudad-color",
      name: "Shopper Ciudad color",
      description: "Shopper de lona vista de tres cuartos. Este producto es un dato de demostración.",
      price: 19800,
      stock: 6,
      isFeatured: true,
      categoryId: illustrated.id,
      image: "/bags/shopper-tilo.png",
    },
    {
      slug: "tote-manana-clara",
      name: "Tote ancha Mañana clara",
      description: "Tote más ancha, de frente. Este producto es un dato de demostración.",
      price: 17200,
      stock: 11,
      isFeatured: true,
      categoryId: tote.id,
      image: "/bags/tote-ancha-blanco.png",
    },
    {
      slug: "tote-fuelle",
      name: "Tote con fuelle",
      description: "Tote estructurada con el costado a la vista. Este producto es un dato de demostración.",
      price: 18900,
      stock: 7,
      isFeatured: true,
      categoryId: tote.id,
      image: "/bags/tote-fuelle-natural.png",
    },
    {
      slug: "mochila-cuerdas",
      name: "Mochila de cuerdas",
      description: "Mochila tipo bolsa, con cordón. Este producto es un dato de demostración.",
      price: 14500,
      stock: 9,
      isFeatured: true,
      categoryId: backpacks.id,
      image: "/bags/mochila-blanco.png",
    },
  ];

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        isFeatured: item.isFeatured,
        categoryId: item.categoryId,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        isFeatured: item.isFeatured,
        categoryId: item.categoryId,
      },
    });

    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });

    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.image,
          publicId: `demo/${item.slug}`,
          alt: `Imagen de demostración de ${item.name}`,
          sortOrder: 0,
        },
      });
    } else if (
      existingImage.publicId?.startsWith("demo/") ||
      existingImage.url.startsWith("/placeholders/") ||
      existingImage.url.startsWith("/bags/")
    ) {
      await prisma.productImage.update({
        where: { id: existingImage.id },
        data: {
          url: item.image,
          alt: `Imagen de demostración de ${item.name}`,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
