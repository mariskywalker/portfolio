"use client";

/**
 * SplineHudPanels
 * ─────────────────────────────────────────────────────────────────
 * 4 HUD panels that appear on hover of the Spline 3D object.
 *
 * HOW TO USE, drop inside the Spline column in HomeSystem.tsx:
 *
 *   <section className="relative col-span-12 h-full md:col-span-4">
 *     <div className="absolute inset-0">
 *       <motion.div className="relative z-20 h-full w-full">
 *
 *         ← your existing Spline wrapper, unchanged →
 *         <Hero3DHub
 *           scene={DEFAULT_SPLINE}
 *           pulseKey={selectedId}
 *           onHoverChange={(h) => setSplineHovered(h)}   ← already exists
 *         />
 *         <VoidCallouts visible={splineHovered && introScroll >= 0.22} />
 *
 *         ← add this one line, nothing else changes →
 *         <SplineHudPanels
 *           visible={splineHovered}                       ← same flag you already have
 *           activeNode={selectedMode.index}               ← e.g. "NODE 01"
 *           activeLabel={selectedMode.label}              ← e.g. "WORK"
 *         />
 *
 *       </motion.div>
 *     </div>
 *   </section>
 *
 * The panels are absolute-positioned inside the Spline container.
 * They do NOT affect layout, other sections, or existing components.
 * ─────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from "framer-motion";

// ─── Props ────────────────────────────────────────────────────────
export interface SplineHudPanelsProps {
  /** Tie directly to splineHovered from HomeSystem */
  visible: boolean;
  /** From selectedMode.index, e.g. "NODE 01" */
  activeNode?: string;
  /** From selectedMode.label, e.g. "WORK" */
  activeLabel?: string;
  /** 3D object name shown in TL panel */
  projectName?: string;
  /** Year shown in TL panel */
  projectYear?: string;
  /** Tech stack shown in TL panel */
  projectStack?: string;
  /** Live coords from Hero3DHub mousemove (optional) */
  coords?: { x: number; y: number; q: number };
}

// ─── Corner brackets (same style as SystemPanel) ──────────────────
function Corners() {
  return (
    <>
      <span className="pointer-events-none absolute left-[-1px] top-[-1px] block h-[8px] w-[8px] border-l-[1.5px] border-t-[1.5px] border-[#ff2020]" />
      <span className="pointer-events-none absolute bottom-[-1px] right-[-1px] block h-[8px] w-[8px] border-b-[1.5px] border-r-[1.5px] border-[#ff2020]" />
    </>
  );
}

// ─── Blinking status dot ──────────────────────────────────────────
function BlinkDot() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="ml-auto inline-block h-[5px] w-[5px] flex-shrink-0 bg-[#ff2020]"
    />
  );
}

// ─── Single HUD panel ─────────────────────────────────────────────
function HudPanel({
  title,
  sub,
  delay,
  position,
  children,
}: {
  title: string;
  sub: string;
  delay: number;
  /** Which corner of the Spline container to anchor to */
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  children: React.ReactNode;
}) {
  const posClass = {
    "top-left":     "top-3 left-3",
    "top-right":    "top-3 right-3",
    "bottom-left":  "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  }[position];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{    opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
      className={`absolute z-30 w-[148px] border border-[#c41e1e] bg-[rgba(6,6,6,0.93)] backdrop-blur-sm ${posClass}`}
    >
      <Corners />

      {/* Header */}
      <div className="flex items-center gap-[5px] border-b border-[rgba(196,30,30,0.3)] px-[7px] py-[4px]">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/75">
          {title}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-white/24">
          {sub}
        </span>
        <BlinkDot />
      </div>

      {/* Body */}
      <div className="px-[7px] py-[6px]">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Row helper ───────────────────────────────────────────────────
function Row({ label, value, red }: { label: string; value: string; red?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 mb-[4px]">
      <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/27">
        {label}
      </span>
      <span
        className="font-mono text-[7.5px] font-bold uppercase tracking-[0.1em]"
        style={{ color: red ? "#ff3030" : "rgba(255,255,255,0.6)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────
export function SplineHudPanels({
  visible,
  activeNode  = "NODE 01",
  activeLabel = "WORK",
  projectName = "VOID",
  projectYear = "2025",
  projectStack = "React · Spline · TS",
  coords,
}: SplineHudPanelsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── TOP LEFT, 3D object identity ── */}
          <HudPanel title="OBJ" sub="// ACTIVE" delay={0} position="top-left">
            <div className="mb-[2px] font-mono text-[15px] font-bold uppercase leading-none tracking-[0.04em] text-white/86">
              {projectName}
            </div>
            <div className="mb-[6px] font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
              {projectYear} · 3D OBJECT
            </div>
            <Row label="Stack"  value={projectStack} />
            <Row label="Status" value="LIVE" red />
          </HudPanel>

          {/* ── TOP RIGHT, active node / navigation state ── */}
          <HudPanel title="NODE" sub={activeNode} delay={0.05} position="top-right">
            <div
              className="mb-[2px] font-mono text-[13px] font-bold uppercase leading-none tracking-[0.04em]"
              style={{ color: "#ff3030" }}
            >
              {activeLabel}
            </div>
            <div className="mb-[6px] font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
              STATUS: ACTIVE
            </div>
            <Row label="Mode"  value="Interactive" />
            <Row label="Input" value="Pointer" />
          </HudPanel>

          {/* ── BOTTOM LEFT, project etymology / definition ── */}
          <HudPanel title="SYS" sub="// DEF" delay={0.1} position="bottom-left">
            <div className="mb-[6px] font-mono text-[9px] uppercase leading-[1.65] tracking-[0.07em] text-white/65">
              VOID (EMPTY SPACE)
              <br />
              + MODULE (3D LAYER)
            </div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/85">
              → SPATIAL INTERFACE
            </div>
          </HudPanel>

          {/* ── BOTTOM RIGHT, live coordinates from Hero3DHub ── */}
          <HudPanel title="COORD" sub="// LIVE" delay={0.15} position="bottom-right">
            <Row label="X" value={coords ? coords.x.toFixed(3) : "0.000"} />
            <Row label="Y" value={coords ? coords.y.toFixed(3) : "0.000"} />
            <Row label="Q" value={coords ? coords.q.toFixed(2)  : "0.00"}  />
            <div className="my-[5px] h-px bg-white/[0.05]" />
            <Row label="Grid" value="DYNAMIC" />
          </HudPanel>
        </>
      )}
    </AnimatePresence>
  );
}
