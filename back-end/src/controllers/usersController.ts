import { asyncHandler } from "../utils/asyncHandler";
import * as usersService from "../services/usersService";

export const listUsers = asyncHandler(async (_request, response) => {
  const users = await usersService.listUsers();
  return response.json(users);
});

export const me = asyncHandler(async (request, response) => {
  const user = await usersService.getMe(request.user!.id);
  return response.json(user);
});
