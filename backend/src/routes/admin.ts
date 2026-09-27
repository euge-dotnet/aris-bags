import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ok } from "../lib/http.js";
import { routeParam } from "../lib/params.js";
import { requireAdmin } from "../middleware/auth.js";
import { productImageUpload } from "../middleware/upload.js";
import {
  createCategory,
  listAdminCategories,
  updateCategory,
} from "../services/categoryService.js";
import {
  addProductImage,
  attachDrawingToProduct,
  getCloudinaryStatus,
  importProductImagesFromCloudinary,
  listDrawings,
  removeProductImage,
  uploadProductImages,
} from "../services/cloudinaryService.js";
import { getDashboard } from "../services/dashboardService.js";
import { getAdminOrder, listOrders, updateOrderStatus } from "../services/orderService.js";
import {
  createProduct,
  deactivateProduct,
  getAdminProduct,
  listAdminProducts,
  updateProduct,
} from "../services/productService.js";
import {
  categoryInputSchema,
  drawingAttachSchema,
  imageInputSchema,
  productInputSchema,
} from "../validators/catalog.js";
import { orderStatusSchema } from "../validators/order.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    res.json(ok(await getDashboard()));
  }),
);

adminRouter.get(
  "/products",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listAdminProducts()));
  }),
);

adminRouter.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    res.json(ok(await getAdminProduct(routeParam(req, "id"))));
  }),
);

adminRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const body = productInputSchema.parse(req.body);
    res.status(201).json(ok(await createProduct(body)));
  }),
);

adminRouter.put(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const body = productInputSchema.partial().parse(req.body);
    res.json(ok(await updateProduct(routeParam(req, "id"), body)));
  }),
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    res.json(ok(await deactivateProduct(routeParam(req, "id"))));
  }),
);

adminRouter.get(
  "/media/status",
  asyncHandler(async (_req, res) => {
    res.json(ok(getCloudinaryStatus()));
  }),
);

adminRouter.get(
  "/drawings",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listDrawings()));
  }),
);

adminRouter.post(
  "/products/:id/images/upload",
  productImageUpload.array("images", 12),
  asyncHandler(async (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    res.status(201).json(ok(await uploadProductImages(routeParam(req, "id"), files)));
  }),
);

adminRouter.post(
  "/products/:id/images/import",
  asyncHandler(async (req, res) => {
    res.json(ok(await importProductImagesFromCloudinary(routeParam(req, "id"))));
  }),
);

adminRouter.post(
  "/products/:id/images/from-drawing",
  asyncHandler(async (req, res) => {
    const body = drawingAttachSchema.parse(req.body);
    res.status(201).json(ok(await attachDrawingToProduct(routeParam(req, "id"), body.publicId)));
  }),
);

adminRouter.post(
  "/products/:id/images",
  asyncHandler(async (req, res) => {
    const body = imageInputSchema.parse(req.body);
    res.status(201).json(ok(await addProductImage(routeParam(req, "id"), body)));
  }),
);

adminRouter.delete(
  "/products/:id/images/:imageId",
  asyncHandler(async (req, res) => {
    res.json(ok(await removeProductImage(routeParam(req, "id"), routeParam(req, "imageId"))));
  }),
);

adminRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listAdminCategories()));
  }),
);

adminRouter.post(
  "/categories",
  asyncHandler(async (req, res) => {
    const body = categoryInputSchema.parse(req.body);
    res.status(201).json(ok(await createCategory(body)));
  }),
);

adminRouter.put(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const body = categoryInputSchema.partial().parse(req.body);
    res.json(ok(await updateCategory(routeParam(req, "id"), body)));
  }),
);

adminRouter.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    res.json(ok(await listOrders()));
  }),
);

adminRouter.get(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    res.json(ok(await getAdminOrder(routeParam(req, "id"))));
  }),
);

adminRouter.put(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const body = orderStatusSchema.parse(req.body);
    res.json(ok(await updateOrderStatus(routeParam(req, "id"), body.status)));
  }),
);
