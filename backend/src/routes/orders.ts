import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { AppError } from "../lib/errors.js";
import { ok } from "../lib/http.js";
import { routeParam } from "../lib/params.js";
import { orderLimiter } from "../middleware/rateLimit.js";
import { createOrder, getPublicOrder } from "../services/orderService.js";
import { orderInputSchema } from "../validators/order.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/",
  orderLimiter,
  asyncHandler(async (req, res) => {
    const body = orderInputSchema.parse(req.body);
    res.status(201).json(ok(await createOrder(body)));
  }),
);

ordersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const email = typeof req.query.email === "string" ? req.query.email : "";
    if (!email) {
      throw new AppError(400, "VALIDATION_ERROR", "El email es obligatorio para consultar el pedido");
    }
    res.json(ok(await getPublicOrder(routeParam(req, "id"), email)));
  }),
);
