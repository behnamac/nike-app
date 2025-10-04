"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ShoeModel from "./ShoeModel";
import TransformControls from "./TransformControls";

interface ShoeSceneProps {
  className?: string;
}

export default function ShoeScene({ className = "" }: ShoeSceneProps) {
  const [transform, setTransform] = useState({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [2, 2, 2] as [number, number, number],
  });

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Transform Controls UI */}
      <TransformControls
        onTransformChange={setTransform}
        initialTransform={transform}
      />

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
