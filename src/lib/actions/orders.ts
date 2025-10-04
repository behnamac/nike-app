"use server";

import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  productVariants,
  products,
  colors,
  sizes,
  productImages,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/actions";
import { getCart } from "./cart";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OrderWithDetails {
  id: string;
  userId: string | null;
  guestId: string | null;
  stripeSessionId: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  createdAt: Date;
  items: {
    id: string;
    productVariantId: string;
    quantity: number;
    priceAtPurchase: number;
    productName: string;
    productImage: string;
    color: string;
    size: string;
  }[];
}

export async function createOrder(
  stripeSessionId: string,
  userId?: string
): Promise<ActionResult<OrderWithDetails>> {
  try {
    // Get current user if not provided
    let finalUserId = userId;
    let guestId: string | null = null;

    if (!finalUserId) {
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        finalUserId = userResult.data.user.id;
      } else {
        // Guest user - get or create guest ID
        const cookieStore = await cookies();
        guestId = cookieStore.get("guest_session")?.value || uuidv4();
        if (!cookieStore.get("guest_session")) {
          cookieStore.set("guest_session", guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }
      }
    }

    // Get cart items for this user/guest
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

    // Calculate total amount
    const subtotal = items.reduce(
      (total, item) => total + (item.salePrice || item.price) * item.quantity,
      0
    );
    const shipping = subtotal >= 7500 ? 0 : 999; // $75.00 in cents
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const totalAmount = subtotal + shipping + tax;

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: finalUserId,
        guestId: guestId,
        stripeSessionId,
        status: "paid",
        totalAmount: (totalAmount / 100).toString(), // Convert from cents to dollars and to string
      })
      .returning();

    // Create order items
    const orderItemsData = items.map((item) => ({
      orderId: newOrder.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceAtPurchase: ((item.salePrice || item.price) / 100).toString(), // Convert from cents to dollars and to string
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Get order with details
    const orderWithDetails = await getOrder(newOrder.id);
    if (!orderWithDetails.success || !orderWithDetails.data) {
      return {
        success: false,
        error: "Failed to retrieve created order",
      };
    }

    return {
      success: true,
      data: orderWithDetails.data,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
}

export async function getOrder(
  orderId: string
): Promise<ActionResult<OrderWithDetails>> {
  try {
    const order = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        guestId: orders.guestId,
        stripeSessionId: orders.stripeSessionId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Get order items with product details
    const orderItemsWithDetails = await db
      .select({
        id: orderItems.id,
        productVariantId: orderItems.productVariantId,
        quantity: orderItems.quantity,
        priceAtPurchase: orderItems.priceAtPurchase,
        productName: products.name,
        productImage: productImages.url,
        color: colors.name,
        size: sizes.name,
      })
      .from(orderItems)
      .innerJoin(
        productVariants,
        eq(orderItems.productVariantId, productVariants.id)
      )
      .innerJoin(products, eq(productVariants.productId, products.id))
      .leftJoin(colors, eq(productVariants.colorId, colors.id))
      .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .leftJoin(
        productImages,
        and(
          eq(productImages.productId, products.id),
          eq(productImages.isPrimary, true)
        )
      )
      .where(eq(orderItems.orderId, orderId));

    return {
      success: true,
      data: {
        ...order[0],
        totalAmount: Number(order[0].totalAmount),
        items: orderItemsWithDetails.map((item) => ({
          id: item.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          priceAtPurchase: Number(item.priceAtPurchase),
          productName: item.productName,
          productImage: item.productImage || "/placeholder-image.jpg",
          color: item.color || "",
          size: item.size || "",
        })),
      },
    };
  } catch (error) {
    console.error("Get order error:", error);
    return {
      success: false,
      error: "Failed to retrieve order",
    };
  }
}

export async function getOrderBySessionId(
  sessionId: string
): Promise<ActionResult<OrderWithDetails>> {
  try {
    const order = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        guestId: orders.guestId,
        stripeSessionId: orders.stripeSessionId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.stripeSessionId, sessionId))
      .limit(1);

    if (order.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return getOrder(order[0].id);
  } catch (error) {
    console.error("Get order by session ID error:", error);
    return {
      success: false,
      error: "Failed to retrieve order",
    };
  }
}
