"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PixelArtProps = {
  src: string;
  alt?: string;
  /**
   * How big each pixel should appear (in CSS pixels) after scaling up.
   * Smaller = denser pixels, bigger = chunky pixel art.
   */
  pixelSize?: number;
  /**
   * Width of the pixel grid (in pixels).
   * Height is derived from the image aspect ratio.
   */
  gridWidth?: number;
  /**
   * Color quantization levels per RGB channel.
   * Example: 6 -> each channel uses ~6 values, creating an 8-bit-ish look.
   */
  levels?: number;
  className?: string;
};

function quantizeByte(value: number, levels: number) {
  if (levels <= 1) return 0;
  const step = 255 / (levels - 1);
  return Math.max(0, Math.min(255, Math.round(value / step) * step));
}

export default function PixelArt({
  src,
  alt = "",
  pixelSize = 6,
  gridWidth = 64,
  levels = 6,
  className,
}: PixelArtProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const imgAspect = useRef<number>(1);
  const [gridHeight, setGridHeight] = useState(64);

  const filters = useMemo(() => {
    // Keep the look crisp + neon.
    return {
      imageSmoothingEnabled: false,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = async () => {
      if (cancelled) return;
      imgAspect.current = img.height / Math.max(1, img.width);
      const derivedH = Math.max(8, Math.round(gridWidth * imgAspect.current));
      setGridHeight(derivedH);
      setLoaded(true);
    };

    img.onerror = () => {
      // Keep silent: the canvas will stay empty.
      if (!cancelled) setLoaded(false);
    };

    return () => {
      cancelled = true;
    };
  }, [src, gridWidth]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outW = gridWidth;
    const outH = gridHeight;

    // Display size (scaled up). Actual drawing happens on an offscreen grid.
    canvas.width = outW * pixelSize;
    canvas.height = outH * pixelSize;
    canvas.style.width = `${outW * pixelSize}px`;
    canvas.style.height = `${outH * pixelSize}px`;

    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = outW;
    gridCanvas.height = outH;
    const gridCtx = gridCanvas.getContext("2d");
    if (!gridCtx) return;

    gridCtx.imageSmoothingEnabled = filters.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = filters.imageSmoothingEnabled;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      // 1) Downscale into a pixel grid.
      gridCtx.clearRect(0, 0, outW, outH);
      gridCtx.drawImage(img, 0, 0, outW, outH);

      // 2) Quantize colors to create an 8-bit look.
      const imgData = gridCtx.getImageData(0, 0, outW, outH);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = quantizeByte(data[i], levels); // R
        data[i + 1] = quantizeByte(data[i + 1], levels); // G
        data[i + 2] = quantizeByte(data[i + 2], levels); // B
        // alpha unchanged
      }
      gridCtx.putImageData(imgData, 0, 0);

      // 3) Scale up without smoothing.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(gridCanvas, 0, 0, canvas.width, canvas.height);
    };
  }, [loaded, gridHeight, gridWidth, pixelSize, levels, filters, src]);

  return (
    <canvas ref={canvasRef} aria-label={alt} className={className} />
  );
}

