"use client";

import { useState } from "react";

interface TransformControlsProps {
  onTransformChange: (transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }) => void;
  initialTransform?: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

export default function TransformControls({
  onTransformChange,
  initialTransform = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [3, 3, 3],
  },
}: TransformControlsProps) {
  const [transform, setTransform] = useState(initialTransform);

  const updateTransform = (key: string, axis: number, value: number) => {
    const newTransform = {
      ...transform,
      [key]: [...transform[key as keyof typeof transform]] as [
        number,
        number,
        number,
      ],
    };
    newTransform[key as keyof typeof transform][axis] = value;
    setTransform(newTransform);
    onTransformChange(newTransform);
  };

  return (
    <div className="absolute -top-58 inset-  left-0 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 z-[9999] max-w-xs">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Model Controls
      </h3>

      {/* Position Controls */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Position</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">
              X: {transform.position[0].toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={transform.position[0]}
              onChange={(e) =>
                updateTransform("position", 0, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Y: {transform.position[1].toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={transform.position[1]}
              onChange={(e) =>
                updateTransform("position", 1, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Z: {transform.position[2].toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={transform.position[2]}
              onChange={(e) =>
                updateTransform("position", 2, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Rotation</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">
              X: {transform.rotation[0].toFixed(1)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={transform.rotation[0]}
              onChange={(e) =>
                updateTransform("rotation", 0, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Y: {transform.rotation[1].toFixed(1)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={transform.rotation[1]}
              onChange={(e) =>
                updateTransform("rotation", 1, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Z: {transform.rotation[2].toFixed(1)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={transform.rotation[2]}
              onChange={(e) =>
                updateTransform("rotation", 2, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Scale Controls */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Scale</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">
              X: {transform.scale[0].toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={transform.scale[0]}
              onChange={(e) =>
                updateTransform("scale", 0, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Y: {transform.scale[1].toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={transform.scale[1]}
              onChange={(e) =>
                updateTransform("scale", 1, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Z: {transform.scale[2].toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={transform.scale[2]}
              onChange={(e) =>
                updateTransform("scale", 2, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setTransform(initialTransform);
          onTransformChange(initialTransform);
        }}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
