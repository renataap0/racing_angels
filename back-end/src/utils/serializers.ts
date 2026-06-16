type DecimalLike = {
  toNumber?: () => number;
  toString?: () => string;
};

export function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "number") {
    return value;
  }

  const decimal = value as DecimalLike;

  if (typeof decimal.toNumber === "function") {
    return decimal.toNumber();
  }

  return Number(decimal.toString?.() ?? value);
}

export function serializeProduct<T extends { price: unknown }>(product: T) {
  return {
    ...product,
    price: decimalToNumber(product.price)
  };
}

export function serializeOrder(order: any) {
  return {
    ...order,
    subtotal: decimalToNumber(order.subtotal),
    shipping: decimalToNumber(order.shipping),
    total: decimalToNumber(order.total),
    items: order.items?.map((item: any) => ({
      ...item,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total),
      product: item.product ? serializeProduct(item.product) : item.product
    }))
  };
}
