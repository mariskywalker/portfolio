"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  metaLeft?: string;
  metaRight?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: "default" | "active";
};

export function SystemPanel({
  title,
  metaLeft,
  metaRight,
  rightSlot,
  children,
  className,
  contentClassName,
  tone = "default",
}: Props) {
  const border =
    tone === "active" ? "var(--sys-accent)" : "rgba(255,255,255,0.14)";

  return (
    <motion.div
      className={[
        "relative overflow-hidden border bg-[color:var(--sys-panel)]",
        className || "",
      ].join(" ")}
      style={{ borderColor: border }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: "linear" }}
    >
      <CornerBrackets tone={tone} />
      <HeaderStrip
        title={title}
        metaLeft={metaLeft}
        metaRight={metaRight}
        rightSlot={rightSlot}
        tone={tone}
      />
      <div className={contentClassName || "px-5 py-5"}>{children}</div>
      <BorderDraw tone={tone} />
    </motion.div>
  );
}

function HeaderStrip({
  title,
  metaLeft,
  metaRight,
  rightSlot,
  tone,
}: {
  title: string;
  metaLeft?: string;
  metaRight?: string;
  rightSlot?: ReactNode;
  tone: "default" | "active";
}) {
  const accentOn = tone === "active";
  return (
    <div className="border-b border-white/10 bg-black/40 px-5 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="font-heading text-[14px] font-semibold uppercase tracking-[0.08em] text-white">
              <span className="glitch" data-text={title}>
                {title}
              </span>
            </div>
            {metaLeft ? (
              <div className="truncate font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/40">
                {metaLeft}
              </div>
            ) : null}
          </div>
          {metaRight ? (
            <div className="mt-1 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/35">
              {metaRight}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {rightSlot}
          <span
            aria-hidden
            className="h-[8px] w-[8px] border"
            style={{
              borderColor: accentOn ? "var(--sys-accent)" : "rgba(255,255,255,0.22)",
              background: accentOn ? "var(--sys-accent)" : "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function BorderDraw({ tone }: { tone: "default" | "active" }) {
  const color = tone === "active" ? "var(--sys-accent)" : "rgba(255,255,255,0.18)";
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px"
        style={{ background: color }}
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.16, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 w-px"
        style={{ background: color }}
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: "100%", opacity: 1 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.03 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-px"
        style={{ background: color }}
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.06 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-px"
        style={{ background: color }}
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: "100%", opacity: 1 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.09 }}
      />
    </>
  );
}

function CornerBrackets({ tone }: { tone: "default" | "active" }) {
  const c = tone === "active" ? "var(--sys-accent)" : "rgba(255,255,255,0.25)";
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t"
        style={{ borderColor: c }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.14, ease: "linear", delay: 0.04 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t"
        style={{ borderColor: c }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.14, ease: "linear", delay: 0.06 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b"
        style={{ borderColor: c }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.14, ease: "linear", delay: 0.08 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b"
        style={{ borderColor: c }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.14, ease: "linear", delay: 0.1 }}
      />
    </>
  );
}

