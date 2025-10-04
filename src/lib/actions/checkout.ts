"use server";

import { stripe } from "@/lib/stripe/client";
import { getCart } from "./cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { mergeGuestCartWithUserCart } from "@/lib/auth/actions";
import { cookies } from "next/headers";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createStripeCheckoutSession(
  cartId: string
): Promise<ActionResult<{ checkoutUrl: string }>> {
  try {
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

    // Calculate totals
    const subtotal = items.reduce(
      (total, item) => total + (item.salePrice || item.price) * item.quantity,
      0
    );
    const shipping = subtotal >= 7500 ? 0 : 999; // $75.00 in cents
    const tax = Math.round(subtotal * 0.08); // 8% tax

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
