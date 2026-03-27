"use client";

import { Vector2Shape } from "./Vector2Shape";

type Props = {
  headline: string;
  subcopy: string;
  metaLeft?: string;
  metaRightTop?: string;
  metaRightBottom?: string;
  cornerTag?: string;
};

export function TokyoStyleCard({
  headline,
  subcopy,
  metaLeft = "96.6764 N, 139.6500 E",
  metaRightTop = "2026",
  metaRightBottom = "PLAY MINIGAME",
  cornerTag = "JAPAN",
}: Props) {
  return (
    <div className="relative w-full overflow-hidden">
      <Vector2Shape className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 p-6 md:p-7">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[38ch]">
            <div className="font-heading text-[20px] font-black leading-[1.05] tracking-tight text-black md:text-[22px]">
              {headline}
            </div>
          </div>

          <div className="text-right">
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
              {cornerTag}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
              {metaLeft}
            </div>
            <p className="mt-4 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.04em] text-black/85 md:text-[13px]">
              {subcopy}
            </p>
          </div>

          <div className="col-span-12 md:col-span-5">
            <div className="border border-black/40 bg-black/0 p-4">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/80">
                CREDITS
              </div>
              <div className="mt-3 space-y-2 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-black/70">
                <div>SITE BY: MARI</div>
                <div>DESIGN SYSTEM: UI GRID</div>
                <div>MOTION: LINEAR DISCIPLINE</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
                {metaRightTop}
              </div>
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.24em] text-black/70">
                {metaRightBottom}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-black/35" />

        <div className="mt-5 flex items-end justify-between gap-6">
          <div className="font-heading text-[56px] font-black uppercase tracking-[-0.02em] text-black md:text-[74px]">
            {headline.split(" ")[0]}
          </div>
          <div className="font-heading text-[56px] font-black uppercase tracking-[-0.02em] text-black/35 md:text-[74px]">
            {headline.split(" ").slice(1).join(" ") || "TOKYO"}
          </div>
        </div>
      </div>
    </div>
  );
}

