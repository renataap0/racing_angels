import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/AppError";

export function requireRole(...roles: Role[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const user = request.user;

    if (!user) {
      throw new AppError("Usuario nao autenticado.", 401);
    }

    if (!roles.includes(user.role)) {
      throw new AppError("Usuario sem permissao para esta acao.", 403);
    }

    next();
  };
}
