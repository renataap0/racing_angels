import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export type AuthUser = {
  id: number;
  username: string;
  role: Role;
  teamId: number | null;
  driverId: number | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type JwtPayload = {
  sub: string;
  username: string;
  role: Role;
  teamId?: number | null;
  driverId?: number | null;
};

export function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token JWT nao informado.", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    request.user = {
      id: Number(decoded.sub),
      username: decoded.username,
      role: decoded.role,
      teamId: decoded.teamId ?? null,
      driverId: decoded.driverId ?? null
    };
    next();
  } catch {
    throw new AppError("Token JWT invalido ou expirado.", 401);
  }
}
