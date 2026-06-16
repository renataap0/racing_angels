import { Router } from "express";
import * as racesController from "../controllers/racesController";
import { requireRole } from "../middlewares/requireRole";

export const racesRoutes = Router();

racesRoutes.get("/", racesController.listRaces);
racesRoutes.get("/:id", racesController.getRace);
racesRoutes.post("/", requireRole("admin", "team"), racesController.createRace);
racesRoutes.put("/:id", requireRole("admin", "team"), racesController.updateRace);
racesRoutes.delete("/:id", requireRole("admin"), racesController.deleteRace);
