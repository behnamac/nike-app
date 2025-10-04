import { Suspense } from "react";
import { parseFilters } from "@/lib/utils/query";
import {
  mockProducts,
  filterProducts,
  sortProducts,
} from "@/lib/data/mock-products";
import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  // Convert searchParams to URLSearchParams format
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.append(key, value);
      }
    }
  });

  // Parse filters from URL
  const filters = parseFilters(urlSearchParams);

  // Filter and sort products
  const filteredProducts = filterProducts(mockProducts, filters);
  const sortedProducts = sortProducts(
    filteredProducts,
    filters.sort || "featured"
  );

  // Get active filter count for display
  const activeFilterCount = Object.values(filters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
                }
              >
                <Filters initialFilters={filters} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Products
                </h1>
                <p className="text-gray-600">
                  {sortedProducts.length} product
                  {sortedProducts.length !== 1 ? "s" : ""} found
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {activeFilterCount} filter
                      {activeFilterCount !== 1 ? "s" : ""} applied
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-200 h-10 w-32 rounded" />
                  }
                >
                  <Sort initialSort={filters.sort || "featured"} />
                </Suspense>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.gender?.map((gender) => (
                    <span
                      key={gender}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </span>
                  ))}
                  {filters.color?.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                  ))}
                  {filters.size?.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      Size {size}
                    </span>
                  ))}
                  {filters.price?.map((price) => (
                    <span
                      key={price}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                    >
                      {price === "200+" ? "$200+" : `$${price}`}
                    </span>
                  ))}
                  {filters.category?.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                  const defaultVariant =
                    product.variants.find(
                      (v) => v.id === product.defaultVariantId
                    ) || product.variants[0];
                  const primaryImage =
                    product.images.find((img) => img.isPrimary) ||
                    product.images[0];

                  return (
                    <Card
                      key={product.id}
                      title={product.name}
                      category={
                        product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)
                      }
                      colors={`${defaultVariant.color.charAt(0).toUpperCase() + defaultVariant.color.slice(1)} • Size ${defaultVariant.size}`}
                      price={`$${defaultVariant.salePrice || defaultVariant.price}`}
                      image={primaryImage?.url}
                      badge={
                        defaultVariant.salePrice
                          ? "Sale"
                          : defaultVariant.inStock > 20
                            ? "Best Seller"
                            : undefined
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters to see more products.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/products")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
