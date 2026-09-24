"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { CartItemWithDetails } from "@/lib/actions/cart";
import { completeMockCheckout } from "@/lib/actions/checkout";
import { calculateOrderTotals } from "@/lib/utils/pricing";

interface MockCheckoutFormProps {
  items: CartItemWithDetails[];
  defaultEmail: string;
}

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

export default function MockCheckoutForm({
  items,
  defaultEmail,
}: MockCheckoutFormProps) {
  const router = useRouter();
  const setItems = useCartStore((state) => state.setItems);
  const [form, setForm] = useState({
    email: defaultEmail,
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { subtotal, shipping, tax, total } = calculateOrderTotals(items);

  const update =
    (field: keyof typeof form, format?: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [field]: format ? format(e.target.value) : e.target.value,
      }));

  const fillDemoDetails = () => {
    const nextYear = String((new Date().getFullYear() + 1) % 100).padStart(
      2,
      "0"
    );
    setForm({
      email: defaultEmail || "demo@example.com",
      fullName: "Jordan Demo",
      address: "1 Bowerman Dr",
      city: "Beaverton",
      postalCode: "97005",
      country: "United States",
      cardNumber: "4242 4242 4242 4242",
      expiry: `12/${nextYear}`,
      cvc: "123",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const result = await completeMockCheckout(form);
      if (result.success && result.data) {
        // Server cart is already cleared; sync the persisted client store
        setItems([]);
        router.push(`/checkout/success?session_id=${result.data.sessionId}`);
        return;
      }
      setError(result.error || "Payment failed");
    } catch {
      setError("Payment failed. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Demo checkout: no real payment is taken.</p>
          <button
            type="button"
            onClick={fillDemoDetails}
            className="flex-shrink-0 rounded-md bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Fill demo details
          </button>
        </div>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
          <input
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Full name"
              autoComplete="name"
              value={form.fullName}
              onChange={update("fullName")}
              className={`${inputClass} sm:col-span-2`}
            />
            <input
              required
              placeholder="Street address"
              autoComplete="street-address"
              value={form.address}
              onChange={update("address")}
              className={`${inputClass} sm:col-span-2`}
            />
            <input
              required
              placeholder="City"
              autoComplete="address-level2"
              value={form.city}
              onChange={update("city")}
              className={inputClass}
            />
            <input
              required
              placeholder="Postal code"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={update("postalCode")}
              className={inputClass}
            />
            <input
              required
              placeholder="Country"
              autoComplete="country-name"
              value={form.country}
              onChange={update("country")}
              className={`${inputClass} sm:col-span-2`}
            />
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              inputMode="numeric"
              placeholder="Card number"
              autoComplete="cc-number"
              value={form.cardNumber}
              onChange={update("cardNumber", formatCardNumber)}
              className={`${inputClass} col-span-2`}
            />
            <input
              required
              inputMode="numeric"
              placeholder="MM/YY"
              autoComplete="cc-exp"
              value={form.expiry}
              onChange={update("expiry", formatExpiry)}
              className={inputClass}
            />
            <input
              required
              inputMode="numeric"
              placeholder="CVC"
              autoComplete="cc-csc"
              maxLength={4}
              value={form.cvc}
              onChange={update("cvc", (v) => v.replace(/\D/g, ""))}
              className={inputClass}
            />
          </div>
        </section>
      </div>

      <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h2>

        <ul className="divide-y divide-gray-100 mb-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                {item.productImage && (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-medium text-gray-900 truncate">
                  {item.productName}
                </p>
                <p className="text-gray-500">
                  {item.color} • Size {item.size} • Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">
                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Lock className="w-4 h-4" />
          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </button>

        <Link
          href="/cart"
          className="block w-full text-center mt-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Back to cart
        </Link>
      </aside>
    </form>
  );
}
