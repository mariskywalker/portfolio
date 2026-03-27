"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StrengthBars } from "./StrengthBars";
import { SystemPanel } from "./SystemPanel";
import { ProfileDisclaimer } from "./ProfileDisclaimer";
import { SkillWord } from "@/app/components/PixelAvatars";

type Props = {
  open: boolean;
  showPlayerPanel?: boolean;
  onClose: () => void;
};

export function PlayerPanel({ open, showPlayerPanel = true, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="pointer-events-none fixed left-6 top-[92px] z-40 hidden w-[min(420px,92vw)] md:left-10 md:block">
      <div className="pointer-events-auto">
        <SystemPanel
          title="PROFILE CONTROL"
          metaLeft="SYS: ONLINE"
          metaRight={open ? "STATE: OPEN" : "STATE: CLOSED"}
          tone={open ? "active" : "default"}
          className="shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
        >
          <ProfileDisclaimer />
        </SystemPanel>
      </div>

      <AnimatePresence>
        {open && showPlayerPanel ? (
          <motion.aside
            key="player-panel"
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: [0.2, 0.9, 0.2, 1] }}
            className="pointer-events-auto mt-3"
          >
            <SystemPanel
              title="PLAYER PANEL"
              metaLeft="PROFILE: LOADED"
              metaRight="NODE: USER_01 / STATUS: ACTIVE"
              tone="active"
              className="shadow-[0_28px_120px_rgba(0,0,0,0.78)]"
            >
              <div className="max-h-[calc(100svh-210px)] overflow-auto pr-1">
                <div
                  className="font-heading text-[22px] font-semibold uppercase tracking-[0.12em] text-white"
                  data-cursor-photo="mari-photo"
                >
                  MARI SYSTEM
                </div>
                <div className="mt-2 font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
                  CREATIVE DIRECTOR / DESIGNER / VIBE CODER
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16, ease: "linear", delay: 0.06 }}
                >
                  <div className="mt-5 h-px w-full bg-white/10" />

                  <p className="mt-5 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/55">
                    System-driven creative operator building interactive UI, motion logic, and spatial experiences.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Chip k="STATUS" v="ACTIVE" accent />
                    <Chip k="PROFILE" v="READY" />
                    <Chip k="SYS" v="MARI" />
                    <Chip k="INDEX" v="0001" />
                  </div>

                  <StrengthBars
                    strengths={[
                      {
                        key: "design",
                        label: (
                          <SkillWord skill="design" avatarSize={0.5} cursorAvatar>
                            DESIGN
                          </SkillWord>
                        ),
                        value: 9,
                      },
                      {
                        key: "art-direction",
                        label: (
                          <SkillWord skill="art-direction" cursorAvatar>
                            ART DIRECTION
                          </SkillWord>
                        ),
                        value: 8,
                      },
                      {
                        key: "vibe-coding",
                        label: (
                          <SkillWord skill="vibe-coding" cursorAvatar>
                            VIBE CODING
                          </SkillWord>
                        ),
                        value: 7,
                      },
                      {
                        key: "motion",
                        label: (
                          <SkillWord skill="motion" cursorAvatar>
                            MOTION
                          </SkillWord>
                        ),
                        value: 8,
                      },
                      {
                        key: "world-building",
                        label: (
                          <SkillWord skill="world-building" cursorAvatar>
                            WORLD BUILDING
                          </SkillWord>
                        ),
                        value: 6,
                      },
                      {
                        key: "system-thinking",
                        label: (
                          <SkillWord skill="system-thinking" cursorAvatar>
                            SYSTEM THINKING
                          </SkillWord>
                        ),
                        value: 9,
                      },
                    ]}
                  />

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/40">
                      SYS: ONLINE
                    </div>
                    <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/35">
                      STATUS: ACTIVE / ID: 0001-A
                    </div>
                  </div>
                </motion.div>
              </div>
            </SystemPanel>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Chip({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="border border-white/10 bg-black/35 p-3" data-cursor-photo="mari-photo">
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/40">
        {k}
      </div>
      <div
        className="mt-2 font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: accent ? "var(--sys-accent)" : "rgba(255,255,255,0.75)" }}
      >
        {v}
      </div>
    </div>
  );
}
