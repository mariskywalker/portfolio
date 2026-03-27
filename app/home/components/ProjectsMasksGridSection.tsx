"use client";

import { useMemo, type ReactNode } from "react";
import type { VisorHoverInfo } from "./InfoPanel";

type Field = { k: string; v: string };

type Project = {
  id: string;
  name: string;
  client: string;
  year: string;
  description: string;
  fields: Field[];
  active: boolean;
  iconSrc?: string;
};

function PlaceholderGlyph({ seed }: { seed: number }) {
  const rot = (seed % 11) * 4;
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <circle cx="50" cy="38" r="22" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <ellipse cx="50" cy="70" rx="18" ry="12" stroke="white" strokeWidth="1.5" opacity="0.75" />
      <line x1="38" y1="34" x2="44" y2="38" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="62" y1="34" x2="56" y2="38" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <path d="M42 46 Q50 52 58 46" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85" />
    </svg>
  );
}

export function ProjectsMasksGridSection({
  projects,
  onHoverVisor,
  selectedProjectId,
  onSelectProject,
  selectedProjectCard,
}: {
  projects: Project[];
  onHoverVisor: (info: VisorHoverInfo | null) => void;
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  selectedProjectCard?: ReactNode;
}) {
  const activeCount = useMemo(() => projects.filter((p) => p.active).length, [projects]);
  const visibleCount = projects.length;

  return (
    <section style={{ scrollSnapAlign: "start" }} className="relative w-full">
      {/* Backdrop is already handled by global layers */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pt-[72px] pb-[24px]">
        <div className="projects-masks-section-header flex-shrink-0">
          <div>
            <div className="projects-masks-section-label">Explore Projects</div>
            <div className="projects-masks-section-title">PROJECT GRID</div>
          </div>
          <div className="projects-masks-section-count">
            {activeCount} / {visibleCount} ACTIVE
          </div>
        </div>

        <div className="flex w-full items-start overflow-visible">
          <div className="projects-masks-grid w-full">
            {projects.map((p, i) => {
              const inactive = !p.active;
              return (
                <div
                  key={p.id}
                  className="projects-mask-card"
                  style={{
                    opacity: inactive ? 0.22 : 1,
                    pointerEvents: inactive ? "none" : "auto",
                    border:
                      !inactive && p.id === selectedProjectId
                        ? "1px solid rgba(255,90,31,0.85)"
                        : "1px solid rgba(255,255,255,0.0)",
                  }}
                  onPointerEnter={() => {
                    if (!p.active) return;
                    onHoverVisor({
                      metaLeft: `HOVER / ${p.client.toUpperCase()}`,
                      metaRight: `YEAR: ${p.year}`,
                      kicker: "PROJECT VISOR",
                      title: `${p.name.toUpperCase()} / OVERVIEW`,
                      description: p.description,
                      target: "MODULE: PROJECT GRID",
                      action: "HOVER PREVIEW",
                    });
                  }}
                  onPointerLeave={() => onHoverVisor(null)}
                  onClick={() => {
                    if (!p.active) return;
                    onSelectProject(p.id);
                  }}
                >
                  <div className="projects-mask-placeholder">
                  {p.iconSrc ? (
                    <img
                      src={p.iconSrc}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className="projects-mask-icon"
                    />
                  ) : (
                    <PlaceholderGlyph seed={i} />
                  )}
                  </div>

                  <div className="projects-mask-info">
                    {String(i + 1).padStart(2, "0")} / {visibleCount}
                  </div>

                  <div className="projects-mask-overlay">
                    <div className="projects-mask-name-en">{p.name.toUpperCase()}</div>
                    <div className="projects-mask-name-jp">{p.client}</div>
                  </div>

                  <div className="projects-mask-bottom">
                    <div className="projects-mask-bottom-name">{p.name.toUpperCase()}</div>
                    <span className="projects-mask-bottom-hint" aria-hidden>
                      HOVER
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

