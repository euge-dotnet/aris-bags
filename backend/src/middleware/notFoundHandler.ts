import type { RequestHandler } from "express";
import { fail } from "../lib/http.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(fail("NOT_FOUND", "Recurso no encontrado"));
};
