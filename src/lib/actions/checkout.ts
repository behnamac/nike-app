"use server";

import { stripe } from "@/lib/stripe/client";
import { getCart, clearCart } from "./cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { mergeGuestCartWithUserCart } from "@/lib/auth/actions";
import { cookies } from "next/headers";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { calculateOrderTotals } from "@/lib/utils/pricing";
import { createOrder } from "./orders";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createStripeCheckoutSession(
  cartId: string
): Promise<ActionResult<{ checkoutUrl: string }>> {
  try {
    if (!stripe) {
      return {
        success: false,
        error:
          "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.",
      };
    }
    // Get current user to determine if we need to merge guest cart
    const userResult = await getCurrentUser();
    const isAuthenticated = userResult.success && userResult.data;

    // If user is authenticated, merge guest cart with user cart
    if (isAuthenticated && userResult.data) {
      const cookieStore = await cookies();
      const guestSessionToken = cookieStore.get("guest_session")?.value;
      if (guestSessionToken) {
        await mergeGuestCartWithUserCart(
          guestSessionToken,
          userResult.data.user.id
        );
      }
    }

    // Get cart items
    const cartResult = await getCart();
    if (!cartResult.success || !cartResult.data) {
      return {
        success: false,
        error: "Failed to retrieve cart items",
      };
    }

    const items = cartResult.data;

    if (items.length === 0) {
      return {
        success: false,
        error: "Cart is empty",
      };
    }

    // Stripe expects cents
    const totals = calculateOrderTotals(items);
    const shipping = Math.round(totals.shipping * 100);
    const tax = Math.round(totals.tax * 100);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        // Cart items
        ...items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName,
              description: `${item.color} • Size ${item.size}`,
              images: item.productImage ? [item.productImage] : [],
            },
            unit_amount: Math.round((item.salePrice || item.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        // Shipping
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping",
              description:
                shipping === 0 ? "Free shipping" : "Standard shipping",
            },
            unit_amount: shipping,
          },
          quantity: 1,
        },
        // Tax
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tax",
              description: "Sales tax (8%)",
            },
            unit_amount: tax,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        cartId,
        userId:
          isAuthenticated && userResult.data ? userResult.data.user.id : null,
      },
      customer_email:
        isAuthenticated && userResult.data
          ? userResult.data.user.email
          : undefined,
    });

    return {
      success: true,
      data: {
        checkoutUrl: session.url!,
      },
    };
  } catch (error) {
    console.error("Create checkout session error:", error);
    return {
      success: false,
      error: "Failed to create checkout session",
    };
  }
}

// ---------------------------------------------------------------------------
// Mock payments (used while PAYMENT_MODE is "mock", see lib/payments/config.ts)
// ---------------------------------------------------------------------------

// Test cards: anything that passes the Luhn check succeeds, except these.
const DECLINED_CARD = "4000000000000002";
const INSUFFICIENT_FUNDS_CARD = "4000000000009995";

const passesLuhn = (digits: string) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
};

const mockCheckoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  fullName: z.string().trim().min(2, "Enter your full name"),
  address: z.string().trim().min(3, "Enter your street address"),
  city: z.string().trim().min(2, "Enter your city"),
  postalCode: z.string().trim().min(3, "Enter your postal code"),
  country: z.string().trim().min(2, "Enter your country"),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\d{13,19}$/.test(v) && passesLuhn(v), "Invalid card number"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY")
    .refine((v) => {
      const [mm, yy] = v.split("/").map(Number);
      // Card is valid through the end of its expiry month
      return new Date(2000 + yy, mm, 1) > new Date();
    }, "Card has expired"),
  cvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
});

export type MockCheckoutInput = z.input<typeof mockCheckoutSchema>;

export async function completeMockCheckout(
  input: MockCheckoutInput
): Promise<ActionResult<{ sessionId: string }>> {
  const parsed = mockCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Simulate processor latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (parsed.data.cardNumber === DECLINED_CARD) {
    return { success: false, error: "Your card was declined." };
  }
  if (parsed.data.cardNumber === INSUFFICIENT_FUNDS_CARD) {
    return { success: false, error: "Your card has insufficient funds." };
  }

  try {
    const userResult = await getCurrentUser();
    if (userResult.success && userResult.data) {
      const guestSessionToken = (await cookies()).get("guest_session")?.value;
      if (guestSessionToken) {
        await mergeGuestCartWithUserCart(
          guestSessionToken,
          userResult.data.user.id
        );
      }
    }

    // Stands in for the Stripe session id (the column is a uuid)
    const sessionId = uuidv4();
    const orderResult = await createOrder(sessionId);
    if (!orderResult.success) {
      return {
        success: false,
        error: orderResult.error || "Failed to create order",
      };
    }

    await clearCart();

    return { success: true, data: { sessionId } };
  } catch (error) {
    console.error("Mock checkout error:", error);
    return { success: false, error: "Failed to complete checkout" };
  }
}
