import { Suspense } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { getProduct } from "@/lib/actions/product";
import ProductGallery from "@/components/ProductGallery";
import CollapsibleSection from "@/components/CollapsibleSection";
import ProductReviews from "@/components/ProductReviews";
import RecommendedProducts from "@/components/RecommendedProducts";
import ProductPurchasePanel, {
  type PurchaseVariant,
} from "@/components/ProductPurchasePanel";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Fetch product from database
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ImageOff className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get default variant - prefer the product's configured default, fall back
  // to the first variant
  const defaultVariant =
    product.variants?.find(
      (v: Record<string, unknown>) =>
        v.id === (product as Record<string, unknown>).default_variant_id
    ) ??
    (product.variants && product.variants.length > 0
      ? (product.variants[0] as Record<string, unknown>)
      : null);

  // Get primary image
  const primaryImage =
    product.images && product.images.length > 0
      ? ((product.images[0] as Record<string, unknown>)?.url as string)
      : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Gallery */}
          <div className="space-y-4">
            <Suspense
              fallback={
                <div className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg" />
                  <div className="flex space-x-2 mt-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-16 h-16 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              }
            >
              <ProductGallery
                images={product.images.map((img: Record<string, unknown>) => ({
                  id: img.id as string,
                  url: img.url as string,
                  isPrimary: (img.isPrimary as boolean) || false,
                  sortOrder: (img.sortOrder as number) || 0,
                }))}
                defaultImage={
                  primaryImage
                    ? {
                        id: "1",
                        url: primaryImage,
                        isPrimary: true,
                        sortOrder: 0,
                      }
                    : undefined
                }
              />
            </Suspense>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {(product as Record<string, unknown>).name as string}
              </h1>
              <p className="text-lg text-gray-600">
                {
                  (
                    (product as Record<string, unknown>).gender as Record<
                      string,
                      unknown
                    >
                  )?.label as string
                }
                &apos;s Shoes
              </p>
            </div>

            {defaultVariant && (
              <ProductPurchasePanel
                variants={product.variants as unknown as PurchaseVariant[]}
                defaultVariantId={
                  (defaultVariant as Record<string, unknown>).id as string
                }
                productId={(product as Record<string, unknown>).id as string}
                productName={
                  (product as Record<string, unknown>).name as string
                }
                productImage={primaryImage || ""}
              />
            )}

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection title="Product Details" isExpanded={true}>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    The Air Max 90 stays true to its running roots with the
                    iconic Waffle outsole, stitched overlays and classic TPU
                    details. An airy, lightweight upper combines with our
                    signature Air Max cushioning.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Padded collar</li>
                    <li>• Foam midsole</li>
                    <li>
                      • Shown: Dark Team Red/Platinum Tint/Pure Platinum/White
                    </li>
                    <li>• Style: HM9451-600</li>
                  </ul>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns" isExpanded={false}>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    Free shipping on orders over $75. Standard delivery takes
                    3-5 business days.
                  </p>
                  <p>Easy returns within 30 days of purchase.</p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Reviews" isExpanded={false}>
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 bg-gray-200 rounded"
                            />
                          ))}
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded" />
                      </div>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-full bg-gray-200 rounded" />
                            <div className="h-3 w-3/4 bg-gray-200 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <ProductReviews
                    productId={
                      (product as Record<string, unknown>).id as string
                    }
                  />
                </Suspense>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="mt-16">
          <Suspense
            fallback={
              <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded" />
                        <div className="h-6 w-16 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <RecommendedProducts
              productId={(product as Record<string, unknown>).id as string}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
