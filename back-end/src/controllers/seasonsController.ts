import {
  seasonCreateSchema,
  seasonRoundCreateSchema,
  seasonRoundLapCreateSchema
} from "../schemas/domainSchemas";
import * as seasonsService from "../services/seasonsService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, parseId } from "../utils/http";

export const listSeasons = asyncHandler(async (_request, response) => {
  const seasons = await seasonsService.listSeasons();
  return response.json(seasons);
});

export const createSeason = asyncHandler(async (request, response) => {
  const data = seasonCreateSchema.parse(request.body);
  const season = await seasonsService.createSeason(data, request.user!);
  return created(response, season);
});

export const getSeason = asyncHandler(async (request, response) => {
  const season = await seasonsService.getSeason(parseId(request.params.id));
  return response.json(season);
});

export const createSeasonRound = asyncHandler(async (request, response) => {
  const seasonId = parseId(request.params.id);
  const data = seasonRoundCreateSchema.parse(request.body);
  const round = await seasonsService.createSeasonRound(seasonId, data, request.user!);
  return created(response, round);
});

export const createSeasonRoundLap = asyncHandler(async (request, response) => {
  const seasonRoundId = parseId(request.params.id);
  const data = seasonRoundLapCreateSchema.parse(request.body);
  const lap = await seasonsService.createSeasonRoundLap(seasonRoundId, data, request.user!);
  return created(response, lap);
});

export const listSeasonRoundLaps = asyncHandler(async (request, response) => {
  const seasonRoundId = parseId(request.params.id);
  const laps = await seasonsService.listSeasonRoundLaps(seasonRoundId);
  return response.json(laps);
});
