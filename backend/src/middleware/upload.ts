import multer from "multer";
import { AppError } from "../lib/errors.js";

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 12,
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError(400, "INVALID_IMAGE", "Solo se aceptan archivos de imagen"));
      return;
    }
    callback(null, true);
  },
});
