import "dotenv/config";

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function read(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: read("NODE_ENV", "development"),
  port: readNumber("PORT", 4000),
  corsOrigin: read("CORS_ORIGIN", "http://localhost:5173"),
  corsOrigins: read("CORS_ORIGIN", "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  databaseUrl: read("DATABASE_URL"),
  jwtSecret: read("JWT_SECRET", "dev-only-change-me"),
  jwtExpiresIn: read("JWT_EXPIRES_IN", "8h"),
  cloudinaryCloudName: read("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: read("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: read("CLOUDINARY_API_SECRET"),
  cloudinaryFolder: read("CLOUDINARY_FOLDER", "aris-bags"),
  isProduction: read("NODE_ENV", "development") === "production",
};

export function assertAuthSecrets() {
  if (env.isProduction && env.jwtSecret === "dev-only-change-me") {
    throw new Error("JWT_SECRET es obligatorio en producción");
  }
}
