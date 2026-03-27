"use client";

type PixelPortraitProps = {
  alt?: string;
  className?: string;
  /**
   * Source is a file served from `public/`.
   */
  src?: string;
};

export default function PixelPortrait({
  alt = "Pixel portrait",
  className,
  src = "/files/portrait.svg",
}: PixelPortraitProps) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={className ?? "h-full w-full object-contain"}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

