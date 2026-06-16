import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

const publicUserSelect = {
  id: true,
  username: true,
  role: true,
  teamId: true,
  driverId: true,
  createdAt: true,
  updatedAt: true,
  team: true,
  driver: true
};

export async function listUsers() {
  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { id: "asc" }
  });
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect
  });

  if (!user) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  return user;
}
