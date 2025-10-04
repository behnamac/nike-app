import Stripe from "stripe";

// Only initialize Stripe if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
      typescript: true,
    })
  : null;

export default stripe;
