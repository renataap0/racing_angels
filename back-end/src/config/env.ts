import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3333,
  jwtSecret: process.env.JWT_SECRET || "troque_essa_chave"
};
