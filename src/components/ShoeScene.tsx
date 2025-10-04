"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import ShoeModel from "./ShoeModel";

interface ShoeSceneProps {
  className?: string;
}

export default function ShoeScene({ className = "" }: ShoeSceneProps) {
  // Get responsive transform based on desktop screen size
  const getResponsiveTransform = () => {
    if (typeof window === "undefined") {
      // Default for SSR
      return {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [3, 3, 3] as [number, number, number],
      };
    }

    const width = window.innerWidth;

    if (width === 1920) {
      // 1920px Resolution - Optimized for your monitor
      return {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [2.5, 2.5, 2.5] as [number, number, number],
      };
    } else if (width >= 1024 && width < 1440) {
      // Standard Desktop (1024px - 1439px)
      return {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1.5, 1.5, 1.5] as [number, number, number],
      };
    } else if (width >= 1440 && width < 2560) {
      // Large Desktop (1440px - 2559px)
      return {
        position: [0.5, 0, 0] as [number, number, number],
        rotation: [0, 10, 0] as [number, number, number],
        scale: [1.5, 1.5, 1.5] as [number, number, number],
      };
    } else if (width >= 2560) {
      // 4K Desktop (2560px+)
      return {
        position: [1, 0, 0] as [number, number, number],
        rotation: [0, 15, 0] as [number, number, number],
        scale: [2, 2, 2] as [number, number, number],
      };
    } else {
      // Fallback for smaller screens (though 3D model won't show on mobile/tablet)
      return {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [2.5, 2.5, 2.5] as [number, number, number],
      };
    }
  };

  const [transform, setTransform] = useState(getResponsiveTransform());

  // Update transform on window resize
  useEffect(() => {
    const handleResize = () => {
      setTransform(getResponsiveTransform());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 50,
        }}
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense fallback={null}>
          <ShoeModel
            scale={transform.scale}
            position={transform.position}
            rotation={transform.rotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
