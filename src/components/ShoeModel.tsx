"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/model/nike_dunk_hawaii_-_6k_triangles.glb";
const DEG = Math.PI / 180;
/** How far the shoe (and its shadow) sit above the scene origin */
const LIFT = 0.45;

/** Mutable input the scene writes to and the model reads every frame. */
export interface ShoeMotion {
  /** Cursor position across the window, -0.5..0.5 */
  mx: number;
  my: number;
  /** Extra yaw from dragging, in radians */
  dragYaw: number;
  dragging: boolean;
  releasedAt: number;
  /** False when the user prefers reduced motion */
  animate: boolean;
}

interface ShoeModelProps {
  motion: React.RefObject<ShoeMotion>;
  /** The longest side of the shoe, in world units. Defaults to a smaller size on narrow canvases */
  size?: number;
}

export default function ShoeModel({ motion, size: sizeProp }: ShoeModelProps) {
  const spinRef = useRef<THREE.Group>(null);
  const isMobile = useThree((state) => state.size.width < 640);
  const size = sizeProp ?? (isMobile ? 3.0 : 4.2);
  const { scene } = useGLTF(MODEL_URL);

  const scale = useMemo(() => {
    const dims = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    return size / Math.max(dims.x, dims.y, dims.z);
  }, [scene, size]);

  useFrame((state, delta) => {
    const group = spinRef.current;
    const m = motion.current;
    if (!group || !m) return;

    // Let go of a drag for 2.5s and the shoe drifts back to the scroll-driven angle
    if (!m.dragging && performance.now() - m.releasedAt > 2500) {
      m.dragYaw = THREE.MathUtils.damp(m.dragYaw, 0, 2, delta);
    }

    let yaw = 25 * DEG;
    let pitch = 0;
    if (m.animate) {
      const t = state.clock.elapsedTime * 1000;
      yaw += (window.scrollY * 0.32 + Math.sin(t / 2600) * 10 + m.mx * 28) * DEG;
      pitch = m.my * 10 * DEG;
    }
    yaw += m.dragYaw;

    group.rotation.y = m.dragging ? yaw : THREE.MathUtils.damp(group.rotation.y, yaw, 6, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pitch, 6, delta);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} />
      <directionalLight position={[-6, 2, -4]} intensity={0.5} />

      <group position-y={LIFT}>
        <group ref={spinRef}>
          <Center scale={scale}>
            <primitive object={scene} />
          </Center>
        </group>
      </group>

      <ContactShadows position={[0, LIFT - 1.3, 0]} opacity={0.45} scale={8.5} blur={2.6} far={3} />
    </>
  );
}

useGLTF.preload(MODEL_URL);
