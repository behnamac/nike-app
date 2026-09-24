import { redirect } from "next/navigation";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { isMockPayments } from "@/lib/payments/config";
import MockCheckoutForm from "@/components/MockCheckoutForm";

export default async function CheckoutPage() {
  // Stripe mode has its own hosted checkout page
  if (!isMockPayments) redirect("/cart");

  const cartResult = await getCart();
  const items = cartResult.success ? cartResult.data || [] : [];
  if (items.length === 0) redirect("/cart");

  const userResult = await getCurrentUser();
  const email =
    userResult.success && userResult.data ? userResult.data.user.email : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <MockCheckoutForm items={items} defaultEmail={email} />
      </div>
    </div>
  );
}
