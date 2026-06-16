import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export async function listTracks(query: any) {
  return prisma.track.findMany({
    where: {
      name: query.name ? { contains: String(query.name) } : undefined,
      country: query.country ? { contains: String(query.country) } : undefined,
      type: query.type ? String(query.type) : undefined
    },
    orderBy: { name: "asc" }
  });
}

export async function getTrack(id: number) {
  const track = await prisma.track.findUnique({
    where: { id },
    include: { races: true }
  });

  if (!track) {
    throw new AppError("Pista nao encontrada.", 404);
  }

  return track;
}

export async function createTrack(data: any, user: AuthUser) {
  if (!["admin", "team"].includes(user.role)) {
    throw new AppError("Usuario sem permissao para cadastrar pistas.", 403);
  }

  return prisma.track.create({ data });
}

export async function updateTrack(id: number, data: any, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode editar pistas.", 403);
  }

  return prisma.track.update({ where: { id }, data });
}

export async function deleteTrack(id: number, user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode excluir pistas.", 403);
  }

  return prisma.track.delete({ where: { id } });
}
