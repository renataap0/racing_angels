import { carCreateSchema, carUpdateSchema } from "../schemas/domainSchemas";
import * as carsService from "../services/carsService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listCars = asyncHandler(async (request, response) => {
  const cars = await carsService.listCars(request.query);
  return response.json(cars);
});

export const getCar = asyncHandler(async (request, response) => {
  const car = await carsService.getCar(parseId(request.params.id));
  return response.json(car);
});

export const createCar = asyncHandler(async (request, response) => {
  const data = carCreateSchema.parse(request.body);
  const car = await carsService.createCar(data, request.user!);
  return created(response, car);
});

export const updateCar = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = carUpdateSchema.parse(request.body);
  const car = await carsService.updateCar(id, data, request.user!);
  return response.json(car);
});

export const deleteCar = asyncHandler(async (request, response) => {
  await carsService.deleteCar(parseId(request.params.id), request.user!);
  return noContent(response);
});
