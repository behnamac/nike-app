"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ShoeScene from "./ShoeScene";
import { ArrowRight, MagneticLink, reveal, useMotionAllowed } from "./motion";

const MARQUEE_ROWS = [
  { text: "Dunk High · Dunk High · ", direction: 1, className: "text-orange-500" },
  {
    text: "Hawaii · Hawaii · Hawaii · ",
    direction: -1,
    className: "text-transparent [-webkit-text-stroke:2px_#1e3a8a]",
  },
];

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionAllowed = useMotionAllowed();

  // The type band loops and speeds up while you scroll; the background and copy drift for parallax
  useEffect(() => {
    if (!motionAllowed) return;
    let offset = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let raf = 0;

    const tick = () => {
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;

      if (y < window.innerHeight * 1.2) {
        offset += 0.55 + Math.min(Math.abs(velocity), 60) * 0.35;
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const width = row.scrollWidth / 2 || 1;
          const o = offset % width;
          row.style.transform = `translateX(${MARQUEE_ROWS[i].direction > 0 ? -o : o - width}px)`;
        });
        if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.22}px) scale(1.06)`;
        if (textRef.current) textRef.current.style.transform = `translateY(${y * 0.1}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motionAllowed]);

  return (
    <section className="relative -mt-16 pt-16 min-h-[min(100vh,920px)] overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-pink-50">
      <div
        ref={bgRef}
        className="absolute -top-[6%] inset-x-0 bottom-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-60 will-change-transform"
      />

      {/* Looping "Dunk High / Hawaii" type band */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 z-[1] pointer-events-none flex flex-col font-bold leading-[.86] tracking-[-.02em] uppercase text-[clamp(96px,15vw,232px)] whitespace-nowrap"
      >
        {MARQUEE_ROWS.map((row, i) => (
          <div
            key={row.text}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={`flex w-max will-change-transform ${row.className}`}
          >
            <span className="pr-[.3em]">{row.text + row.text}</span>
            <span className="pr-[.3em]">{row.text + row.text}</span>
          </div>
        ))}
      </div>

      <div className="relative z-[2] max-w-[1280px] mx-auto px-4 sm:px-8 pt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-6 min-h-[calc(min(100vh,920px)-64px)]">
        <div
          ref={textRef}
          className="flex flex-col items-start gap-7 pb-[clamp(40px,14vw,220px)]"
        >
          <div
            {...reveal(100)}
            className="flex items-center gap-3 text-pink-600 text-caption font-semibold tracking-[.14em] uppercase"
          >
            <span className="w-7 h-0.5 bg-pink-600" />
            Bold &amp; Sporty
          </div>

          <h1 className="text-[clamp(48px,6.2vw,84px)] leading-[1.02] font-bold tracking-[-.025em]">
            <span className="block overflow-hidden pb-[.06em]">
              <span className="block text-dark-900 animate-line-up [animation-delay:120ms]">
                Style That Moves
              </span>
            </span>
            <span className="block overflow-hidden pb-[.06em]">
              <span className="block text-blue-900 animate-line-up [animation-delay:250ms]">
                With You.
              </span>
            </span>
          </h1>

          <p {...reveal(450)} className="text-lg leading-7 text-dark-900 max-w-[440px] text-pretty">
            Not just style. Not just comfort. Footwear that effortlessly moves with your every step.
          </p>

          <div {...reveal(600)} className="flex flex-wrap gap-3">
            <MagneticLink
              href="/products"
              className="inline-flex items-center gap-3 h-14 px-7 rounded-full bg-dark-900 hover:bg-black text-white text-body-medium"
            >
              Find Your Shoe
              <ArrowRight className="transition-transform duration-[350ms] group-hover:translate-x-[5px]" />
            </MagneticLink>
            <Link
              href="/products?search=Dunk"
              className="inline-flex items-center h-14 px-7 rounded-full border-[1.5px] border-dark-900 bg-white/60 text-dark-900 text-body-medium hover:bg-dark-900 hover:text-white transition-colors"
            >
              Shop Dunk High
            </Link>
          </div>
        </div>

        <ShoeScene className="h-[clamp(480px,80vh,800px)] -mt-[120px] -mr-12" />
      </div>
    </section>
  );
}
