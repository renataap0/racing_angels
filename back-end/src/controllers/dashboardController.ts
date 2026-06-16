import * as dashboardService from "../services/dashboardService";
import { asyncHandler } from "../utils/asyncHandler";

export const summary = asyncHandler(async (_request, response) => {
  const result = await dashboardService.getDashboardSummary();
  return response.json(result);
});
