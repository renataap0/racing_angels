import { prisma } from "../config/prisma";
import { decimalToNumber } from "../utils/serializers";

const pointsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

function average(values: number[]) {
  const validValues = values.filter((value) => Number.isFinite(value));
  return validValues.length ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length : null;
}

function minBy<T>(items: T[], score: (item: T) => number | null) {
  return items.reduce<T | null>((best, item) => {
    const itemScore = score(item);
    const bestScore = best ? score(best) : null;

    if (itemScore === null) {
      return best;
    }

    if (bestScore === null || itemScore < bestScore) {
      return item;
    }

    return best;
  }, null);
}

function maxBy<T>(items: T[], score: (item: T) => number) {
  return items.reduce<T | null>((best, item) => (!best || score(item) > score(best) ? item : best), null);
}

async function loadRaces() {
  return prisma.race.findMany({
    include: { driver: true, team: true, track: true, car: true },
    orderBy: { bestLapMs: "asc" }
  });
}

export async function getDriverAnalytics() {
  const races = await loadRaces();
  const stats = new Map<number, any>();

  races.forEach((race, index) => {
    const current = stats.get(race.driverId) ?? {
      driver: race.driver,
      team: race.team,
      races: 0,
      laps: 0,
      points: 0,
      bestLapMs: Number.POSITIVE_INFINITY,
      avgBestLapSamples: [],
      consistencySamples: []
    };

    current.races += 1;
    current.laps += race.laps;
    current.points += pointsTable[index] ?? 1;
    current.bestLapMs = Math.min(current.bestLapMs, race.bestLapMs);
    current.avgBestLapSamples.push(race.bestLapMs);
    current.consistencySamples.push(Math.abs(race.lastLapMs - race.bestLapMs));
    stats.set(race.driverId, current);
  });

  return Array.from(stats.values())
    .map((item) => ({
      driver: item.driver,
      team: item.team,
      races: item.races,
      laps: item.laps,
      points: item.points,
      bestLapMs: item.bestLapMs,
      avgBestLapMs: average(item.avgBestLapSamples),
      consistencyMs: average(item.consistencySamples)
    }))
    .sort((first, second) => second.points - first.points || first.bestLapMs - second.bestLapMs);
}

export async function getTrackAnalytics() {
  const races = await loadRaces();
  const tracks = await prisma.track.findMany();

  return tracks
    .map((track) => {
      const trackRaces = races.filter((race) => race.trackId === track.id);
      const bestLapMs = average(trackRaces.map((race) => race.bestLapMs));
      const efficiency = Math.round(
        Math.max(1, Math.min(100, track.grip * 0.45 + (100 - track.abrasion) * 0.25 + track.sectors * 4 + trackRaces.length * 3))
      );

      return {
        track,
        races: trackRaces.length,
        totalLaps: trackRaces.reduce((sum, race) => sum + race.laps, 0),
        bestLapMs: trackRaces.length ? Math.min(...trackRaces.map((race) => race.bestLapMs)) : null,
        avgBestLapMs: bestLapMs,
        efficiency
      };
    })
    .sort((first, second) => second.efficiency - first.efficiency);
}

export async function getCarAnalytics() {
  const races = await loadRaces();
  const cars = await prisma.car.findMany({ include: { team: true, driver: true } });

  return cars
    .map((car) => {
      const carRaces = races.filter((race) => race.carId === car.id);
      const bestLapMs = carRaces.length ? Math.min(...carRaces.map((race) => race.bestLapMs)) : null;
      const technicalScore = (car.power / 11) * 0.25 + car.aero * 0.25 + car.reliability * 0.2 + car.tireCare * 0.15 + car.ers * 0.15;
      const raceBonus = carRaces.length ? Math.max(0, 12 - (bestLapMs ?? 0) / 10000) : 0;

      return {
        car,
        races: carRaces.length,
        bestLapMs,
        avgBestLapMs: average(carRaces.map((race) => race.bestLapMs)),
        score: Math.round(Math.max(1, Math.min(100, technicalScore + raceBonus)))
      };
    })
    .sort((first, second) => second.score - first.score);
}

export async function getRankings() {
  const [drivers, cars, tracks, races, laps] = await Promise.all([
    getDriverAnalytics(),
    getCarAnalytics(),
    getTrackAnalytics(),
    loadRaces(),
    prisma.seasonRoundLap.findMany()
  ]);

  const bestDriver = drivers[0] ?? null;
  const bestRace = minBy(races, (race) => race.bestLapMs);
  const bestCar = cars[0] ?? null;
  const bestTrack = minBy(tracks, (track) => track.avgBestLapMs);
  const mostConsistentDriver = minBy(drivers, (driver) => driver.consistencyMs);
  const mostEfficientTrack = maxBy(tracks, (track) => track.efficiency);

  const raceLapTotal = races.reduce((sum, race) => sum + race.laps, 0);

  return {
    best_driver: bestDriver,
    best_lap: bestRace
      ? {
          race: bestRace.name,
          bestLapMs: bestRace.bestLapMs,
          driver: bestRace.driver,
          track: bestRace.track,
          car: bestRace.car
        }
      : null,
    best_car: bestCar,
    best_track: bestTrack,
    most_consistent_driver: mostConsistentDriver,
    most_efficient_track: mostEfficientTrack,
    total_races: races.length,
    total_laps: raceLapTotal || laps.length,
    avg_best_lap_ms: average(races.map((race) => race.bestLapMs)),
    top_drivers: drivers.slice(0, 5),
    top_cars: cars.slice(0, 5),
    top_tracks: tracks.slice(0, 5)
  };
}

export async function getAnalytics() {
  const [drivers, tracks, cars, rankings] = await Promise.all([
    getDriverAnalytics(),
    getTrackAnalytics(),
    getCarAnalytics(),
    getRankings()
  ]);

  return {
    drivers,
    tracks,
    cars,
    rankings
  };
}

export async function getSalesSummary() {
  const orders = await prisma.order.findMany();
  const revenue = orders.reduce((sum, order) => sum + Number(decimalToNumber(order.total)), 0);

  return {
    totalOrders: orders.length,
    revenue
  };
}
