import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  category: string | null;
  brand: string;
  size: string | null;
  color: string | null;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      set({ products, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },
}));
