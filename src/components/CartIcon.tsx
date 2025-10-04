"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

export default function CartIcon() {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
