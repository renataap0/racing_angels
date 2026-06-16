import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema } from "../schemas/authSchemas";
import * as authService from "../services/authService";

export const login = asyncHandler(async (request, response) => {
  const data = loginSchema.parse(request.body);
  const result = await authService.login(data.username, data.password);
  return response.json(result);
});
