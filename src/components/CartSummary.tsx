"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { CartItemWithDetails } from "@/lib/actions/cart";

interface CartSummaryProps {
  items: CartItemWithDetails[];
  isAuthenticated: boolean;
}

export default function CartSummary({
  items,
  isAuthenticated,
}: CartSummaryProps) {
  const { getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to auth page with return URL
      window.location.href = `/auth?redirect=${encodeURIComponent("/cart")}`;
      return;
    }

    // TODO: Implement checkout flow
    console.log("Proceed to checkout");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping > 0 && (
          <div className="text-xs text-green-600">
            Add ${(75 - subtotal).toFixed(2)} more for free shipping
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Checkout
      </button>

      {/* Continue Shopping */}
      <Link
        href="/products"
        className="block w-full text-center mt-3 text-gray-600 hover:text-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Security Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Secure checkout with SSL encryption
        </div>
      </div>
    </div>
  );
}
