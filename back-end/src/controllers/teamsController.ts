import { teamCreateSchema, teamUpdateSchema } from "../schemas/domainSchemas";
import * as teamsService from "../services/teamsService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listTeams = asyncHandler(async (request, response) => {
  const teams = await teamsService.listTeams(request.query);
  return response.json(teams);
});

export const createTeam = asyncHandler(async (request, response) => {
  const data = teamCreateSchema.parse(request.body);
  const team = await teamsService.createTeam(data);
  return created(response, team);
});

export const updateTeam = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = teamUpdateSchema.parse(request.body);
  const team = await teamsService.updateTeam(id, data);
  return response.json(team);
});

export const deleteTeam = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  await teamsService.deleteTeam(id);
  return noContent(response);
});
