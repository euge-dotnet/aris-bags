import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ok } from "../lib/http.js";
import { listPublicCategories } from "../services/categoryService.js";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listPublicCategories()));
  }),
);
