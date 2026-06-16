import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.seasonRoundLap.deleteMany();
  await prisma.seasonRound.deleteMany();
  await prisma.season.deleteMany();
  await prisma.race.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.team.deleteMany();
  await prisma.track.deleteMany();
  await prisma.product.deleteMany();

  const racingAngels = await prisma.team.create({
    data: {
      name: "Racing Angels",
      country: "Brasil",
      principal: "Renata Alves",
      foundedYear: 2024
    }
  });

  const orionApex = await prisma.team.create({
    data: {
      name: "Orion Apex",
      country: "Japao",
      principal: "Haru Sato",
      foundedYear: 2023
    }
  });

  const lia = await prisma.driver.create({
    data: {
      name: "Lia Torres",
      nationality: "Brasil",
      status: "Titular",
      number: 7,
      teamId: racingAngels.id
    }
  });

  const nina = await prisma.driver.create({
    data: {
      name: "Nina Vale",
      nationality: "Portugal",
      status: "Titular",
      number: 11,
      teamId: racingAngels.id
    }
  });

  const kai = await prisma.driver.create({
    data: {
      name: "Kai Morita",
      nationality: "Japao",
      status: "Titular",
      number: 1,
      teamId: orionApex.id
    }
  });

  await prisma.user.createMany({
    data: [
      { username: "admin", password: passwordHash, role: "admin" },
      { username: "equipe", password: passwordHash, role: "team", teamId: racingAngels.id },
      { username: "corredor", password: passwordHash, role: "driver", teamId: racingAngels.id, driverId: lia.id }
    ]
  });

  const ra07 = await prisma.car.create({
    data: {
      model: "RA-07 Halo",
      code: "RA-07",
      teamId: racingAngels.id,
      driverId: lia.id,
      power: 1018,
      aero: 92,
      reliability: 94,
      tireCare: 86,
      ers: 88,
      topSpeed: 334,
      weight: 796,
      packageName: "Aero balanceado"
    }
  });

  const ra11 = await prisma.car.create({
    data: {
      model: "RA-11 Sprint",
      code: "RA-11",
      teamId: racingAngels.id,
      driverId: nina.id,
      power: 1006,
      aero: 88,
      reliability: 91,
      tireCare: 90,
      ers: 84,
      topSpeed: 329,
      weight: 798,
      packageName: "Tracao e pneus"
    }
  });

  const rax = await prisma.car.create({
    data: {
      model: "RA-X Reserve",
      code: "RA-X",
      teamId: racingAngels.id,
      power: 998,
      aero: 86,
      reliability: 96,
      tireCare: 84,
      ers: 82,
      topSpeed: 326,
      weight: 801,
      packageName: "Confiabilidade"
    }
  });

  const oa01 = await prisma.car.create({
    data: {
      model: "OA-01 Apex",
      code: "OA-01",
      teamId: orionApex.id,
      driverId: kai.id,
      power: 1002,
      aero: 87,
      reliability: 89,
      tireCare: 82,
      ers: 83,
      topSpeed: 328,
      weight: 800,
      packageName: "Reta longa"
    }
  });

  const tracks = await Promise.all([
    prisma.track.create({ data: { name: "Interlagos", country: "Brasil", city: "Sao Paulo", lengthKm: 4.309, turns: 15, sectors: 3, recordLapMs: 70540, grip: 86, elevation: 43, type: "Misto", weather: "Instavel", abrasion: 72 } }),
    prisma.track.create({ data: { name: "Monaco", country: "Monaco", city: "Monte Carlo", lengthKm: 3.337, turns: 19, sectors: 3, recordLapMs: 72908, grip: 78, elevation: 42, type: "Rua", weather: "Seco", abrasion: 48 } }),
    prisma.track.create({ data: { name: "Spa", country: "Belgica", city: "Stavelot", lengthKm: 7.004, turns: 19, sectors: 3, recordLapMs: 104210, grip: 83, elevation: 102, type: "Alta velocidade", weather: "Instavel", abrasion: 67 } }),
    prisma.track.create({ data: { name: "Suzuka", country: "Japao", city: "Suzuka", lengthKm: 5.807, turns: 18, sectors: 3, recordLapMs: 89771, grip: 84, elevation: 40, type: "Tecnico", weather: "Umido", abrasion: 62 } }),
    prisma.track.create({ data: { name: "Silverstone", country: "Reino Unido", city: "Towcester", lengthKm: 5.891, turns: 18, sectors: 3, recordLapMs: 87097, grip: 88, elevation: 11, type: "Rapido", weather: "Frio", abrasion: 58 } }),
    prisma.track.create({ data: { name: "Monza", country: "Italia", city: "Monza", lengthKm: 5.793, turns: 11, sectors: 3, recordLapMs: 81046, grip: 82, elevation: 12, type: "Alta velocidade", weather: "Seco", abrasion: 52 } }),
    prisma.track.create({ data: { name: "Bahrain", country: "Bahrein", city: "Sakhir", lengthKm: 5.412, turns: 15, sectors: 3, recordLapMs: 91647, grip: 80, elevation: 17, type: "Deserto", weather: "Quente", abrasion: 74 } }),
    prisma.track.create({ data: { name: "Singapore", country: "Singapura", city: "Marina Bay", lengthKm: 4.94, turns: 19, sectors: 3, recordLapMs: 95200, grip: 76, elevation: 6, type: "Rua", weather: "Umido", abrasion: 55 } })
  ]);

  const [interlagos, monaco, spa, suzuka] = tracks;

  const races = await Promise.all([
    prisma.race.create({ data: { name: "Interlagos GP", status: "Finalizada", laps: 42, bestLapMs: 81348, lastLapMs: 82005, teamId: racingAngels.id, driverId: lia.id, trackId: interlagos.id, carId: ra07.id, raceDate: new Date("2026-03-10T18:00:00.000Z") } }),
    prisma.race.create({ data: { name: "Monaco Night Run", status: "Finalizada", laps: 39, bestLapMs: 72908, lastLapMs: 73210, teamId: racingAngels.id, driverId: nina.id, trackId: monaco.id, carId: ra11.id, raceDate: new Date("2026-04-05T20:00:00.000Z") } }),
    prisma.race.create({ data: { name: "Spa Aero Test", status: "Treino", laps: 31, bestLapMs: 104210, lastLapMs: 105010, teamId: racingAngels.id, driverId: lia.id, trackId: spa.id, carId: rax.id, raceDate: new Date("2026-05-12T15:00:00.000Z") } }),
    prisma.race.create({ data: { name: "Suzuka Data Cup", status: "Finalizada", laps: 36, bestLapMs: 89771, lastLapMs: 90402, teamId: orionApex.id, driverId: kai.id, trackId: suzuka.id, carId: oa01.id, raceDate: new Date("2026-06-02T10:00:00.000Z") } })
  ]);

  const season = await prisma.season.create({
    data: {
      name: "CorridaPro Series",
      year: 2026,
      status: "Ativa"
    }
  });

  for (let index = 0; index < races.length; index += 1) {
    const round = await prisma.seasonRound.create({
      data: {
        seasonId: season.id,
        raceId: races[index].id,
        trackId: races[index].trackId,
        name: races[index].name,
        roundNumber: index + 1,
        scheduledAt: races[index].raceDate
      }
    });

    await prisma.seasonRoundLap.createMany({
      data: [
        { seasonRoundId: round.id, driverId: races[index].driverId, carId: races[index].carId, lapNumber: 1, lapTimeMs: races[index].bestLapMs + 920 },
        { seasonRoundId: round.id, driverId: races[index].driverId, carId: races[index].carId, lapNumber: 2, lapTimeMs: races[index].bestLapMs },
        { seasonRoundId: round.id, driverId: races[index].driverId, carId: races[index].carId, lapNumber: 3, lapTimeMs: races[index].lastLapMs }
      ]
    });
  }

  await prisma.product.createMany({
    data: [
      { name: "Camisa Team Carbon", description: "Camisa oficial preta com detalhes dourados Racing Angels.", price: 189.9, stock: 50, imageUrl: "assets/shop/image (2).png", active: true },
      { name: "Bone Halo Apex", description: "Bone de paddock com aba curva e logo bordado.", price: 119.9, stock: 40, imageUrl: "assets/shop/image (3).png", active: true },
      { name: "Jaqueta Pit Lane", description: "Jaqueta leve para viagem e area tecnica.", price: 349.9, stock: 24, imageUrl: "assets/shop/image (4).png", active: true },
      { name: "Miniatura RA-07 Halo", description: "Modelo colecionavel do carro RA-07.", price: 259.9, stock: 30, imageUrl: "assets/shop/image (5).png", active: true }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
