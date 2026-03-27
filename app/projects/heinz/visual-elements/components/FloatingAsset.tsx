"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { CSSProperties } from "react";

type FloatingAssetProps = {
  src: string;
  alt: string;
  width: number;
  progress: MotionValue<number>;
  revealRange: [number, number];
  xRange: [number, number];
  yRange: [number, number];
  rotateRange: [number, number];
  position: CSSProperties;
  zIndex?: number;
};

export default function FloatingAsset({
  src,
  alt,
  width,
  progress,
  revealRange,
  xRange,
  yRange,
  rotateRange,
  position,
  zIndex = 20,
}: FloatingAssetProps) {
  const fadeStart = Math.max(0, revealRange[0] - 0.06);
  const peak = revealRange[0] + (revealRange[1] - revealRange[0]) * 0.55;

  const opacity = useTransform(
    progress,
    [fadeStart, revealRange[0], revealRange[1], 1],
    [0, 0.92, 1, 0.96],
  );
  const scale = useTransform(
    progress,
    [fadeStart, revealRange[0], peak, revealRange[1], 1],
    [0.65, 0.86, 1.12, 1, 1.03],
  );
  const x = useTransform(progress, [0, 1], xRange);
  const y = useTransform(progress, [0, 1], yRange);
  const rotate = useTransform(progress, [0, 1], rotateRange);

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      style={{ ...position, width, opacity, scale, x, y, rotate, zIndex }}
      className="pointer-events-none absolute select-none object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.34)] will-change-transform"
    />
  );
}
