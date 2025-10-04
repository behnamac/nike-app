"use client";

import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

interface AddToCartProps {
  productVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  inStock: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCart({
  productVariantId,
  productId,
  productName,
  productImage,
  color,
  size,
  price,
  salePrice,
  inStock,
  disabled = false,
  className = "",
}: AddToCartProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding || inStock <= 0) return;

    setIsAdding(true);
    try {
      await addItem({
        productVariantId,
        productId,
        productName,
        productImage,
        color,
        size,
        price,
        salePrice,
        quantity: 1,
        inStock,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = disabled || isAdding || inStock <= 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5 mr-2" />
          {inStock <= 0 ? "Out of Stock" : "Add to Bag"}
        </>
      )}
    </button>
  );
}
