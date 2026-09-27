import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ok } from "../lib/http.js";
import { routeParam } from "../lib/params.js";
import { getPublicProduct, listPublicProducts } from "../services/productService.js";
import { productQuerySchema } from "../validators/catalog.js";

export const productsRouter = Router();

productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = productQuerySchema.parse(req.query);
    res.json(ok(await listPublicProducts(query)));
  }),
);

productsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    res.json(ok(await getPublicProduct(routeParam(req, "slug"))));
  }),
);
