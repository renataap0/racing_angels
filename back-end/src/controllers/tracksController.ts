import { trackCreateSchema, trackUpdateSchema } from "../schemas/domainSchemas";
import * as tracksService from "../services/tracksService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listTracks = asyncHandler(async (request, response) => {
  const tracks = await tracksService.listTracks(request.query);
  return response.json(tracks);
});

export const getTrack = asyncHandler(async (request, response) => {
  const track = await tracksService.getTrack(parseId(request.params.id));
  return response.json(track);
});

export const createTrack = asyncHandler(async (request, response) => {
  const data = trackCreateSchema.parse(request.body);
  const track = await tracksService.createTrack(data, request.user!);
  return created(response, track);
});

export const updateTrack = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = trackUpdateSchema.parse(request.body);
  const track = await tracksService.updateTrack(id, data, request.user!);
  return response.json(track);
});

export const deleteTrack = asyncHandler(async (request, response) => {
  await tracksService.deleteTrack(parseId(request.params.id), request.user!);
  return noContent(response);
});
