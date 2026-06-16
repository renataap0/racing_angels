import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

function assertCanWriteSeason(user: AuthUser) {
  if (!["admin", "team"].includes(user.role)) {
    throw new AppError("Usuario sem permissao para alterar temporadas.", 403);
  }
}

export async function listSeasons() {
  return prisma.season.findMany({
    include: {
      rounds: {
        include: { race: true, track: true },
        orderBy: { roundNumber: "asc" }
      }
    },
    orderBy: [{ year: "desc" }, { name: "asc" }]
  });
}

export async function createSeason(data: any, user: AuthUser) {
  assertCanWriteSeason(user);
  return prisma.season.create({ data });
}

export async function getSeason(id: number) {
  const season = await prisma.season.findUnique({
    where: { id },
    include: {
      rounds: {
        include: { race: true, track: true, laps: { include: { driver: true, car: true } } },
        orderBy: { roundNumber: "asc" }
      }
    }
  });

  if (!season) {
    throw new AppError("Temporada nao encontrada.", 404);
  }

  return season;
}

export async function createSeasonRound(seasonId: number, data: any, user: AuthUser) {
  assertCanWriteSeason(user);

  return prisma.seasonRound.create({
    data: { ...data, seasonId },
    include: { season: true, race: true, track: true }
  });
}

export async function createSeasonRoundLap(seasonRoundId: number, data: any, user: AuthUser) {
  assertCanWriteSeason(user);

  return prisma.seasonRoundLap.create({
    data: { ...data, seasonRoundId },
    include: { driver: true, car: true, seasonRound: true }
  });
}

export async function listSeasonRoundLaps(seasonRoundId: number) {
  return prisma.seasonRoundLap.findMany({
    where: { seasonRoundId },
    include: { driver: true, car: true },
    orderBy: [{ lapNumber: "asc" }, { id: "asc" }]
  });
}
