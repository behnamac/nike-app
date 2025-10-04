import { Suspense } from "react";
import { parseProductFilters } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Await searchParams
  const resolvedSearchParams = await searchParams;

  // Convert searchParams to URLSearchParams format
  const urlSearchParams = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.append(key, value);
      }
    }
  });

  // Parse filters from URL
  const filters = parseProductFilters(urlSearchParams);

  // Fetch products from database
  const { products: sortedProducts } = await getAllProducts(filters);

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
                  <Sort initialSort={filters.sortBy || "created_at_desc"} />
                </Suspense>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.genderId?.map((genderId) => (
                    <span
                      key={genderId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      Gender: {genderId}
                    </span>
                  ))}
                  {filters.colorId?.map((colorId) => (
                    <span
                      key={colorId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      Color: {colorId}
                    </span>
                  ))}
                  {filters.sizeId?.map((sizeId) => (
                    <span
                      key={sizeId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      Size: {sizeId}
                    </span>
                  ))}
                  {filters.priceMin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      Min: ${filters.priceMin}
                    </span>
                  )}
                  {filters.priceMax && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      Max: ${filters.priceMax}
                    </span>
                  )}
                  {filters.categoryId?.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                    >
                      Category: {categoryId}
                    </span>
                  ))}
                  {filters.brandId?.map((brandId) => (
                    <span
                      key={brandId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                    >
                      Brand: {brandId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                  const primaryImage =
                    product.primaryImage || product.images[0]?.url;
                  const priceDisplay =
                    product.minPrice === product.maxPrice
                      ? `$${product.minPrice}`
                      : `$${product.minPrice} - $${product.maxPrice}`;

                  return (
                    <Card
                      key={product.id}
                      title={product.name}
                      category={product.category.name}
                      colors={`${product.gender.label} • ${product.brand.name}`}
                      price={priceDisplay}
                      image={primaryImage}
                      badge={
                        product.minPrice < product.maxPrice ? "Sale" : undefined
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
