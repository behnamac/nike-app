import Link from "next/link";
import Image from "next/image";
import ShoeScene from "./ShoeScene";

export default function HeroSection() {
  return (
    <section className="relative  lg:min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-pink-50 overflow-hidden">
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

      {/* Mobile Layout - Clean Structure */}
      <div className="lg:hidden">
        {/* Text Content - Mobile Top */}
        <div className="relative z-20 px-4 py-8 text-center">
          <div className="space-y-4">
            {/* Bold & Sporty tag */}
            <div className="text-pink-600 font-medium text-xs tracking-wide uppercase">
              Bold & Sporty
            </div>

            {/* Main Title */}
            <h1 className="text-3xl font-bold leading-tight">
              <span className="block text-slate-800">Style That Moves</span>
              <span className="block text-blue-900">With You.</span>
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-700 max-w-sm mx-auto leading-relaxed">
              Not just style. Not just comfort. Footwear that effortlessly moves
              with your every step.
            </p>
          </div>
        </div>

        {/* Shoe Image - Mobile Middle */}
        <div className="relative z-10 px-4">
          <div className="flex justify-center relative">
            <Image
              src="/hero-shoe.png"
              alt="Nike Dunk High Hawaii"
              width={250}
              height={250}
              className="object-contain w-full max-w-sm"
              priority
            />

            {/* Mobile Brand Text "Dunk High" */}
            <div className="absolute top-2 left-4 md:top-4 md:left-8 lg:top-2 lg:left-10 text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 z-30 drop-shadow-lg">
              Dunk High
            </div>

            {/* Mobile Brand Text "Hawaii" */}
            <div className="absolute top-8 left-20 md:top-12 md:left-28 lg:top-12 lg:left-32 text-lg md:text-xl lg:text-2xl font-bold text-blue-900 z-10 drop-shadow-lg">
              Hawaii
            </div>
          </div>
        </div>

        {/* CTA Button - Mobile Bottom */}
        <div className="relative z-20 px-4 pt-10 pb-8 text-center">
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded-3xl font-medium text-sm hover:bg-gray-800 transition-colors duration-300 w-full max-w-xs mx-auto text-center pointer-events-auto"
          >
            Find Your Shoe
          </Link>
        </div>
      </div>

      {/* Desktop Text Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none hidden lg:flex">
        <div className="container mx-auto px-2 py-20">
          <div className="grid grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Section - Text Content */}
            <div className="space-y-6 xl:space-y-8 text-left">
              {/* Bold & Sporty tag */}
              <div className="text-pink-600 font-medium text-sm tracking-wide uppercase">
                Bold & Sporty
              </div>

              {/* Main Title */}
              <h1 className="text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-slate-800">Style That Moves</span>
                <span className="block text-blue-900">With You.</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-700 max-w-lg leading-relaxed">
                Not just style. Not just comfort. Footwear that effortlessly
                moves with your every step.
              </p>

              {/* CTA Button */}
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-4 rounded-3xl font-medium text-lg hover:bg-gray-800 transition-colors duration-300 w-auto text-center pointer-events-auto"
              >
                Find Your Shoe
              </Link>
            </div>

            {/* Right Section - Brand Text Overlay */}
            <div className="relative w-full h-[80vh]">
              {/* Brand Text "Dunk High" */}
              <div className="absolute -top-8 -left-4 text-8xl font-bold text-orange-500 z-30 drop-shadow-lg">
                Dunk High
              </div>

              {/* Brand Text "Hawaii" */}
              <div className="absolute -bottom-0 -right-8 text-9xl font-bold text-blue-900 z-10 drop-shadow-lg">
                Hawaii
              </div>

              {/* Diagonal Tropical Graphic */}
              <div className="absolute -bottom-16 -right-16 w-64 h-32 bg-gradient-to-br from-pink-500 to-blue-500 transform rotate-12 opacity-80 z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
