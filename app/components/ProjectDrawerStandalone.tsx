"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ── TYPES ──────────────────────────────────────────────
interface Project {
  id: string;
  slug: string;
  index: string;          // "01.", "02.", etc
  title: string;
  description: string;
  year: string;
  role: string;
  scope: string;
  tags: { label: string; href: string }[];
  images: string[];       // array de paths, ex: ["/projects/heinz-1.jpg"]
  color?: string;         // cor de fundo do drawer, default vermelho
}

// ── DATA ───────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "heinz",
    index: "01.",
    title: "Heinz Lab",
    description:
      "Campaign-driven interactive work presented as a clean system card. Bold heading, mono meta, and controlled credit block, consistent with the home UI language.",
    year: "2024",
    role: "Art Director",
    scope: "Campaign / Interactive",
    tags: [
      { label: "CASE STUDY", href: "/projects/heinz" },
      { label: "CAMPAIGN", href: "/projects/heinz" },
    ],
    images: ["/projects/heinz-1.jpg", "/projects/heinz-2.jpg"],
    color: "#cc0000",
  },
  {
    id: "2",
    slug: "casa-do-urso",
    index: "02.",
    title: "Casa do Urso",
    description:
      "A portfolio case study for Casa do Urso, focused on a tactile interface system and branded interaction language. Built to translate a warm identity into a controlled UI rhythm, with modular panels and high-contrast typography.",
    year: "2024",
    role: "Designer",
    scope: "Brand Identity",
    tags: [
      { label: "BRANDING", href: "/projects/casa-do-urso" },
      { label: "UI SYSTEM", href: "/projects/casa-do-urso" },
    ],
    images: ["/projects/casa-1.jpg"],
    color: "#cc0000",
  },
  {
    id: "3",
    slug: "pokerbros",
    index: "03.",
    title: "PokerBros",
    description:
      "Design leadership for a global poker platform. Head of Design: visual identity, product UI, and art direction across app, web, podcasts, and marketing. One coherent system across all touchpoints.",
    year: "2023–24",
    role: "Head of Design",
    scope: "Brand · Product · Media",
    tags: [
      { label: "BRAND", href: "/projects/pokerbros" },
      { label: "PRODUCT", href: "/projects/pokerbros" },
    ],
    images: ["/projects/poker-1.jpg"],
    color: "#cc0000",
  },
  {
    id: "4",
    slug: "projeto-4",
    index: "04.",
    title: "Projeto 04",
    description: "Em breve.",
    year: "",
    role: "",
    scope: "",
    tags: [],
    images: [],
    color: "#cc0000",
  },
  {
    id: "5",
    slug: "projeto-5",
    index: "05.",
    title: "Projeto 05",
    description: "Em breve.",
    year: "",
    role: "",
    scope: "",
    tags: [],
    images: [],
    color: "#cc0000",
  },
];

// ── COMPONENT ──────────────────────────────────────────
export default function ProjectDrawerStandalone() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const active = PROJECTS.find((p) => p.id === activeId) ?? null;

  // controla animação de entrada/saída
  useEffect(() => {
    if (activeId) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [activeId]);

  // fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (id: string) => {
    if (activeId === id) { setActiveId(null); return; }
    setVisible(false);
    setTimeout(() => setActiveId(id), activeId ? 200 : 0);
  };

  const drawerColor = active?.color ?? "#cc0000";

  return (
    <section className="relative w-full font-mono">

      {/* ── HEADER ── */}
      <div className="flex items-baseline justify-between px-6 py-5 border-b border-white/10">
        <h2 className="text-white text-xs tracking-[0.3em] uppercase opacity-50">
          Some Project Examples
        </h2>
        <span className="text-white/25 text-[13px] tracking-widest">
          (Have fun exploring)
        </span>
      </div>

      {/* ── LAYOUT: drawer + grid ── */}
      <div className="flex">

        {/* DRAWER, esquerda */}
        <div
          className="relative shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            width: active ? "380px" : "0px",
          }}
        >
          {active && (
            <div
              className="w-[380px] h-full flex flex-col"
              style={{ backgroundColor: drawerColor }}
            >
              {/* topo do drawer */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <span className="text-white/70 text-[13px] tracking-[0.25em] uppercase">
                  {active.index}
                </span>
                <button
                  onClick={() => setActiveId(null)}
                  className="text-white/50 hover:text-white text-xs tracking-widest transition-colors border border-white/20 hover:border-white/60 w-7 h-7 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* conteúdo */}
              <div
                className="flex flex-col gap-6 px-6 pb-8 overflow-y-auto flex-1 transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                }}
              >
                {/* título */}
                <h3 className="text-white text-3xl font-bold uppercase leading-tight tracking-tight">
                  {active.title}
                </h3>

                {/* linha divisória */}
                <div className="w-full h-px bg-white/20" />

                {/* meta */}
                <div className="grid grid-cols-2 gap-3 text-[13px] tracking-[0.2em] uppercase">
                  <div>
                    <p className="text-white/50 mb-1">Role</p>
                    <p className="text-white font-bold">{active.role}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Scope</p>
                    <p className="text-white font-bold">{active.scope}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Year</p>
                    <p className="text-white font-bold">{active.year}</p>
                  </div>
                </div>

                {/* linha divisória */}
                <div className="w-full h-px bg-white/20" />

                {/* descrição */}
                <p className="text-white/80 text-[13px] leading-relaxed tracking-wide uppercase">
                  {active.description}
                </p>

                {/* tags / links */}
                {active.tags.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {active.tags.map((tag) => (
                      <Link
                        key={tag.label}
                        href={tag.href}
                        className="text-white text-[13px] tracking-[0.25em] uppercase border border-white/30 hover:border-white px-3 py-2 transition-colors w-fit"
                      >
                        {tag.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* linha divisória */}
                <div className="w-full h-px bg-white/20" />

                {/* CTA */}
                <Link
                  href={`/projects/${active.slug}`}
                  className="text-white text-[13px] tracking-[0.3em] uppercase flex items-center gap-3 group w-fit"
                >
                  <span>YEAR</span>
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                  <span>ENTER CASE</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── GRID DE PROJETOS ── */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-l border-white/10">
          {PROJECTS.map((project, i) => (
            <button
              key={project.id}
              onClick={() => open(project.id)}
              className={`
                group relative aspect-square overflow-hidden text-left
                border-r border-b border-white/10
                transition-all duration-200
                ${activeId === project.id ? "outline outline-1 outline-white/40" : ""}
              `}
              style={{ background: "#0d0d0d", cursor: "none" }}
            >
              {/* thumbnail */}
              {project.images[0] ? (
                <div className="absolute inset-0">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/8 text-4xl font-bold tracking-widest">
                    {project.index}
                  </span>
                </div>
              )}

              {/* overlay no hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              {/* index */}
              <span className="absolute top-3 left-3 text-white/25 text-[13px] tracking-widest z-10">
                {project.index}
              </span>

              {/* nome */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <p className="text-white/50 group-hover:text-white/80 text-[13px] tracking-widest uppercase transition-colors">
                  {project.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* ── MÍDIA, direita (quando drawer aberto) ── */}
        {active && active.images.length > 0 && (
          <div
            className="shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
            style={{
              width: visible ? "calc(100% - 380px - 300px)" : "0px",
              minWidth: visible ? "300px" : "0px",
              opacity: visible ? 1 : 0,
            }}
          >
            <div className="w-full h-full flex flex-col gap-px bg-white/5">
              {active.images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative flex-1 min-h-[200px] overflow-hidden bg-black"
                >
                  <Image
                    src={src}
                    alt={`${active.title} ${idx + 1}`}
                    fill
                    className="object-cover opacity-90"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
