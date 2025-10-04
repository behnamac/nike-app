"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

interface ProductVariant {
  id: string;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  inStock: number;
}

interface ColorSelectorProps {
  variants: ProductVariant[];
  defaultVariant?: ProductVariant;
  onColorSelect?: (variant: ProductVariant) => void;
}

export default function ColorSelector({
  variants,
  defaultVariant,
  onColorSelect,
}: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    defaultVariant?.color || variants[0]?.color || ""
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const colorRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Group variants by color
  const colorGroups = variants.reduce(
    (acc, variant) => {
      if (!acc[variant.color]) {
        acc[variant.color] = [];
      }
      acc[variant.color].push(variant);
      return acc;
    },
    {} as Record<string, ProductVariant[]>
  );

  const colors = Object.keys(colorGroups);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const variant = colorGroups[color][0]; // Get first variant of this color
    onColorSelect?.(variant);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = Math.min(index + 1, colors.length - 1);
        setFocusedIndex(nextIndex);
        colorRefs.current[nextIndex]?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        setFocusedIndex(prevIndex);
        colorRefs.current[prevIndex]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleColorSelect(colors[index]);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && colorRefs.current[focusedIndex]) {
      colorRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Get color display name
  const getColorDisplayName = (color: string) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  // Get color hex code (mock implementation)
  const getColorHex = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#DC2626",
      blue: "#2563EB",
      green: "#16A34A",
      yellow: "#EAB308",
      pink: "#EC4899",
      gray: "#6B7280",
      brown: "#92400E",
      purple: "#7C3AED",
    };
    return colorMap[color.toLowerCase()] || "#6B7280";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => {
        const isSelected = selectedColor === color;
        const colorHex = getColorHex(color);

        return (
          <button
            key={color}
            ref={(el) => {
              colorRefs.current[index] = el;
            }}
            onClick={() => handleColorSelect(color)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            className={`
              relative w-8 h-8 rounded-full border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
              ${
                isSelected
                  ? "border-black ring-2 ring-black ring-offset-2"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
            style={{ backgroundColor: colorHex }}
            aria-pressed={isSelected}
            aria-label={`Color ${getColorDisplayName(color)}`}
            title={getColorDisplayName(color)}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
