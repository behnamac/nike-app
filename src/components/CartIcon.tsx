"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

/** Dispatch after something lands in the bag to make the icon wiggle and the badge pop. */
export const CART_BUMP_EVENT = "cart:bump";

export default function CartIcon() {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const iconRef = useRef<HTMLAnchorElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bump = () => {
      badgeRef.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }],
        { duration: 450, easing: "cubic-bezier(.3,1.6,.5,1)" }
      );
      iconRef.current?.animate(
        [
          { transform: "rotate(0)" },
          { transform: "rotate(-12deg)" },
          { transform: "rotate(8deg)" },
          { transform: "rotate(0)" },
        ],
        { duration: 500 }
      );
    };
    window.addEventListener(CART_BUMP_EVENT, bump);
    return () => window.removeEventListener(CART_BUMP_EVENT, bump);
  }, []);

  return (
    <Link
      ref={iconRef}
      href="/cart"
      data-cart-icon
      className="relative w-11 h-11 rounded-full flex items-center justify-center text-dark-900 hover:bg-light-200 transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-[22px] h-[22px]" />
      {totalItems > 0 && (
        <span
          ref={badgeRef}
          className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-[5px] rounded-full bg-red text-white text-[11px] font-semibold flex items-center justify-center"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
