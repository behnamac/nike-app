"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Mock cart types
export interface MockCartItem {
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

export interface MockCart {
  items: MockCartItem[];
  id: string;
}

// Mock cart storage (in-memory for development)
const mockCarts = new Map<string, MockCart>();

// Helper function to get or create mock cart
async function getOrCreateMockCart(): Promise<{
  cartId: string;
  cart: MockCart;
}> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("mock_cart_id")?.value;

  if (!cartId) {
    // Create a new cart ID
    cartId = uuidv4();
    // Note: We can't set cookies in server components, but we can still use the cart
  }

  if (!mockCarts.has(cartId)) {
    mockCarts.set(cartId, {
      id: cartId,
      items: [],
    });
  }

  return {
    cartId,
    cart: mockCarts.get(cartId)!,
  };
}

// Mock cart actions
export async function getMockCart(): Promise<MockCartItem[]> {
  try {
    const { cart } = await getOrCreateMockCart();
    return cart.items;
  } catch (_error) {
    return [];
  }
}

export async function addMockCartItem(
  productVariantId: string,
  quantity: number,
  productDetails: {
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    size: string;
    price: number;
    salePrice?: number;
    inStock: number;
  }
): Promise<{ success: boolean; itemId?: string; error?: string }> {
  try {
    const { cart } = await getOrCreateMockCart();

    // Check if item already exists
    const existingItem = cart.items.find(
      (item) => item.productVariantId === productVariantId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      const newItem: MockCartItem = {
        id: uuidv4(),
        productVariantId,
        ...productDetails,
        quantity,
      };
      cart.items.push(newItem);
    }

    return {
      success: true,
      itemId: existingItem?.id || cart.items[cart.items.length - 1]?.id,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to add item to cart",
    };
  }
}

export async function updateMockCartItem(
  itemId: string,
  updates: { quantity?: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { cart } = await getOrCreateMockCart();
    const item = cart.items.find((item) => item.id === itemId);

    if (!item) {
      return {
        success: false,
        error: "Item not found",
      };
    }

    if (updates.quantity !== undefined) {
      item.quantity = updates.quantity;
    }

    return { success: true };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to update cart item",
    };
  }
}

export async function removeMockCartItem(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { cart } = await getOrCreateMockCart();
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        error: "Item not found",
      };
    }

    cart.items.splice(itemIndex, 1);
    return { success: true };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to remove cart item",
    };
  }
}

export async function clearMockCart(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { cart } = await getOrCreateMockCart();
    cart.items = [];
    return { success: true };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to clear cart",
    };
  }
}
