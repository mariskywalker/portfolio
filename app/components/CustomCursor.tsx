"use client";

import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };
const LERP = 0.08;

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState("");
  const [scale, setScale] = useState(1);
  const [dotPos, setDotPos] = useState<Position>({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState<Position>({ x: 0, y: 0 });

  const pointerRef = useRef<Position>({ x: 0, y: 0 });
  const ringRef = useRef<Position>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const getCursorState = (target: HTMLElement | null) => {
      if (!target) return { nextLabel: "", nextScale: 1 };
      if (target.closest('[data-cursor="drag"]')) return { nextLabel: "DRAG", nextScale: 1.4 };
      if (target.closest('[data-cursor="read"]')) return { nextLabel: "READ", nextScale: 1.4 };
      if (target.closest("a, button")) return { nextLabel: "VIEW", nextScale: 1.4 };
      return { nextLabel: "", nextScale: 1 };
    };

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      pointerRef.current = { x, y };
      setDotPos({ x, y });

      const target = document.elementFromPoint(x, y) as HTMLElement | null;
      const { nextLabel, nextScale } = getCursorState(target);
      setLabel(nextLabel);
      setScale(nextScale);
    };

    const animate = () => {
      const target = pointerRef.current;
      const current = ringRef.current;
      const next = {
        x: current.x + (target.x - current.x) * LERP,
        y: current.y + (target.y - current.y) * LERP,
      };
      ringRef.current = next;
      setRingPos(next);
      rafRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999]"
      style={{ left: dotPos.x, top: dotPos.y }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          left: -3,
          top: -3,
          background: "#fff",
          mixBlendMode: "difference",
        }}
      />
      <div
        className="absolute flex items-center justify-center rounded-full border transition-transform duration-200 ease-out"
        style={{
          width: 80,
          height: 80,
          left: ringPos.x - dotPos.x - 40,
          top: ringPos.y - dotPos.y - 40,
          borderColor: "rgba(255,255,255,0.9)",
          color: "rgba(255,255,255,0.9)",
          transform: `scale(${scale})`,
        }}
      >
        <div
          className="select-none whitespace-nowrap text-center uppercase transition-opacity duration-200 ease-out"
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            opacity: label ? 1 : 0,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

