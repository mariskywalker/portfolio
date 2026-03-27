# Home Interface — Spline Interactions (código para revisão)

Este documento contém o código relevante da interface home e das interações com o Spline 3D.

---

## Fluxo geral

1. **Hero3DHub** renderiza o Spline e deteta `pointerenter` / `pointerleave` no container.
2. Quando o utilizador passa o rato sobre o Spline → `splineHovered = true`.
3. Com `splineHovered`:
   - **VoidCallouts** — callouts estilo Sutera (linhas finas + caixas de texto) sobre a cena.
   - **SplineHudPanels** — painéis HUD (CHANGE REALITY, LOCAL TIME) nos cantos.
   - **InfoPanel** — muda para modo "VOID" (fonte VCR OSD Mono, texto específico).

4. **introScroll** (0–1) controla quando os elementos aparecem:
   - InfoPanel e VoidCallouts: `introScroll >= 0.22`
   - SelectionGrid (NODE GRID): `introScroll >= 0.28`

---

## 1. HomeSystem.tsx (secção hero + Spline)

```tsx
// Estado
const [splineHovered, setSplineHovered] = useState(false);

// Na secção hero (h-[100svh]):
<section className="relative h-[100svh] w-full">
  <div className="absolute inset-0 pt-[56px] pb-[72px]">
    <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-12 gap-0 px-0 md:px-0">
      {/* Coluna esquerda vazia */}
      <div className="col-span-12 h-full md:col-span-4" />

      {/* Coluna central — Spline + overlays */}
      <section className="relative col-span-12 h-full md:col-span-4">
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: introScroll >= 0.22 ? 1 : 0,
              scale: introScroll >= 0.22 ? 1 : 0.98,
            }}
            transition={{ duration: 0.18, ease: "linear" }}
            className="relative z-20 h-full w-full"
          >
            <Hero3DHub
              scene={DEFAULT_SPLINE}
              pulseKey={selectedId}
              onHoverChange={(h) => setSplineHovered(h)}
            />
            <VoidCallouts visible={splineHovered && introScroll >= 0.22} />
            <SplineHudPanels visible={splineHovered} />
          </motion.div>
        </div>
      </section>

      {/* Coluna direita — SYSTEM VISOR + NODE GRID */}
      <div className="col-span-12 h-full md:col-span-4">
        <div className="h-full p-2 md:p-3">
          <div className="flex h-full flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{
                opacity: introScroll >= 0.22 ? 1 : 0,
                y: introScroll >= 0.22 ? 0 : 26,
              }}
              transition={{ duration: 0.18, ease: "linear" }}
              className="min-h-[280px] flex-1 shrink-0"
            >
              <InfoPanel
                selectedMode={selectedMode}
                selectedId={selectedId}
                hoveredMode={hoveredMode}
                splineHovered={splineHovered}
                visorInfo={visorInfo}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{
                opacity: introScroll >= 0.28 ? 1 : 0,
                y: introScroll >= 0.28 ? 0 : 26,
              }}
              transition={{ duration: 0.18, ease: "linear" }}
              className="min-h-0 flex-1"
            >
              <SelectionGrid
                modes={HOME_MODES}
                hoveredId={hoveredId}
                selectedId={selectedId}
                onHover={setHoveredId}
                onSelect={handleSelect}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 2. Hero3DHub.tsx

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { SplineScene } from "@/app/components/SplineScene";

type Props = {
  scene: string;
  pulseKey?: string;
  onHoverChange?: (hovered: boolean) => void;
};

export function Hero3DHub({ scene, pulseKey, onHoverChange }: Props) {
  const hubRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const HUB_SCALE = 1;

  useEffect(() => {
    const node = hubRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const animate = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotateX(${(-cy) * 0.06}deg) rotateY(${cx * 0.07}deg)`;
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      tx = Math.max(-18, Math.min(18, nx * 18));
      ty = Math.max(-14, Math.min(14, ny * 14));
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    window.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", () => setHovered(true));
    node.addEventListener("pointerleave", () => {
      setHovered(false);
      onLeave();
    });

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    onHoverChange?.(hovered);
  }, [hovered, onHoverChange]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div style={{ transform: `scale(${HUB_SCALE})`, transformOrigin: "center" }}>
        <div
          key={pulseKey}
          ref={hubRef}
          className="homeHubPulse relative h-[min(74vmin,720px)] w-[min(74vmin,720px)]"
          style={{
            animation: "homeHubFloat 6.5s linear infinite",
            boxShadow: "0 28px 140px rgba(0,0,0,0.55)",
            willChange: "transform, filter",
          }}
        >
          <SplineScene
            scene={scene}
            className="absolute inset-0 h-full w-full"
            style={{
              borderRadius: 0,
              border: "none",
              background: "transparent",
              minHeight: 0,
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        @keyframes homeHubFloat {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .homeHubPulse {
          animation: homeHubPulse 340ms linear 1;
        }
        @keyframes homeHubPulse {
          0% { filter: brightness(1) contrast(1); }
          45% { filter: brightness(1.08) contrast(1.05); }
          100% { filter: brightness(1) contrast(1); }
        }
      `}</style>
    </div>
  );
}
```

---

## 3. SplineScene.tsx

```tsx
"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

type Props = {
  scene: string;
  className?: string;
  style?: React.CSSProperties;
};

export function SplineScene({ scene, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactiveLayerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ top: event.deltaY * multiplier, behavior: "auto" });
    };
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    const interactiveLayer = interactiveLayerRef.current;
    if (!node || !interactiveLayer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const nx = (relativeX - 0.5) * 2;
      const ny = (relativeY - 0.5) * 2;
      interactiveLayer.style.transform = `translate3d(${nx * 9}px, ${ny * 7}px, 0) scale(1.01)`;
    };

    const handlePointerLeave = () => {
      interactiveLayer.style.transform = "translate3d(0, 0, 0) scale(1)";
    };

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  if (!scene || scene === "loading...") return null;
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        touchAction: "pan-y",
        ...style,
      }}
    >
      <div
        ref={interactiveLayerRef}
        className="relative"
        style={{
          width: "100%",
          height: "100%",
          minHeight: 320,
          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <Suspense fallback={<SplineLoading />}>
          <Spline
            scene={scene}
            renderOnDemand={true}
            onLoad={() => setLoaded(true)}
            style={{ width: "100%", height: "100%", minHeight: 320 }}
          />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## 4. SplineHudPanels.tsx

```tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  visible: boolean;
};

export function SplineHudPanels({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[16]" aria-hidden>
      <div className="relative h-full w-full">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 top-4 border border-white/35 bg-black/75 px-4 py-2.5 backdrop-blur-sm"
        >
          <div className="font-[var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-white/80">
            CHANGE REALITY
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="absolute right-4 top-4 border border-white/35 bg-black/75 px-4 py-2.5 backdrop-blur-sm"
        >
          <div className="font-[var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-white/80">
            LOCAL TIME
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 5. VoidCallouts.tsx

```tsx
"use client";

import { motion } from "framer-motion";

type Callout = {
  id: string;
  anchorPercent: { x: number; y: number };
  boxSide: "left" | "right";
  title: string;
  index: string;
  lines: string[];
};

const CALLOUTS: Callout[] = [
  {
    id: "void-main",
    anchorPercent: { x: 52, y: 55 },
    boxSide: "right",
    title: "VOID",
    index: "/01",
    lines: ["VOID (EMPTY SPACE)", "+ MODULE (3D LAYER)", "→ SPATIAL INTERFACE"],
  },
  {
    id: "void-tagline",
    anchorPercent: { x: 38, y: 38 },
    boxSide: "left",
    title: "",
    index: "",
    lines: ["WHERE IMAGINATION BRANCHES INTO A LANDSCAPE OF ENDLESS DIVERSITY"],
  },
];

export function VoidCallouts({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[15]">
      <div className="relative h-full w-full">
        {CALLOUTS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: i * 0.12 }}
            className="absolute"
            style={{
              left: `${c.anchorPercent.x}%`,
              top: `${c.anchorPercent.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute left-0 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 border border-black bg-black" />

            {c.boxSide === "right" ? (
              <>
                <svg className="absolute left-4 top-0" width={140} height={80} style={{ transform: "translateY(-50%)" }}>
                  <path d="M 0 0 H 60 L 120 35 V 55" fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth="1" />
                </svg>
                <div className="absolute left-[100px] top-4 min-w-[200px] max-w-[260px] border border-black bg-white/95 p-3" style={{ fontFamily: "var(--font-void)" }}>
                  {c.title && (
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-black">{c.title}</span>
                      <span className="text-[10px] text-black/55">{c.index}</span>
                    </div>
                  )}
                  <div className="space-y-0.5 text-[10px] uppercase leading-tight tracking-wider text-black/85">
                    {c.lines.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <svg className="absolute right-2 top-0" width={120} height={60} style={{ transform: "translateY(-50%)" }}>
                  <path d="M 120 30 L 60 30 L 0 0" fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth="1" />
                </svg>
                <div className="absolute right-full top-2 mr-2 min-w-[200px] max-w-[260px] border border-black bg-white/95 p-3 text-right" style={{ fontFamily: "var(--font-void)" }}>
                  <div className="space-y-0.5 text-[10px] uppercase leading-tight tracking-wider text-black/85">
                    {c.lines.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. InfoPanel.tsx

```tsx
"use client";

import type { HomeMode, HomeModeId } from "../modes";
import { SystemPanel } from "./SystemPanel";

type Props = {
  selectedMode: HomeMode;
  selectedId: HomeModeId;
  hoveredMode: HomeMode | null;
  splineHovered: boolean;
  visorInfo?: VisorHoverInfo | null;
};

export type VisorHoverInfo = {
  metaLeft: string;
  metaRight: string;
  kicker: string;
  title: string;
  description: string;
  target: string;
  action: string;
};

export function InfoPanel({
  selectedMode,
  selectedId,
  hoveredMode,
  splineHovered,
  visorInfo = null,
}: Props) {
  const mode = hoveredMode || selectedMode;
  const source = splineHovered ? "SPLINE" : hoveredMode ? "HOVER" : "SELECT";
  const isOverride = !!visorInfo;

  return (
    <aside className="pointer-events-auto h-full">
      <SystemPanel
        title="SYSTEM VISOR"
        metaLeft={isOverride ? visorInfo.metaLeft : `${source} / ${mode.index}`}
        metaRight={isOverride ? visorInfo.metaRight : `STATUS: ${mode.status.toUpperCase()}`}
        tone={selectedId === "work" ? "active" : "default"}
        className="h-full shadow-[0_22px_90px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className={`text-[11px] uppercase tracking-[0.22em] text-white/60 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}>
              {isOverride ? visorInfo.kicker : splineHovered ? "PROJECT VISOR" : hoveredMode ? "HOVER NODE" : "ACTIVE NODE"}
            </div>
            <div className={`mt-2 text-[22px] font-semibold uppercase tracking-[0.02em] text-white ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-heading"}`}>
              {isOverride ? visorInfo.title : splineHovered ? "VOID" : mode.label}
            </div>
          </div>
          {/* ... resto do painel ... */}
        </div>

        <div className="mt-5 h-px w-full bg-white/10" />

        <div className={`mt-5 text-[11px] uppercase tracking-[0.22em] text-white/55 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}>
          {isOverride ? visorInfo.title : splineHovered ? `VOID /01` : mode.title}
        </div>
        <p className={`mt-3 text-[12px] leading-relaxed tracking-[0.06em] text-white/55 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}>
          {isOverride
            ? visorInfo.description
            : splineHovered
              ? "Pointer detected on spatial layer. Project details live. Click nodes to lock selection."
              : mode.description}
        </p>

        {/* TARGET / ACTION grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* ... */}
        </div>
      </SystemPanel>
    </aside>
  );
}
```

---

## Ordem de z-index (coluna central)

| Elemento       | z-index | Descrição                          |
|----------------|---------|------------------------------------|
| Hero3DHub      | z-10    | Container do Spline                |
| VoidCallouts   | z-[15]  | Callouts sobre a cena              |
| SplineHudPanels| z-[16]  | Painéis HUD (CHANGE REALITY, etc.) |

---

## Dependências

- `@splinetool/react-spline` — renderização 3D
- `framer-motion` — animações
- `--font-void` — VCR OSD Mono (definida em `globals.css` / `layout.tsx`)
