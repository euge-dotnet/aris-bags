import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ok } from "../lib/http.js";
import { quoteCart } from "../services/cartService.js";
import { cartQuoteSchema } from "../validators/order.js";

export const cartRouter = Router();

cartRouter.post(
  "/quote",
  asyncHandler(async (req, res) => {
    const body = cartQuoteSchema.parse(req.body);
    res.json(ok(await quoteCart(body.items)));
  }),
);
