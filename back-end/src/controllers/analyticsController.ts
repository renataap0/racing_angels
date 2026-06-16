import * as analyticsService from "../services/analyticsService";
import { asyncHandler } from "../utils/asyncHandler";

export const getAnalytics = asyncHandler(async (_request, response) => {
  const analytics = await analyticsService.getAnalytics();
  return response.json(analytics);
});

export const getDriversAnalytics = asyncHandler(async (_request, response) => {
  const drivers = await analyticsService.getDriverAnalytics();
  return response.json(drivers);
});

export const getTracksAnalytics = asyncHandler(async (_request, response) => {
  const tracks = await analyticsService.getTrackAnalytics();
  return response.json(tracks);
});

export const getCarsAnalytics = asyncHandler(async (_request, response) => {
  const cars = await analyticsService.getCarAnalytics();
  return response.json(cars);
});

export const getRankings = asyncHandler(async (_request, response) => {
  const rankings = await analyticsService.getRankings();
  return response.json(rankings);
});
