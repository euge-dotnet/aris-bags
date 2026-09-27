import { describe, expect, it } from "vitest";
import {
  drawingKeyFromPublicId,
  drawingPublicId,
  drawingPublicIdFromKey,
  drawingsFolder,
  isOwnedProductImage,
  productMediaFolder,
  unsyncedResources,
} from "../lib/cloudinaryFolder.js";

describe("carpetas de Cloudinary", () => {
  it("arma la carpeta por producto", () => {
    expect(productMediaFolder("aris-bags", "tote-jardin-secreto")).toBe(
      "aris-bags/products/tote-jardin-secreto",
    );
  });

  it("no vuelve a importar public_id ya vinculados", () => {
    const next = unsyncedResources(
      [
        { public_id: "aris-bags/products/tote/a" },
        { public_id: "aris-bags/products/tote/b" },
      ],
      ["aris-bags/products/tote/a"],
    );
    expect(next.map((item) => item.public_id)).toEqual(["aris-bags/products/tote/b"]);
  });

  it("nombra los dibujos locales de forma estable", () => {
    expect(drawingPublicId("Imagen (1).jpg")).toBe("imagen-1");
    expect(drawingsFolder("aris-bags")).toBe("aris-bags/drawings");
    expect(isOwnedProductImage("aris-bags", "aris-bags/drawings/imagen-1")).toBe(false);
    expect(isOwnedProductImage("aris-bags", "aris-bags/products/tote/a")).toBe(true);
    expect(drawingKeyFromPublicId("aris-bags/drawings/imagen-12")).toBe("imagen-12");
    expect(drawingPublicIdFromKey("aris-bags", "imagen-12")).toBe("aris-bags/drawings/imagen-12");
  });
});
