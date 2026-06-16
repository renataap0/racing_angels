import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export async function listTeams(query: any) {
  return prisma.team.findMany({
    where: {
      name: query.name ? { contains: String(query.name) } : undefined,
      country: query.country ? { contains: String(query.country) } : undefined
    },
    include: { drivers: true, cars: true },
    orderBy: { name: "asc" }
  });
}

export async function createTeam(data: any) {
  return prisma.team.create({ data });
}

export async function updateTeam(id: number, data: any) {
  return prisma.team.update({ where: { id }, data });
}

export async function deleteTeam(id: number) {
  const users = await prisma.user.count({ where: { teamId: id } });

  if (users > 0) {
    throw new AppError("Nao e possivel excluir equipe vinculada a usuarios.", 409);
  }

  return prisma.team.delete({ where: { id } });
}
