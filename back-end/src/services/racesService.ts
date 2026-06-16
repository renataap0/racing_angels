import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { parseOptionalNumber } from "../utils/http";

const raceInclude = {
  driver: true,
  team: true,
  track: true,
  car: true
};

async function assertTeamOwnsRace(user: AuthUser, raceId: number) {
  const race = await prisma.race.findUnique({ where: { id: raceId } });

  if (!race) {
    throw new AppError("Corrida nao encontrada.", 404);
  }

  if (user.role === "admin") {
    return race;
  }

  if (user.role === "team" && user.teamId === race.teamId) {
    return race;
  }

  throw new AppError("Usuario sem permissao para gerenciar esta corrida.", 403);
}

async function assertRaceEntities(data: any, user: AuthUser) {
  const teamId = user.role === "team" ? user.teamId : data.teamId;

  if (!teamId) {
    throw new AppError("teamId e obrigatorio para criar corrida.", 400);
  }

  const [driver, car] = await Promise.all([
    prisma.driver.findUnique({ where: { id: data.driverId } }),
    prisma.car.findUnique({ where: { id: data.carId } })
  ]);

  if (!driver || !car) {
    throw new AppError("Piloto ou carro nao encontrado.", 404);
  }

  if (driver.teamId !== teamId || car.teamId !== teamId) {
    throw new AppError("Piloto e carro devem pertencer a equipe da corrida.", 400);
  }

  return teamId;
}

export async function listRaces(query: any) {
  return prisma.race.findMany({
    where: {
      name: query.name ? { contains: String(query.name) } : undefined,
      status: query.status ? String(query.status) : undefined,
      teamId: parseOptionalNumber(query.teamId),
      driverId: parseOptionalNumber(query.driverId),
      trackId: parseOptionalNumber(query.trackId),
      carId: parseOptionalNumber(query.carId)
    },
    include: raceInclude,
    orderBy: { id: "asc" }
  });
}

export async function getRace(id: number) {
  const race = await prisma.race.findUnique({
    where: { id },
    include: raceInclude
  });

  if (!race) {
    throw new AppError("Corrida nao encontrada.", 404);
  }

  return race;
}

export async function createRace(data: any, user: AuthUser) {
  if (!["admin", "team"].includes(user.role)) {
    throw new AppError("Usuario sem permissao para criar corridas.", 403);
  }

  const teamId = await assertRaceEntities(data, user);
  return prisma.race.create({
    data: {
      ...data,
      teamId
    },
    include: raceInclude
  });
}

export async function updateRace(id: number, data: any, user: AuthUser) {
  if (!["admin", "team"].includes(user.role)) {
    throw new AppError("Usuario sem permissao para editar corridas.", 403);
  }

  const currentRace = await assertTeamOwnsRace(user, id);
  const candidate = {
    ...currentRace,
    ...data,
    teamId: user.role === "team" ? currentRace.teamId : data.teamId ?? currentRace.teamId
  };

  await assertRaceEntities(candidate, user);

  return prisma.race.update({
    where: { id },
    data: {
      ...data,
      teamId: candidate.teamId
    },
    include: raceInclude
  });
}

export async function deleteRace(id: number, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Team e driver nao podem excluir corridas.", 403);
  }

  return prisma.race.delete({ where: { id } });
}
