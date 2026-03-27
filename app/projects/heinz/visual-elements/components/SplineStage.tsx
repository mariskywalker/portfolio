"use client";

import { useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineStage() {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      // Keep Spline mouse interaction, but route wheel to page scroll.
      event.preventDefault();

      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;

      window.scrollBy({
        top: event.deltaY * multiplier,
        behavior: "auto",
      });
    };

    node.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 touch-pan-y [&>div]:h-full [&>div]:w-full [&_canvas]:h-full [&_canvas]:w-full"
    >
      <Spline
        scene="https://prod.spline.design/6wFweH-Zf7ncXJhT/scene.splinecode?v=2"
        renderOnDemand={false}
        className="h-full w-full"
      />
    </div>
  );
}
