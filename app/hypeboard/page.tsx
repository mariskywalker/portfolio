"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Cell = {
  x: number;
  y: number;
};

function formatCell({ x, y }: Cell) {
  return `${x}, ${y}`;
}

export default function HypeboardPage() {
  // Example shows combos like "1, 3", "2, 4", ... up to 5.
  // We'll build a bigger moodboard so the user can drag around.
  const cols = 12; // x: 0..11
  const rows = 18; // y: 0..17

  const cells = useMemo<Cell[]>(() => {
    const list: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        list.push({ x, y });
      }
    }
    return list;
  }, [cols, rows]);

  const [active, setActive] = useState<Cell>({ x: 1, y: 3 });

  const iconByCell = useMemo(() => {
    // Assets available in `public/` (mixing project + system icons).
    const icons = [
      "/casadourso.svg",
      "/Heinz/ithastobeheinz.svg",
      "/assets/svg/vector-2.svg",
      "/vibecoind.svg",
      "/globe.svg",
      "/window.svg",
      "/icones.svg",
      "/file.svg",
      "/next.svg",
      "/vercel.svg",
      "/assets_task_01jrqpwh4mew5snabhrnzzs3j2_img_0 1.svg",
    ];

    const map = new Map<string, string>();
    for (const c of cells) {
      // deterministic pick
      const idx = Math.abs((c.x + 1) * 31 + (c.y + 1) * 17) % icons.length;
      map.set(`${c.x}-${c.y}`, icons[idx]);
    }
    return map;
  }, [cells]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [constraints, setConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);

  const [initialOffset, setInitialOffset] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const vw = el.clientWidth;
      const vh = el.clientHeight;

      // board is 3x viewport in both dimensions -> max drag is -2*viewportSize .. 0
      setConstraints({
        left: -(vw * 2),
        right: 0,
        top: -(vh * 2),
        bottom: 0,
      });
      // start centered-ish (show the middle third)
      setInitialOffset({ x: -vw, y: -vh });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="relative min-h-[100vh] w-full bg-black text-white">
      {/* Utopia cyber backdrop */}
      <div className="utopia-grid-bg" />
      <div className="utopia-noise" />
      <div className="utopia-vignette" />
      <div className="utopia-scanlines" />

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-[100]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div className="pointer-events-auto font-heading text-[18px] font-semibold tracking-[0.12em]">
            HYPE<span className="text-[color:var(--sys-accent)]">BOARD</span>
          </div>
          <nav className="pointer-events-auto flex items-center gap-6 text-white/50">
            <a className="hover:text-white/85" href="#">
              Dashboard
            </a>
            <a className="hover:text-white/85" href="#">
              About
            </a>
            <a className="hover:text-white/85" href="#">
              Hypeboard
            </a>
            <a className="hover:text-white/85" href="#">
              Let&apos;s Work
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 h-[100vh] w-full overflow-hidden">
        <section className="pointer-events-none absolute left-0 right-0 top-[86px] z-20 mx-auto w-full max-w-7xl px-6">
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/45">
            DASH / BOARD
          </div>
          <div className="mt-3 font-heading text-[48px] font-black uppercase tracking-[0.08em] leading-[0.95]">
            <span className="glitch" data-text="HYPEBOARD">
              HYPEBOARD
            </span>
          </div>
          <div className="mt-4 text-white/55">
            Click a coordinate to lock the visor. Hover to feel the board respond.
          </div>
        </section>

        <section className="absolute inset-0 z-10">
          <div
            ref={viewportRef}
            className="hypeboard-viewport absolute inset-0 overflow-hidden border border-white/10 bg-black/35"
          >
            <div className="pointer-events-none absolute left-4 top-4 z-10 text-white/40">
              Drag to explore
            </div>

            <motion.div
              drag
              dragMomentum={false}
              dragConstraints={constraints || undefined}
              initial={
                initialOffset ? { x: initialOffset.x, y: initialOffset.y } : { x: 0, y: 0 }
              }
              className="hypeboard-board absolute left-0 top-0"
              style={{ touchAction: "none" }}
            >
              <div className="hypeboard-grid-wrap p-6">
                <div
                  className="hypeboard-grid grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {cells.map((c, idx) => {
                    const isActive = c.x === active.x && c.y === active.y;
                    const iconSrc = iconByCell.get(`${c.x}-${c.y}`);

                    return (
                      <button
                        key={`${c.x}-${c.y}-${idx}`}
                        type="button"
                        onMouseEnter={() => setActive(c)}
                        onFocus={() => setActive(c)}
                        onClick={() => setActive(c)}
                        onPointerDown={(e) => {
                          // Prevent the tile click from starting a pan drag.
                          e.stopPropagation();
                        }}
                        className={[
                          "hypeboard-tile border border-white/10 bg-black/20",
                          isActive
                            ? "border-[color:var(--sys-accent)]/70"
                            : "hover:border-white/25",
                        ].join(" ")}
                        aria-label={`Coordinate ${formatCell(c)}`}
                      >
                        <div className="hypeboard-tile-media" aria-hidden="true">
                          {iconSrc ? (
                            <img
                              src={iconSrc}
                              alt=""
                              draggable={false}
                              className="hypeboard-tile-img"
                            />
                          ) : (
                            <div className="hypeboard-tile-placeholder" />
                          )}
                        </div>

                        <div className="hypeboard-tile-overlay">
                          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/80">
                            {formatCell(c)}
                          </div>
                          <div className="mt-1 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/45">
                            PROJECT MIX
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 mb-8 px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-3">
            <div className="hypeboard-stat rounded-none border border-white/10 bg-black/25 p-4">
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
              ACTIVE
            </div>
            <div className="mt-2 font-heading text-[22px] font-semibold tracking-[0.08em] text-white">
              {formatCell(active)}
            </div>
          </div>
            <div className="hypeboard-stat rounded-none border border-white/10 bg-black/25 p-4">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
                TAGLINE
              </div>
              <div className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/70">
                Shoot the shit. Hit it!
              </div>
            </div>
            <div className="hypeboard-stat rounded-none border border-white/10 bg-black/25 p-4">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
                LOC / STUDIO
              </div>
              <div className="mt-2 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/70">
                Charlotte, NC
                <br />
                Madebyanalogue
              </div>
            </div>
          </div>
        </section>

        <footer className="pointer-events-none absolute left-0 right-0 bottom-0 z-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 px-6 py-8 text-white/35 md:flex-row">
          <div className="font-heading text-[22px] tracking-[0.12em] text-white/45">
            HYPEBOARD
          </div>
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em]">
            Unapologetically Bold ____{" "}
          </div>
        </footer>
      </main>
    </div>
  );
}

