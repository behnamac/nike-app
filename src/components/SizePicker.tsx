"use client";

import { useState, useRef, useEffect } from "react";

interface SizePickerProps {
  sizes?: string[];
  onSizeSelect?: (size: string) => void;
}

export default function SizePicker({
  sizes = [
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
  ],
  onSizeSelect,
}: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const sizeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Available sizes (first 10 are available, rest are disabled)
  const availableSizes = sizes.slice(0, 10);
  const unavailableSizes = sizes.slice(10);

  const handleSizeSelect = (size: string) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
      onSizeSelect?.(size);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = Math.min(index + 1, availableSizes.length - 1);
        setFocusedIndex(nextIndex);
        sizeRefs.current[nextIndex]?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        setFocusedIndex(prevIndex);
        sizeRefs.current[prevIndex]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleSizeSelect(availableSizes[index]);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && sizeRefs.current[focusedIndex]) {
      sizeRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Available Sizes */}
      {availableSizes.map((size, index) => (
        <button
          key={size}
          ref={(el) => {
            sizeRefs.current[index] = el;
          }}
          onClick={() => handleSizeSelect(size)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedIndex(index)}
          className={`
            h-10 px-3 text-sm font-medium rounded-md border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            ${
              selectedSize === size
                ? "bg-black text-white border-black"
                : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
            }
          `}
          aria-pressed={selectedSize === size}
          aria-label={`Size ${size}`}
        >
          {size}
        </button>
      ))}

      {/* Unavailable Sizes */}
      {unavailableSizes.map((size) => (
        <button
          key={size}
          disabled
          className="h-10 px-3 text-sm font-medium rounded-md border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          aria-label={`Size ${size} - Not available`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
