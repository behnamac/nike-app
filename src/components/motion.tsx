"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import type { ComponentProps, CSSProperties } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** False when the user asked for reduced motion (and on the server). */
export function useMotionAllowed() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

/** Props that fade an element up when it scrolls into view. Needs <ScrollReveal /> on the page. */
export function reveal(delayMs = 0) {
  return {
    "data-reveal": "",
    style: { "--reveal-delay": `${delayMs}ms` } as CSSProperties,
  };
}

/** Watches every [data-reveal] and [data-clip-host] element on the page and marks it shown once it's 15% visible. */
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    document
      .querySelectorAll("[data-reveal]:not([data-shown]), [data-clip-host]:not([data-shown])")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

/** A link that leans toward the cursor. Put the arrow in a `group-hover:` span to nudge it too. */
export function MagneticLink({
  className = "",
  style,
  ...props
}: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const motionAllowed = useMotionAllowed();

  return (
    <Link
      ref={ref}
      {...props}
      style={style}
      className={`group transition-transform duration-[350ms] ease-[var(--ease-out-soft)] ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || !motionAllowed) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    />
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
