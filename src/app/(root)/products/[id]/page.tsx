import { Suspense } from "react";
import Link from "next/link";
import { Heart, ImageOff } from "lucide-react";
import { getProduct } from "@/lib/actions/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import ColorSelector from "@/components/ColorSelector";
import ProductReviews from "@/components/ProductReviews";
import RecommendedProducts from "@/components/RecommendedProducts";
import AddToCart from "@/components/AddToCart";

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
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  // Get default variant - use first variant if available
  const defaultVariant =
    product.variants && product.variants.length > 0
      ? (product.variants[0] as Record<string, unknown>)
      : null;

  // Get primary image
  const primaryImage =
    product.images && product.images.length > 0
      ? ((product.images[0] as Record<string, unknown>)?.url as string)
      : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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

            {/* Price & Discount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  $
                  {String(
                    (defaultVariant as Record<string, unknown>)?.salePrice ||
                      (defaultVariant as Record<string, unknown>)?.price ||
                      ((product as Record<string, unknown>)
                        .minPrice as number) ||
                      0
                  )}
                </span>
                {Boolean(
                  (defaultVariant as Record<string, unknown>)?.salePrice
                ) &&
                  Boolean(
                    (defaultVariant as Record<string, unknown>)?.price
                  ) && (
                    <span className="text-xl text-gray-500 line-through">
                      $
                      {String(
                        (defaultVariant as Record<string, unknown>).price
                      )}
                    </span>
                  )}
              </div>
              {Boolean(
                (defaultVariant as Record<string, unknown>)?.salePrice
              ) && (
                <p className="text-sm text-green-600 font-medium">
                  Extra 20% off w/ code SPORT
                </p>
              )}
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <Suspense
                fallback={
                  <div className="flex space-x-2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gray-200 rounded-full"
                      />
                    ))}
                  </div>
                }
              >
                <ColorSelector
                  variants={product.variants.map(
                    (v: Record<string, unknown>) => ({
                      id: v.id as string,
                      color: (v.color as Record<string, unknown>)
                        .name as string,
                      size: (v.size as Record<string, unknown>).name as string,
                      price: v.price as number,
                      salePrice: v.salePrice as number | undefined,
                      inStock: v.inStock as number,
                    })
                  )}
                  defaultVariant={
                    defaultVariant
                      ? {
                          id: (defaultVariant as Record<string, unknown>)
                            .id as string,
                          color: (
                            (defaultVariant as Record<string, unknown>)
                              .color as Record<string, unknown>
                          ).name as string,
                          size: (
                            (defaultVariant as Record<string, unknown>)
                              .size as Record<string, unknown>
                          ).name as string,
                          price: (defaultVariant as Record<string, unknown>)
                            .price as number,
                          salePrice: (defaultVariant as Record<string, unknown>)
                            .salePrice as number | undefined,
                          inStock: (defaultVariant as Record<string, unknown>)
                            .inStock as number,
                        }
                      : undefined
                  }
                />
              </Suspense>
            </div>

            {/* Size Picker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Select Size
                </h3>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Size Guide
                </button>
              </div>
              <Suspense
                fallback={
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded" />
                    ))}
                  </div>
                }
              >
                <SizePicker />
              </Suspense>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {defaultVariant && (
                <AddToCart
                  productVariantId={
                    (defaultVariant as Record<string, unknown>).id as string
                  }
                  productId={(product as Record<string, unknown>).id as string}
                  productName={
                    (product as Record<string, unknown>).name as string
                  }
                  productImage={primaryImage || ""}
                  color={
                    (
                      (defaultVariant as Record<string, unknown>)
                        .color as Record<string, unknown>
                    ).name as string
                  }
                  size={
                    (
                      (defaultVariant as Record<string, unknown>)
                        .size as Record<string, unknown>
                    ).name as string
                  }
                  price={
                    (defaultVariant as Record<string, unknown>).price as number
                  }
                  salePrice={
                    (defaultVariant as Record<string, unknown>).salePrice as
                      | number
                      | undefined
                  }
                  inStock={
                    (defaultVariant as Record<string, unknown>)
                      .inStock as number
                  }
                  className="w-full"
                />
              )}
              <button className="w-full border border-gray-300 text-gray-900 py-3 px-6 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Favorite</span>
              </button>
            </div>

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

      <Footer />
    </div>
  );
}
