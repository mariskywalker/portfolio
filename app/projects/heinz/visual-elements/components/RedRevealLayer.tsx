"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

import FloatingAssetLayer from "./FloatingAssetLayer";
import SplineStage from "./SplineStage";

type RedRevealLayerProps = {
  progress: MotionValue<number>;
  layerY: MotionValue<number>;
  layerScale: MotionValue<number>;
  layerOpacity: MotionValue<number>;
};

export default function RedRevealLayer({
  progress,
  layerY,
  layerScale,
  layerOpacity,
}: RedRevealLayerProps) {
  const stageY = useTransform(progress, [0.2, 0.65, 1], [120, 0, -16]);
  const stageScale = useTransform(progress, [0.2, 0.65, 1], [1.06, 1, 1.015]);
  const overlayOpacity = useTransform(progress, [0.2, 0.65, 1], [0.58, 0.72, 0.78]);

  return (
    <motion.div
      style={{ y: layerY, scale: layerScale, opacity: layerOpacity }}
      className="absolute inset-0 z-10 origin-bottom overflow-hidden rounded-t-[36px] border-t border-white/25 bg-[#c8102e]"
    >
      <motion.div style={{ y: stageY, scale: stageScale }} className="absolute inset-0">
        <SplineStage />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_10%,rgba(200,16,46,0.28)_54%,rgba(200,16,46,0.72)_100%)]"
      />

      <FloatingAssetLayer progress={progress} />
    </motion.div>
  );
}
