import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark Theme */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern or Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Nike Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6">Just Do It</h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-md">
              Join millions of athletes and fitness enthusiasts who trust Nike
              for their performance needs.
            </p>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col items-start">
            {/* Dots indicator */}
            <div className="flex space-x-2 mb-4">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 Nike. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Light Theme */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
