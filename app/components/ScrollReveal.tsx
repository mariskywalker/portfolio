"use client";

import { motion } from "framer-motion";

const revealTransition = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
  amount?: number;
  y?: number;
  blur?: number;
};

export function ScrollReveal({
  children,
  className,
  style,
  delay = 0,
  once = true,
  amount = 0.15,
  y = 28,
  blur = 0,
}: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-6% 0px -6% 0px", amount }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
