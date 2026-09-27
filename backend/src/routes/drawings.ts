import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ok } from "../lib/http.js";
import { routeParam } from "../lib/params.js";
import { getDrawing, listDrawings } from "../services/cloudinaryService.js";

export const drawingsRouter = Router();

drawingsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listDrawings()));
  }),
);

drawingsRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    res.json(ok(await getDrawing(routeParam(req, "key"))));
  }),
);
