"use client";

import { ProjectCard } from "@/app/components/ProjectCard";
import type { VisorHoverInfo } from "./InfoPanel";
import type { Project as ProjectCardType } from "@/app/components/ProjectCard";

type Project = {
  id: string;
  name: string;
  client: string;
  year: string;
  description: string;
  active: boolean;
};

export function ProjectGridSection({
  projects,
  cardsForGrid,
  onHoverVisor,
  onSelectProject,
}: {
  projects: Project[];
  cardsForGrid: ProjectCardType[];
  onHoverVisor: (info: VisorHoverInfo | null) => void;
  onSelectProject: (id: string) => void;
}) {
  const activeCount = projects.filter((p) => p.active).length;
  const visibleCount = projects.length;

  return (
    <section
      id="project-grid"
      style={{ scrollSnapAlign: "start" }}
      className="relative w-full"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pt-[72px] pb-[72px] md:px-6 lg:px-8">
        <div className="projects-masks-section-header flex-shrink-0">
          <div>
            <div className="projects-masks-section-label">Explore Projects</div>
            <div className="projects-masks-section-title">PROJECT GRID</div>
          </div>
          <div className="projects-masks-section-count">
            {activeCount} / {visibleCount} ACTIVE
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-6 md:grid-cols-4 md:gap-4">
          {cardsForGrid.map((card) => {
            const p = projects.find((x) => x.id === card.id);
            const inactive = !p?.active;
            return (
              <div
                key={card.id}
                className={inactive ? "pointer-events-none opacity-30" : ""}
                onPointerEnter={() => {
                  if (!p?.active) return;
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
              >
                <ProjectCard
                  project={card}
                  onClick={() => p?.active && onSelectProject(card.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
