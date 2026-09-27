import { app } from "./app.js";
import { assertAuthSecrets, env } from "./config/env.js";
import { logger } from "./lib/logger.js";

assertAuthSecrets();

const server = app.listen(env.port, () => {
  logger.info(`Ari´s Bags API escuchando en http://localhost:${env.port}`);
});

server.on("error", (error) => {
  logger.error("No se pudo iniciar el servidor", error);
  process.exit(1);
});
