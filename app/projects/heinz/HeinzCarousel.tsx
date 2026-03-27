"use client";

import { useState, useEffect } from "react";

const slides = [
  { src: "/Heinz/carousel-1.png", alt: "Heinz Dip to Win, Underground poster, hand dipping fry into sauce" },
  { src: "/Heinz/carousel-2.png", alt: "Heinz Dip to Win, Piccadilly line station, International Fries Day Dip Box" },
  { src: "/Heinz/carousel-3.png", alt: "Heinz Dip to Win, Bus stop OOH, International Fries Day 2023" },
];

const INTERVAL_MS = 4500;

export function HeinzCarousel() {
  const [index, setIndex] = useState(0);
  const current = slides[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes heinzCarouselFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
          background: "#000",
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            width: "100%",
            backgroundColor: "#000",
          }}
        >
          <img
            key={index}
            src={current.src}
            alt={current.alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              animation: "heinzCarouselFade 0.6s ease-out",
            }}
          />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === index ? "#111111" : "rgba(0,0,0,0.25)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 12,
            right: 12,
            transform: "translateY(-50%)",
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <button
            type="button"
            onClick={() => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))}
            aria-label="Previous"
            style={{
              pointerEvents: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1))}
            aria-label="Next"
            style={{
              pointerEvents: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
