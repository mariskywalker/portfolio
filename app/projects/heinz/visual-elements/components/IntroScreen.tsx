"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

type IntroScreenProps = {
  progress: MotionValue<number>;
};

export default function IntroScreen({ progress }: IntroScreenProps) {
  const introOpacity = useTransform(progress, [0, 0.2, 0.62], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.62], [0, -72]);
  const subtitleOpacity = useTransform(progress, [0.03, 0.2, 0.56], [0.72, 1, 0]);

  return (
    <motion.div
      style={{ opacity: introOpacity, y: introY }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      <div className="px-6 text-center">
        <h1 className="text-[18vw] font-black uppercase leading-[0.86] tracking-tight text-white md:text-[124px]">
          Heinz Lab
        </h1>
        <motion.p
          style={{ opacity: subtitleOpacity }}
          className="mt-4 text-[13px] font-bold uppercase tracking-[0.24em] text-white/80"
        >
          Scroll to explore
        </motion.p>
      </div>
    </motion.div>
  );
}
