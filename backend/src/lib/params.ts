import type { Request } from "express";
import { AppError } from "./errors.js";

export function routeParam(req: Request, name: string) {
  const value = req.params[name];
  if (typeof value !== "string" || !value) {
    throw new AppError(400, "VALIDATION_ERROR", `Parámetro ${name} inválido`);
  }
  return value;
}
