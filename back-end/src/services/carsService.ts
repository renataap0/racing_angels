import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { parseOptionalNumber } from "../utils/http";

export async function listCars(query: any) {
  return prisma.car.findMany({
    where: {
      model: query.model ? { contains: String(query.model) } : undefined,
      teamId: parseOptionalNumber(query.teamId),
      driverId: parseOptionalNumber(query.driverId)
    },
    include: { team: true, driver: true },
    orderBy: { model: "asc" }
  });
}

export async function getCar(id: number) {
  const car = await prisma.car.findUnique({
    where: { id },
    include: { team: true, driver: true, races: true }
  });

  if (!car) {
    throw new AppError("Carro nao encontrado.", 404);
  }

  return car;
}

export async function createCar(data: any, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode cadastrar carros.", 403);
  }

  return prisma.car.create({ data });
}

export async function updateCar(id: number, data: any, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode editar carros.", 403);
  }

  return prisma.car.update({ where: { id }, data });
}

export async function deleteCar(id: number, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode excluir carros.", 403);
  }

  return prisma.car.delete({ where: { id } });
}
