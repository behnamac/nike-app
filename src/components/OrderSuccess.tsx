"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import { OrderWithDetails } from "@/lib/actions/orders";

interface OrderSuccessProps {
  order: OrderWithDetails;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CreditCard className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600">
          Thank you for your purchase. We&apos;ve sent you a confirmation email.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order Details
            </h3>
            <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-900">Order Date</p>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Total Amount</p>
            <p className="text-sm text-gray-600">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Items Ordered ({order.items.length})
          </h4>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 relative bg-gray-200 rounded-lg overflow-hidden">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {item.productName}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {item.color} • Size {item.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ${item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-900 mb-3">
          What&apos;s Next?
        </h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• You&apos;ll receive an email confirmation shortly</p>
          <p>• We&apos;ll notify you when your order ships</p>
          <p>• Track your order status in your account</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
