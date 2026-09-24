"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, MagneticLink, reveal, useMotionAllowed } from "./motion";

export default function ReactPrestoBanner() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed();

  // The shoe bobs on its own and leans toward the cursor while it's over the image
  useEffect(() => {
    const area = tiltRef.current;
    const shoe = floatRef.current;
    if (!area || !shoe || !motionAllowed) return;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = area.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const tick = (now: number) => {
      shoe.style.transform = `translate(${tx * 24}px, ${Math.sin(now / 900) * 12 + ty * 16}px) rotate(${
        Math.sin(now / 1400) * 2 - tx * 6
      }deg)`;
      raf = requestAnimationFrame(tick);
    };

    area.addEventListener("mousemove", onMove);
    area.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      area.removeEventListener("mousemove", onMove);
      area.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [motionAllowed]);

  return (
    <section className="relative pt-6 pb-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-10">
        <div className="flex flex-col items-start gap-6">
          <div
            {...reveal(0)}
            className="flex items-center gap-3 text-pink-600 text-caption font-semibold tracking-[.14em] uppercase"
          >
            <span className="w-7 h-0.5 bg-pink-600" />
            Bold &amp; Sporty
          </div>
          <h2
            {...reveal(80)}
            className="text-[clamp(40px,5vw,68px)] leading-none font-bold tracking-[-.02em] uppercase"
          >
            <span className="block">Nike React</span>
            <span className="block">Presto By You</span>
          </h2>
          <p {...reveal(160)} className="text-lg leading-7 text-dark-700 max-w-[440px] text-pretty">
            Take advantage of brand new, proprietary cushioning technology with a fresh pair of
            Nike react shoes.
          </p>
          <div {...reveal(240)}>
            <MagneticLink
              href="/products"
              className="inline-flex items-center gap-3 h-14 px-7 rounded-full bg-dark-900 hover:bg-black text-white text-body-medium"
            >
              Shop Now
              <ArrowRight className="transition-transform duration-[350ms] group-hover:translate-x-[5px]" />
            </MagneticLink>
          </div>
        </div>

        <div ref={tiltRef} className="relative h-[clamp(340px,48vw,560px)]">
          <div ref={floatRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/feature.png"
              alt="Nike React Presto"
              fill
              className="object-contain"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
