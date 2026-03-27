"use client";

import type { HomeMode, HomeModeId } from "../modes";
import { AnimatePresence, motion } from "framer-motion";
import { SystemPanel } from "./SystemPanel";

type Props = {
  modes: HomeMode[];
  hoveredId: HomeModeId | null;
  selectedId: HomeModeId;
  onHover: (id: HomeModeId | null) => void;
  onSelect: (id: HomeModeId) => void;
  splineHovered?: boolean;
  /** "void" | "heinz", define a ilustração no NODE GRID quando splineHovered */
  activeSplineSceneId?: string;
};

export function SelectionGrid({
  modes,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  splineHovered = false,
  activeSplineSceneId = "void",
}: Props) {
  return (
    <section className="pointer-events-auto h-full border-r border-white/10 bg-black/35 p-3 md:p-4">
      <SystemPanel
        title="NODE GRID"
        metaLeft="INVENTORY / SELECT"
        metaRight="INPUT: POINTER / GRID: DYNAMIC"
        className="h-full"
      >
        <AnimatePresence>
          {splineHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex justify-center overflow-hidden rounded border border-white/10"
            >
              <img
                src={activeSplineSceneId === "heinz" ? "/57_1.svg" : "/controller.svg"}
                alt={activeSplineSceneId === "heinz" ? "Heinz bottle illustration" : "VOID controller"}
                className="h-auto max-h-[100px] w-auto max-w-[140px] object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedId === "about" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 overflow-hidden rounded border border-white/10 p-3"
            >
              {activeSplineSceneId === "heinz" ? (
                <>
                  <div className="font-[var(--font-geist-mono)] text-[13px] font-bold uppercase tracking-[0.18em] text-white/90">
                    Approach, Heinz
                  </div>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
                    The landing page was built as a scroll-based cinematic system, where:
                  </p>
                  <ul className="mt-2 space-y-1 font-[var(--font-geist-mono)] text-[13px] leading-[1.5] tracking-[0.04em] text-white/65">
                    <li>• The bottle (3D, built in Spline) reacts to scroll progression</li>
                    <li>• Camera movement replaces traditional navigation</li>
                    <li>• UI elements enter and exit as part of the scene, not as overlays</li>
                  </ul>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
                    Instead of sections, the experience unfolds in moments.
                  </p>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
                    Each scroll gesture becomes a trigger:
                  </p>
                  <ul className="mt-1 space-y-0.5 font-[var(--font-geist-mono)] text-[13px] leading-[1.5] tracking-[0.04em] text-white/65">
                    <li>• rotation</li>
                    <li>• depth shifts</li>
                    <li>• layered transitions</li>
                    <li>• timing-based reveals</li>
                  </ul>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/75">
                    The page doesn&apos;t just scroll, it performs.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src="/about/void-node-02-talk.png"
                      alt="VOID presentation moment"
                      className="h-auto w-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="font-[var(--font-geist-mono)] text-[13px] font-bold uppercase tracking-[0.18em] text-white/90">
                    About, VOID
                  </div>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
                    VOID is a hardware experiment that explores the boundary between
                    interface, body, and absence. It starts from a simple provocation:
                    what if an interface wasn&apos;t seen, but felt?
                  </p>
                  <p className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
                    Instead of screens, dashboards, or explicit feedback, VOID operates
                    through silent presence, a physical system that responds and
                    communicates without relying on traditional UI.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {modes.map((mode) => {
            const isHovered = hoveredId === mode.id;
            const isSelected = selectedId === mode.id;
            const isLocked = mode.status === "locked";
            const accentOn = isHovered || isSelected;

            return (
              <motion.button
                key={mode.id}
                type="button"
                onPointerEnter={() => onHover(mode.id)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(mode.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(mode.id)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.14, ease: "linear" }}
                className={[
                  "group relative overflow-hidden border bg-black/55 p-3 text-left",
                  "transition-[transform,border-color,background-color,filter] duration-150 ease-linear",
                  isSelected ? "bg-black/55" : isHovered ? "bg-white/5" : "",
                  "hover:-translate-y-[1px] active:translate-y-0",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                ].join(" ")}
                style={{
                  borderColor: isSelected
                    ? "var(--sys-accent)"
                    : isHovered
                      ? "rgba(255,90,31,0.55)"
                      : "rgba(255,255,255,0.15)",
                  boxShadow: isSelected ? "0 0 0 1px var(--sys-accent)" : undefined,
                }}
              >
                {isSelected ? (
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[3px] bg-[color:var(--sys-accent)]"
                  />
                ) : null}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
                      {mode.index}
                    </div>
                    <div className="mt-1 font-heading text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
                      {mode.label}
                    </div>
                  </div>

                  <div className="shrink-0 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/35">
                    {isLocked ? "LOCK" : mode.status === "external" ? "EXT" : "OK"}
                  </div>
                </div>

                {/* no preview / no extra labels */}

                <FrameDraw active={accentOn} />
                {/* no glow wash on hover */}
              </motion.button>
            );
          })}
        </div>
      </SystemPanel>
    </section>
  );
}

function FrameDraw({ active }: { active: boolean }) {
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px bg-[color:var(--sys-accent)]"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.16, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 w-px bg-[color:var(--sys-accent)]"
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.03 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-px bg-[color:var(--sys-accent)]"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.06 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-px bg-[color:var(--sys-accent)]"
        initial={{ height: "0%", opacity: 0 }}
        animate={{ height: active ? "100%" : "0%", opacity: active ? 1 : 0 }}
        transition={{ duration: 0.16, ease: "linear", delay: 0.09 }}
      />
    </>
  );
}

