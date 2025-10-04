"use client";

import { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface ShoeModelProps {
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function ShoeModel({
  scale = [3, 3, 3],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ShoeModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  console.log("ShoeModel props:", { scale, position, rotation });

  // Load the GLB model
  const gltf = useLoader(
    GLTFLoader,
    "/model/nike_dunk_hawaii_-_6k_triangles.glb"
  );

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation animation
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Shoe Model */}
      <group
        position={position}
        rotation={[
          (rotation[0] * Math.PI) / 180,
          (rotation[1] * Math.PI) / 180,
          (rotation[2] * Math.PI) / 180,
        ]}
      >
        <primitive ref={meshRef} object={gltf.scene} scale={scale} />
      </group>

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        target={position}
      />
    </>
  );
}
