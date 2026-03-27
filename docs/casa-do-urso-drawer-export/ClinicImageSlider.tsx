"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ClinicImageSlider({
  images,
  intervalMs = 4000,
  className = "",
}: {
  images: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden rounded-sm ${className}`}>
      <div className="relative aspect-[4/3] w-full">
        <motion.div
          className="flex h-full"
          style={{ width: `${images.length * 100}%` }}
          animate={{ x: `-${index * (100 / images.length)}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              className="h-full w-full flex-shrink-0 object-cover"
              style={{
                width: `${100 / images.length}%`,
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
