import { Router } from "express";
import * as usersController from "../controllers/usersController";
import { requireRole } from "../middlewares/requireRole";

export const usersRoutes = Router();

usersRoutes.get("/", requireRole("admin"), usersController.listUsers);
usersRoutes.get("/me", usersController.me);
