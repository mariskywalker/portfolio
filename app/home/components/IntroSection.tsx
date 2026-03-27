"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroMarquee } from "./IntroMarquee";

type Props = {
  /** 0..1 scroll progress from section 1 -> 2 (optional) */
  scrollProgress?: number;
  onReady?: () => void;
};

const BOOT_LINES = [
  "INITIALIZING SYSTEM...",
  "LOADING INTERFACE MODULES...",
  "CONNECTING NODES...",
];

const LOG_LINES = [
  "UI GRID: OK",
  "3D MODULE: READY",
  "PROFILE DATA: LOADED",
  "INPUT DEVICE: POINTER",
  "STATUS: READY",
];

export function IntroSection({ scrollProgress = 0, onReady }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(0);
  const readyRef = useRef(false);

  const brandText = "MARI // CREATIVE SYSTEM";
  const typed = useTypewriter(step >= 2 ? brandText : "", { speedMs: 28, glitch: true });

  useEffect(() => {
    if (step !== 1) return;
    const t = window.setTimeout(() => setStep(2), 950);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    if (typed.length < brandText.length) return;
    const t = window.setTimeout(() => setStep(3), 360);
    return () => window.clearTimeout(t);
  }, [step, typed.length, brandText.length]);

  useEffect(() => {
    if (step !== 3) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1550;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.6 ? t / 0.6 : 1 - (1 - t) * 0.15;
      setProgress(Math.floor(eased * 100));
      if (t >= 1) {
        setStep(4);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  useEffect(() => {
    if (step !== 4) return;
    if (readyRef.current) return;
    readyRef.current = true;
    onReady?.();
  }, [step, onReady]);

  const activeLogs = useMemo(() => {
    const count = Math.max(
      0,
      Math.min(LOG_LINES.length, Math.floor((progress / 100) * LOG_LINES.length)),
    );
    return LOG_LINES.slice(0, Math.max(1, count));
  }, [progress]);

  const compress = Math.max(0, Math.min(1, scrollProgress));
  const introY = compress * -60;
  const introOpacity = 1 - compress * 0.35;
  const introScaleY = 1 - compress * 0.06;
  const introBlur = compress * 1.6;
  const barOpacity = Math.max(0, 1 - compress * 1.25);

  return (
    <section
      className="relative h-[100svh] w-full"
      style={{
        transform: `translate3d(0, ${introY}px, 0) scaleY(${introScaleY})`,
        transformOrigin: "top",
        opacity: introOpacity,
        filter: `blur(${introBlur}px)`,
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: "linear" }}
            className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/55"
          >
            SYS_INTRO / NODE: USER_01
          </motion.div>

          <div className="mt-6 space-y-2">
            {BOOT_LINES.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: "linear", delay: i * 0.06 }}
                className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-white/75"
              >
                &gt;_ {line}
              </motion.div>
            ))}
          </div>

          <div className="mt-10 border border-white/12 bg-black/55 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-white/50">
                  IDENTIFICATION
                </div>
                <div className="mt-3 font-heading text-[35px] font-black uppercase tracking-[0.12em] text-white md:text-[35px]">
                  <span
                    className="glitch"
                    data-text={step >= 2 ? typed : ""}
                  >
                    {step >= 2 ? typed : ""}
                  </span>
                  <BlinkCursor active={compress < 0.55} />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-white/45">
                  STATUS
                </div>
                <div
                  className="mt-3 font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: step >= 4 ? "var(--sys-accent)" : "rgba(255,255,255,0.60)" }}
                >
                  {step >= 4 ? "READY" : "BOOTING"}
                </div>
              </div>
            </div>

            <div className="mt-5 h-px w-full bg-white/10" />

            <div className="mt-5" style={{ opacity: barOpacity }}>
              <div className="flex items-center justify-between">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-white/45">
                  MODULES
                </div>
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-white/35">
                  {String(progress).padStart(3, "0")}%
                </div>
              </div>

              <SegmentedProgress value={progress} />

              <div className="mt-4 space-y-2">
                <AnimatePresence mode="popLayout">
                  {activeLogs.map((log) => (
                    <motion.div
                      key={log}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.14, ease: "linear" }}
                      className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55"
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 10 }}
            transition={{ duration: 0.16, ease: "linear", delay: 0.06 }}
            className="mt-8"
          >
            <div className="text-center">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/35">
                INITIALIZATION COMPLETE
              </div>

              <motion.div
                className="mt-3 font-[var(--font-geist-mono)] text-[16px] font-semibold uppercase tracking-[0.38em] md:text-[18px]"
                style={{ color: "var(--sys-accent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.16, ease: "linear" }}
              >
                SCROLL TO ENTER
                <motion.span
                  aria-hidden
                  className="ml-2 inline-block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
                >
                  ↓
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 22 }}
        transition={{ duration: 0.18, ease: "linear", delay: 0.14 }}
        className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2"
      >
        <IntroMarquee />
      </motion.div>
    </section>
  );
}

function SegmentedProgress({ value }: { value: number }) {
  const count = 22;
  const onCount = Math.round((Math.max(0, Math.min(100, value)) / 100) * count);
  return (
    <div className="mt-3 flex gap-1">
      {Array.from({ length: count }).map((_, i) => {
        const on = i < onCount;
        return (
          <span
            key={i}
            aria-hidden
            className="h-[12px] flex-1 border"
            style={{
              borderColor: on ? "var(--sys-accent)" : "rgba(255,255,255,0.14)",
              background: on ? "var(--sys-accent)" : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

function BlinkCursor({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      aria-hidden
      className="ml-1 inline-block w-[8px] align-middle"
      style={{
        height: 18,
        background: "rgba(255,255,255,0.65)",
        animation: "introCursorBlink 920ms linear infinite",
      }}
    />
  );
}

function useTypewriter(text: string, opts: { speedMs: number; glitch?: boolean }) {
  const { speedMs, glitch = false } = opts;
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    let t: number | undefined;

    const tick = () => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) return;
      t = window.setTimeout(tick, speedMs);
    };

    t = window.setTimeout(tick, speedMs);
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [text, speedMs]);

  useEffect(() => {
    if (!glitch) return;
    if (!out) return;
    const chars = "!@#$%^&*()_+-=[]{};:,.<>?";
    let raf = 0;
    const start = performance.now();
    const duration = 520;
    const loop = (now: number) => {
      if (now - start > duration) return;
      if (Math.random() < 0.06) {
        const idx = Math.floor(Math.random() * Math.max(1, out.length));
        const g = chars[Math.floor(Math.random() * chars.length)];
        setOut((prev) => prev.slice(0, idx) + g + prev.slice(idx + 1));
        setTimeout(() => setOut((prev) => text.slice(0, prev.length)), 28);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [glitch, out.length, text]);

  return out;
}


