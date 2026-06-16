import { Router } from "express";
import * as seasonsController from "../controllers/seasonsController";
import { requireRole } from "../middlewares/requireRole";

export const seasonsRoutes = Router();
export const seasonRoundsRoutes = Router();

seasonsRoutes.get("/", seasonsController.listSeasons);
seasonsRoutes.post("/", requireRole("admin", "team"), seasonsController.createSeason);
seasonsRoutes.get("/:id", seasonsController.getSeason);
seasonsRoutes.post("/:id/rounds", requireRole("admin", "team"), seasonsController.createSeasonRound);

seasonRoundsRoutes.post("/:id/laps", requireRole("admin", "team"), seasonsController.createSeasonRoundLap);
seasonRoundsRoutes.get("/:id/laps", seasonsController.listSeasonRoundLaps);
