import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background with blurred people silhouettes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-2 md:py-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
          {/* Left Section - Text Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Bold & Sporty tag */}
            <div className="text-pink-500 font-medium text-xs sm:text-sm tracking-wide uppercase">
              Bold & Sporty
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight">
              <span className="block">Style That Moves</span>
              <span className="block">With You.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-black max-w-lg leading-relaxed">
              Not just style. Not just comfort. Footwear that effortlessly moves
              with your every step.
            </p>

            {/* CTA Button */}
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 sm:px-8 sm:py-4 rounded-3xl font-medium text-sm sm:text-base lg:text-lg hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto text-center"
            >
              Find Your Shoe
            </Link>
          </div>

          {/* Right Section - Product and Brand Text */}
          <div className="relative order-1 lg:order-2 md:h-64 h-80 lg:h-auto">
            {/* Main Shoe Image */}
            <div className="relative z-20 flex justify-center items-center h-full">
              <Image
                src="/hero-shoe.png"
                alt="Nike Air Jordan"
                width={500}
                height={500}
                className="object-contain w-full h-full md:max-w-2xl max-w-md"
                priority
              />
            </div>

            {/* Diagonal Pink Graphic */}
            <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 lg:-bottom-16 lg:-right-16 w-32 h-16 sm:w-48 sm:h-24 lg:w-64 lg:h-32 bg-pink-500 transform rotate-12 opacity-80 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
