import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Featured",
    links: [
      { label: "Air Force 1", href: "/products?search=Air%20Force%201" },
      { label: "Huarache", href: "/products?search=Huarache" },
      { label: "Air Max 90", href: "/products?search=Air%20Max%2090" },
      { label: "Air Max 95", href: "/products?search=Air%20Max%2095" },
    ],
  },
  {
    title: "Shoes",
    links: [
      { label: "All Shoes", href: "/products" },
      { label: "Custom Shoes", href: "#" },
      { label: "Jordan Shoes", href: "/products?search=Jordan" },
      { label: "Running Shoes", href: "#" },
    ],
  },
  {
    title: "Clothing",
    links: [
      { label: "All Clothing", href: "#" },
      { label: "Modest Wear", href: "#" },
      { label: "Hoodies & Pullovers", href: "#" },
      { label: "Shirts & Tops", href: "#" },
    ],
  },
  {
    title: "Kids'",
    links: [
      { label: "Infant & Toddler Shoes", href: "#" },
      { label: "Kids' Shoes", href: "/products?gender=kids" },
      { label: "Kids' Jordan Shoes", href: "#" },
      { label: "Kids' Basketball Shoes", href: "#" },
    ],
  },
];

const SOCIALS = [
  { label: "X", icon: "/x.svg" },
  { label: "Facebook", icon: "/facebook.svg" },
  { label: "Instagram", icon: "/instagram.svg" },
];

const LEGAL = ["Guides", "Terms of Sale", "Terms of Use", "Nike Privacy Policy"];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8">
          <div>
            <Image src="/logo.svg" alt="Nike Logo" width={40} height={32} className="w-10 h-8" />
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-body-medium mb-4">{column.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-[15px] leading-[22px] text-light-400 hover:text-white hover:translate-x-1 transition-[color,translate] duration-300 ease-[var(--ease-out-soft)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#2a2a2a] flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:-translate-y-[3px] transition-[translate] duration-300 ease-[var(--ease-out-soft)]"
              >
                <Image src={social.icon} alt="" width={16} height={16} className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption font-normal text-dark-500">
            <span>NL © {new Date().getFullYear()} Nike, Inc. All Rights Reserved</span>
            {LEGAL.map((label) => (
              <a key={label} href="#" className="hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
