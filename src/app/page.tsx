"use client";

import { useEffect } from "react";
import { useProductStore } from "@/lib/store";
import Image from "next/image";

export default function Home() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg">Loading Nike products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Nike Store</h1>
            </div>
            <div className="text-sm text-gray-500">
              {products.length} products available
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {product.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  )}
                  {product.color && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {product.color}
                    </span>
                  )}
                  {product.size && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Size: {product.size}
                    </span>
                  )}
                </div>

                <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No products found
            </h2>
            <p className="text-gray-600">
              Check back later for new Nike products!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
