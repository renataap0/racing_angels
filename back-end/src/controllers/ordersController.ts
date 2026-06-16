import { orderCreateSchema } from "../schemas/domainSchemas";
import * as ordersService from "../services/ordersService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, parseId } from "../utils/http";

export const listOrders = asyncHandler(async (request, response) => {
  const orders = await ordersService.listOrders(request.user!);
  return response.json(orders);
});

export const getOrder = asyncHandler(async (request, response) => {
  const order = await ordersService.getOrder(parseId(request.params.id), request.user!);
  return response.json(order);
});

export const createOrder = asyncHandler(async (request, response) => {
  const data = orderCreateSchema.parse(request.body);
  const order = await ordersService.createOrder(data, request.user!);
  return created(response, order);
});
