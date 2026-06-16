import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { serializeProduct } from "../utils/serializers";

export async function listProducts(query: any) {
  const products = await prisma.product.findMany({
    where: {
      active: query.active === undefined ? undefined : String(query.active) === "true",
      name: query.name ? { contains: String(query.name) } : undefined
    },
    orderBy: { name: "asc" }
  });

  return products.map(serializeProduct);
}

export async function getProduct(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new AppError("Produto nao encontrado.", 404);
  }

  return serializeProduct(product);
}

function assertAdmin(user: AuthUser) {
  if (user.role !== "admin") {
    throw new AppError("Apenas admin pode gerenciar produtos.", 403);
  }
}

export async function createProduct(data: any, user: AuthUser) {
  assertAdmin(user);
  return serializeProduct(await prisma.product.create({ data }));
}

export async function updateProduct(id: number, data: any, user: AuthUser) {
  assertAdmin(user);
  return serializeProduct(await prisma.product.update({ where: { id }, data }));
}

export async function deleteProduct(id: number, user: AuthUser) {
  assertAdmin(user);
  return prisma.product.delete({ where: { id } });
}
