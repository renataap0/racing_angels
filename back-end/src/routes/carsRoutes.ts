import { Router } from "express";
import * as carsController from "../controllers/carsController";
import { requireRole } from "../middlewares/requireRole";

export const carsRoutes = Router();

carsRoutes.get("/", carsController.listCars);
carsRoutes.get("/:id", carsController.getCar);
carsRoutes.post("/", requireRole("admin"), carsController.createCar);
carsRoutes.put("/:id", requireRole("admin"), carsController.updateCar);
carsRoutes.delete("/:id", requireRole("admin"), carsController.deleteCar);
