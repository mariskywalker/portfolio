"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type MediaItem = { src: string; type: "video" | "image" };

export function MediaSlider({
  items,
  intervalMs = 5000,
  className = "",
}: {
  items: MediaItem[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  // Play video when visible, pause when not
  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (el) {
        if (i === index && items[i]?.type === "video") {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      }
    });
  }, [index, items]);

  if (items.length === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden rounded-sm ${className}`}>
      <div className="relative aspect-video w-full">
        <motion.div
          className="flex h-full"
          style={{ width: `${items.length * 100}%` }}
          animate={{ x: `-${index * (100 / items.length)}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / items.length}%` }}
            >
              {item.type === "video" ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={item.src}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={item.src}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
