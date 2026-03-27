"use client";

import { useEffect, useRef, useState } from "react";
import { drawPixelAvatarToContext } from "./PixelAvatars";

const GRID_SIZE = 60;
const SQUARE_CELLS = 2;
const SQUARE_SIZE = GRID_SIZE * SQUARE_CELLS;
const LERP = 0.15;

type Point = { x: number; y: number };
type MemoryCell = { x: number; y: number; strength: number };
type GlitchState = {
  activeUntil: number;
  offsetX: number;
  offsetY: number;
  scanLines: number[];
  nextAt: number;
  doubleAt: number | null;
  doubleDuration: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randomInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

export default function BarrierCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const mouseInsideRef = useRef(false);

  const currentRef = useRef<Point>({ x: 0, y: 0 });
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const hasInitRef = useRef(false);
  const lastCellKeyRef = useRef<string | null>(null);

  const memoryRef = useRef<Map<string, MemoryCell>>(new Map());
  const glitchRef = useRef<GlitchState>({
    activeUntil: 0,
    offsetX: 0,
    offsetY: 0,
    scanLines: [],
    nextAt: performance.now() + rand(800, 3000),
    doubleAt: null,
    doubleDuration: 0,
  });

  const [crosshairPos, setCrosshairPos] = useState<Point | null>(null);
  const showPortraitRef = useRef(false);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const avatarNameRef = useRef<string | null>(null);
  /** Hover image for elements with data-cursor-image="/path" (drawn in main square like portrait) */
  const cursorHoverImgStateRef = useRef<{
    targetUrl: string | null;
    img: HTMLImageElement | null;
    readyUrl: string | null;
  }>({ targetUrl: null, img: null, readyUrl: null });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prevBodyCursor = document.body.style.cursor;
    const prevHtmlCursor = document.documentElement.style.cursor;
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const cellFromMouse = (x: number, y: number): Point => ({
      x: Math.floor(x / GRID_SIZE) * GRID_SIZE,
      y: Math.floor(y / GRID_SIZE) * GRID_SIZE,
    });

    const cellKey = (p: Point) => `${p.x}:${p.y}`;

    const stampCell = (p: Point) => {
      const key = cellKey(p);
      memoryRef.current.set(key, { x: p.x, y: p.y, strength: 1 });
      lastCellKeyRef.current = key;
    };

    const beginGlitch = (durationMs: number, maxOffset = 4, scheduleDouble = false) => {
      const g = glitchRef.current;
      g.activeUntil = performance.now() + durationMs;
      g.offsetX = rand(-maxOffset, maxOffset);
      g.offsetY = rand(-maxOffset, maxOffset);
      const lineCount = randomInt(3, 5);
      g.scanLines = Array.from({ length: lineCount }, () => rand(6, SQUARE_SIZE - 6));
      g.nextAt = performance.now() + rand(800, 3000);
      g.doubleAt = null;
      g.doubleDuration = 0;
      if (scheduleDouble && Math.random() < 0.4) {
        g.doubleAt = performance.now() + rand(90, 140);
        g.doubleDuration = rand(30, 45);
      }
    };

    const maybeStampTransition = (nextCell: Point) => {
      const nextKey = cellKey(nextCell);
      if (nextKey !== lastCellKeyRef.current) {
        stampCell(nextCell);
        if (Math.random() < 0.18) {
          beginGlitch(rand(28, 42), 2, false);
        }
      }
    };

    const syncCursorHoverImage = (url: string | null) => {
      const s = cursorHoverImgStateRef.current;
      s.targetUrl = url;
      if (!url) {
        s.img = null;
        s.readyUrl = null;
        return;
      }
      if (s.readyUrl === url && s.img?.complete && s.img.naturalWidth > 0) {
        return;
      }
      const img = new Image();
      const loadUrl = url;
      img.onload = () => {
        if (cursorHoverImgStateRef.current.targetUrl === loadUrl) {
          cursorHoverImgStateRef.current.img = img;
          cursorHoverImgStateRef.current.readyUrl = loadUrl;
        }
      };
      img.onerror = () => {
        if (cursorHoverImgStateRef.current.targetUrl === loadUrl) {
          cursorHoverImgStateRef.current.img = null;
          cursorHoverImgStateRef.current.readyUrl = null;
        }
      };
      img.src = loadUrl;
    };

    const drawImageCover = (
      image: HTMLImageElement,
      boxX: number,
      boxY: number,
      boxW: number,
      boxH: number
    ) => {
      const imgAspect = image.naturalWidth / image.naturalHeight;
      const boxAspect = boxW / boxH;
      let dw: number, dh: number, dx: number, dy: number;
      if (imgAspect > boxAspect) {
        dw = boxW;
        dh = boxW / imgAspect;
        dx = boxX;
        dy = boxY + (boxH - dh) / 2;
      } else {
        dh = boxH;
        dw = boxH * imgAspect;
        dx = boxX + (boxW - dw) / 2;
        dy = boxY;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, dx, dy, dw, dh);
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mouseRef.current = { x, y };
      mouseInsideRef.current = true;
      setCrosshairPos({ x, y });

      const target = document.elementFromPoint(x, y) as HTMLElement | null;
      const avatarEl = target?.closest("[data-cursor-avatar]") as HTMLElement | null;
      const portraitEl = target?.closest("[data-cursor-portrait]");
      const cursorImgEl = target?.closest("[data-cursor-image]");
      const cursorImgSrc =
        cursorImgEl?.getAttribute("data-cursor-image")?.trim() || null;

      avatarNameRef.current = avatarEl?.getAttribute("data-cursor-avatar") ?? null;
      syncCursorHoverImage(avatarNameRef.current ? null : cursorImgSrc);
      showPortraitRef.current =
        !!portraitEl && !avatarNameRef.current && !cursorImgSrc;

      const snapped = cellFromMouse(x, y);
      targetRef.current = snapped;
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        currentRef.current = snapped;
        stampCell(snapped);
      } else {
        maybeStampTransition(snapped);
      }
    };

    const onEnter = () => {
      mouseInsideRef.current = true;
    };

    const onLeave = () => {
      mouseInsideRef.current = false;
      setCrosshairPos(null);
      showPortraitRef.current = false;
      avatarNameRef.current = null;
      syncCursorHoverImage(null);
      const last = targetRef.current;
      stampCell(last);
    };

    // Preload portrait for canvas drawing
    const portraitImg = new Image();
    portraitImg.src = "/files/portrait.svg";
    portraitImg.onload = () => {
      portraitImgRef.current = portraitImg;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);

    const drawMemory = () => {
      const decay = mouseInsideRef.current ? 0.94 : 0.88;
      const memory = memoryRef.current;

      for (const [key, cell] of memory.entries()) {
        cell.strength *= decay;
        if (cell.strength < 0.015) {
          memory.delete(key);
          continue;
        }

        const x = cell.x;
        const y = cell.y;
        const s = cell.strength;

        // Soft radial aura with ~35% spread beyond cell.
        const cx = x + GRID_SIZE / 2;
        const cy = y + GRID_SIZE / 2;
        const outer = GRID_SIZE * 0.85;
        const grad = ctx.createRadialGradient(cx, cy, GRID_SIZE * 0.15, cx, cy, outer);
        grad.addColorStop(0, `rgba(255,255,255,${(0.08 * s).toFixed(4)})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(x - GRID_SIZE * 0.35, y - GRID_SIZE * 0.35, GRID_SIZE * 1.7, GRID_SIZE * 1.7);

        ctx.fillStyle = `rgba(255,255,255,${(0.018 * s).toFixed(4)})`;
        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(255,255,255,${(0.5 * s).toFixed(4)})`;
        ctx.strokeRect(x + 0.25, y + 0.25, GRID_SIZE - 0.5, GRID_SIZE - 0.5);
      }
    };

    const drawCorners = (x: number, y: number) => {
      const arm = 9;
      const c = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = c;

      ctx.beginPath();
      // top-left
      ctx.moveTo(x, y + arm);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arm, y);
      // top-right
      ctx.moveTo(x + SQUARE_SIZE - arm, y);
      ctx.lineTo(x + SQUARE_SIZE, y);
      ctx.lineTo(x + SQUARE_SIZE, y + arm);
      // bottom-left
      ctx.moveTo(x, y + SQUARE_SIZE - arm);
      ctx.lineTo(x, y + SQUARE_SIZE);
      ctx.lineTo(x + arm, y + SQUARE_SIZE);
      // bottom-right
      ctx.moveTo(x + SQUARE_SIZE - arm, y + SQUARE_SIZE);
      ctx.lineTo(x + SQUARE_SIZE, y + SQUARE_SIZE);
      ctx.lineTo(x + SQUARE_SIZE, y + SQUARE_SIZE - arm);
      ctx.stroke();
    };

    const drawMainSquare = (baseX: number, baseY: number, now: number) => {
      const g = glitchRef.current;
      const glitchActive = now < g.activeUntil;
      const x = baseX + (glitchActive ? g.offsetX : 0);
      const y = baseY + (glitchActive ? g.offsetY : 0);

      // aura
      const cx = x + SQUARE_SIZE / 2;
      const cy = y + SQUARE_SIZE / 2;
      const aura = ctx.createRadialGradient(
        cx,
        cy,
        SQUARE_SIZE * 0.15,
        cx,
        cy,
        SQUARE_SIZE * 0.95
      );
      aura.addColorStop(0, "rgba(255,255,255,0.16)");
      aura.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(
        x - SQUARE_SIZE * 0.6,
        y - SQUARE_SIZE * 0.6,
        SQUARE_SIZE * 2.2,
        SQUARE_SIZE * 2.2
      );

      // base square
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.strokeRect(x + 0.375, y + 0.375, SQUARE_SIZE - 0.75, SQUARE_SIZE - 0.75);

      // inner border
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.strokeRect(x + 4, y + 4, SQUARE_SIZE - 8, SQUARE_SIZE - 8);

      // content inside square: pixel avatar (HoverWord) or portrait
      const pad = 8;
      const boxW = SQUARE_SIZE - pad * 2;
      const boxH = SQUARE_SIZE - pad * 2;
      const boxX = x + pad;
      const boxY = y + pad;

      if (avatarNameRef.current) {
        drawPixelAvatarToContext(ctx, avatarNameRef.current, boxX, boxY, boxW, boxH);
      } else {
        const hoverState = cursorHoverImgStateRef.current;
        const hoverImg =
          hoverState.targetUrl &&
          hoverState.readyUrl === hoverState.targetUrl &&
          hoverState.img?.complete &&
          hoverState.img.naturalWidth > 0
            ? hoverState.img
            : null;

        if (hoverImg) {
          drawImageCover(hoverImg, boxX, boxY, boxW, boxH);
        } else {
          const img = portraitImgRef.current;
          if (showPortraitRef.current && img?.complete && img.naturalWidth > 0) {
            ctx.imageSmoothingEnabled = false;
            drawImageCover(img, boxX, boxY, boxW, boxH);
            ctx.imageSmoothingEnabled = true;
          }
        }
      }

      drawCorners(x, y);

      if (!glitchActive) return;

      // chromatic ghost borders
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(160,210,255,0.28)";
      ctx.strokeRect(x + 1.6, y - 1.4, SQUARE_SIZE - 3.2, SQUARE_SIZE - 3.2);
      ctx.strokeStyle = "rgba(255,150,150,0.22)";
      ctx.strokeRect(x - 1.8, y + 1.4, SQUARE_SIZE - 3.2, SQUARE_SIZE - 3.2);

      // scan lines
      ctx.lineWidth = 1;
      for (const ly of g.scanLines) {
        const yy = y + ly;
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.moveTo(x + 4, yy);
        ctx.lineTo(x + SQUARE_SIZE - 4, yy);
        ctx.stroke();
      }
    };

    const tick = () => {
      const now = performance.now();
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      // Update glitch timeline
      const g = glitchRef.current;
      if (mouseInsideRef.current && now >= g.nextAt) {
        beginGlitch(70, 4, true);
      } else if (g.doubleAt && now >= g.doubleAt) {
        beginGlitch(g.doubleDuration || 36, 3, false);
      }

      drawMemory();

      if (hasInitRef.current) {
        const current = currentRef.current;
        const target = targetRef.current;
        current.x += (target.x - current.x) * LERP;
        current.y += (target.y - current.y) * LERP;
        drawMainSquare(current.x, current.y, now);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      document.body.style.cursor = prevBodyCursor;
      document.documentElement.style.cursor = prevHtmlCursor;
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
      />
      {crosshairPos ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[10000] -translate-x-1/2 -translate-y-1/2 select-none text-[14px] leading-none text-white/90"
          style={{ left: crosshairPos.x, top: crosshairPos.y }}
        >
          +
        </div>
      ) : null}
    </>
  );
}

