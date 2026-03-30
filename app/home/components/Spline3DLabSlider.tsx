"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero3DHub } from "./Hero3DHub";
import { SplineHudPanels } from "./SplineHudPanels";

export type SplineLabScene = {
  id: string;
  scene: string;
  label: string;
  /** "portrait" = taller container para objetos verticais (ex: garrafa); "square" = quadrado */
  aspect?: "square" | "portrait";
};

const DEFAULT_SCENES: SplineLabScene[] = [
  {
    id: "void",
    scene:
      process.env.NEXT_PUBLIC_SPLINE_SCENE ||
      "https://prod.spline.design/PzhATh1DbVo2Xhdn/scene.splinecode",
    label: "VOID",
    aspect: "square",
  },
  {
    id: "heinz",
    scene: "https://prod.spline.design/6wFweH-Zf7ncXJhT/scene.splinecode?v=2",
    label: "HEINZ BOTTLE",
    aspect: "portrait",
  },
];

type Props = {
  scenes?: SplineLabScene[];
  pulseKey?: string;
  splineHovered?: boolean;
  splinePointerCoords?: { x: number; y: number } | null;
  onHoverChange?: (hovered: boolean) => void;
  onPointerMove?: (x: number, y: number) => void;
  onActiveSceneChange?: (sceneId: string) => void;
};

export function Spline3DLabSlider({
  scenes = DEFAULT_SCENES,
  pulseKey,
  splineHovered = false,
  splinePointerCoords = null,
  onHoverChange,
  onPointerMove,
  onActiveSceneChange,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Home mobile: remove the HEINZ bottle from the Spline hub.
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const scenesToUse = isMobile ? scenes.filter((s) => s.id === "void") : scenes;
  const active = scenesToUse[activeIndex] ?? scenesToUse[0];

  // Clamp index when scene list changes (e.g. switching between mobile/desktop)
  useEffect(() => {
    setActiveIndex(0);
  }, [isMobile]);

  // Report active scene when it changes
  useEffect(() => {
    onActiveSceneChange?.(active.id);
  }, [active.id, onActiveSceneChange]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const handlePointerEnter = useCallback(() => {
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handlePointerLeave = useCallback(() => {
    onHoverChange?.(false);
  }, [onHoverChange]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      onPointerMove?.(relX, relY);
    },
    [onPointerMove]
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* HUD panels, mesmo comportamento da Void para todas as cenas (texto Void mantido para edição manual) */}
      <SplineHudPanels
        visible={splineHovered}
        pointerCoords={splinePointerCoords}
        activeSceneId={active.id}
      />
      {/* 3D Lab label */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 flex items-center gap-2">
        <span className="font-[var(--font-geist-mono)] text-[11px] uppercase tracking-[0.28em] text-white/35">
          3D LAB
        </span>
        <span className="h-px w-8 bg-white/20" />
        <span className="font-[var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-white/50">
          {active.label}
        </span>
      </div>

      {/* Spline viewport, captura hover/coords para HUD em todas as cenas */}
      <div
        ref={viewportRef}
        className="relative h-full w-full flex-1 overflow-hidden"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 z-10"
          >
            <Hero3DHub
              scene={active.scene}
              pulseKey={`${pulseKey}-${active.id}`}
              aspect={active.aspect ?? "square"}
              onHoverChange={undefined}
              onPointerMove={undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal nav dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {scenesToUse.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group flex items-center gap-2 transition-colors"
            aria-label={`Switch to ${s.label}`}
          >
            <span
              className={`h-[6px] w-[6px] rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "bg-[color:var(--sys-accent)] ring-2 ring-[color:var(--sys-accent)]/40 ring-offset-2 ring-offset-transparent"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
            <span
              className={`font-[var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] transition-colors ${
                i === activeIndex ? "text-white/80" : "text-white/40 group-hover:text-white/60"
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Arrow nav (optional, for keyboard/swipe) */}
      {scenes.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i - 1 + scenes.length) % scenes.length)}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded border border-white/15 bg-black/40 px-2 py-3 font-[var(--font-geist-mono)] text-[13px] text-white/60 transition-colors hover:border-white/30 hover:bg-black/60 hover:text-white/90"
            aria-label="Previous 3D scene"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i + 1) % scenesToUse.length)}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded border border-white/15 bg-black/40 px-2 py-3 font-[var(--font-geist-mono)] text-[13px] text-white/60 transition-colors hover:border-white/30 hover:bg-black/60 hover:text-white/90"
            aria-label="Next 3D scene"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
