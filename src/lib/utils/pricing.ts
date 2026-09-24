// All amounts are in dollars, matching the numeric columns in the DB.
export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_COST = 9.99;
export const TAX_RATE = 0.08;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateOrderTotals(
  items: { price: number; salePrice?: number; quantity: number }[]
): OrderTotals {
  const subtotal = round2(
    items.reduce(
      (total, item) => total + (item.salePrice || item.price) * item.quantity,
      0
    )
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = round2(subtotal * TAX_RATE);
  return { subtotal, shipping, tax, total: round2(subtotal + shipping + tax) };
}
