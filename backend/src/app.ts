import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { cartRouter } from "./routes/cart.js";
import { categoriesRouter } from "./routes/categories.js";
import { drawingsRouter } from "./routes/drawings.js";
import { healthRouter } from "./routes/health.js";
import { ordersRouter } from "./routes/orders.js";
import { productsRouter } from "./routes/products.js";

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: env.corsOrigins.length === 1 ? env.corsOrigins[0] : env.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/drawings", drawingsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
