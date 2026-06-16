import { Router } from "express";
import * as ordersController from "../controllers/ordersController";

export const ordersRoutes = Router();

ordersRoutes.get("/", ordersController.listOrders);
ordersRoutes.get("/:id", ordersController.getOrder);
ordersRoutes.post("/", ordersController.createOrder);
