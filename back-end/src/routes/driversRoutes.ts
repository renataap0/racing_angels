import { Router } from "express";
import * as driversController from "../controllers/driversController";
import { requireRole } from "../middlewares/requireRole";

export const driversRoutes = Router();

driversRoutes.get("/", driversController.listDrivers);
driversRoutes.get("/:id", driversController.getDriver);
driversRoutes.post("/", requireRole("admin"), driversController.createDriver);
driversRoutes.put("/:id", requireRole("admin", "team"), driversController.updateDriver);
driversRoutes.delete("/:id", requireRole("admin"), driversController.deleteDriver);
