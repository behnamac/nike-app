"use server";

import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  productVariants,
  products,
  colors,
  sizes,
  productImages,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/actions";
import { eq, and, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

// Types
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface CartItemWithDetails {
  id: string;
  productVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  quantity: number;
  inStock: number;
}

export interface NewCartItemInput {
  productVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  inStock: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity?: number;
  productVariantId?: string;
}

// Validation schemas
const addCartItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(10).optional(),
  productVariantId: z.string().uuid().optional(),
});

// Helper function to get or create cart
async function getOrCreateCart(): Promise<ActionResult<{ cartId: string }>> {
  try {
    const userResult = await getCurrentUser();
    const cookieStore = await cookies();

    let cartId: string;

    if (userResult.success && userResult.data) {
      // User is logged in - find or create user cart
      const [existingCart] = await db
        .select({ id: carts.id })
        .from(carts)
        .where(eq(carts.userId, userResult.data.user.id))
        .limit(1);

      if (existingCart) {
        cartId = existingCart.id;
      } else {
        // Create new cart for user
        const [newCart] = await db
          .insert(carts)
          .values({
            userId: userResult.data.user.id,
            guestId: null,
          })
          .returning({ id: carts.id });

        cartId = newCart.id;
      }
    } else {
      // Guest user - find or create guest cart
      const guestSessionToken = cookieStore.get("guest_session")?.value;

      if (!guestSessionToken) {
        // For server components, we can't create guest IDs, so return empty cart
        return {
          success: true,
          data: { cartId: "empty" },
        };
      }

      const [existingCart] = await db
        .select({ id: carts.id })
        .from(carts)
        .where(eq(carts.guestId, guestSessionToken))
        .limit(1);

      if (existingCart) {
        cartId = existingCart.id;
      } else {
        // Create new cart for guest
        const [newCart] = await db
          .insert(carts)
          .values({
            userId: null,
            guestId: guestSessionToken,
          })
          .returning({ id: carts.id });

        cartId = newCart.id;
      }
    }

    return {
      success: true,
      data: { cartId },
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to get or create cart",
    };
  }
}

// Server Actions
export async function getCart(): Promise<ActionResult<CartItemWithDetails[]>> {
  try {
    const cartResult = await getOrCreateCart();

    if (!cartResult.success || !cartResult.data) {
      return {
        success: false,
        error: cartResult.error || "Failed to get cart",
      };
    }

    // Handle empty cart case
    if (cartResult.data.cartId === "empty") {
      return {
        success: true,
        data: [],
      };
    }

    const cartItemsWithDetails = await db
      .select({
        id: cartItems.id,
        productVariantId: cartItems.productVariantId,
        quantity: cartItems.quantity,
        productId: products.id,
        productName: products.name,
        productImage: productImages.url,
        color: colors.name,
        size: sizes.name,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        inStock: productVariants.inStock,
      })
      .from(cartItems)
      .innerJoin(
        productVariants,
        eq(cartItems.productVariantId, productVariants.id)
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
      .where(eq(cartItems.cartId, cartResult.data.cartId))
      .orderBy(desc(cartItems.id));

    return {
      success: true,
      data: cartItemsWithDetails.map((item) => ({
        id: item.id,
        productVariantId: item.productVariantId,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage || "",
        color: item.color || "",
        size: item.size || "",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : undefined,
        quantity: item.quantity,
        inStock: item.inStock,
      })),
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to get cart items",
    };
  }
}

export async function addCartItem(
  data: z.infer<typeof addCartItemSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const validatedData = addCartItemSchema.parse(data);

    const cartResult = await getOrCreateCart();

    if (!cartResult.success || !cartResult.data) {
      return {
        success: false,
        error: cartResult.error || "Failed to get cart",
      };
    }

    // Check if item already exists in cart
    const [existingItem] = await db
      .select({ id: cartItems.id, quantity: cartItems.quantity })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartResult.data.cartId),
          eq(cartItems.productVariantId, validatedData.productVariantId)
        )
      )
      .limit(1);

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + validatedData.quantity;
      await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));

      return {
        success: true,
        data: { id: existingItem.id },
      };
    } else {
      // Add new item to cart
      const [newItem] = await db
        .insert(cartItems)
        .values({
          cartId: cartResult.data.cartId,
          productVariantId: validatedData.productVariantId,
          quantity: validatedData.quantity,
        })
        .returning({ id: cartItems.id });

      return {
        success: true,
        data: { id: newItem.id },
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: "Failed to add item to cart",
    };
  }
}

export async function updateCartItem(
  itemId: string,
  data: z.infer<typeof updateCartItemSchema>
): Promise<ActionResult<null>> {
  try {
    const validatedData = updateCartItemSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
      return {
        success: false,
        error: "No updates provided",
      };
    }

    await db
      .update(cartItems)
      .set(validatedData)
      .where(eq(cartItems.id, itemId));

    return {
      success: true,
      data: null,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to update cart item",
    };
  }
}

export async function removeCartItem(
  itemId: string
): Promise<ActionResult<null>> {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    return {
      success: true,
      data: null,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to remove cart item",
    };
  }
}

export async function clearCart(): Promise<ActionResult<null>> {
  try {
    const cartResult = await getOrCreateCart();

    if (!cartResult.success || !cartResult.data) {
      return {
        success: false,
        error: cartResult.error || "Failed to get cart",
      };
    }

    await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartResult.data.cartId));

    return {
      success: true,
      data: null,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to clear cart",
    };
  }
}

// Helper function to merge guest cart with user cart
export async function mergeGuestCartWithUserCart(
  guestSessionToken: string,
  userId: string
): Promise<ActionResult<null>> {
  try {
    // Find guest cart
    const [guestCart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.guestId, guestSessionToken))
      .limit(1);

    if (!guestCart) {
      return {
        success: true,
        data: null,
      };
    }

    // Find or create user cart
    const [userCart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    let userCartId: string;

    if (userCart) {
      userCartId = userCart.id;
    } else {
      // Create new cart for user
      const [newCart] = await db
        .insert(carts)
        .values({
          userId,
          guestId: null,
        })
        .returning({ id: carts.id });

      userCartId = newCart.id;
    }

    // Get guest cart items
    const guestItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, guestCart.id));

    // Merge items into user cart
    for (const item of guestItems) {
      // Check if item already exists in user cart
      const [existingItem] = await db
        .select({ id: cartItems.id, quantity: cartItems.quantity })
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, userCartId),
            eq(cartItems.productVariantId, item.productVariantId)
          )
        )
        .limit(1);

      if (existingItem) {
        // Update quantity
        await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + item.quantity })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        // Add new item
        await db.insert(cartItems).values({
          cartId: userCartId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        });
      }
    }

    // Delete guest cart
    await db.delete(carts).where(eq(carts.id, guestCart.id));

    return {
      success: true,
      data: null,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to merge guest cart",
    };
  }
}
