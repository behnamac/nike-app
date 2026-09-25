"use client";

import { useRef, useEffect } from "react";

export interface SizeOption {
  id: string;
  name: string;
  available: boolean;
}

interface SizePickerProps {
  sizes: SizeOption[];
  selectedSizeId?: string | null;
  onSizeSelect?: (size: SizeOption) => void;
}

export default function SizePicker({
  sizes,
  selectedSizeId = null,
  onSizeSelect,
}: SizePickerProps) {
  const focusIndexRef = useRef<number>(-1);
  const sizeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSizeSelect = (size: SizeOption) => {
    if (size.available) {
      onSizeSelect?.(size);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const nextIndex = Math.min(index + 1, sizes.length - 1);
        focusIndexRef.current = nextIndex;
        sizeRefs.current[nextIndex]?.focus();
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        focusIndexRef.current = prevIndex;
        sizeRefs.current[prevIndex]?.focus();
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        handleSizeSelect(sizes[index]);
        break;
    }
  };

  useEffect(() => {
    if (
      focusIndexRef.current >= 0 &&
      sizeRefs.current[focusIndexRef.current]
    ) {
      sizeRefs.current[focusIndexRef.current]?.focus();
    }
  }, []);

  return (
    <div className="grid grid-cols-5 gap-2">
      {sizes.map((size, index) => {
        const isSelected = selectedSizeId === size.id;

        if (!size.available) {
          return (
            <button
              key={size.id}
              disabled
              className="h-10 px-3 text-sm font-medium rounded-md border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              aria-label={`Size ${size.name} - Not available`}
            >
              {size.name}
            </button>
          );
        }

        return (
          <button
            key={size.id}
            ref={(el) => {
              sizeRefs.current[index] = el;
            }}
            onClick={() => handleSizeSelect(size)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => {
              focusIndexRef.current = index;
            }}
            className={`
              h-10 px-3 text-sm font-medium rounded-md border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
              ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Size ${size.name}`}
          >
            {size.name}
          </button>
        );
      })}
    </div>
  );
}
