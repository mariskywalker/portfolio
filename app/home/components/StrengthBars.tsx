"use client";

import { motion } from "framer-motion";

type Strength = {
  label: React.ReactNode;
  value: number; // 0..10
  key?: string;
};

const DEFAULT_STRENGTHS: Strength[] = [
  { label: "DESIGNER", value: 9 },
  { label: "CREATIVE DIRECTOR", value: 8 },
  { label: "VIBE CODER", value: 7 },
  { label: "MOTION DESIGN", value: 8 },
  { label: "WORLD BUILDING", value: 6 },
];

type Props = {
  strengths?: Strength[];
};

export function StrengthBars({ strengths = DEFAULT_STRENGTHS }: Props) {
  return (
    <div className="mt-5">
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/60">
        STRENGTHS
      </div>

      <motion.div
        className="mt-4 space-y-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.06 },
          },
        }}
      >
        {strengths.map((s) => {
          const clamped = Math.max(0, Math.min(10, s.value));
          const lvl = Math.max(1, Math.min(99, Math.round(10 + clamped * 3)));
          return (
            <motion.div
              key={s.key ?? String(s.label)}
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: { opacity: 1, y: 0, transition: { duration: 0.16, ease: "linear" } },
              }}
              className="grid grid-cols-[150px_1fr_72px] items-center gap-3"
            >
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
                {s.label}
              </div>

              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const on = i < clamped;
                  return (
                    <motion.span
                      key={i}
                      aria-hidden
                      initial={on ? { scaleX: 0 } : { opacity: 1 }}
                      animate={on ? { scaleX: 1 } : { opacity: 1 }}
                      transition={{
                        duration: 0.14,
                        ease: "linear",
                        delay: 0.03 + i * 0.02,
                      }}
                      className={[
                        "h-[10px] flex-1 border",
                        on
                          ? "border-[color:var(--sys-accent)] bg-[color:var(--sys-accent)]"
                          : "border-white/12 bg-transparent",
                      ].join(" ")}
                      style={on ? { transformOrigin: "left" } : undefined}
                    />
                  );
                })}
              </div>

              <div className="text-right">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
                  LVL {String(lvl).padStart(2, "0")}
                </div>
                <div className="mt-1 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/30">
                  {String(clamped).padStart(2, "0")}/10
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

