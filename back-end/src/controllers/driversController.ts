import { driverCreateSchema, driverUpdateSchema } from "../schemas/domainSchemas";
import * as driversService from "../services/driversService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listDrivers = asyncHandler(async (request, response) => {
  const drivers = await driversService.listDrivers(request.query);
  return response.json(drivers);
});

export const getDriver = asyncHandler(async (request, response) => {
  const driver = await driversService.getDriver(parseId(request.params.id));
  return response.json(driver);
});

export const createDriver = asyncHandler(async (request, response) => {
  const data = driverCreateSchema.parse(request.body);
  const driver = await driversService.createDriver(data, request.user!);
  return created(response, driver);
});

export const updateDriver = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = driverUpdateSchema.parse(request.body);
  const driver = await driversService.updateDriver(id, data, request.user!);
  return response.json(driver);
});

export const deleteDriver = asyncHandler(async (request, response) => {
  await driversService.deleteDriver(parseId(request.params.id), request.user!);
  return noContent(response);
});
