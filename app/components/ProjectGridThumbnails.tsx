"use client";

import { useState } from "react";
import Link from "next/link";

// ── TYPES ──────────────────────────────────────────────
interface Project {
  id: string;
  slug: string;       // usado para /projects/[slug]
  title: string;
  client: string;
  year: string;
  role: string;
  scope: string;
  category: string;
  status: "active" | "archived";
  thumbnail?: string; // path da imagem, ex: "/projects/heinz.jpg"
}

// ── DATA, substitua pelos seus projetos ───────────────
const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "heinz",
    title: "HEINZ LAB",
    client: "Heinz",
    year: "2024",
    role: "Art Director",
    scope: "Campaign Experience",
    category: "Campaign / Interactive",
    status: "archived",
  },
  {
    id: "2",
    slug: "casa-do-urso",
    title: "CASA DO URSO",
    client: "Casa do Urso",
    year: "2024",
    role: "Designer",
    scope: "Brand Identity",
    category: "Branding",
    status: "active",
  },
  {
    id: "3",
    slug: "pokerbros",
    title: "POKERBROS",
    client: "PokerBros",
    year: "2023–24",
    role: "Head of Design",
    scope: "Brand · Product · Media",
    category: "Brand / Product / Leadership",
    status: "active",
  },
  {
    id: "4",
    slug: "projeto-4",
    title: "PROJETO 04",
    client: "",
    year: "",
    role: "",
    scope: "",
    category: "",
    status: "active",
  },
  {
    id: "5",
    slug: "projeto-5",
    title: "PROJETO 05",
    client: "",
    year: "",
    role: "",
    scope: "",
    category: "",
    status: "active",
  },
];

// ── COMPONENT ──────────────────────────────────────────
export default function ProjectGridThumbnails() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = PROJECTS.find((p) => p.id === activeId) ?? null;

  return (
    <section className="w-full px-6 py-16 font-mono">

      {/* Header */}
      <div className="flex items-baseline justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-white text-2xl font-bold tracking-widest uppercase">
          Project Grid
        </h2>
        <span className="text-white/30 text-xs tracking-widest">
          {PROJECTS.length} / {PROJECTS.length} ACTIVE
        </span>
      </div>

      {/* Grid de thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/8">
        {PROJECTS.map((project, i) => (
          <button
            key={project.id}
            onClick={() =>
              setActiveId(activeId === project.id ? null : project.id)
            }
            className={`
              group relative aspect-[3/4] overflow-hidden text-left
              transition-all duration-300
              ${activeId === project.id
                ? "outline outline-1 outline-white/60 z-10"
                : "outline-none"
              }
            `}
            style={{ background: "#0d0d0d" }}
          >
            {/* Thumbnail ou placeholder */}
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {/* crosshair decorativo */}
                <span className="text-white/10 text-xs tracking-widest">+</span>
              </div>
            )}

            {/* Overlay escuro no hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

            {/* Index */}
            <span className="absolute top-3 left-3 text-white/25 text-[13px] tracking-widest">
              {String(i + 1).padStart(2, "0")} / {PROJECTS.length}
            </span>

            {/* Nome sempre visível na base */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
              <span className="text-white/60 text-xs tracking-widest uppercase">
                {project.title}
              </span>
              <span className="text-white/20 text-[13px] tracking-widest">
                HOVER
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Painel expandido, aparece abaixo do grid ao clicar */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${active ? "max-h-[600px] opacity-100 mt-px" : "max-h-0 opacity-0"}
        `}
      >
        {active && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8">

            {/* Col 1, identidade do projeto */}
            <div className="bg-[#0d0d0d] p-6 flex flex-col justify-between">
              <div>
                <p className="text-white/30 text-[13px] tracking-widest mb-1 uppercase">
                  {active.client}
                </p>
                <h3 className="text-white text-3xl font-bold tracking-widest uppercase leading-none mb-4">
                  {active.title}
                </h3>
                <p className="text-white/40 text-[13px] tracking-widest">
                  {active.year !== "" ? active.year : "YEAR:"}
                </p>
              </div>

              <div className="mt-6 border border-white/10 p-4 text-[13px] tracking-widest text-white/40 uppercase space-y-1">
                <p className="text-white/20 mb-2">CREDITS</p>
                <p>ROLE: {active.role}</p>
                <p>SCOPE: {active.scope}</p>
              </div>
            </div>

            {/* Col 2, project case */}
            <div className="bg-[#0d0d0d] p-6 flex flex-col justify-between border-l border-r border-white/8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-white text-[13px] tracking-widest font-bold uppercase">
                    Project Case
                  </span>
                  <span className="text-white/25 text-[13px] tracking-widest">
                    {active.client} / CLIENT: {active.client}
                  </span>
                </div>

                <p className="text-white/20 text-[13px] tracking-widest mb-3 uppercase">
                  Overview
                </p>
                <h4 className="text-white text-xl font-bold tracking-widest uppercase mb-4">
                  {active.title}
                </h4>

                <div className="grid grid-cols-2 gap-px bg-white/8 mt-6">
                  <div className="bg-[#0d0d0d] p-3">
                    <p className="text-white/30 text-[13px] tracking-widest uppercase mb-1">Client</p>
                    <p className="text-white text-xs tracking-widest uppercase">{active.client}</p>
                  </div>
                  <div className="bg-[#0d0d0d] p-3">
                    <p className="text-white/30 text-[13px] tracking-widest uppercase mb-1">Year</p>
                    <p className="text-white text-xs tracking-widest">{active.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3, details + CTA */}
            <div className="bg-[#0d0d0d] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-white text-[13px] tracking-widest font-bold uppercase">
                    Details
                  </span>
                  <span className="text-white/25 text-[13px] tracking-widest">
                    SCOPE / ROLE
                  </span>
                </div>

                <p className="text-white/20 text-[13px] tracking-widest mb-3 uppercase">
                  STATUS: {active.status.toUpperCase()}
                </p>

                <div className="space-y-px mt-4">
                  {[
                    { label: "Role", value: active.role },
                    { label: "Scope", value: active.scope },
                    { label: "Category", value: active.category },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center bg-white/4 px-3 py-2"
                    >
                      <span className="text-white/30 text-[13px] tracking-widest uppercase">
                        {row.label}
                      </span>
                      <span className="text-white text-[13px] tracking-widest uppercase font-bold">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/projects/${active.slug}`}
                className="
                  mt-6 block w-full text-center
                  border border-white/20 hover:border-white/60
                  text-white text-[13px] tracking-widest uppercase
                  py-3 px-4
                  transition-all duration-200
                  hover:bg-white hover:text-black
                "
              >
                [ ENTER CASE →  ]
              </Link>
            </div>

          </div>
        )}
      </div>

    </section>
  );
}
