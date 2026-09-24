"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, reveal, useMotionAllowed } from "./motion";

const TILES = [
  {
    href: "/products?search=Presto",
    image: "/trending-1.png",
    alt: "Nike React Presto Collection",
  },
  {
    href: "/products?search=Air%20Max",
    image: "/trending-2.png",
    alt: "Summer Must-Haves: Air Max Dia",
    title: "Summer Must-Haves: Air Max Dia",
  },
  {
    href: "/collections",
    image: "/trending-3.png",
    alt: "Essential Collection",
    title: "Essential Collection",
  },
];

export default function TrendingNow() {
  const gridRef = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed();

  // Images drift with scroll, and settle from a zoom as their tile uncovers
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !motionAllowed) return;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>("[data-clip]"));
    const settled = tiles.map(() => 0);
    let shownAt = 0;
    let raf = 0;

    const tick = (now: number) => {
      if (!shownAt && grid.hasAttribute("data-shown")) shownAt = now;
      tiles.forEach((tile, i) => {
        const r = tile.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
        const uncovered = shownAt > 0 && now - shownAt > i * 140;
        settled[i] += ((uncovered ? 1 : 0) - settled[i]) * 0.045;
        const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const zoom = 1 + (1 - settled[i]) * 0.25 + (tile.matches(":hover") ? 0.04 : 0);
        const img = tile.querySelector<HTMLElement>("[data-par]");
        if (img) img.style.transform = `translateY(${-progress * 50}px) scale(${zoom})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motionAllowed]);

  return (
    <section className="relative py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col gap-3 mb-10">
          <div
            {...reveal(0)}
            className="text-dark-700 text-caption font-semibold tracking-[.14em] uppercase"
          >
            This Week
          </div>
          <h2
            {...reveal(80)}
            className="text-[clamp(36px,4.2vw,56px)] leading-[1.05] font-bold tracking-[-.02em]"
          >
            Trending Now
          </h2>
        </div>

        <div
          ref={gridRef}
          data-clip-host
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] auto-rows-[310px] gap-5"
        >
          {TILES.map((tile, i) => (
            <Link
              key={tile.image}
              href={tile.href}
              data-clip
              style={{ "--reveal-delay": `${i * 140}ms` } as CSSProperties}
              className={`group relative block rounded-3xl overflow-hidden text-white ${
                i === 0 ? "row-span-2" : ""
              }`}
            >
              <div data-par className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority={i === 0}
                />
              </div>

              {i === 0 ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/15 to-65%" />
                  <div className="absolute inset-x-0 bottom-0 p-[clamp(24px,3vw,40px)] flex flex-col items-start gap-4">
                    <h3 className="text-[clamp(44px,5.4vw,80px)] leading-[.95] font-bold tracking-[-.02em]">
                      REACT PRESTO
                    </h3>
                    <p className="text-lg leading-7 max-w-[420px]">
                      With React foam for the most comfortable Presto ever.
                    </p>
                    <span className="inline-flex items-center gap-3 h-13 px-6 rounded-full bg-white text-dark-900 text-body-medium">
                      Shop Now
                      <ArrowRight className="transition-transform duration-[450ms] ease-[var(--ease-out-soft)] group-hover:translate-x-[5px]" />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent to-60%" />
                  <div className="absolute left-7 right-7 bottom-6 flex items-end justify-between gap-4">
                    <h4 className="text-heading-3 font-semibold text-pretty">{tile.title}</h4>
                    <span className="flex-none w-12 h-12 rounded-full bg-white text-dark-900 flex items-center justify-center transition-transform duration-[450ms] ease-[var(--ease-out-soft)] group-hover:[transform:rotate(-45deg)_scale(1.08)]">
                      <ArrowRight />
                    </span>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
