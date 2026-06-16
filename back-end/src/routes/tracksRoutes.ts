import { Router } from "express";
import * as tracksController from "../controllers/tracksController";
import { requireRole } from "../middlewares/requireRole";

export const tracksRoutes = Router();

tracksRoutes.get("/", tracksController.listTracks);
tracksRoutes.get("/:id", tracksController.getTrack);
tracksRoutes.post("/", requireRole("admin", "team"), tracksController.createTrack);
tracksRoutes.put("/:id", requireRole("admin"), tracksController.updateTrack);
tracksRoutes.delete("/:id", requireRole("admin"), tracksController.deleteTrack);
