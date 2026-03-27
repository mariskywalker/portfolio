"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type DrawerSection = "overview" | "problem" | "process" | "outcome";

const MENU_ENTRIES: { id: DrawerSection; label: string; n: number }[] = [
  { id: "overview", label: "Overview", n: 1 },
  { id: "problem",  label: "Problem",  n: 2 },
  { id: "process",  label: "Process",  n: 3 },
  { id: "outcome",  label: "Outcome",  n: 4 },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useDrawerScroll() {
  const scrollRef   = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<DrawerSection, HTMLElement | null>>>({});
  const [active, setActive] = useState<DrawerSection>("overview");
  const scrolling = useRef(false);

  const scrollTo = useCallback((id: DrawerSection) => {
    const container = scrollRef.current;
    const target    = sectionRefs.current[id];
    if (!container || !target) return;

    scrolling.current = true;
    setActive(id);

    const offset =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      24;

    container.scrollTo({ top: offset, behavior: "smooth" });
    setTimeout(() => { scrolling.current = false; }, 750);
  }, []);

  const registerRef = useCallback(
    (id: DrawerSection) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
      if (el) el.dataset.section = id;
    },
    []
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.section as DrawerSection;
          if (id) setActive(id);
        }
      },
      { root: container, rootMargin: "0px 0px -50% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { scrollRef, registerRef, active, scrollTo };
}

// ─── Section block ─────────────────────────────────────────────────────────────
// Each section: optional full-width media on top → text below
// No fixed hero, everything scrolls together like Sutera
function SectionBlock({
  id,
  label,
  active,
  registerRef,
  mediaSrc,
  isVideo,
  children,
}: {
  id: DrawerSection;
  label: string;
  active: boolean;
  registerRef: (el: HTMLElement | null) => void;
  mediaSrc?: string;
  isVideo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div ref={registerRef} className="border-b border-white/[0.07] last:border-b-0">

      {/* Full-width media, part of scroll, not fixed */}
      {mediaSrc && (
        <div className="relative w-full overflow-hidden rounded-sm">
          <motion.div
            animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 1.02 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full"
          >
            {isVideo ? (
              <video
                src={mediaSrc}
                autoPlay loop muted playsInline
                className="h-auto w-full object-contain"
              />
            ) : (
              <img
                src={mediaSrc} alt="" aria-hidden draggable={false}
                className="h-auto w-full object-contain"
              />
            )}
          </motion.div>

          {/* Gradient + label at bottom of media */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end px-6 pb-5 pt-20"
            style={{ background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 100%)" }}
          >
            <motion.span
              animate={{ opacity: active ? 0.6 : 0.25 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white"
            >
              {label}
            </motion.span>
          </div>
        </div>
      )}

      {/* Text content */}
      <motion.div
        animate={{
          backgroundColor: active ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.3 }}
        className="px-6 py-7"
      >
        {/* Label shown above text only when section has no media */}
        {!mediaSrc && (
          <motion.div
            animate={{ opacity: active ? 0.5 : 0.28 }}
            transition={{ duration: 0.25 }}
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white"
          >
            {label}
          </motion.div>
        )}
        {children}
      </motion.div>
    </div>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────────────────
export function ProjectDrawer({
  projectDrawerOpen,
  selectedProject,
  projects,
  activeDrawerCopy,
  setProjectDrawerOpen,
}: {
  projectDrawerOpen: boolean;
  selectedProject: any;
  projects: any[];
  activeDrawerCopy: any;
  setProjectDrawerOpen: (v: boolean) => void;
}) {
  const { scrollRef, registerRef, active, scrollTo } = useDrawerScroll();

  const idx = projects.findIndex((p) => p.id === selectedProject.id);

  // Per-section media, add more project-specific logic here as needed
  const sectionMedia: Partial<Record<DrawerSection, { src: string; video: boolean }>> = {
    overview: selectedProject.videoSrc
      ? { src: selectedProject.videoSrc, video: true }
      : selectedProject.iconSrc
      ? { src: selectedProject.iconSrc, video: false }
      : undefined,
    process:
      selectedProject.id === "casa"
        ? { src: "/casadourso-process-corrected-final.mp4", video: true }
        : undefined,
  } as any;

  const textColor = (id: DrawerSection) =>
    active === id ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {projectDrawerOpen && (
        <motion.section
          key={selectedProject.id}
          initial={{ x: "100%", opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.92 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-y-0 right-0 z-[90] w-[70vw] border-l border-white/20 bg-[#141414]/96 backdrop-blur-xl lg:w-[66.666vw]"
        >
          {/* Two-column layout: sidebar | scroll content */}
          <div className="grid h-full" style={{ gridTemplateColumns: "380px 1fr" }}>

            {/* ── Left sidebar ──────────────────────────────────────── */}
            <aside className="flex h-full flex-col border-r border-black/20 bg-[#e8dddd] text-black overflow-hidden">

              <div className="flex items-start justify-between px-4 pt-4 shrink-0">
                <span className="font-mono text-[32px] leading-none tracking-tight">
                  0{idx + 1}.
                </span>
                <button
                  type="button"
                  onClick={() => setProjectDrawerOpen(false)}
                  className="h-7 w-7 bg-black font-mono text-[14px] leading-none text-white"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="px-4 pt-8 shrink-0">
                <h2 className="font-heading text-[52px] leading-[0.95] tracking-tight">
                  {selectedProject.name}
                </h2>
                <div className="mt-6 border-t border-black/30" />
                <p className="mt-6 font-mono text-[11px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                  {selectedProject.description}
                </p>
              </div>

              {/* Nav, fixed to bottom of sidebar */}
              <nav className="mt-auto border-t border-black/30 shrink-0">
                {MENU_ENTRIES.map((entry) => {
                  const isActive = active === entry.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => scrollTo(entry.id)}
                      className="flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5"
                      style={{ backgroundColor: isActive ? "rgba(0,0,0,0.08)" : undefined }}
                    >
                      <span className="font-sans text-[44px] leading-[0.9]">
                        {entry.label}
                      </span>
                      <motion.span
                        animate={{
                          backgroundColor: isActive ? "#000" : "rgba(0,0,0,0.18)",
                          scale: isActive ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.18 }}
                        className="flex h-6 w-6 items-center justify-center font-mono text-[10px] tracking-widest text-white"
                      >
                        {entry.n}
                      </motion.span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* ── Right: continuous scroll ──────────────────────────── */}
            <div ref={scrollRef} className="h-full overflow-y-auto bg-[#0d0d0d]">

              <SectionBlock
                id="overview" label="Overview"
                active={active === "overview"}
                registerRef={registerRef("overview")}
                mediaSrc={sectionMedia.overview?.src}
                isVideo={sectionMedia.overview?.video}
              >
                <motion.p
                  animate={{ color: textColor("overview") }}
                  transition={{ duration: 0.25 }}
                  className="whitespace-pre-line font-mono text-[13px] leading-relaxed md:text-[15px]"
                >
                  {activeDrawerCopy?.overview ?? selectedProject.description}
                </motion.p>
              </SectionBlock>

              <SectionBlock
                id="problem" label="Problem"
                active={active === "problem"}
                registerRef={registerRef("problem")}
              >
                <motion.p
                  animate={{ color: textColor("problem") }}
                  transition={{ duration: 0.25 }}
                  className="whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                >
                  {activeDrawerCopy?.problem ??
                    "Translate project goals into a structured system where visual identity, interaction rhythm, and content hierarchy remain clear across contexts."}
                </motion.p>
              </SectionBlock>

              <SectionBlock
                id="process" label="Process"
                active={active === "process"}
                registerRef={registerRef("process")}
                mediaSrc={sectionMedia.process?.src}
                isVideo={sectionMedia.process?.video}
              >
                {activeDrawerCopy ? (
                  <motion.p
                    animate={{ color: textColor("process") }}
                    transition={{ duration: 0.25 }}
                    className="whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                  >
                    {activeDrawerCopy.process}
                  </motion.p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.fields.map((field: any) => (
                      <span
                        key={`${selectedProject.id}-${field.k}`}
                        className="border border-white/15 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/72"
                      >
                        {field.k}: {field.v}
                      </span>
                    ))}
                  </div>
                )}
              </SectionBlock>

              <SectionBlock
                id="outcome" label="Outcome"
                active={active === "outcome"}
                registerRef={registerRef("outcome")}
              >
                <motion.p
                  animate={{ color: textColor("outcome") }}
                  transition={{ duration: 0.25 }}
                  className="whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                >
                  {activeDrawerCopy?.outcome ??
                    "A clear project narrative with stronger focus on mockups and key visuals, allowing navigation by chapter while preserving a cinematic flow inside the drawer."}
                </motion.p>
              </SectionBlock>

              {/* Spacer: permite que a última seção alcance o threshold do observer */}
              <div className="h-[60vh]" />
            </div>

          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
