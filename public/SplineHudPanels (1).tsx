"use client";

/**
 * SplineHudPanels
 * ─────────────────────────────────────────────────────────────────
 * 4 painéis HUD que aparecem quando o mouse está sobre o Spline.
 *
 * Já está integrado no HomeSystem.tsx:
 *   <SplineHudPanels visible={splineHovered} />
 *
 * Posição: absolute inset-0 z-[16], mesmo container do Hero3DHub.
 * Não toca em nada fora da coluna central.
 * ─────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  visible: boolean;
};

// ─── Corner brackets, mesmo estilo do SystemPanel ────────────────
function Corners() {
  return (
    <>
      <span className="pointer-events-none absolute left-[-1px] top-[-1px] block h-[8px] w-[8px] border-l-[1.5px] border-t-[1.5px] border-[#ff2020]" />
      <span className="pointer-events-none absolute bottom-[-1px] right-[-1px] block h-[8px] w-[8px] border-b-[1.5px] border-r-[1.5px] border-[#ff2020]" />
    </>
  );
}

// ─── Blink dot ────────────────────────────────────────────────────
function Dot() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="ml-auto inline-block h-[5px] w-[5px] flex-shrink-0 bg-[#ff2020]"
    />
  );
}

// ─── Panel shell ──────────────────────────────────────────────────
function Panel({
  title,
  sub,
  delay,
  className,
  children,
}: {
  title: string;
  sub: string;
  delay: number;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: "easeOut", delay }}
      className={`absolute border border-[#c41e1e] bg-[rgba(6,6,6,0.92)] backdrop-blur-sm ${className}`}
    >
      <Corners />

      {/* Header */}
      <div className="flex items-center gap-[5px] border-b border-[rgba(196,30,30,0.3)] px-[7px] py-[4px]">
        <span className="font-[var(--font-geist-mono)] text-[8px] font-bold uppercase tracking-[0.16em] text-white/75">
          {title}
        </span>
        <span className="font-[var(--font-geist-mono)] text-[7px] uppercase tracking-[0.13em] text-white/24">
          {sub}
        </span>
        <Dot />
      </div>

      {/* Body */}
      <div className="px-[7px] py-[6px]">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────
function Row({
  label,
  value,
  red,
}: {
  label: string;
  value: string;
  red?: boolean;
}) {
  return (
    <div className="mb-[4px] flex items-baseline justify-between gap-2">
      <span className="font-[var(--font-geist-mono)] text-[7px] uppercase tracking-[0.14em] text-white/27">
        {label}
      </span>
      <span
        className="font-[var(--font-geist-mono)] text-[7.5px] font-bold uppercase tracking-[0.1em]"
        style={{ color: red ? "#ff3030" : "rgba(255,255,255,0.6)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function SplineHudPanels({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          className="pointer-events-none absolute inset-0 z-[16]"
          aria-hidden
        >
          {/* ── TOP LEFT, nome + stack do projecto ── */}
          <Panel
            title="OBJ"
            sub="// ACTIVE"
            delay={0}
            className="left-4 top-4 w-[148px]"
          >
            <div className="mb-[2px] font-[var(--font-geist-mono)] text-[15px] font-bold uppercase leading-none tracking-[0.04em] text-white/86">
              VOID
            </div>
            <div className="mb-[6px] font-[var(--font-geist-mono)] text-[7px] uppercase tracking-[0.15em] text-white/25">
              2025 · 3D OBJECT
            </div>
            <Row label="Stack"  value="React · Spline" />
            <Row label="Status" value="LIVE" red />
          </Panel>

          {/* ── TOP RIGHT, node activo ── */}
          <Panel
            title="NODE"
            sub="01"
            delay={0.05}
            className="right-4 top-4 w-[132px]"
          >
            <div
              className="mb-[2px] font-[var(--font-geist-mono)] text-[13px] font-bold uppercase leading-none tracking-[0.04em]"
              style={{ color: "#ff3030" }}
            >
              WORK
            </div>
            <div className="mb-[6px] font-[var(--font-geist-mono)] text-[7px] uppercase tracking-[0.15em] text-white/25">
              STATUS: ACTIVE
            </div>
            <Row label="Mode"  value="Interactive" />
            <Row label="Input" value="Pointer" />
          </Panel>

          {/* ── BOTTOM LEFT, etimologia / definição ── */}
          <Panel
            title="SYS"
            sub="// DEF"
            delay={0.1}
            className="bottom-4 left-4 w-[152px]"
          >
            <div className="mb-[6px] font-[var(--font-geist-mono)] text-[9px] uppercase leading-[1.65] tracking-[0.07em] text-white/65">
              VOID (EMPTY SPACE)
              <br />
              + MODULE (3D LAYER)
            </div>
            <div className="font-[var(--font-geist-mono)] text-[9px] font-bold uppercase tracking-[0.1em] text-white/85">
              → SPATIAL INTERFACE
            </div>
          </Panel>

          {/* ── BOTTOM RIGHT, coordenadas live ── */}
          <Panel
            title="COORD"
            sub="// LIVE"
            delay={0.15}
            className="bottom-4 right-4 w-[128px]"
          >
            <Row label="X" value="0.000" />
            <Row label="Y" value="0.000" />
            <Row label="Q" value="0.00"  />
            <div className="my-[5px] h-px bg-white/[0.05]" />
            <Row label="Grid" value="DYNAMIC" />
          </Panel>
        </div>
      )}
    </AnimatePresence>
  );
}
