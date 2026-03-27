"use client";

/**
 * SplineHudPanels
 * ─────────────────────────────────────────────────────────────────
 * 4 painéis HUD que aparecem quando o mouse está sobre o Spline.
 * Cada card surge da linha, a linha termina na borda do card.
 * ─────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  visible: boolean;
  pointerCoords?: { x: number; y: number } | null;
  /** "void" | "heinz", define o conteúdo dos cards conforme a cena ativa */
  activeSceneId?: string;
};

function Corners() {
  return (
    <>
      <span className="pointer-events-none absolute left-[-1px] top-[-1px] block h-[8px] w-[8px] border-l-[1.5px] border-t-[1.5px] border-[#ff2020]" />
      <span className="pointer-events-none absolute bottom-[-1px] right-[-1px] block h-[8px] w-[8px] border-b-[1.5px] border-r-[1.5px] border-[#ff2020]" />
    </>
  );
}

function Dot() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="ml-auto inline-block h-[5px] w-[5px] flex-shrink-0 bg-[#ff2020]"
    />
  );
}

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
      className={`absolute max-w-[240px] border border-[#c41e1e] bg-[rgba(6,6,6,0.92)] backdrop-blur-sm ${className}`}
    >
      <Corners />
      <div className="flex items-center gap-[5px] border-b border-[rgba(196,30,30,0.3)] px-[7px] py-[4px]">
        <span className="font-[var(--font-geist-mono)] text-[13px] font-bold uppercase tracking-[0.16em] text-white/75">
          {title}
        </span>
        <span className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.13em] text-white/24">
          {sub}
        </span>
        <Dot />
      </div>
      <div className="px-[7px] py-[6px]">{children}</div>
    </motion.div>
  );
}

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
      <span className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.14em] text-white/27">
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

function fmt(n: number) {
  return n.toFixed(3);
}

export function SplineHudPanels({ visible, pointerCoords = null, activeSceneId = "void" }: Props) {
  const splineTopLeft = { x: 35, y: 35 };
  const splineTopRight = { x: 65, y: 35 };
  const splineBottomLeft = { x: 35, y: 65 };
  const splineBottomRight = { x: 65, y: 65 };

  // Ponto onde a linha termina = borda do card (card surge da linha)
  const lineEndTopLeft = { x: 55, y: 30 };
  const lineEndTopRight = { x: 70, y: 30 };
  const lineEndBottomLeft = { x: 30, y: 70 };
  const lineEndBottomRight = { x: 70, y: 70 };

  const xVal = pointerCoords ? pointerCoords.x : 0.5;
  const yVal = pointerCoords ? pointerCoords.y : 0.5;
  const qVal = pointerCoords ? (pointerCoords.x + pointerCoords.y) / 2 : 0.5;

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="pointer-events-none absolute inset-0 z-[25] hidden items-center justify-center px-4 py-4 sm:px-6 md:flex md:px-8"
          aria-hidden
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-6xl">
            {/* Linhas: Spline → borda do card */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                x1={`${splineTopLeft.x}%`}
                y1={`${splineTopLeft.y}%`}
                x2={`${lineEndTopLeft.x}%`}
                y2={`${lineEndTopLeft.y}%`}
                stroke="#ff2020"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                x1={`${splineTopRight.x}%`}
                y1={`${splineTopRight.y}%`}
                x2={`${lineEndTopRight.x}%`}
                y2={`${lineEndTopRight.y}%`}
                stroke="#ff2020"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                x1={`${splineBottomLeft.x}%`}
                y1={`${splineBottomLeft.y}%`}
                x2={`${lineEndBottomLeft.x}%`}
                y2={`${lineEndBottomLeft.y}%`}
                stroke="#ff2020"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                x1={`${splineBottomRight.x}%`}
                y1={`${splineBottomRight.y}%`}
                x2={`${lineEndBottomRight.x}%`}
                y2={`${lineEndBottomRight.y}%`}
                stroke="#ff2020"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>

            {/* OBJ: linha termina no canto inferior-direito do card → card estende-se para cima e esquerda */}
            <Panel
              title="OBJ"
              sub="// ACTIVE"
              delay={0}
              className="right-[45%] bottom-[70%] w-max max-w-[280px]"
            >
              {activeSceneId === "heinz" ? (
                <>
                  <div className="mb-2 font-[var(--font-geist-mono)] text-[13px] font-bold leading-tight tracking-[0.02em] text-white/90">
                    Heinz, Object of Desire
                  </div>
                  <p className="font-[var(--font-geist-mono)] text-[13px] leading-[1.5] tracking-[0.04em] text-white/65">
                    Heinz is already culturally loaded. The challenge wasn&apos;t to
                    explain the product, it was to amplify its presence.
                  </p>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] font-semibold leading-tight tracking-[0.02em] text-white/80">
                    The idea: treat the bottle like an object of desire.
                  </p>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.5] tracking-[0.04em] text-white/65">
                    Every movement, transition, and interaction was designed to
                    build anticipation, tension, and release, almost like a
                    product trailer.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    <Row label="Stack" value="React + Spline" />
                    <Row label="Status" value="LIVE" red />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 font-[var(--font-geist-mono)] text-[13px] font-bold leading-tight tracking-[0.02em] text-white/90">
                    VOID, Hardware as Interface
                  </div>
                  <div className="mb-2 overflow-hidden rounded border border-white/10">
                    <img
                      src="/void-product-physical.png"
                      alt="VOID physical hardware, PCB, display, buttons, rotary knob"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <p className="font-[var(--font-geist-mono)] text-[13px] leading-[1.5] tracking-[0.04em] text-white/65">
                    VOID is a hardware experiment that explores the boundary between
                    interface, body, and absence. It starts from a simple provocation:
                    what if an interface wasn&apos;t seen, but felt? Instead of screens,
                    dashboards, or explicit feedback, VOID operates through silent
                    presence, a physical system that responds and communicates
                    without relying on traditional UI.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    <Row label="Stack" value="React + Spline" />
                    <Row label="Status" value="LIVE" red />
                  </div>
                </>
              )}
            </Panel>

            {/* NODE: linha termina no canto inferior-esquerdo do card → card estende-se para cima e direita */}
            <Panel
              title="NODE"
              sub={activeSceneId === "heinz" ? "02" : "01"}
              delay={0.05}
              className="left-[70%] bottom-[70%] w-[140px]"
            >
              {activeSceneId === "heinz" ? (
                <>
                  <div
                    className="mb-[2px] font-[var(--font-geist-mono)] text-[13px] font-bold uppercase leading-none tracking-[0.04em]"
                    style={{ color: "#ff3030" }}
                  >
                    HEINZ BOTTLE
                  </div>
                  <div className="mb-[6px] font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.15em] text-white/25">
                    STATUS: ACTIVE
                  </div>
                  <Row label="Mode" value="Product trailer" />
                  <Row label="Input" value="Pointer" />
                </>
              ) : (
                <>
                  <div
                    className="mb-[2px] font-[var(--font-geist-mono)] text-[13px] font-bold uppercase leading-none tracking-[0.04em]"
                    style={{ color: "#ff3030" }}
                  >
                    WORK
                  </div>
                  <div className="mb-[6px] font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.15em] text-white/25">
                    STATUS: ACTIVE
                  </div>
                  <Row label="Mode" value="Interactive" />
                  <Row label="Input" value="Pointer" />
                </>
              )}
            </Panel>

            {/* SYS: linha termina no canto superior-direito do card → card estende-se para baixo e esquerda */}
            <Panel
              title="SYS"
              sub="// DEF"
              delay={0.1}
              className="right-[70%] top-[70%] w-[160px]"
            >
              {activeSceneId === "heinz" ? (
                <>
                  <div className="mb-[6px] font-[var(--font-geist-mono)] text-[13px] uppercase leading-[1.65] tracking-[0.07em] text-white/65">
                    HEINZ (KETCHUP BOTTLE)
                    <br />
                    + SPLINE (3D LAYER)
                  </div>
                  <div className="font-[var(--font-geist-mono)] text-[13px] font-bold uppercase tracking-[0.1em] text-white/85">
                    → PRODUCT TRAILER
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-[6px] font-[var(--font-geist-mono)] text-[13px] uppercase leading-[1.65] tracking-[0.07em] text-white/65">
                    VOID (EMPTY SPACE)
                    <br />
                    + MODULE (3D LAYER)
                  </div>
                  <div className="font-[var(--font-geist-mono)] text-[13px] font-bold uppercase tracking-[0.1em] text-white/85">
                    → SPATIAL INTERFACE
                  </div>
                </>
              )}
            </Panel>

            {/* COORD: linha termina no canto superior-esquerdo do card → card estende-se para baixo e direita */}
            <Panel
              title="COORD"
              sub="// LIVE"
              delay={0.15}
              className="left-[70%] top-[70%] w-[130px]"
            >
              <Row label="X" value={fmt(xVal)} />
              <Row label="Y" value={fmt(yVal)} />
              <Row label="Q" value={fmt(qVal)} />
              <div className="my-[5px] h-px bg-white/[0.05]" />
              <Row label="Grid" value={activeSceneId === "heinz" ? "HEINZ" : "DYNAMIC"} />
            </Panel>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
