"use client";

import { useEffect, useRef, useState } from "react";

const CELL_SIZE = 40; // must match CSS background grid

type Vec2 = { x: number; y: number };

// Distance (Chebyshev) -> opacity mapping
function opacityForOffset(dx: number, dy: number): number {
  const d = Math.max(Math.abs(dx), Math.abs(dy)); // 0 = center, 1,2,...
  if (d === 0) return 0.06;
  if (d === 1) return 0.035;
  if (d === 2) return 0.012;
  return 0;
}

export function GridCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<Vec2 | null>(null);
  const framePendingRef = useRef(false);
  const [dotPos, setDotPos] = useState<Vec2 | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const handleResize = () => {
      resize();
      // force redraw next frame with new size
      framePendingRef.current = false;
    };

    const scheduleFrame = () => {
      if (framePendingRef.current) return;
      framePendingRef.current = true;
      requestAnimationFrame(() => {
        framePendingRef.current = false;
        const mouse = mouseRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);

        if (!mouse) return;

        const baseCol = Math.floor(mouse.x / CELL_SIZE);
        const baseRow = Math.floor(mouse.y / CELL_SIZE);

        // 5x5 area around cursor: offsets -2..2
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const opacity = opacityForOffset(dx, dy);
            if (opacity <= 0) continue;

            const col = baseCol + dx;
            const row = baseRow + dy;

            if (col < 0 || row < 0) continue;
            const px = col * CELL_SIZE;
            const py = row * CELL_SIZE;
            if (px > width || py > height) continue;

            ctx.fillStyle = `rgba(255,255,255,${opacity})`;
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          }
        }
      });
    };

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mouseRef.current = { x, y };
      setDotPos({ x, y });
      scheduleFrame();
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Canvas is always present so highlights can appear as soon as mouse moves
  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[50]"
      />
      {dotPos && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[51] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 5,
            height: 5,
            left: dotPos.x,
            top: dotPos.y,
            background: "#ffffff",
          }}
        />
      )}
    </>
  );
}

