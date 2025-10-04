import Link from "next/link";
import { getRecommendedProducts } from "@/lib/actions/product";
import Card from "@/components/Card";

interface RecommendedProductsProps {
  productId: string;
}

export default async function RecommendedProducts({ productId }: RecommendedProductsProps) {
  const recommendedProducts = await getRecommendedProducts(productId);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedProducts.map((product) => {
          const priceDisplay =
            product.minPrice === product.maxPrice
              ? `$${product.minPrice}`
              : `$${product.minPrice} - $${product.maxPrice}`;

          return (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card
                title={product.name}
                category={product.category.name}
                colors={`${product.gender.label} • ${product.brand.name}`}
                price={priceDisplay}
                image={product.primaryImage || undefined}
                badge={
                  product.minPrice < product.maxPrice ? "Sale" : undefined
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
