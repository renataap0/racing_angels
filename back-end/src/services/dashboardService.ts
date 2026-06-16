import { prisma } from "../config/prisma";
import { getRankings, getSalesSummary } from "./analyticsService";

export async function getDashboardSummary() {
  const [teams, drivers, cars, tracks, races, products, rankings, sales] = await Promise.all([
    prisma.team.count(),
    prisma.driver.count(),
    prisma.car.count(),
    prisma.track.count(),
    prisma.race.count(),
    prisma.product.count(),
    getRankings(),
    getSalesSummary()
  ]);

  return {
    teams,
    drivers,
    cars,
    tracks,
    races,
    products,
    orders: sales.totalOrders,
    revenue: sales.revenue,
    rankings
  };
}
