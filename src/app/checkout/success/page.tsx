import { Suspense } from "react";
import Link from "next/link";
import { getOrderBySessionId } from "@/lib/actions/orders";
import OrderSuccess from "@/components/OrderSuccess";

interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id as string;

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Session
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find your order. Please contact support if you
              need assistance.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get order details
  const orderResult = await getOrderBySessionId(sessionId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Order Confirmation
        </h1>

        {orderResult.success && orderResult.data ? (
          <Suspense
            fallback={
              <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            }
          >
            <OrderSuccess order={orderResult.data} />
          </Suspense>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find your order. This might be because:
            </p>
            <ul className="text-left max-w-md mx-auto text-gray-600 mb-6">
              <li>• The order is still being processed</li>
              <li>• The session ID is invalid</li>
              <li>• There was an error creating the order</li>
            </ul>
            <div className="space-x-4">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Continue Shopping
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
