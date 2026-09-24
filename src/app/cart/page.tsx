import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import CartContent from "@/components/CartContent";

export default async function CartPage() {
  // Get current user to determine if checkout should redirect to auth
  const userResult = await getCurrentUser();
  const isAuthenticated = Boolean(userResult.success && userResult.data);

  const cartResult = await getCart();
  const cartItems = cartResult.success ? cartResult.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartContent initialItems={cartItems} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
