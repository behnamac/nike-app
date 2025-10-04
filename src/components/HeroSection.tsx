import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background with blurred people silhouettes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20 blur-sm"></div>
      </div>

      {/* Light blue border */}
      <div className="absolute inset-0 border-2 border-blue-200"></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            {/* Bold & Sporty tag */}
            <div className="text-pink-500 font-medium text-sm tracking-wide uppercase">
              Bold & Sporty
            </div>

            {/* Main Title */}
            <h1 className="text-6xl lg:text-7xl font-bold text-black leading-tight">
              <span className="block">Style That Moves</span>
              <span className="block">With You.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-black max-w-lg leading-relaxed">
              Not just style. Not just comfort. Footwear that effortlessly moves
              with your every step.
            </p>

            {/* CTA Button */}
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Find Your Shoe
            </Link>
          </div>

          {/* Right Section - Product and Brand Text */}
          <div className="relative">
            {/* Brand Text "AIR" */}
            <div className="absolute -top-8 -left-4 text-8xl font-bold text-orange-500 z-20">
              AIR
            </div>

            {/* Main Shoe Image */}
            <div className="relative z-10 flex justify-center">
              <Image
                src="/hero-shoe.png"
                alt="Nike Air Jordan"
                width={600}
                height={600}
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Text "JORDAN" */}
            <div className="absolute -bottom-8 -right-8 text-9xl font-bold text-black z-20">
              JORDAN
            </div>

            {/* Diagonal Pink Graphic */}
            <div className="absolute -bottom-16 -right-16 w-64 h-32 bg-pink-500 transform rotate-12 opacity-80 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
