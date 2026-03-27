"use client";

import { MotionValue } from "framer-motion";

import FloatingAsset from "./FloatingAsset";

type FloatingAssetLayerProps = {
  progress: MotionValue<number>;
};

const assets = [
  {
    src: "/heinz-lab/tomato.png",
    alt: "Tomato",
    width: 188,
    position: { top: "14%", left: "4%" },
    revealRange: [0.58, 0.72] as [number, number],
    xRange: [-110, 52] as [number, number],
    yRange: [115, -40] as [number, number],
    rotateRange: [-10, 7] as [number, number],
    zIndex: 34,
  },
  {
    src: "/heinz-lab/tomato.png",
    alt: "Tomato slice",
    width: 128,
    position: { bottom: "9%", right: "13%" },
    revealRange: [0.63, 0.76] as [number, number],
    xRange: [120, -42] as [number, number],
    yRange: [98, -56] as [number, number],
    rotateRange: [8, -9] as [number, number],
    zIndex: 34,
  },
  {
    src: "/heinz-lab/splash.png",
    alt: "Ketchup splash",
    width: 220,
    position: { bottom: "12%", left: "17%" },
    revealRange: [0.68, 0.82] as [number, number],
    xRange: [-165, 55] as [number, number],
    yRange: [148, -22] as [number, number],
    rotateRange: [-14, 11] as [number, number],
    zIndex: 33,
  },
  {
    src: "/heinz-lab/sachet.png",
    alt: "Ketchup sachet",
    width: 170,
    position: { top: "40%", right: "14%" },
    revealRange: [0.73, 0.87] as [number, number],
    xRange: [170, -64] as [number, number],
    yRange: [92, -52] as [number, number],
    rotateRange: [16, -7] as [number, number],
    zIndex: 35,
  },
];

export default function FloatingAssetLayer({ progress }: FloatingAssetLayerProps) {
  return (
    <>
      {assets.map((asset, idx) => (
        <FloatingAsset
          key={`${asset.src}-${idx}`}
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          progress={progress}
          revealRange={asset.revealRange}
          xRange={asset.xRange}
          yRange={asset.yRange}
          rotateRange={asset.rotateRange}
          position={asset.position}
          zIndex={asset.zIndex}
        />
      ))}
    </>
  );
}
