"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDrawerScroll } from "./useDrawerScroll";

const MENU_ENTRIES = [
  { id: "overview", label: "Overview", n: 1 },
  { id: "problem",  label: "Problem",  n: 2 },
  { id: "process",  label: "Process",  n: 3 },
  { id: "outcome",  label: "Outcome",  n: 4 },
] as const;

// ─── Section wrapper: fades + slides in when it becomes active ────────────────
function DrawerSection({
  id,
  active,
  registerRef,
  children,
}: {
  id: string;
  active: boolean;
  registerRef: (el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      ref={registerRef}
      animate={{
        borderColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
        backgroundColor: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
      }}
      transition={{ duration: 0.25 }}
      className="p-4"
    >
      {children}
    </motion.div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
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
  const { scrollRef, registerRef, activeSection, scrollTo } = useDrawerScroll();

  const projectIndex = projects.findIndex((p) => p.id === selectedProject.id);

  // Animated hero: swap video/image when active section changes
  const showProcessVideo =
    selectedProject.id === "casa" && activeSection === "process";
  const heroSrc = showProcessVideo
    ? "/casadourso-process-corrected-final.mp4"
    : selectedProject.videoSrc || selectedProject.iconSrc;
  const isVideo = showProcessVideo || !!selectedProject.videoSrc;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {projectDrawerOpen ? (
        <motion.section
          key={selectedProject.id}
          initial={{ x: "100%", opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.92 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-y-0 right-0 z-[90] w-[70vw] border-l border-white/20 bg-[#141414]/96 backdrop-blur-xl lg:w-[66.666vw]"
        >
          <div className="mx-auto flex h-full w-full flex-col px-5 py-5 md:px-8 md:py-7">
            <div className="grid h-full min-h-0 grid-cols-1 gap-5 pt-2 md:grid-cols-[380px_1fr]">

              {/* ── Sidebar / Menu ────────────────────────────────────────── */}
              <aside className="flex h-full min-h-0 flex-col border border-black/20 bg-[#e8dddd] text-black">
                <div className="flex items-start justify-between px-4 pt-4">
                  <span className="font-mono text-[32px] leading-none tracking-tight">
                    0{projectIndex + 1}.
                  </span>
                  <button
                    type="button"
                    onClick={() => setProjectDrawerOpen(false)}
                    className="h-7 w-7 bg-black font-mono text-[14px] leading-none text-white"
                    aria-label="Close drawer"
                  >
                    ×
                  </button>
                </div>

                <div className="px-4 pt-8">
                  <h2 className="font-heading text-[52px] leading-[0.95] tracking-tight">
                    {selectedProject.name}
                  </h2>
                  <div className="mt-6 border-t border-black/30" />
                  <p className="mt-6 font-mono text-[11px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Menu items, highlight + scroll on click */}
                <div className="mt-auto border-t border-black/30">
                  {MENU_ENTRIES.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => scrollTo(entry.id)}
                      className="flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5"
                      style={{
                        backgroundColor:
                          activeSection === entry.id
                            ? "rgba(0,0,0,0.10)"
                            : undefined,
                      }}
                    >
                      <span className="font-sans text-[44px] leading-[0.9]">
                        {entry.label}
                      </span>
                      <motion.span
                        animate={{
                          backgroundColor:
                            activeSection === entry.id ? "#000" : "rgba(0,0,0,0.25)",
                          scale: activeSection === entry.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex h-6 w-6 items-center justify-center font-mono text-[10px] tracking-widest text-white"
                      >
                        {entry.n}
                      </motion.span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* ── Scrollable Content ────────────────────────────────────── */}
              <div className="min-h-0">
                <div
                  ref={scrollRef}
                  className="relative h-[68vh] overflow-y-auto border border-white/12 bg-[#0d0d0d] md:h-full"
                >
                  {/* Hero media, animates when active section changes */}
                  <motion.div
                    key={heroSrc}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full overflow-hidden border-b border-white/12"
                  >
                    {isVideo ? (
                      <video
                        src={heroSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-auto w-full object-contain opacity-90"
                      />
                    ) : heroSrc ? (
                      <img
                        src={heroSrc}
                        alt=""
                        aria-hidden
                        draggable={false}
                        className="h-auto w-full object-contain opacity-85"
                      />
                    ) : null}

                    {/* Section label overlay */}
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50"
                    >
                      {activeSection}
                    </motion.div>
                  </motion.div>

                  {/* Sections */}
                  <div className="space-y-8 p-5 md:p-6">

                    <DrawerSection
                      id="overview"
                      active={activeSection === "overview"}
                      registerRef={registerRef("overview")}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/62">
                        OVERVIEW
                      </div>
                      <motion.p
                        animate={{ color: activeSection === "overview" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)" }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 whitespace-pre-line font-mono text-[13px] leading-relaxed md:text-[15px]"
                      >
                        {activeDrawerCopy?.overview ?? selectedProject.description}
                      </motion.p>
                    </DrawerSection>

                    <DrawerSection
                      id="problem"
                      active={activeSection === "problem"}
                      registerRef={registerRef("problem")}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/62">
                        PROBLEM
                      </div>
                      <motion.p
                        animate={{ color: activeSection === "problem" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)" }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                      >
                        {activeDrawerCopy?.problem ??
                          "Translate project goals into a structured system where visual identity, interaction rhythm, and content hierarchy remain clear across contexts."}
                      </motion.p>
                    </DrawerSection>

                    <DrawerSection
                      id="process"
                      active={activeSection === "process"}
                      registerRef={registerRef("process")}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/62">
                        PROCESS
                      </div>
                      {activeDrawerCopy ? (
                        <motion.p
                          animate={{ color: activeSection === "process" ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.72)" }}
                          transition={{ duration: 0.25 }}
                          className="mt-3 whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                        >
                          {activeDrawerCopy.process}
                        </motion.p>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
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
                    </DrawerSection>

                    <DrawerSection
                      id="outcome"
                      active={activeSection === "outcome"}
                      registerRef={registerRef("outcome")}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/62">
                        OUTCOME
                      </div>
                      <motion.p
                        animate={{ color: activeSection === "outcome" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)" }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 whitespace-pre-line font-mono text-[13px] leading-relaxed tracking-[0.02em]"
                      >
                        {activeDrawerCopy?.outcome ??
                          "A clear project narrative with stronger focus on mockups and key visuals, allowing navigation by chapter while preserving a cinematic flow inside the drawer."}
                      </motion.p>
                    </DrawerSection>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
