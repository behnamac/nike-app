"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import CartIcon from "./CartIcon";

const NAV_LINKS = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=kids" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, signOut: authSignOut } = useAuth();

  // Transparent over the hero, frosted once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await authSignOut();
  };

  const solid = scrolled || isMobileMenuOpen;

  return (
    <nav
      className={`sticky top-0 z-50 h-16 border-b transition-[background-color,border-color,backdrop-filter] duration-400 ${
        solid
          ? "bg-white/[.82] border-light-300 backdrop-blur-lg backdrop-saturate-[1.8]"
          : "bg-white/0 border-transparent"
      }`}
    >
      <div className="max-w-[1280px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between gap-6">
        <Link href="/" aria-label="Nike home" className="flex w-10 h-8">
          <Image
            src="/logo.svg"
            alt="Nike Logo"
            width={40}
            height={32}
            className="w-full h-full brightness-0"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-caption text-dark-900 bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:12px_100%] bg-[length:0_2px] hover:bg-[length:calc(100%-24px)_2px] transition-[background-size] duration-[350ms] ease-[var(--ease-out-soft)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          <Link
            href="/products"
            aria-label="Search products"
            className="w-11 h-11 rounded-full flex items-center justify-center text-dark-900 hover:bg-light-200 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
          <CartIcon />

          <div className="hidden md:flex items-center ml-2">
            {loading ? (
              <div className="w-4 h-4 mx-4 border-2 border-light-400 border-t-dark-700 rounded-full animate-spin" />
            ) : user ? (
              <button
                onClick={handleSignOut}
                title={`Signed in as ${user.name || user.email}`}
                className="flex items-center gap-2 h-10 px-4 rounded-full border border-light-400 text-caption text-dark-900 hover:bg-dark-900 hover:text-white hover:border-dark-900 transition-colors cursor-pointer"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 h-10 px-4 rounded-full border border-light-400 text-caption text-dark-900 hover:bg-dark-900 hover:text-white hover:border-dark-900 transition-colors"
              >
                <FaUser className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-dark-900 hover:bg-light-200"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white border-b border-light-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-body-medium text-dark-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-light-300 mt-2 pt-2">
            {loading ? null : user ? (
              <>
                <div className="px-3 py-2 text-body text-dark-700">
                  Welcome, {user.name || user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-body-medium text-dark-900"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-body-medium text-dark-900"
              >
                <FaUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
