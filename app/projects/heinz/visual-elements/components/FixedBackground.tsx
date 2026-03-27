"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

type FixedBackgroundProps = {
  progress: MotionValue<number>;
};

export default function FixedBackground({ progress }: FixedBackgroundProps) {
  const bgScale = useTransform(progress, [0, 1], [1, 1.02]);
  const bgOpacity = useTransform(progress, [0, 0.2], [0.95, 1]);

  return (
    <motion.div
      style={{ scale: bgScale, opacity: bgOpacity }}
      className="absolute inset-0 z-0"
    >
      <div className="absolute inset-0 bg-[#020202]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_62%)]" />
    </motion.div>
  );
}
