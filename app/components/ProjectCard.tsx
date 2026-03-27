"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────
export interface Project {
  id: string;
  index: number;
  name: string;
  tags: string[];
  year: string;
  coverSrc?: string;
  accentColor: string;
  overview: string;
  problem: string;
  process: string;
  outcome: string;
}

// ─── Sample data, swap with real projects ────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "casa",
    index: 1,
    name: "Casa do Urso",
    tags: ["Brand Identity", "UX Design"],
    year: "2024",
    accentColor: "#F9746E",
    overview:
      "A sensory-driven brand system that translates neurodevelopment principles into a cohesive visual and spatial language.",
    problem:
      "Therapy spaces either lack identity or overwhelm users with visual noise. The challenge: design a system that supports emotional regulation across all age groups.",
    process:
      "Grid-based construction from scratch. Each letterform and symbol derived from the O oval proportional system. 8 construction stages documented.",
    outcome:
      "A modular identity deployable across physical and digital touchpoints. Grid animation became a standalone brand asset.",
  },
  {
    id: "motion",
    index: 2,
    name: "Motion System",
    tags: ["Motion Design", "Interaction"],
    year: "2024",
    accentColor: "#5BC7AA",
    overview:
      "A principled animation language built for scale, one set of timing curves and spring tokens used across all product surfaces.",
    problem:
      "Inconsistent animations were creating cognitive friction as users moved between product features. No shared vocabulary existed.",
    process:
      "Audited 200+ animations in production. Clustered by intent. Mapped to semantic motion tokens. Documented as a Figma library.",
    outcome:
      "40% reduction in animation-related design review cycles. Adopted across 3 platform teams.",
  },
  {
    id: "vibe",
    index: 3,
    name: "Vibe Coding",
    tags: ["Creative Dev", "Tool Design"],
    year: "2025",
    accentColor: "#F5BF42",
    overview:
      "A live-coded visual environment where music, code and interaction share a single evolving canvas.",
    problem:
      "The gap between creative intent and technical execution in live performance contexts. Tools force a choice between expression and precision.",
    process:
      "Iterative prototyping over 6 weeks. 3 major pivots. Eventually found the constraint that freed the form: everything must be editable while running.",
    outcome:
      "Performed at 4 events. Open sourced on GitHub. 200+ forks in first month.",
  },
  {
    id: "world",
    index: 4,
    name: "World Building",
    tags: ["Art Direction", "Systems"],
    year: "2025",
    accentColor: "#4497C3",
    overview:
      "A speculative design project imagining urban interfaces for a post-screen city, what does wayfinding look like without displays?",
    problem:
      "Screens dominate public space but communicate almost nothing of value. Attention is extracted, not served.",
    process:
      "Research sprint → three scenario development → prototype each at 1:20 scale → stress-test with mobility impaired users.",
    outcome:
      "Featured in two design publications and presented at one academic conference.",
  },
];

// ─── 3D tilt card hook ────────────────────────────────────────────
function useTilt(strength = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ─── Project Card ─────────────────────────────────────────────────
export function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const tilt = useTilt(7);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={() => { tilt.onMouseLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      onClick={onClick}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.975 }}
      className="relative cursor-pointer select-none"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "2px",
        }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 65% 25%, ${project.accentColor}1a 0%, transparent 60%), #0d0d0d`,
            opacity: hovered ? 1 : 0.6,
          }}
        />

        {/* Cover image or video if provided */}
        {project.coverSrc && (
          /\.(mp4|webm|mov)(\?|$)/i.test(project.coverSrc) ? (
            <video
              src={project.coverSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: hovered ? 0.5 : 0.3, mixBlendMode: "luminosity", left: -3, top: -3 }}
            />
          ) : (
            <img
              src={project.coverSrc}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: hovered ? 0.5 : 0.3, mixBlendMode: "luminosity", left: -3, top: -3 }}
            />
          )
        )}

        {/* Subtle noise texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Hover shimmer sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}12 0%, transparent 45%)`,
          }}
        />

        {/* Index + year */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-4">
          <span
            className="font-mono text-[13px] tracking-[0.22em] uppercase"
            style={{ color: project.accentColor }}
          >
            {String(project.index).padStart(2, "0")}.
          </span>
          <span className="font-mono text-[13px] tracking-[0.15em] text-white/25">
            {project.year}
          </span>
        </div>

        {/* Tags */}
        <div className="absolute left-4 top-[38px] flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-white/30"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "2px 6px",
                borderRadius: "1px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="font-sans leading-[1.05] tracking-tight text-white/88"
            style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 450 }}
          >
            {project.name}
          </h3>

          {/* CTA hint */}
          <motion.div
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 5,
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-2.5 flex items-center gap-1.5"
          >
            <span
              className="font-mono text-[13px] uppercase tracking-[0.18em]"
              style={{ color: project.accentColor }}
            >
              Ver projeto
            </span>
            <motion.span
              animate={{ x: hovered ? 3 : 0 }}
              transition={{ duration: 0.22 }}
              style={{ color: project.accentColor, fontSize: "10px" }}
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "1.5px", background: project.accentColor, transformOrigin: "left" }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────
type Section = "overview" | "problem" | "process" | "outcome";
const SECTIONS: Section[] = ["overview", "problem", "process", "outcome"];

function ProjectDrawer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<Section, HTMLElement | null>>>({});
  const [active, setActive] = useState<Section>("overview");
  const isScrolling = useRef(false);

  // IntersectionObserver, scroll drives menu
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.section as Section;
          if (id) setActive(id);
        }
      },
      { root: container, rootMargin: "0px 0px -50% 0px", threshold: 0.1 }
    );
    SECTIONS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) { el.dataset.section = id; obs.observe(el); }
    });
    return () => obs.disconnect();
  }, [project]);

  // Click menu → scroll
  const scrollTo = (id: Section) => {
    const container = scrollRef.current;
    const target = sectionRefs.current[id];
    if (!container || !target) return;
    isScrolling.current = true;
    setActive(id);
    const offset =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      24;
    container.scrollTo({ top: offset, behavior: "smooth" });
    setTimeout(() => { isScrolling.current = false; }, 750);
  };

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const copy: Record<Section, string> = {
    overview: project.overview,
    problem: project.problem,
    process: project.process,
    outcome: project.outcome,
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        className="fixed inset-y-0 right-0 z-[90] flex w-[72vw] max-w-[920px] overflow-hidden border-l border-white/[0.09]"
        style={{ background: "rgba(20,20,20,0.96)", backdropFilter: "blur(20px)" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Sidebar ── */}
        <div
          className="flex w-[260px] shrink-0 flex-col"
          style={{
            background: "#e8dddd",
            borderRight: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5">
            <span
              className="font-mono text-[30px] leading-none tracking-tight"
              style={{ color: project.accentColor }}
            >
              {String(project.index).padStart(2, "0")}.
            </span>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[14px] leading-none text-white opacity-80 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-5 pt-5">
            <h2
              className="font-sans leading-[0.95] tracking-tight text-black"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 450 }}
            >
              {project.name}
            </h2>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-black/50"
                  style={{ border: "1px solid rgba(0,0,0,0.18)", padding: "2px 6px", borderRadius: "1px" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-black/15" />
            <p className="mt-3 font-mono text-[13px] uppercase leading-[1.6] tracking-[0.08em] text-black/50">
              {project.year}
            </p>
          </div>

          {/* Nav */}
          <nav className="mt-auto border-t border-black/15">
            {SECTIONS.map((section, i) => {
              const isActive = active === section;
              return (
                <button
                  key={section}
                  onClick={() => scrollTo(section)}
                  className="flex w-full items-center justify-between border-b border-black/15 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-black/5"
                  style={{ background: isActive ? "rgba(0,0,0,0.07)" : undefined }}
                >
                  <span
                    className="font-sans capitalize leading-[0.9]"
                    style={{ fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 400 }}
                  >
                    {section}
                  </span>
                  <motion.span
                    animate={{
                      background: isActive ? "#000" : "rgba(0,0,0,0.18)",
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                    className="flex h-5 w-5 items-center justify-center font-mono text-[13px] tracking-widest text-white"
                  >
                    {i + 1}
                  </motion.span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Scrollable content ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          style={{ background: "#0d0d0d" }}
        >
          {SECTIONS.map((section) => {
            const isActive = active === section;
            return (
              <motion.div
                key={section}
                ref={(el) => { sectionRefs.current[section] = el; }}
                animate={{
                  background: isActive
                    ? "rgba(255,255,255,0.032)"
                    : "rgba(255,255,255,0)",
                }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/[0.055] px-7 py-8 last:border-b-0"
              >
                <div className="mb-2.5 font-mono text-[13px] uppercase tracking-[0.22em] text-white/30">
                  {section}
                </div>
                <motion.p
                  animate={{
                    color: isActive
                      ? "rgba(255,255,255,0.86)"
                      : "rgba(255,255,255,0.48)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-[13px] leading-relaxed tracking-[0.02em] md:text-[14px]"
                >
                  {copy[section]}
                </motion.p>
              </motion.div>
            );
          })}

          {/* Spacer */}
          <div className="h-[55vh]" />
        </div>
      </motion.aside>
    </>
  );
}

// ─── Main export: ProjectGrid ─────────────────────────────────────
export default function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div
      className="min-h-screen bg-[#111] px-6 py-14 md:px-12 md:py-20"
    >
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.22em] text-white/28">
            Selected Work
          </p>
          <h1
            className="mt-1 font-sans leading-none tracking-tight text-white/88"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 450 }}
          >
            Projects
          </h1>
        </div>
        <span className="font-mono text-[13px] uppercase tracking-[0.15em] text-white/18">
          {PROJECTS.length} projects
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelected(project)}
          />
        ))}
      </div>

      {/* Drawer */}
      <AnimatePresence mode="wait">
        {selected && (
          <ProjectDrawer
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
