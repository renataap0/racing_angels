import { z } from "zod";

const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const positiveInt = z.coerce.number().int().positive();
const nonNegativeInt = z.coerce.number().int().nonnegative();
const percent = z.coerce.number().int().min(0).max(100);

export const teamCreateSchema = z.object({
  name: text,
  country: optionalText,
  principal: optionalText,
  foundedYear: z.coerce.number().int().min(1900).max(2100).optional()
});

export const teamUpdateSchema = teamCreateSchema.partial();

export const driverCreateSchema = z.object({
  name: text,
  nationality: optionalText,
  status: z.string().trim().default("Titular"),
  number: z.coerce.number().int().positive().optional(),
  teamId: positiveInt.optional()
});

export const driverUpdateSchema = driverCreateSchema.partial();

export const carCreateSchema = z.object({
  model: text,
  code: optionalText,
  teamId: positiveInt,
  driverId: positiveInt.optional().nullable(),
  power: positiveInt,
  aero: percent,
  reliability: percent,
  tireCare: percent,
  ers: percent,
  topSpeed: positiveInt,
  weight: positiveInt,
  packageName: optionalText
});

export const carUpdateSchema = carCreateSchema.partial();

export const trackCreateSchema = z.object({
  name: text,
  country: text,
  city: text,
  lengthKm: z.coerce.number().positive(),
  turns: positiveInt,
  sectors: positiveInt,
  recordLapMs: positiveInt,
  grip: percent,
  elevation: nonNegativeInt,
  type: text,
  weather: text,
  abrasion: percent
});

export const trackUpdateSchema = trackCreateSchema.partial();

export const raceCreateSchema = z.object({
  name: text,
  status: z.string().trim().default("Agendada"),
  laps: positiveInt,
  bestLapMs: positiveInt,
  lastLapMs: positiveInt,
  raceDate: z.coerce.date().optional().nullable(),
  teamId: positiveInt.optional(),
  driverId: positiveInt,
  trackId: positiveInt,
  carId: positiveInt
});

export const raceUpdateSchema = raceCreateSchema.partial();

export const seasonCreateSchema = z.object({
  name: text,
  year: z.coerce.number().int().min(2000).max(2100),
  status: z.string().trim().default("Ativa")
});

export const seasonRoundCreateSchema = z.object({
  raceId: positiveInt.optional().nullable(),
  trackId: positiveInt,
  name: text,
  roundNumber: positiveInt,
  scheduledAt: z.coerce.date().optional().nullable()
});

export const seasonRoundLapCreateSchema = z.object({
  driverId: positiveInt,
  carId: positiveInt.optional().nullable(),
  lapNumber: positiveInt,
  lapTimeMs: positiveInt
});

export const productCreateSchema = z.object({
  name: text,
  description: optionalText,
  price: z.coerce.number().positive(),
  stock: nonNegativeInt,
  imageUrl: optionalText,
  active: z.boolean().optional()
});

export const productUpdateSchema = productCreateSchema.partial();

export const orderCreateSchema = z.object({
  customerName: text,
  customerEmail: z.string().email(),
  customerZip: z.string().trim().min(8),
  paymentMethod: text,
  items: z.array(
    z.object({
      productId: positiveInt,
      quantity: positiveInt
    })
  ).min(1)
});
