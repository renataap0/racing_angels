import { productCreateSchema, productUpdateSchema } from "../schemas/domainSchemas";
import * as productsService from "../services/productsService";
import { asyncHandler } from "../utils/asyncHandler";
import { created, noContent, parseId } from "../utils/http";

export const listProducts = asyncHandler(async (request, response) => {
  const products = await productsService.listProducts(request.query);
  return response.json(products);
});

export const getProduct = asyncHandler(async (request, response) => {
  const product = await productsService.getProduct(parseId(request.params.id));
  return response.json(product);
});

export const createProduct = asyncHandler(async (request, response) => {
  const data = productCreateSchema.parse(request.body);
  const product = await productsService.createProduct(data, request.user!);
  return created(response, product);
});

export const updateProduct = asyncHandler(async (request, response) => {
  const id = parseId(request.params.id);
  const data = productUpdateSchema.parse(request.body);
  const product = await productsService.updateProduct(id, data, request.user!);
  return response.json(product);
});

export const deleteProduct = asyncHandler(async (request, response) => {
  await productsService.deleteProduct(parseId(request.params.id), request.user!);
  return noContent(response);
});
