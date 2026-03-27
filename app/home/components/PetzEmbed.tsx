"use client";

import { useEffect, useRef } from "react";

type DrawerSection = "overview" | "problem" | "process" | "outcome";

export function PetzEmbed({
  scrollToSection,
  onSectionChange,
  onScrollSent,
}: {
  scrollToSection?: DrawerSection | null;
  onSectionChange?: (section: DrawerSection) => void;
  onScrollSent?: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!scrollToSection || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "petz-scroll", section: scrollToSection }, "*");
    onScrollSent?.();
  }, [scrollToSection, onScrollSent]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "petz-section" && e.data?.section) {
        onSectionChange?.(e.data.section);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSectionChange]);

  return (
    <iframe
      ref={iframeRef}
      src="/petz/petz-drawer-embed.html"
      title="Petz, Portfolio"
      className="absolute inset-0 block h-full min-h-full w-full border-0"
      style={{ minHeight: "100%" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
