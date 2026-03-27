"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StrengthBars } from "./StrengthBars";

type Props = {
  compactLabel?: string;
};

export function AnimatedAboutCard({ compactLabel = "PLAYER PROFILE" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const header = useMemo(() => {
    return expanded ? "ABOUT / EXPANDED" : "ABOUT / CARD";
  }, [expanded]);

  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group mt-6 block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sys-accent)]/40"
      style={{ perspective: 900 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.14, ease: "linear" }}
    >
      <motion.div
        layout
        className="relative overflow-hidden border bg-[color:var(--sys-panel)] p-4"
        style={{
          borderColor: hovered || expanded ? "var(--sys-accent)" : "rgba(255,255,255,0.12)",
        }}
        animate={{
          rotateX: expanded ? 3 : 0,
          rotateY: expanded ? -2 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
              {compactLabel}
            </div>
            <div className="mt-2 font-heading text-[18px] font-semibold uppercase tracking-[0.04em] text-white">
              {header}
            </div>
          </div>
          <div className="text-right">
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/35">
              CLICK
            </div>
            <div
              className="mt-1 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em]"
              style={{ color: expanded ? "var(--sys-accent)" : "rgba(255,255,255,0.35)" }}
            >
              {expanded ? "COLLAPSE" : "EXPAND"}
            </div>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-white/10" />

        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "linear" }}
            >
              <p className="mt-4 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/55">
                Interactive systems, brutal interfaces, motion discipline. Shipping with precision.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoChip k="SYS" v="MARI" />
                <InfoChip k="ROLE" v="DESIGN + CODE" />
                <InfoChip k="FOCUS" v="3D / UI / MOTION" />
                <InfoChip k="STATE" v="ONLINE" accent />
              </div>

              <StrengthBars />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "linear" }}
              className="mt-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
                  TITLE
                </div>
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/35">
                  {">_"} HOVER / CLICK
                </div>
              </div>
              <p className="mt-3 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/50">
                Minimal card. Expand to reveal profile + strengths.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <BorderDraw active={hovered || expanded} />
      </motion.div>
    </motion.button>
  );
}

function InfoChip({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="border border-white/10 bg-black/40 p-3">
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/40">
        {k}
      </div>
      <div
        className="mt-2 truncate font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: accent ? "var(--sys-accent)" : "rgba(255,255,255,0.75)" }}
      >
        {v}
      </div>
    </div>
  );
}

function BorderDraw({ active }: { active: boolean }) {
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px bg-[color:var(--sys-accent)]"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 w-px bg-[color:var(--sys-accent)]"
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "linear", delay: 0.04 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-px bg-[color:var(--sys-accent)]"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "linear", delay: 0.08 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-px bg-[color:var(--sys-accent)]"
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "linear", delay: 0.12 }}
      />
    </>
  );
}

