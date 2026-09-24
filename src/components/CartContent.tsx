"use client";

import { Suspense, useEffect, useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { CartItemWithDetails } from "@/lib/actions/cart";
import CartItems from "@/components/CartItems";
import CartSummary from "@/components/CartSummary";
import EmptyCart from "@/components/EmptyCart";

interface CartContentProps {
  initialItems: CartItemWithDetails[];
  isAuthenticated: boolean;
}

export default function CartContent({
  initialItems,
  isAuthenticated,
}: CartContentProps) {
  const storeItems = useCartStore((state) => state.items);
  const [hydrated, setHydrated] = useState(false);

  // The persisted store only has its localStorage items after mount
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Server cart wins when it has items; otherwise show what the store holds
  // (e.g. items kept in the in-memory mock cart that the server lost on restart)
  const cartItems =
    initialItems.length > 0 || !hydrated ? initialItems : storeItems;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
          cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                    >
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <CartItems initialItems={initialItems} />
            </Suspense>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Suspense
              fallback={
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              }
            >
              <CartSummary items={cartItems} isAuthenticated={isAuthenticated} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
