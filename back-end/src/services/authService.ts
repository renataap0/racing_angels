import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { team: true, driver: true }
  });

  if (!user) {
    throw new AppError("Usuario ou senha invalidos.", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError("Usuario ou senha invalidos.", 401);
  }

  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
      teamId: user.teamId,
      driverId: user.driverId
    },
    env.jwtSecret,
    {
      subject: String(user.id),
      expiresIn: "8h"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      teamId: user.teamId,
      driverId: user.driverId,
      team: user.team,
      driver: user.driver
    }
  };
}
