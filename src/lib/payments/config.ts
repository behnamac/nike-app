// Which payment flow the checkout uses.
// "mock" (default): in-app fake checkout at /checkout, no real charges.
// "stripe": redirects to Stripe Checkout (needs STRIPE_SECRET_KEY + webhook).
export type PaymentMode = "mock" | "stripe";

export const PAYMENT_MODE: PaymentMode =
  process.env.NEXT_PUBLIC_PAYMENT_MODE === "stripe" ? "stripe" : "mock";

export const isMockPayments = PAYMENT_MODE === "mock";
