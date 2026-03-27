"use client";

export function TridentEmbed() {
  return (
    <iframe
      src="/Trident/trident-case.html"
      title="Trident, Bone Marrow Campaign"
      className="absolute inset-0 h-full w-full min-h-full border-0 block"
      style={{ minHeight: "100%" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
