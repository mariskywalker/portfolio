"use client";

import type { HomeMode, HomeModeId } from "../modes";
import { SystemPanel } from "./SystemPanel";

type Props = {
  selectedMode: HomeMode;
  selectedId: HomeModeId;
  hoveredMode: HomeMode | null;
  splineHovered: boolean;
  /** "void" | "heinz", define o conteúdo do visor quando splineHovered */
  activeSplineSceneId?: string;
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

const SPLINE_VISOR_CONTENT = {
  void: {
    title: "VOID",
    sub: "VOID /01",
    description: "Pointer detected on spatial layer. Project details live. Click nodes to lock selection.",
  },
  heinz: {
    title: "HEINZ BOTTLE",
    sub: "HEINZ /02",
    description: "Pointer detected on spatial layer. Heinz Dip to Win, 3D bottle as product trailer. Click nodes to lock selection.",
  },
} as const;

export function InfoPanel({
  selectedMode,
  selectedId,
  hoveredMode,
  splineHovered,
  activeSplineSceneId = "void",
  visorInfo = null,
}: Props) {
  const mode = hoveredMode || selectedMode;
  const source = splineHovered ? "SPLINE" : hoveredMode ? "HOVER" : "SELECT";
  const isOverride = !!visorInfo;
  const splineContent = SPLINE_VISOR_CONTENT[activeSplineSceneId === "heinz" ? "heinz" : "void"];

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
            <div
              className={`text-[13px] uppercase tracking-[0.22em] text-white/60 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
            >
              {isOverride
                ? visorInfo.kicker
                : splineHovered
                  ? "PROJECT VISOR"
                  : hoveredMode
                    ? "HOVER NODE"
                    : "ACTIVE NODE"}
            </div>
            <div
              className={`mt-2 text-[22px] font-semibold uppercase tracking-[0.02em] text-white ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-heading"}`}
            >
              {isOverride ? visorInfo.title : splineHovered ? splineContent.title : mode.label}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
              {isOverride ? "" : mode.index}
            </div>
            <div className="mt-1 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/35">
              {isOverride ? visorInfo.metaRight : `STATUS: ${mode.status.toUpperCase()}`}
            </div>
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-white/10" />

        <div
          className={`mt-5 text-[13px] uppercase tracking-[0.22em] text-white/55 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
        >
          {isOverride ? visorInfo.title : splineHovered ? splineContent.sub : mode.title}
        </div>
        <p
          className={`mt-3 text-[13px] leading-relaxed tracking-[0.06em] text-white/55 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
        >
          {isOverride
            ? visorInfo.description
            : splineHovered
              ? splineContent.description
              : mode.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="border border-white/10 p-3">
            <div
              className={`text-[13px] uppercase tracking-[0.22em] text-white/45 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
            >
              TARGET
            </div>
            <div
              className={`mt-2 truncate text-[13px] font-semibold uppercase tracking-[0.22em] text-white/75 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
            >
              {isOverride
                ? visorInfo.target
                : splineHovered
                  ? activeSplineSceneId === "heinz"
                    ? "/projects/heinz"
                    : "--"
                  : mode.href
                    ? mode.href.replace(/^https?:\/\//, "")
                    : "--"}
            </div>
          </div>
          <div className="border border-white/10 p-3">
            <div
              className={`text-[13px] uppercase tracking-[0.22em] text-white/45 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
            >
              ACTION
            </div>
            <div
              className={`mt-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/75 ${splineHovered && !isOverride ? "font-[var(--font-void)]" : "font-[var(--font-geist-mono)]"}`}
            >
              {isOverride
                ? visorInfo.action
                : splineHovered
                  ? activeSplineSceneId === "heinz"
                    ? "ENTER"
                    : "--"
                  : mode.status === "locked"
                    ? "DENIED"
                    : mode.status === "external"
                      ? "OPEN"
                      : "ENTER"}
            </div>
          </div>
        </div>
      </SystemPanel>
    </aside>
  );
}

