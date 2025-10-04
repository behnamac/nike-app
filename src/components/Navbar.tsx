"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/lib/auth/context";
import CartIcon from "./CartIcon";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut: authSignOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await authSignOut();
    // The auth context will automatically update the UI
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.svg"
                  alt="Nike Logo"
                  width={32}
                  height={32}
                  className="w-full h-full filter brightness-0"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Men
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Women
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Kids
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Search
            </a>
            <CartIcon />
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Welcome, {user.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                <FaUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <a
            href="#"
            className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
          >
            Men
          </a>
          <a
            href="#"
            className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
          >
            Women
          </a>
          <a
            href="#"
            className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
          >
            Kids
          </a>
          <a
            href="#"
            className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
          >
            Collections
          </a>
          <a
            href="#"
            className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
          >
            Contact
          </a>
          <div className="border-t border-gray-200 pt-4">
            <a
              href="#"
              className="text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
            >
              Search
            </a>
            <div className="px-3 py-2">
              <CartIcon />
            </div>
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-500 px-3 py-2 text-base font-medium">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="text-gray-700 px-3 py-2 text-base font-medium">
                  Welcome, {user.name || user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 w-full px-3 py-2 text-base font-medium"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 block px-3 py-2 text-base font-medium"
              >
                <FaUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
