import { getCart, CartItemWithDetails } from "@/lib/actions/cart";
import { getMockCart } from "@/lib/actions/mock-cart";
import { getCurrentUser } from "@/lib/auth/actions";
import CartContent from "@/components/CartContent";

export default async function CartPage() {
  // Get current user to determine if checkout should redirect to auth
  const userResult = await getCurrentUser();
  const isAuthenticated = Boolean(userResult.success && userResult.data);

  // Get cart items - try database first, fallback to mock cart.
  // An empty DB result also falls back: items added while the DB was
  // unavailable (or with non-UUID mock variant ids) only live in the mock cart.
  let cartItems: CartItemWithDetails[] = [];
  try {
    const cartResult = await getCart();
    if (cartResult.success) {
      cartItems = cartResult.data || [];
    }
  } catch {}

  if (cartItems.length === 0) {
    cartItems = await getMockCart();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartContent initialItems={cartItems} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
