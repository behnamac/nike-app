import Link from "next/link";
import Image from "next/image";
import ShoeScene from "./ShoeScene";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-pink-50 overflow-hidden">
      {/* Background with tropical gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-pink-50">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-60"></div>
        {/* Tropical overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-pink-100/20"></div>
      </div>

      {/* 3D Scene - Desktop Only */}
      <div className="absolute inset-0 w-full h-full z-10 hidden lg:block">
        <div className="w-full h-full flex">
          {/* Left side - empty space for text */}
          <div className="w-1/2 h-full"></div>
          {/* Right side - 3D model */}
          <div className="w-full translate-x-20 h-full">
            <ShoeScene className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Static Image - Mobile Only */}
      <div className="absolute inset-0 w-full h-full z-10 lg:hidden">
        <div className="w-full h-full flex">
          {/* Left side - empty space for text */}
          <div className="w-1/2 h-full"></div>
          {/* Right side - Static image */}
          <div className="w-1/2 h-full flex justify-center items-center">
            <Image
              src="/hero-shoe.png"
              alt="Nike Air Jordan"
              width={400}
              height={400}
              className="object-contain w-full h-full max-w-sm"
              priority
            />
          </div>
        </div>
      </div>

      {/* Text Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="container mx-auto px-6 md:px-2 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
            {/* Left Section - Text Content */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Bold & Sporty tag */}
              <div className="text-pink-600 font-medium text-xs sm:text-sm tracking-wide uppercase">
                Bold & Sporty
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-slate-800">Style That Moves</span>
                <span className="block text-blue-900">With You.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 max-w-lg leading-relaxed">
                Not just style. Not just comfort. Footwear that effortlessly
                moves with your every step.
              </p>

              {/* CTA Button */}
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 sm:px-8 sm:py-4 rounded-3xl font-medium text-sm sm:text-base lg:text-lg hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto text-center pointer-events-auto"
              >
                Find Your Shoe
              </Link>
            </div>

            {/* Right Section - Brand Text Overlay */}
            <div className="relative order-1 lg:order-2 w-full h-[60vh] lg:h-[80vh]">
              {/* Brand Text "Dunk High" */}
              <div className="absolute -top-4 -left-2 sm:-top-6 sm:-left-3 lg:-top-8 lg:-left-4 text-4xl sm:text-6xl lg:text-8xl font-bold text-orange-500 z-30 drop-shadow-lg">
                Dunk High
              </div>

              {/* Brand Text "Hawaii" */}
              <div className="absolute -right-4 sm:-right-6 lg:-bottom-0 lg:-right-8 text-3xl sm:text-5xl lg:text-9xl font-bold text-blue-900 z-10 drop-shadow-lg">
                Hawaii
              </div>

              {/* Diagonal Tropical Graphic */}
              <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 lg:-bottom-16 lg:-right-16 w-32 h-16 sm:w-48 sm:h-24 lg:w-64 lg:h-32 bg-gradient-to-br from-pink-500 to-blue-500 transform rotate-12 opacity-80 z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
