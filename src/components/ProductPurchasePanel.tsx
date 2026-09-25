"use client";

import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import ColorSelector from "./ColorSelector";
import SizePicker, { type SizeOption } from "./SizePicker";
import AddToCart from "./AddToCart";

export interface PurchaseVariant {
  id: string;
  price: number;
  sale_price?: number | null;
  in_stock: number;
  color: { id: string; name: string; slug: string; hexCode: string };
  size: { id: string; name: string; slug: string; sortOrder: number };
}

interface ProductPurchasePanelProps {
  variants: PurchaseVariant[];
  defaultVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
}

export default function ProductPurchasePanel({
  variants,
  defaultVariantId,
  productId,
  productName,
  productImage,
}: ProductPurchasePanelProps) {
  const defaultVariant = useMemo(
    () => variants.find((v) => v.id === defaultVariantId) ?? variants[0],
    [variants, defaultVariantId]
  );

  const [selectedColor, setSelectedColor] = useState(
    defaultVariant.color.name
  );
  const [selectedSizeId, setSelectedSizeId] = useState(
    defaultVariant.size.id
  );

  const colorSelectorVariants = useMemo(
    () =>
      variants.map((v) => ({
        id: v.id,
        color: v.color.name,
        size: v.size.name,
        price: Number(v.price),
        salePrice: v.sale_price ? Number(v.sale_price) : undefined,
        inStock: v.in_stock,
      })),
    [variants]
  );

  const sizesForColor: SizeOption[] = useMemo(
    () =>
      variants
        .filter((v) => v.color.name === selectedColor)
        .sort((a, b) => a.size.sortOrder - b.size.sortOrder)
        .map((v) => ({
          id: v.size.id,
          name: v.size.name,
          available: v.in_stock > 0,
        })),
    [variants, selectedColor]
  );

  const selectedVariant =
    variants.find(
      (v) => v.color.name === selectedColor && v.size.id === selectedSizeId
    ) ??
    variants.find((v) => v.color.name === selectedColor) ??
    defaultVariant;

  const handleColorSelect = (variant: { color: string }) => {
    setSelectedColor(variant.color);

    const stillAvailable = variants.some(
      (v) =>
        v.color.name === variant.color &&
        v.size.id === selectedSizeId &&
        v.in_stock > 0
    );
    if (!stillAvailable) {
      const fallback =
        variants.find(
          (v) => v.color.name === variant.color && v.in_stock > 0
        ) ?? variants.find((v) => v.color.name === variant.color);
      if (fallback) setSelectedSizeId(fallback.size.id);
    }
  };

  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSizeId(size.id);
  };

  const price = Number(selectedVariant.price);
  const salePrice = selectedVariant.sale_price
    ? Number(selectedVariant.sale_price)
    : undefined;

  return (
    <>
      {/* Price & Discount */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            ${salePrice ?? price}
          </span>
          {salePrice !== undefined && (
            <span className="text-xl text-gray-500 line-through">
              ${price}
            </span>
          )}
        </div>
        {salePrice !== undefined && (
          <p className="text-sm text-green-600 font-medium">
            You save ${price - salePrice}!
          </p>
        )}
      </div>

      {/* Color Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Color</h3>
        <ColorSelector
          variants={colorSelectorVariants}
          defaultVariant={colorSelectorVariants.find(
            (v) => v.id === defaultVariant.id
          )}
          onColorSelect={handleColorSelect}
        />
      </div>

      {/* Size Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
          <button className="text-sm text-gray-600 hover:text-gray-900 underline">
            Size Guide
          </button>
        </div>
        <SizePicker
          sizes={sizesForColor}
          selectedSizeId={selectedSizeId}
          onSizeSelect={handleSizeSelect}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <AddToCart
          productVariantId={selectedVariant.id}
          productId={productId}
          productName={productName}
          productImage={productImage}
          color={selectedVariant.color.name}
          size={selectedVariant.size.name}
          price={price}
          salePrice={salePrice}
          inStock={selectedVariant.in_stock}
          className="w-full"
        />
        <button className="w-full border border-gray-300 text-gray-900 py-3 px-6 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors flex items-center justify-center space-x-2">
          <Heart className="w-5 h-5" />
          <span>Favorite</span>
        </button>
      </div>
    </>
  );
}
