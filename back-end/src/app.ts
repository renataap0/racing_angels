import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { analyticsRoutes } from "./routes/analyticsRoutes";
import { authRoutes } from "./routes/authRoutes";
import { carsRoutes } from "./routes/carsRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { driversRoutes } from "./routes/driversRoutes";
import { ordersRoutes } from "./routes/ordersRoutes";
import { productsRoutes } from "./routes/productsRoutes";
import { racesRoutes } from "./routes/racesRoutes";
import { seasonRoundsRoutes, seasonsRoutes } from "./routes/seasonsRoutes";
import { teamsRoutes } from "./routes/teamsRoutes";
import { tracksRoutes } from "./routes/tracksRoutes";
import { usersRoutes } from "./routes/usersRoutes";
import { AppError } from "./utils/AppError";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware);
app.use("/api/users", usersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/races", racesRoutes);
app.use("/api/seasons", seasonsRoutes);
app.use("/api/season-rounds", seasonRoundsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((_request, _response, next) => {
  next(new AppError("Rota nao encontrada.", 404));
});

app.use(errorMiddleware);
