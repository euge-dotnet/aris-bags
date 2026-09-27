import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { clearSessionCookie, setSessionCookie } from "../lib/cookies.js";
import { ok } from "../lib/http.js";
import { requireAdmin } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { getMe, login } from "../services/authService.js";
import { loginSchema } from "../validators/auth.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const result = await login(body.email, body.password);
    setSessionCookie(res, result.token);
    res.json(ok(result));
  }),
);

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json(ok({ closed: true }));
});

authRouter.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json(ok(await getMe(req.auth!.sub)));
  }),
);
