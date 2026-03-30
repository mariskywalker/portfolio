"use client";

import { useEffect, useRef, useState } from "react";
import { SplineScene } from "@/app/components/SplineScene";

type Props = {
  scene: string;
  pulseKey?: string;
  /** "portrait" = container mais alto para objetos verticais (garrafa); "square" = quadrado */
  aspect?: "square" | "portrait";
  onHoverChange?: (hovered: boolean) => void;
  onPointerMove?: (x: number, y: number) => void;
};

export function Hero3DHub({ scene, pulseKey, aspect = "square", onHoverChange, onPointerMove }: Props) {
  const hubRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hubScale, setHubScale] = useState(1);

  // The Spline "portrait" framing can appear too tall on small screens.
  // We apply a mobile-only scale to keep the bottle visually proportionate.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (aspect === "portrait" && isMobile) setHubScale(0.88);
    else setHubScale(1);
  }, [aspect]);

  useEffect(() => {
    const node = hubRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const animate = () => {
      // inertia
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotateX(${(-cy) * 0.06}deg) rotateY(${cx * 0.07}deg)`;
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      tx = Math.max(-18, Math.min(18, nx * 18));
      ty = Math.max(-14, Math.min(14, ny * 14));
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        onPointerMove?.(relX, relY);
      }
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    window.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", () => setHovered(true));
    node.addEventListener("pointerleave", () => {
      setHovered(false);
      onLeave();
    });

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [onPointerMove]);

  useEffect(() => {
    onHoverChange?.(hovered);
  }, [hovered, onHoverChange]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div style={{ transform: `scale(${hubScale})`, transformOrigin: "center" }}>
        <div
          key={`${pulseKey}-${aspect}-${hubScale}`}
          ref={hubRef}
          className={`homeHubPulse relative ${
            aspect === "portrait"
              ? // Mobile: reduzir o "frame" vertical para evitar que o Spline re-enquadre a garrafa
                // com zoom excessivo (aparenta ficar mais alta).
                "h-[min(calc(100svh-200px),90vmin)] md:h-[min(calc(100svh-140px),105vmin)] aspect-[48/105] w-auto"
              : "h-[min(74vmin,720px)] w-[min(74vmin,720px)]"
          }`}
          style={{
            animation: "homeHubFloat 6.5s linear infinite",
            boxShadow: "0 28px 140px rgba(0,0,0,0.55)",
            willChange: "transform, filter",
          }}
        >
          {/* keep hub clean: no hover glow overlay */}
          <SplineScene
            scene={scene}
            className="absolute inset-0 h-full w-full"
            style={{
              borderRadius: 0,
              border: "none",
              background: "transparent",
              minHeight: 0,
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        @keyframes homeHubFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        /* subtle light reaction on node change (via key remount) */
        .homeHubPulse {
          animation: homeHubPulse 340ms linear 1;
        }
        @keyframes homeHubPulse {
          0% {
            filter: brightness(1) contrast(1);
          }
          45% {
            filter: brightness(1.08) contrast(1.05);
          }
          100% {
            filter: brightness(1) contrast(1);
          }
        }
      `}</style>
    </div>
  );
}

