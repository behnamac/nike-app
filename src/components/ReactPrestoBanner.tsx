"use client";

import Image from "next/image";
import Link from "next/link";

export default function ReactPrestoBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left Section - White Background with Text */}
          <div className="flex items-center justify-center py-12 w-[50%] relative">
            <div className="max-w-lg">
              {/* Headline */}
              <div className="text-pink-600 font-bold text-sm uppercase tracking-wide mb-4">
                Bold & Sporty
              </div>

              {/* Main Title */}
              <div className="text-6xl font-semibold text-black uppercase leading-tight w-full mb-6">
                <span className="block">NIKE REACT</span>
                <span className="block">PRESTO BY YOU</span>
              </div>

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

          {/* Back Shoe */}
          <div className="w-[50%] h-full">
            <Image
              src="/feature.png"
              alt="Nike React Presto - Back View"
              width={1000}
              height={1000}
              className="object-contain drop-shadow-2xl w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
