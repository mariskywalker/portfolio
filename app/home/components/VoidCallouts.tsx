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
            {/* Anchor: small black square */}
            <div className="absolute left-0 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 border border-black bg-black" />

            {c.boxSide === "right" ? (
              <>
                {/* Line: horizontal then diagonal to box */}
                <svg
                  className="absolute left-4 top-0"
                  width={140}
                  height={80}
                  style={{ transform: "translateY(-50%)" }}
                >
                  <path
                    d="M 0 0 H 60 L 120 35 V 55"
                    fill="none"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="1"
                  />
                </svg>
                {/* Info box */}
                <div
                  className="absolute left-[100px] top-4 min-w-[200px] max-w-[260px] border border-black bg-white/95 p-3"
                  style={{ fontFamily: "var(--font-void)" }}
                >
                  {c.title && (
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-black">
                        {c.title}
                      </span>
                      <span className="text-[13px] text-black/55">{c.index}</span>
                    </div>
                  )}
                  <div className="space-y-0.5 text-[13px] uppercase leading-tight tracking-wider text-black/85">
                    {c.lines.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Line: from anchor (right) to box (left) */}
                <svg
                  className="absolute right-2 top-0"
                  width={120}
                  height={60}
                  style={{ transform: "translateY(-50%)" }}
                >
                  <path
                    d="M 120 30 L 60 30 L 0 0"
                    fill="none"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="1"
                  />
                </svg>
                {/* Info box - to the left of anchor */}
                <div
                  className="absolute right-full top-2 mr-2 min-w-[200px] max-w-[260px] border border-black bg-white/95 p-3 text-right"
                  style={{ fontFamily: "var(--font-void)" }}
                >
                  <div className="space-y-0.5 text-[13px] uppercase leading-tight tracking-wider text-black/85">
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
