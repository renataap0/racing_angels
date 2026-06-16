import { Prisma } from "@prisma/client";
import { AuthUser } from "../middlewares/authMiddleware";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { decimalToNumber, serializeOrder } from "../utils/serializers";

const orderInclude = {
  user: {
    select: {
      id: true,
      username: true,
      role: true
    }
  },
  items: {
    include: {
      product: true
    }
  }
};

function orderWhereForUser(user: AuthUser) {
  return user.role === "admin" ? {} : { userId: user.id };
}

export async function listOrders(user: AuthUser) {
  const orders = await prisma.order.findMany({
    where: orderWhereForUser(user),
    include: orderInclude,
    orderBy: { createdAt: "desc" }
  });

  return orders.map(serializeOrder);
}

export async function getOrder(id: number, user: AuthUser) {
  const order = await prisma.order.findFirst({
    where: { id, ...orderWhereForUser(user) },
    include: orderInclude
  });

  if (!order) {
    throw new AppError("Pedido nao encontrado.", 404);
  }

  return serializeOrder(order);
}

export async function createOrder(data: any, user: AuthUser) {
  const requestedQuantities = new Map<number, number>();

  data.items.forEach((item: any) => {
    requestedQuantities.set(item.productId, (requestedQuantities.get(item.productId) ?? 0) + item.quantity);
  });

  const productIds = Array.from(requestedQuantities.keys());
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      active: true
    }
  });

  if (products.length !== productIds.length) {
    throw new AppError("Um ou mais produtos nao foram encontrados.", 404);
  }

  const items = products.map((product) => {
    const quantity = requestedQuantities.get(product.id) ?? 0;

    if (product.stock < quantity) {
      throw new AppError(`Estoque insuficiente para ${product.name}.`, 409);
    }

    const unitPrice = Number(decimalToNumber(product.price));
    const total = unitPrice * quantity;

    return {
      product,
      quantity,
      unitPrice,
      total
    };
  });

  const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
  const shipping = subtotal >= 500 ? 0 : 39.9;
  const total = subtotal + shipping;
  const code = `RA-${Date.now().toString().slice(-8)}`;

  const order = await prisma.$transaction(async (transaction) => {
    for (const item of items) {
      await transaction.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return transaction.order.create({
      data: {
        code,
        userId: user.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerZip: data.customerZip,
        paymentMethod: data.paymentMethod,
        subtotal: new Prisma.Decimal(subtotal),
        shipping: new Prisma.Decimal(shipping),
        total: new Prisma.Decimal(total),
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            total: new Prisma.Decimal(item.total)
          }))
        }
      },
      include: orderInclude
    });
  });

  return serializeOrder(order);
}
