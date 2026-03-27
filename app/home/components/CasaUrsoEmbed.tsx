"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawerSection } from "./useDrawerScroll";

type Props = {
  scrollToSection?: DrawerSection | null;
  onScrollDone?: () => void;
};

const ANCHOR_BY_SECTION: Record<DrawerSection, string> = {
  overview: "overview",
  problem: "challenge", // Casa case HTML uses "challenge" id (drawer uses "problem")
  process: "process",
  outcome: "outcome",
  tato: "tato",
  deliverables: "deliverables",
};

export function CasaUrsoEmbed({ scrollToSection, onScrollDone }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  const onLoad = () => setReady(true);

  useEffect(() => {
    if (!scrollToSection) return;
    if (!ready) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    const anchorId = ANCHOR_BY_SECTION[scrollToSection];
    const el = doc.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const t = window.setTimeout(() => onScrollDone?.(), 650);
      return () => window.clearTimeout(t);
    }
  }, [scrollToSection, onScrollDone, ready]);

  return (
    <iframe
      ref={iframeRef}
      src="/casa-do-urso-case.html"
      title="Casa do Urso, Case Study"
      loading="lazy"
      className="absolute inset-0 h-full w-full min-h-full border-0 block"
      sandbox="allow-scripts allow-same-origin"
      style={{ minHeight: "100%" }}
      onLoad={onLoad}
    />
  );
}

