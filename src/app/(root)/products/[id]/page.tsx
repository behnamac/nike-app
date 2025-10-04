import { Suspense } from "react";
import Link from "next/link";
import { Star, Heart, ImageOff } from "lucide-react";
import { mockProducts } from "@/lib/data/mock-products";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import ColorSelector from "@/components/ColorSelector";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find the product by ID (using mock data)
  const product = mockProducts.find((p) => p.id === id);

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

  // Get related products (excluding current product)
  const relatedProducts = mockProducts.filter((p) => p.id !== id).slice(0, 3);

  // Get default variant
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ||
    product.variants[0];

  // Get primary image
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

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
                images={product.images}
                defaultImage={primaryImage}
              />
            </Suspense>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {product.gender.charAt(0).toUpperCase() +
                  product.gender.slice(1)}
                &apos;s Shoes
              </p>
            </div>

            {/* Price & Discount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${defaultVariant.salePrice || defaultVariant.price}
                </span>
                {defaultVariant.salePrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${defaultVariant.price}
                  </span>
                )}
              </div>
              {defaultVariant.salePrice && (
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
                  variants={product.variants}
                  defaultVariant={defaultVariant}
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
              <button className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                Add to Bag
              </button>
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

              <CollapsibleSection title="Reviews (10)" isExpanded={false}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.8 out of 5</span>
                </div>
                <p className="text-sm text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relatedDefaultVariant =
                relatedProduct.variants.find(
                  (v) => v.id === relatedProduct.defaultVariantId
                ) || relatedProduct.variants[0];
              const relatedPrimaryImage =
                relatedProduct.images.find((img) => img.isPrimary) ||
                relatedProduct.images[0];

              return (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                >
                  <Card
                    title={relatedProduct.name}
                    category={
                      relatedProduct.category.charAt(0).toUpperCase() +
                      relatedProduct.category.slice(1)
                    }
                    colors={`${relatedDefaultVariant.color.charAt(0).toUpperCase() + relatedDefaultVariant.color.slice(1)} • Size ${relatedDefaultVariant.size}`}
                    price={`$${relatedDefaultVariant.salePrice || relatedDefaultVariant.price}`}
                    image={relatedPrimaryImage?.url}
                    badge={
                      relatedDefaultVariant.salePrice
                        ? "Sale"
                        : relatedDefaultVariant.inStock > 20
                          ? "Best Seller"
                          : undefined
                    }
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
