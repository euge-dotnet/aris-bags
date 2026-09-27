import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { fail } from "../lib/http.js";

export type AuthPayload = {
  sub: string;
  email: string;
  role: "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

function readToken(req: Request) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("aris_session="));
  return cookie ? decodeURIComponent(cookie.slice("aris_session=".length)) : undefined;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    res.status(401).json(fail("UNAUTHORIZED", "Tenés que iniciar sesión"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    if (payload.role !== "ADMIN") {
      throw new AppError(403, "FORBIDDEN", "No tenés permisos");
    }
    req.auth = payload;
    next();
  } catch {
    res.status(401).json(fail("UNAUTHORIZED", "La sesión no es válida o expiró"));
  }
}
