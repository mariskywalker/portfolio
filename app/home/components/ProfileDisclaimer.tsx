"use client";

import Image from "next/image";
import PixelPortrait from "@/app/components/PixelPortrait";

/**
 * ProfileDisclaimer, integrado ao UI do card (sem fundo próprio)
 */
export function ProfileDisclaimer() {
  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div
        className="h-[96px] w-[64px] flex-shrink-0 cursor-pointer"
        data-cursor-portrait
      >
        <PixelPortrait alt="Mariana Pappou" className="h-full w-full object-contain" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-[var(--font-geist-mono)] text-[13px] leading-[1.55] tracking-[0.04em] text-white/65">
          I&apos;m <strong>Mariana Pappou</strong>, not a team, just a single visual designer with Vibe coding hyperfocus, building
          this website with Cursor.
        </p>

        {/* Tools used */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.18em] text-white/40">
            TOOLS USED:
          </span>
          <a
            href="https://cursor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-2 py-1 transition-colors hover:border-white/25 hover:bg-white/10"
            aria-label="Cursor, AI code editor"
          >
            <Image
              src="/cursor-logo.svg"
              alt=""
              width={18}
              height={18}
              className="invert opacity-90"
            />
            <span className="font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">
              Cursor
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
