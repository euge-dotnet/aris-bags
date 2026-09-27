import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { fail } from "../lib/http.js";
import { logger } from "../lib/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.status).json(fail(error.code, error.message));
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json(fail("VALIDATION_ERROR", "Los datos enviados no son válidos"));
    return;
  }

  logger.error("Error no controlado", {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Error interno",
  });

  const message = env.isProduction
    ? "Ocurrió un error interno"
    : error instanceof Error
      ? error.message
      : "Ocurrió un error interno";

  res.status(500).json(fail("INTERNAL_ERROR", message));
};
