import { raceCreateSchema, raceUpdateSchema } from "../schemas/domainSchemas";
import * as racesService from "../services/racesService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listRaces = asyncHandler(async (request, response) => {
  const races = await racesService.listRaces(request.query);
  return response.json(races);
});

export const getRace = asyncHandler(async (request, response) => {
  const race = await racesService.getRace(parseId(request.params.id));
  return response.json(race);
});

export const createRace = asyncHandler(async (request, response) => {
  const data = raceCreateSchema.parse(request.body);
  const race = await racesService.createRace(data, request.user!);
  return created(response, race);
});

export const updateRace = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = raceUpdateSchema.parse(request.body);
  const race = await racesService.updateRace(id, data, request.user!);
  return response.json(race);
});

export const deleteRace = asyncHandler(async (request, response) => {
  await racesService.deleteRace(parseId(request.params.id), request.user!);
  return noContent(response);
});
