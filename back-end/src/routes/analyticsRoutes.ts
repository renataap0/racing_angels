import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";

export const analyticsRoutes = Router();

analyticsRoutes.get("/", analyticsController.getAnalytics);
analyticsRoutes.get("/drivers", analyticsController.getDriversAnalytics);
analyticsRoutes.get("/tracks", analyticsController.getTracksAnalytics);
analyticsRoutes.get("/cars", analyticsController.getCarsAnalytics);
analyticsRoutes.get("/rankings", analyticsController.getRankings);
