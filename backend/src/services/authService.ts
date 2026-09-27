import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import type { AuthPayload } from "../middleware/auth.js";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email o contraseña incorrectos");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email o contraseña incorrectos");
  }

  const payload: AuthPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "La sesión no es válida");
  }
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
