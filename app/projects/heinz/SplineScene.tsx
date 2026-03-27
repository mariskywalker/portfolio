"use client";

import Spline from "@splinetool/react-spline";

type SplineSceneProps = {
  fullBackground?: boolean;
  className?: string;
  sceneUrl?: string;
};

export default function SplineScene({
  fullBackground = false,
  className = "",
  sceneUrl = "https://prod.spline.design/6wFweH-Zf7ncXJhT/scene.splinecode?v=2",
}: SplineSceneProps) {
  const frameClassName = `spline-frame ${
    fullBackground ? "is-background" : ""
  } ${className}`.trim();

  return (
    <div className={frameClassName}>
      <Spline scene={sceneUrl} renderOnDemand={false} />
      <style jsx>{`
        .spline-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          min-height: 420px;
          background-color: #c8102e;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .spline-frame.is-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          min-height: 100%;
          aspect-ratio: auto;
          background-color: transparent;
        }
      `}</style>
      <style jsx>{`
        .spline-frame :global(> div) {
          width: 100% !important;
          height: 100% !important;
        }

        .spline-frame :global(canvas) {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
