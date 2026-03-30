"use client";

import { useEffect, useRef } from "react";

type DrawerSection = "overview" | "problem" | "process" | "outcome";

export function ComicsEmbed({
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
    iframeRef.current.contentWindow.postMessage(
      { type: "comics-scroll", section: scrollToSection },
      "*"
    );
    onScrollSent?.();
  }, [scrollToSection, onScrollSent]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "comics-section" && e.data?.section) {
        onSectionChange?.(e.data.section);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSectionChange]);

  return (
    <iframe
      ref={iframeRef}
      src="/comics/comics-drawer-embed.html?v=3"
      title="Comics, Portfolio"
      className="absolute inset-0 h-full w-full min-h-full border-0 block"
      style={{ minHeight: "100%" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
