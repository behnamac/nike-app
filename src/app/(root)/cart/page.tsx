import { Suspense } from "react";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItems from "@/components/CartItems";
import CartSummary from "@/components/CartSummary";
import EmptyCart from "@/components/EmptyCart";

export default async function CartPage() {
  // Get current user to determine if checkout should redirect to auth
  const userResult = await getCurrentUser();
  const isAuthenticated = Boolean(userResult.success && userResult.data);

  // Get cart items
  const cartResult = await getCart();
  const cartItems = cartResult.success ? cartResult.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <CartItems initialItems={cartItems} />
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
                <CartSummary
                  items={cartItems}
                  isAuthenticated={isAuthenticated}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
