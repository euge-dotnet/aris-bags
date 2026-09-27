import type { Response } from "express";
import { env } from "../config/env.js";

const cookieName = "aris_session";

export function setSessionCookie(res: Response, token: string) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
  });
}
