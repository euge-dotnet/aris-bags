import "dotenv/config";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { drawingsFolder, drawingPublicId } from "../src/lib/cloudinaryFolder.js";

const imagePattern = /\.(jpe?g|png|webp|gif|avif)$/i;

function resolveDrawingsDir() {
  const candidates = [
    path.resolve(process.cwd(), "drawings"),
    path.resolve(process.cwd(), "../drawings"),
  ];
  return candidates;
}

async function findDrawingsDir() {
  for (const candidate of resolveDrawingsDir()) {
    try {
      const files = await readdir(candidate);
      if (files.some((file) => imagePattern.test(file))) {
        return candidate;
      }
    } catch {
      // keep looking
    }
  }
  throw new Error("No encontré la carpeta drawings con imágenes");
}

async function main() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const rootFolder = process.env.CLOUDINARY_FOLDER || "aris-bags";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET en backend/.env",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const folder = drawingsFolder(rootFolder);
  const source = await findDrawingsDir();
  const files = (await readdir(source))
    .filter((file) => imagePattern.test(file))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  let uploaded = 0;
  let skipped = 0;

  console.log(`Subiendo ${files.length} dibujos a ${folder}`);

  for (const file of files) {
    const publicId = drawingPublicId(file);
    const fullPublicId = `${folder}/${publicId}`;

    try {
      await cloudinary.api.resource(fullPublicId);
      skipped += 1;
      continue;
    } catch {
      // no existe todavía
    }

    await cloudinary.uploader.upload(path.join(source, file), {
      folder,
      public_id: publicId,
      overwrite: false,
      unique_filename: false,
      resource_type: "image",
    });
    uploaded += 1;
    if (uploaded % 20 === 0) {
      console.log(`Progreso: ${uploaded} subidos, ${skipped} ya estaban`);
    }
  }

  console.log(`Listo. Subidos: ${uploaded}. Ya existían: ${skipped}. Carpeta: ${folder}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "No se pudieron subir los dibujos");
  process.exit(1);
});
