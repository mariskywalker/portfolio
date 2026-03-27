"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Vector2Shape } from "./Vector2Shape";

type Props = {
  title: string;
  description: string;
  rightSlot: ReactNode;
  cornerTag?: string;
  reveal?: boolean;
};

export function FileCase({
  title,
  description,
  rightSlot,
  cornerTag = "CASE FILE",
  reveal = true,
}: Props) {
  if (!reveal) {
    return (
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: "linear" }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.995 }}
        drag="y"
        dragConstraints={{ top: -28, bottom: 28 }}
        dragElastic={0.12}
        className="relative w-full overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <Vector2Shape className="absolute inset-0 h-full w-full" />

        <div className="relative z-10 p-6 md:p-7">
          <div className="flex items-start justify-between gap-6">
            <div className="font-heading text-[20px] font-black leading-[1.05] tracking-tight text-black md:text-[22px]">
              {title}
            </div>
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
              {cornerTag}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-7">
              <p className="font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.04em] text-black/85 md:text-[13px]">
                {description}
              </p>
            </div>

            <div className="col-span-12 md:col-span-5">{rightSlot}</div>
          </div>

          <div className="mt-6 h-px w-full bg-black/35" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.995 }}
      drag="y"
      dragConstraints={{ top: -28, bottom: 28 }}
      dragElastic={0.12}
      className="relative w-full overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <Vector2Shape className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 p-6 md:p-7">
        <div className="flex items-start justify-between gap-6">
          <div className="font-heading text-[20px] font-black leading-[1.05] tracking-tight text-black md:text-[22px]">
            {title}
          </div>
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
            {cornerTag}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-7">
            <p className="font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.04em] text-black/85 md:text-[13px]">
              {description}
            </p>
          </div>

          <div className="col-span-12 md:col-span-5">{rightSlot}</div>
        </div>

        <div className="mt-6 h-px w-full bg-black/35" />
      </div>
    </motion.div>
  );
}

