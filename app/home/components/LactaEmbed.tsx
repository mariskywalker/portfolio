"use client";

import { useEffect, useRef, useState } from "react";

type LactaSection = "campaign" | "character" | "illus" | "ooh";

type Props = {
  scrollToSection?: LactaSection | null;
  onScrollDone?: () => void;
};

export function LactaEmbed({ scrollToSection, onScrollDone }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // When iframe content is loaded we can reliably query inside it.
  const onLoad = () => setReady(true);

  useEffect(() => {
    if (!scrollToSection) return;
    if (!ready) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    const el = doc.getElementById(scrollToSection);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const t = window.setTimeout(() => onScrollDone?.(), 650);
      return () => window.clearTimeout(t);
    }
  }, [scrollToSection, onScrollDone, ready]);

  return (
    <iframe
      ref={iframeRef}
      src="/LACTA/lacta-case.html"
      title="Lacta, Case Study"
      loading="lazy"
      className="absolute inset-0 h-full w-full min-h-full border-0 block"
      sandbox="allow-scripts allow-same-origin"
      style={{ minHeight: "100%" }}
      onLoad={onLoad}
    />
  );
}

