"use client";

import { motion } from "framer-motion";
import { SkillWord } from "@/app/components/PixelAvatars";
import { PixelAvatar } from "@/app/components/PixelAvatars";

type SkillItem = {
  skill: string;
  label: string;
};

const SKILLS: SkillItem[] = [
  { skill: "design", label: "DESIGN" },
  { skill: "art-direction", label: "ART DIRECTION" },
  { skill: "vibe-coding", label: "VIBE CODING" },
  { skill: "motion", label: "MOTION" },
  { skill: "world-building", label: "WORLD BUILDING" },
  { skill: "system-thinking", label: "SYSTEM THINKING" },
];

function ScrollIcon() {
  return (
    <span
      aria-hidden
      className="ml-auto flex h-[10px] w-[10px] shrink-0 items-center justify-center"
      style={{ color: "rgba(255,255,255,0.22)" }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-full w-full">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </span>
  );
}

export function IntroMarquee() {
  const row = [...SKILLS, ...SKILLS];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/12 bg-black/35">
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/50">
          SKILLS / FOCUS
        </div>
        <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/35">
          STREAM: ACTIVE
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)" }} />
        <motion.div
          className="flex w-max items-stretch"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        >
          {row.map((item, idx) => (
            <div
              key={`${item.skill}-${idx}`}
              className="flex w-[320px] items-center gap-4 border-r border-white/10 px-6 py-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-white/14 bg-black/55">
                <PixelAvatar name={item.skill} size={0.14} />
              </div>
              <div className="min-w-0">
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.32em] text-white/35">
                  INDEX {String((idx % SKILLS.length) + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 truncate font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/70">
                  <SkillWord skill={item.skill}>{item.label}</SkillWord>
                </div>
              </div>
              <ScrollIcon />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

