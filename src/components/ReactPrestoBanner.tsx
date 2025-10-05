"use client";

import Image from "next/image";
import Link from "next/link";

export default function ReactPrestoBanner() {
  return (
    <section className="pb-12">
      <div className="container mx-auto px-4">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden">
          {/* Text Section */}
          <div className="text-center py-8">
            <div className="text-pink-600 font-bold text-sm uppercase tracking-wide mb-4">
              Bold & Sporty
            </div>
            <h2 className="text-3xl font-bold text-black uppercase leading-tight mb-4">
              <span className="block">NIKE REACT</span>
              <span className="block">PRESTO BY YOU</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-sm mx-auto">
              Take advantage of brand new, proprietary cushioning technology
              with a fresh pair of Nike react shoes.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-gray-800 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>

          {/* Image Section */}
          <div className="relative h-80 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl overflow-hidden">
            <Image
              src="/feature.png"
              alt="Nike React Presto"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex justify-between items-center">
          {/* Left Section - White Background with Text */}
          <div className="flex items-center justify-center py-12 w-[50%] relative">
            <div className="max-w-lg">
              {/* Headline */}
              <div className="text-pink-600 font-bold text-sm uppercase tracking-wide mb-4">
                Bold & Sporty
              </div>

              {/* Main Title */}
              <h2 className="text-6xl font-bold text-black uppercase leading-tight mb-6">
                <span className="block">NIKE REACT</span>
                <span className="block">PRESTO BY YOU</span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
                Take advantage of brand new, proprietary cushioning technology
                with a fresh pair of Nike react shoes.
              </p>

              {/* CTA Button */}
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="w-[50%] h-[50vh] relative">
            <Image
              src="/feature.png"
              alt="Nike React Presto"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
