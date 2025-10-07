import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
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

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  updateItem: (
    id: string,
    updates: Partial<Pick<CartItem, "quantity" | "productVariantId">>
  ) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (newItem) => {
        set({ isLoading: true, error: null });

        try {
          // Try database first, fallback to mock cart
          try {
            const { addCartItem } = await import("@/lib/actions/cart");
            const result = await addCartItem({
              productVariantId: newItem.productVariantId,
              quantity: newItem.quantity,
            });

            if (result.success && result.data) {
              const item: CartItem = {
                id: result.data.id,
                ...newItem,
              };

              set((state) => ({
                items: [...state.items, item],
                isLoading: false,
              }));
              return;
            }
          } catch (dbError) {
            console.log("Database cart failed, using mock cart:", dbError);
          }

          // Fallback to mock cart
          const { addMockCartItem } = await import("@/lib/actions/mock-cart");
          const result = await addMockCartItem(
            newItem.productVariantId,
            newItem.quantity,
            {
              productId: newItem.productId,
              productName: newItem.productName,
              productImage: newItem.productImage,
              color: newItem.color,
              size: newItem.size,
              price: newItem.price,
              salePrice: newItem.salePrice,
              inStock: newItem.inStock,
            }
          );

          if (result.success && result.itemId) {
            const item: CartItem = {
              id: result.itemId,
              ...newItem,
            };

            set((state) => ({
              items: [...state.items, item],
              isLoading: false,
            }));
          } else {
            set({
              error: result.error || "Failed to add item to cart",
              isLoading: false,
            });
          }
        } catch {
          set({
            error: "Failed to add item to cart",
            isLoading: false,
          });
        }
      },

      updateItem: async (id, updates) => {
        set({ isLoading: true, error: null });

        try {
          // Try database first, fallback to mock cart
          try {
            const { updateCartItem } = await import("@/lib/actions/cart");
            const result = await updateCartItem(id, updates);

            if (result.success) {
              set((state) => ({
                items: state.items.map((item) =>
                  item.id === id ? { ...item, ...updates } : item
                ),
                isLoading: false,
              }));
              return;
            }
          } catch (dbError) {
            console.log(
              "Database cart update failed, using mock cart:",
              dbError
            );
          }

          // Fallback to mock cart
          const { updateMockCartItem } = await import(
            "@/lib/actions/mock-cart"
          );
          const result = await updateMockCartItem(id, updates);

          if (result.success) {
            set((state) => ({
              items: state.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
              ),
              isLoading: false,
            }));
          } else {
            set({
              error: result.error || "Failed to update item",
              isLoading: false,
            });
          }
        } catch {
          set({
            error: "Failed to update item",
            isLoading: false,
          });
        }
      },

      removeItem: async (id) => {
        set({ isLoading: true, error: null });

        try {
          // Try database first, fallback to mock cart
          try {
            const { removeCartItem } = await import("@/lib/actions/cart");
            const result = await removeCartItem(id);

            if (result.success) {
              set((state) => ({
                items: state.items.filter((item) => item.id !== id),
                isLoading: false,
              }));
              return;
            }
          } catch (dbError) {
            console.log(
              "Database cart remove failed, using mock cart:",
              dbError
            );
          }

          // Fallback to mock cart
          const { removeMockCartItem } = await import(
            "@/lib/actions/mock-cart"
          );
          const result = await removeMockCartItem(id);

          if (result.success) {
            set((state) => ({
              items: state.items.filter((item) => item.id !== id),
              isLoading: false,
            }));
          } else {
            set({
              error: result.error || "Failed to remove item",
              isLoading: false,
            });
          }
        } catch {
          set({
            error: "Failed to remove item",
            isLoading: false,
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });

        try {
          // Try database first, fallback to mock cart
          try {
            const { clearCart } = await import("@/lib/actions/cart");
            const result = await clearCart();

            if (result.success) {
              set({ items: [], isLoading: false });
              return;
            }
          } catch (dbError) {
            console.log(
              "Database cart clear failed, using mock cart:",
              dbError
            );
          }

          // Fallback to mock cart
          const { clearMockCart } = await import("@/lib/actions/mock-cart");
          const result = await clearMockCart();

          if (result.success) {
            set({ items: [], isLoading: false });
          } else {
            set({
              error: result.error || "Failed to clear cart",
              isLoading: false,
            });
          }
        } catch {
          set({
            error: "Failed to clear cart",
            isLoading: false,
          });
        }
      },

      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
