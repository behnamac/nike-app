"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/product";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  gender: {
    id: string;
    label: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  minPrice: number;
  maxPrice: number;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  variants: Array<{
    id: string;
    price: number;
    salePrice: number | null;
    color: {
      id: string;
      name: string;
      slug: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
      slug: string;
      sortOrder: number;
    };
    inStock: number;
  }>;
}

export default function BestOfAirMax() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch top 12 products - try broader search first
        let result = await getAllProducts({
          search: "Air Max",
          limit: 12,
          sortBy: "created_at_desc",
        });

        // If we don't have enough Air Max products, get any products
        if (result.products.length < 8) {
          console.log("Not enough Air Max products, fetching all products...");
          result = await getAllProducts({
            limit: 12,
            sortBy: "created_at_desc",
          });
        }

        console.log("Fetched products:", result.products);
        console.log("First product structure:", result.products[0]);

        setProducts(result.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320, // Scroll by one card width
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320, // Scroll by one card width
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading best shoes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              No products found. Check back later for new arrivals!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover our top-rated collection, featuring the latest styles and
              classic favorites.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product, index) => {
              const primaryImage =
                product.images?.find((img) => img.isPrimary) ||
                product.images?.[0];
              const minPrice = product.minPrice || 0;
              const maxPrice = product.maxPrice || 0;
              const variants = product.variants || [];
              const hasSale = variants.some(
                (v) => v.salePrice && v.salePrice < v.price
              );
              const salePrice = variants.find((v) => v.salePrice)?.salePrice;

              // Get unique colors count
              const uniqueColors = new Set(
                variants.map((v) => v.color?.name).filter(Boolean)
              ).size;

              // Determine badge
              let badge = null;
              if (index === 0) {
                badge = { text: "Best Seller", color: "bg-red-500" };
              } else if (hasSale) {
                const discount = salePrice
                  ? Math.round(((minPrice - salePrice) / minPrice) * 100)
                  : 0;
                badge = {
                  text: `Extra ${discount}% off`,
                  color: "bg-green-500",
                };
              }

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}

                    {/* Badge */}
                    {badge && (
                      <div
                        className={`absolute top-4 left-4 ${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {badge.text}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2">
                      {product.gender.label}'s Shoes
                    </p>

                    <p className="text-sm text-gray-500 mb-4">
                      {uniqueColors} Colour{uniqueColors !== 1 ? "s" : ""}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      {hasSale && salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            ${salePrice.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${minPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          {minPrice === maxPrice
                            ? `$${minPrice.toFixed(2)}`
                            : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
                        </span>
                      )}
                    </div>

                    {/* View Product Button */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full bg-black text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
