import { Router } from "express";
import * as productsController from "../controllers/productsController";
import { requireRole } from "../middlewares/requireRole";

export const productsRoutes = Router();

productsRoutes.get("/", productsController.listProducts);
productsRoutes.get("/:id", productsController.getProduct);
productsRoutes.post("/", requireRole("admin"), productsController.createProduct);
productsRoutes.put("/:id", requireRole("admin"), productsController.updateProduct);
productsRoutes.delete("/:id", requireRole("admin"), productsController.deleteProduct);
