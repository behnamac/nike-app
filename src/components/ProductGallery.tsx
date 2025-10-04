"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  defaultImage?: ProductImage;
}

export default function ProductGallery({
  images,
  defaultImage,
}: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);

  // Filter out broken images
  const validImages = images.filter((img) => !imageErrors.has(img.id));

  // Set default image
  useEffect(() => {
    if (defaultImage && validImages.length > 0) {
      const defaultIndex = validImages.findIndex(
        (img) => img.id === defaultImage.id
      );
      if (defaultIndex !== -1) {
        setCurrentImageIndex(defaultIndex);
      }
    }
  }, [defaultImage, validImages]);

  // Handle image load errors
  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set([...prev, imageId]));
  };

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [validImages.length]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // If no valid images, show empty state
  if (validImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageOff className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = validImages[currentImageIndex];

  return (
    <div className="space-y-4" ref={galleryRef}>
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <Image
          src={currentImage.url}
          alt={`Product image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          onLoad={handleImageLoad}
          onError={() => handleImageError(currentImage.id)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black ${
                index === currentImageIndex
                  ? "ring-2 ring-black"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                onError={() => handleImageError(image.id)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Navigation Dots */}
      <div className="flex justify-center space-x-2 lg:hidden">
        {validImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
              index === currentImageIndex
                ? "bg-black"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
