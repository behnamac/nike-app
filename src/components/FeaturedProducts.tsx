"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import type { FeaturedProduct } from "@/lib/actions/product";
import { useCartStore } from "@/store/cart.store";
import { CART_BUMP_EVENT } from "./CartIcon";
import { reveal, useMotionAllowed } from "./motion";

type AddStatus = "adding" | "added" | "error";

const CARD_GAP = 20;

/** Clone the shoe image and arc it into the bag icon in the navbar. */
function flyToBag(source: HTMLElement): Promise<void> {
  const cart = document.querySelector("[data-cart-icon]");
  if (!cart) return Promise.resolve();

  const r = source.getBoundingClientRect();
  const c = cart.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: "0",
    zIndex: "100",
    pointerEvents: "none",
    transition: "none",
    transform: "none",
    borderRadius: "24px",
    overflow: "hidden",
  });
  document.body.appendChild(clone);

  const dx = c.left + c.width / 2 - (r.left + r.width / 2);
  const dy = c.top + c.height / 2 - (r.top + r.height / 2);
  const flight = clone.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(-10deg)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px,${dy * 0.35 - 90}px) scale(.55) rotate(-24deg)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${dx}px,${dy}px) scale(.06) rotate(-40deg)`, opacity: 0.3 },
    ],
    { duration: 950, easing: "cubic-bezier(.55,0,.35,1)" }
  );
  return flight.finished.then(
    () => clone.remove(),
    () => clone.remove()
  );
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [status, setStatus] = useState<Record<string, AddStatus>>({});
  const { addItem } = useCartStore();
  const motionAllowed = useMotionAllowed();

  // Progress bar: its width is the visible fraction and it slides with the scroll position
  useEffect(() => {
    const scroller = scrollerRef.current;
    const bar = progressRef.current;
    if (!scroller || !bar) return;

    const update = () => {
      const fraction = scroller.clientWidth / scroller.scrollWidth;
      const max = scroller.scrollWidth - scroller.clientWidth;
      bar.style.width = `${fraction * 100}%`;
      bar.style.transform = `translateX(${
        max > 0 ? (scroller.scrollLeft / max) * (1 / fraction - 1) * 100 : 0
      }%)`;
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Click-and-drag scrolling with a mouse (touch already scrolls natively)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || (e.target as Element).closest("button")) return;
      down = true;
      dragged.current = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragged.current = true;
      scroller.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
      scroller.style.cursor = "";
    };

    scroller.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      scroller.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>("[data-card]");
    scroller?.scrollBy({
      left: direction * ((card?.offsetWidth ?? 300) + CARD_GAP),
      behavior: "smooth",
    });
  };

  const quickAdd = async (product: FeaturedProduct, image: HTMLElement | null) => {
    const variant = product.variant;
    if (!variant || status[product.id] === "adding") return;

    setStatus((s) => ({ ...s, [product.id]: "adding" }));
    await Promise.all([
      addItem({
        productVariantId: variant.id,
        productId: product.id,
        productName: product.name,
        productImage: product.image ?? "",
        color: variant.color,
        size: variant.size,
        price: variant.price,
        salePrice: variant.salePrice ?? undefined,
        quantity: 1,
        inStock: variant.inStock,
      }),
      motionAllowed && image ? flyToBag(image) : null,
    ]);

    const failed = useCartStore.getState().error !== null;
    setStatus((s) => ({ ...s, [product.id]: failed ? "error" : "added" }));
    if (!failed) window.dispatchEvent(new Event(CART_BUMP_EVENT));
  };

  return (
    <section className="relative py-24 pb-20 bg-light-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3 max-w-[620px]">
          <div
            {...reveal(0)}
            className="text-dark-700 text-caption font-semibold tracking-[.14em] uppercase"
          >
            Best of Air Max
          </div>
          <h2
            {...reveal(80)}
            className="text-[clamp(36px,4.2vw,56px)] leading-[1.05] font-bold tracking-[-.02em]"
          >
            Featured Products
          </h2>
          <p {...reveal(160)} className="text-lg leading-7 text-dark-700 text-pretty">
            Discover our top-rated collection, featuring the latest styles and classic favorites.
          </p>
        </div>

        {products.length > 0 && (
          <div {...reveal(200)} className="flex gap-2.5">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                onClick={() => scrollByCard(direction)}
                aria-label={direction < 0 ? "Scroll left" : "Scroll right"}
                className="w-13 h-13 rounded-full border border-light-400 text-dark-900 flex items-center justify-center cursor-pointer transition-colors hover:bg-dark-900 hover:text-white hover:border-dark-900"
              >
                {direction < 0 ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <p className="max-w-[1280px] mx-auto px-4 sm:px-8 text-lg text-dark-700">
          No products found. Check back later for new arrivals!
        </p>
      ) : (
        <>
          <div
            ref={scrollerRef}
            onClickCapture={(e) => {
              // A drag that ends on a card shouldn't open it
              if (dragged.current) {
                e.preventDefault();
                e.stopPropagation();
                dragged.current = false;
              }
            }}
            className="scrollbar-hide flex gap-5 overflow-x-auto pt-2 pb-6 px-[max(16px,calc((100%-1216px)/2))] sm:px-[max(32px,calc((100%-1216px)/2))] cursor-grab select-none"
          >
            {products.map((product, index) => {
              const variant = product.variant;
              const onSale = variant?.salePrice != null && variant.salePrice < variant.price;
              const badge = onSale
                ? `-${Math.round((1 - variant!.salePrice! / variant!.price) * 100)}%`
                : index === 0
                  ? "Best Seller"
                  : null;
              const state = status[product.id];
              const soldOut = !variant || variant.inStock <= 0;
              const href = `/products/${product.id}`;

              return (
                <div
                  key={product.id}
                  data-card
                  {...reveal(index * 90)}
                  className="group flex-none w-[300px] flex flex-col gap-4"
                >
                  <div className="relative aspect-square bg-white rounded-3xl overflow-hidden">
                    <Link href={href} draggable={false} aria-label={product.name}>
                      <div
                        data-shoe
                        className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-soft)] motion-safe:group-hover:[transform:rotate(-4deg)_scale(1.12)]"
                      >
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            draggable={false}
                            className="object-cover"
                            sizes="300px"
                          />
                        )}
                      </div>
                    </Link>

                    {badge && (
                      <span
                        className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-white text-footnote font-medium ${
                          onSale ? "bg-red" : "bg-dark-900"
                        }`}
                      >
                        {badge}
                      </span>
                    )}

                    <button
                      onClick={(e) =>
                        quickAdd(
                          product,
                          e.currentTarget.parentElement?.querySelector<HTMLElement>("[data-shoe]") ??
                            null
                        )
                      }
                      disabled={soldOut || state === "adding"}
                      className="absolute inset-x-4 bottom-4 h-12 rounded-full bg-dark-900 hover:bg-black text-white text-caption flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-dark-700 translate-y-20 group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0 transition-[translate,background-color] duration-500 ease-[var(--ease-out-soft)]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {soldOut
                        ? "Out of Stock"
                        : state === "adding"
                          ? "Adding…"
                          : state === "added"
                            ? "Added to Bag"
                            : state === "error"
                              ? "Couldn't add, try again"
                              : "Add to Bag"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-0.5 px-1">
                    <h3 className="text-body-medium text-dark-900">
                      <Link href={href} draggable={false}>
                        {product.name}
                      </Link>
                    </h3>
                    {product.gender && (
                      <p className="text-caption font-normal text-dark-700">
                        {product.gender}&apos;s Shoes
                      </p>
                    )}
                    {variant && (
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className={`text-body font-semibold ${onSale ? "text-red" : "text-dark-900"}`}>
                          {formatPrice(onSale ? variant.salePrice! : variant.price)}
                        </span>
                        {onSale && (
                          <span className="text-caption font-normal text-dark-500 line-through">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="relative h-0.5 bg-light-300 rounded-sm overflow-hidden">
              <div
                ref={progressRef}
                className="absolute inset-y-0 left-0 w-[30%] bg-dark-900 rounded-sm will-change-transform"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
