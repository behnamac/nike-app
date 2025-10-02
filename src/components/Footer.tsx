import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <div className="w-8 h-8 relative mb-4">
              <Image
                src="/logo.svg"
                alt="Nike Logo"
                width={32}
                height={32}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-medium mb-4">Featured</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Air Force 1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Huarache
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Air Max 90
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Air Max 95
                </a>
              </li>
            </ul>
          </div>

          {/* Shoes */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-medium mb-4">Shoes</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  All Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Custom Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Jordan Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Running Shoes
                </a>
              </li>
            </ul>
          </div>

          {/* Clothing */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-medium mb-4">Clothing</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  All Clothing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Modest Wear
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hoodies & Pullovers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shirts & Tops
                </a>
              </li>
            </ul>
          </div>

          {/* Kids */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-medium mb-4">Kids&apos;</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Infant & Toddler Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kids&apos; Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kids&apos; Jordan Shoes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kids&apos; Basketball Shoes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {/* X (Twitter) */}
              <a
                href="#"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <Image
                  src="/x.svg"
                  alt="X (formerly Twitter)"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <Image
                  src="/facebook.svg"
                  alt="Facebook"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </a>
            </div>

            {/* Copyright and Legal Links */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                Croatia © 2025 Nike, Inc. All Rights Reserved
              </p>
              <div className="flex space-x-4 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Guides
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Sale
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Use
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Nike Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
