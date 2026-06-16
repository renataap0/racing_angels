import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { parseOptionalNumber } from "../utils/http";

function assertCanManageDriver(user: AuthUser, driverTeamId: number) {
  if (user.role === "admin") {
    return;
  }

  if (user.role === "team" && user.teamId === driverTeamId) {
    return;
  }

  throw new AppError("Usuario sem permissao para gerenciar este piloto.", 403);
}

export async function listDrivers(query: any) {
  return prisma.driver.findMany({
    where: {
      name: query.name ? { contains: String(query.name) } : undefined,
      status: query.status ? String(query.status) : undefined,
      teamId: parseOptionalNumber(query.teamId)
    },
    include: { team: true, cars: true },
    orderBy: { name: "asc" }
  });
}

export async function getDriver(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { team: true, cars: true, races: true }
  });

  if (!driver) {
    throw new AppError("Piloto nao encontrado.", 404);
  }

  return driver;
}

export async function createDriver(data: any, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode cadastrar pilotos.", 403);
  }

  if (!data.teamId) {
    throw new AppError("teamId e obrigatorio para cadastrar piloto.", 400);
  }

  return prisma.driver.create({ data });
}

export async function updateDriver(id: number, data: any, user: AuthUser) {
  const driver = await getDriver(id);
  assertCanManageDriver(user, driver.teamId);

  const safeData = user.role === "team" ? { ...data, teamId: driver.teamId } : data;
  return prisma.driver.update({ where: { id }, data: safeData });
}

export async function deleteDriver(id: number, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode excluir pilotos.", 403);
  }

  return prisma.driver.delete({ where: { id } });
}
