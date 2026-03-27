"use client";

type Props = {
  accentActive?: boolean;
  transitionProgress?: number;
};

export function SystemOverlay({ accentActive = false, transitionProgress = 0 }: Props) {
  const p = Math.max(0, Math.min(1, transitionProgress));
  const gridOpacity = 0.42 + p * 0.38; // sharper in section 02
  const noiseOpacity = 0.08 + p * 0.08;
  const labelsOpacity = 0.5 + p * 0.5;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage: [
            // grid lines (subtle red)
            "repeating-linear-gradient(to right, rgba(255,90,31,0.09) 0 1px, transparent 1px 180px)",
            "repeating-linear-gradient(to bottom, rgba(255,90,31,0.08) 0 1px, transparent 1px 180px)",
            // crosshair at intersections (SVG repeated)
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg stroke='rgba(255,90,31,0.55)' stroke-width='1' stroke-linecap='square'%3E%3Cpath d='M0 10 V-0'/%3E%3Cpath d='M0 0 H10'/%3E%3Cpath d='M180 10 V0'/%3E%3Cpath d='M170 0 H180'/%3E%3Cpath d='M0 170 V180'/%3E%3Cpath d='M0 180 H10'/%3E%3Cpath d='M180 170 V180'/%3E%3Cpath d='M170 180 H180'/%3E%3C/g%3E%3Cg stroke='rgba(255,90,31,0.22)' stroke-width='1'%3E%3Cpath d='M0 0 H26'/%3E%3Cpath d='M0 0 V26'/%3E%3Cpath d='M180 0 H154'/%3E%3Cpath d='M180 0 V26'/%3E%3Cpath d='M0 180 H26'/%3E%3Cpath d='M0 180 V154'/%3E%3Cpath d='M180 180 H154'/%3E%3Cpath d='M180 180 V154'/%3E%3C/g%3E%3C/svg%3E\")",
            // sparse star dots
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg fill='rgba(255,255,255,0.10)'%3E%3Ccircle cx='22' cy='38' r='1'/%3E%3Ccircle cx='64' cy='90' r='1'/%3E%3Ccircle cx='112' cy='18' r='1'/%3E%3Ccircle cx='152' cy='66' r='1'/%3E%3Ccircle cx='198' cy='40' r='1'/%3E%3Ccircle cx='34' cy='162' r='1'/%3E%3Ccircle cx='90' cy='204' r='1'/%3E%3Ccircle cx='140' cy='148' r='1'/%3E%3Ccircle cx='206' cy='196' r='1'/%3E%3Ccircle cx='18' cy='220' r='1'/%3E%3Ccircle cx='220' cy='116' r='1'/%3E%3C/g%3E%3Cg fill='rgba(255,90,31,0.16)'%3E%3Ccircle cx='48' cy='120' r='1'/%3E%3Ccircle cx='176' cy='132' r='1'/%3E%3Ccircle cx='120' cy='210' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          ].join(", "),
          backgroundSize: "180px 180px, 180px 180px, 180px 180px, 240px 240px",
          backgroundRepeat: "repeat",
          backgroundPosition: "0 0, 0 0, 0 0, 20px 16px",
          maskImage:
            "radial-gradient(900px circle at 50% 45%, rgba(0,0,0,0.9), transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(900px circle at 50% 45%, rgba(0,0,0,0.9), transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: noiseOpacity,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      <div className="absolute inset-0">
        <CornerFrames accentActive={accentActive} />
      </div>

      <div
        className="absolute left-4 top-[74px] flex flex-col gap-2 md:left-8"
        style={{ opacity: labelsOpacity }}
      >
        <MicroLabel k="SYS" v="HUD" />
        <MicroLabel k="DATA" v="STREAM" />
        <MicroLabel k="ID" v="0001-A" />
      </div>

      <div
        className="absolute right-4 top-[74px] flex flex-col items-end gap-2 md:right-8"
        style={{ opacity: labelsOpacity }}
      >
        <MicroLabel k="GRID" v="REFINED" />
        <MicroLabel k="NOISE" v="ON" />
        <MicroLabel k="ACCENT" v={accentActive ? "HOT" : "IDLE"} />
      </div>
    </div>
  );
}

function MicroLabel({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center gap-2 border border-white/10 bg-black/30 px-2 py-1">
      <span className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
        {k}
      </span>
      <span className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/30">
        {v}
      </span>
    </div>
  );
}

function CornerFrames({ accentActive }: { accentActive: boolean }) {
  const accent = accentActive ? "var(--sys-accent)" : "rgba(255,255,255,0.22)";
  const dim = "rgba(255,255,255,0.12)";

  return (
    <>
      <Corner x="left" y="top" stroke={accent} faint={dim} />
      <Corner x="right" y="top" stroke={dim} faint={dim} />
      <Corner x="left" y="bottom" stroke={dim} faint={dim} />
      <Corner x="right" y="bottom" stroke={accent} faint={dim} />
    </>
  );
}

function Corner({
  x,
  y,
  stroke,
  faint,
}: {
  x: "left" | "right";
  y: "top" | "bottom";
  stroke: string;
  faint: string;
}) {
  const isLeft = x === "left";
  const isTop = y === "top";
  const size = 48;
  const insetX = isLeft ? 10 : undefined;
  const insetR = isLeft ? undefined : 10;
  const insetY = isTop ? 10 : undefined;
  const insetB = isTop ? undefined : 10;

  return (
    <svg
      width={size}
      height={size}
      className="absolute"
      style={{
        left: insetX,
        right: insetR,
        top: insetY,
        bottom: insetB,
      }}
    >
      <path
        d={
          isLeft && isTop
            ? "M2,18 L2,2 L18,2"
            : !isLeft && isTop
              ? "M46,18 L46,2 L30,2"
              : isLeft && !isTop
                ? "M2,30 L2,46 L18,46"
                : "M46,30 L46,46 L30,46"
        }
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d={
          isLeft && isTop
            ? "M2,30 L2,46 L18,46"
            : !isLeft && isTop
              ? "M46,30 L46,46 L30,46"
              : isLeft && !isTop
                ? "M2,18 L2,2 L18,2"
                : "M46,18 L46,2 L30,2"
        }
        fill="none"
        stroke={faint}
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

