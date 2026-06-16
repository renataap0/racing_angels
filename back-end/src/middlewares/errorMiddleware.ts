import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dados invalidos.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({ message: "Registro duplicado." });
    }

    if (error.code === "P2025") {
      return response.status(404).json({ message: "Registro nao encontrado." });
    }

    if (error.code === "P2003") {
      return response.status(409).json({ message: "Registro possui vinculos e nao pode ser alterado ou removido." });
    }
  }

  console.error(error);
  return response.status(500).json({ message: "Erro interno do servidor." });
}
