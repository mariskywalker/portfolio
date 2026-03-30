"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineLoading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        background: "rgba(0,0,0,0.03)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#666",
      }}
    >
      <span className="animate-pulse">Carregando 3D</span>
    </div>
  );
}

type Props = {
  /** URL da cena do Spline (ex: https://prod.spline.design/xxx/scene.splinecode), pegue em Export → Code no Spline */
  scene: string;
  className?: string;
  style?: React.CSSProperties;
};

export function SplineScene({ scene, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactiveLayerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const resolvedMinHeight = style?.minHeight ?? 320;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();

      const multiplier =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;

      window.scrollBy({ top: event.deltaY * multiplier, behavior: "auto" });
    };

    node.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    const interactiveLayer = interactiveLayerRef.current;
    if (!node || !interactiveLayer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const nx = (relativeX - 0.5) * 2;
      const ny = (relativeY - 0.5) * 2;

      interactiveLayer.style.transform = `translate3d(${nx * 9}px, ${ny * 7}px, 0) scale(1.01)`;
    };

    const handlePointerLeave = () => {
      interactiveLayer.style.transform = "translate3d(0, 0, 0) scale(1)";
    };

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  if (!scene || scene === "loading...") return null;
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: resolvedMinHeight,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        touchAction: "pan-y",
        ...style,
      }}
    >
      <div
        ref={interactiveLayerRef}
        className="relative"
        style={{
          width: "100%",
          height: "100%",
          minHeight: resolvedMinHeight,
          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <Suspense fallback={<SplineLoading />}>
          <Spline
            scene={scene}
            renderOnDemand={true}
            onLoad={() => setLoaded(true)}
            style={{ width: "100%", height: "100%", minHeight: resolvedMinHeight }}
          />
        </Suspense>
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/5"
            style={{ pointerEvents: "none" }}
          >
            <SplineLoading />
          </div>
        )}
      </div>
    </div>
  );
}
