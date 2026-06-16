import { Response } from "express";
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export function parseId(id: string) {
  return idParamSchema.parse({ id }).id;
}

export function created(response: Response, payload: unknown) {
  return response.status(201).json(payload);
}

export function noContent(response: Response) {
  return response.status(204).send();
}

export function parseOptionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}
