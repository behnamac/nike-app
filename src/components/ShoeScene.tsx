"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RotateCw } from "lucide-react";
import ShoeModel, { type ShoeMotion } from "./ShoeModel";
import { useMotionAllowed } from "./motion";

interface ShoeSceneProps {
  className?: string;
}

export default function ShoeScene({ className = "" }: ShoeSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const motionAllowed = useMotionAllowed();
  const motion = useRef<ShoeMotion>({
    mx: 0,
    my: 0,
    dragYaw: 0,
    dragging: false,
    releasedAt: 0,
    animate: false,
  });
  const [visible, setVisible] = useState(true);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    motion.current.animate = motionAllowed;
  }, [motionAllowed]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      motion.current.mx = e.clientX / window.innerWidth - 0.5;
      motion.current.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Stop rendering once the hero is off screen
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  const endDrag = () => {
    if (!motion.current.dragging) return;
    motion.current.dragging = false;
    motion.current.releasedAt = performance.now();
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative touch-pan-y cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        motion.current.dragging = true;
        lastX.current = e.clientX;
        setShowHint(false);
      }}
      onPointerMove={(e) => {
        if (!motion.current.dragging) return;
        motion.current.dragYaw += (e.clientX - lastX.current) * 0.012;
        lastX.current = e.clientX;
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 1.4, 8], fov: 30 }}
        style={{ background: "transparent" }}
        aria-label="Nike Dunk High Hawaii 3D model"
      >
        <Suspense fallback={null}>
          <ShoeModel motion={motion} />
        </Suspense>
      </Canvas>

      <div
        className={`absolute left-1/2 bottom-[clamp(40px,10vw,120px)] -translate-x-1/2 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white shadow-[0_6px_20px_rgba(17,17,17,.12)] text-[13px] font-medium whitespace-nowrap pointer-events-none transition-opacity duration-500 ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        <RotateCw className="w-3.5 h-3.5" />
        Drag to rotate
      </div>
    </div>
  );
}
