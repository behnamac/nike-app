"use client";

import Image from "next/image";
import Link from "next/link";

export default function TrendingNow() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trending Now
          </h2>
        </div>

        {/* Main Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="relative h-96 md:h-[500px] lg:h-[600px]">
            {/* Background Image */}
            <Image
              src="/trending-1.png"
              alt="Nike React Presto Collection"
              fill
              className="object-cover"
              priority
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-8 md:px-12">
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                  REACT PRESTO
                </h3>
                <p className="text-lg md:text-xl text-white mb-8 max-w-lg">
                  With React foam for the most comfortable Presto ever.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 border border-black"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card */}
          <div className="relative group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/trending-2.png"
                alt="Summer Must-Haves: Air Max Dia"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white text-xl md:text-2xl font-bold">
                  Summer Must-Haves: Air Max Dia
                </h4>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/trending-3.png"
                alt="Essential Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              <div className="absolute bottom-6 right-6">
                <h4 className="text-white text-xl md:text-2xl font-bold text-right">
                  Essential Collection
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
