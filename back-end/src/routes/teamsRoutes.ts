import { Router } from "express";
import * as teamsController from "../controllers/teamsController";
import { requireRole } from "../middlewares/requireRole";

export const teamsRoutes = Router();

teamsRoutes.get("/", teamsController.listTeams);
teamsRoutes.post("/", requireRole("admin"), teamsController.createTeam);
teamsRoutes.put("/:id", requireRole("admin"), teamsController.updateTeam);
teamsRoutes.delete("/:id", requireRole("admin"), teamsController.deleteTeam);
