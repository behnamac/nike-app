"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { CartItemWithDetails } from "@/lib/actions/cart";

interface CartItemsProps {
  initialItems: CartItemWithDetails[];
}

export default function CartItems({ initialItems }: CartItemsProps) {
  const { items, updateItem, removeItem, setItems } = useCartStore();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Sync initial items with store
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems, setItems]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    setIsUpdating(itemId);
    try {
      await updateItem(itemId, { quantity: newQuantity });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-4">Add some items to get started</p>
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex space-x-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <Link href={`/products/${item.productId}`}>
                <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
                      {item.productName}
                    </h3>
                  </Link>

                  <div className="mt-1 text-sm text-gray-600">
                    <p>
                      {item.color && item.size && (
                        <>
                          {item.color} • Size {item.size}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ${item.salePrice || item.price}
                    </span>
                    {item.salePrice && item.salePrice < item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isUpdating === item.id}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={isUpdating === item.id || item.quantity <= 1}
                    className="p-1 rounded-md border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center font-medium">
                    {isUpdating === item.id ? "..." : item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={
                      isUpdating === item.id ||
                      item.quantity >= 10 ||
                      item.quantity >= item.inStock
                    }
                    className="p-1 rounded-md border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Warning */}
                {item.quantity >= item.inStock && (
                  <p className="text-sm text-orange-600">
                    Only {item.inStock} left in stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
