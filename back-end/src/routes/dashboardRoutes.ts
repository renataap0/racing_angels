import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController";

export const dashboardRoutes = Router();

dashboardRoutes.get("/summary", dashboardController.summary);
