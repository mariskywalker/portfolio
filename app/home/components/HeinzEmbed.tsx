"use client";

import { useEffect, useRef } from "react";

type HeinzSection = "heinz-hero" | "heinz-dip" | "heinz-breakdown";

type Props = {
  scrollToSection?: HeinzSection | null;
  onScrollDone?: () => void;
};

export function HeinzEmbed({ scrollToSection, onScrollDone }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/heinz?embed=1`
      : "/projects/heinz?embed=1";

  useEffect(() => {
    if (!scrollToSection || !iframeRef.current) return;
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;
    const el = doc.getElementById(scrollToSection);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const t = setTimeout(() => onScrollDone?.(), 600);
      return () => clearTimeout(t);
    }
  }, [scrollToSection, onScrollDone]);

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      title="Heinz Lab"
      className="absolute inset-0 h-full w-full min-h-full border-0 block"
      style={{ minHeight: "100%" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
