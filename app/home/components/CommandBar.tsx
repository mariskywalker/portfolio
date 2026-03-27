"use client";

import type { HomeMode } from "../modes";

type Props = {
  hoveredMode: HomeMode;
  activeModeId: HomeMode["id"];
  onEnter: () => void;
};

export function CommandBar({ hoveredMode, activeModeId, onEnter }: Props) {
  const canEnter = hoveredMode.status !== "locked";
  const accent = hoveredMode.status !== "locked";
  const verb =
    hoveredMode.status === "external"
      ? "OPEN EXTERNAL"
      : hoveredMode.status === "locked"
        ? "LOCKED"
        : "ENTER SYSTEM";

  return (
    <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-30">
      <div
        className="h-px w-full"
        style={{ background: accent ? "var(--sys-accent)" : "rgba(255,255,255,0.10)", opacity: 0.6 }}
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/60">
            MODE: {hoveredMode.label} / {hoveredMode.index}{" "}
            / ACTIVE: {activeModeId.toUpperCase()}
          </div>
          <div className="truncate font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/40">
            COORD: X {String(Math.floor(41 + hoveredMode.label.length * 7)).padStart(3, "0")} / Y{" "}
            {String(Math.floor(17 + hoveredMode.index.length * 5)).padStart(3, "0")} / Q 0.72
          </div>
        </div>

        <button
          type="button"
          onClick={onEnter}
          disabled={!canEnter}
          className={[
            "shrink-0 select-none border bg-black/60 px-4 py-2",
            "font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.22em] text-white",
            "transition-[transform,background-color,border-color,opacity] duration-150 ease-linear",
            canEnter
              ? "hover:-translate-y-[1px] hover:bg-black/75 active:translate-y-0"
              : "cursor-not-allowed opacity-50",
          ].join(" ")}
          style={{
            borderColor: canEnter ? "var(--sys-accent)" : "rgba(255,255,255,0.25)",
            color: canEnter ? "var(--sys-accent)" : "rgba(255,255,255,0.75)",
          }}
        >
          &gt;_ {verb}
        </button>
      </div>
    </div>
  );
}

