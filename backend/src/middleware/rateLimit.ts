import rateLimit from "express-rate-limit";
import { fail } from "../lib/http.js";

function limiter(max: number) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json(fail("RATE_LIMITED", "Demasiados intentos. Probá más tarde."));
    },
  });
}

export const loginLimiter = limiter(10);
export const orderLimiter = limiter(20);
