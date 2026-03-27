"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FileCase } from "./FileCase";
import { SystemPanel } from "./SystemPanel";
import type { VisorHoverInfo } from "./InfoPanel";

type Field = { k: string; v: string };

type Project = {
  id: string;
  title: string;
  year: string;
  description: string;
  iconSrc?: string;
  fields: Field[];
};

function FieldLine({
  k,
  v,
  projectTitle,
  onHoverVisor,
}: {
  k: string;
  v: string;
  projectTitle: string;
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
}) {
  const lowerK = k.toLowerCase();
  const fieldDescription =
    lowerK === "role"
      ? `ROLE indica o papel do projeto (${projectTitle}) dentro do seu sistema criativo, como você operou o design e a narrativa da interface.`
      : lowerK === "scope"
        ? `SCOPE define o perímetro do que foi construído em ${projectTitle}: do conceito ao comportamento real na UI.`
        : lowerK === "category"
          ? `CATEGORY posiciona ${projectTitle} na sua linguagem: linguagem de marca + experiência digital como um mesmo sistema.`
          : lowerK === "deliverables"
            ? `DELIVERABLES lista os resultados de ${projectTitle}: o que “virou produto” e permanece como parte do sistema.`
            : `Campo ${k} do projeto ${projectTitle}.`;

  return (
    <div
      className="flex items-center justify-between gap-4 border border-white/10 bg-black/20 px-3 py-2"
      onPointerEnter={() => {
        onHoverVisor?.({
          metaLeft: `HOVER / ${projectTitle.toUpperCase()}`,
          metaRight: "STATUS: FIELD",
          kicker: "HOVER FIELD",
          title: `${k.toUpperCase()}: ${v}`,
          description: fieldDescription,
          target: `FIELD: ${k.toUpperCase()}`,
          action: `VALUE: ${v}`,
        });
      }}
      onPointerLeave={() => onHoverVisor?.(null)}
    >
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
        {k}
      </div>
      <div className="truncate text-right font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.18em] text-white/70">
        {v}
      </div>
    </div>
  );
}

function DraggableTab({
  children,
  constraintsRef,
  defaultX,
  defaultY,
}: {
  children: React.ReactNode;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  defaultX: number;
  defaultY: number;
}) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.06}
      dragMomentum={false}
      initial={false}
      className="absolute left-0 top-0 touch-none"
      style={{ x: defaultX, y: defaultY, cursor: "grab" }}
      whileTap={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
}

export function SelectedProjectFileCaseSection({
  project,
  onHoverVisor,
}: {
  project: Project;
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
}) {
  const dragBoundsRef = useRef<HTMLDivElement | null>(null);

  const fields = useMemo(() => project.fields, [project.fields]);

  return (
    <section style={{ scrollSnapAlign: "start" }} className="relative h-[100svh] w-full">
      <div ref={dragBoundsRef} className="absolute inset-0 pt-[56px] pb-[72px]">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-12 gap-0 px-0 md:px-0">
          <div className="col-span-12 h-full md:col-span-12">
            <div className="relative h-full p-2 md:p-3 group">
              {project.iconSrc ? (
                <div className="pointer-events-none absolute left-1/2 top-0 z-20 flex w-[min(860px,92vw)] -translate-x-1/2 select-none items-center justify-center">
                  <img
                    src={project.iconSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-auto max-h-[62vh] w-full object-contain opacity-24"
                  />
                </div>
              ) : null}

              <div
                className="absolute bottom-0 left-0 right-0 z-10"
                onPointerEnter={() => {
                  onHoverVisor?.({
                    metaLeft: `HOVER / ${project.title.toUpperCase()}`,
                    metaRight: "STATUS: OVERVIEW",
                    kicker: "PROJECT VISOR",
                    title: `${project.title.toUpperCase()} / OVERVIEW`,
                    description: project.description,
                    target: "MODULE: PROJECT CASE",
                    action: "HOVER OVERVIEW",
                  });
                }}
                onPointerLeave={() => onHoverVisor?.(null)}
              >
                <FileCase
                  title={project.title}
                  description={project.description}
                  cornerTag={`YEAR ${project.year}`}
                  rightSlot={null}
                />
              </div>
            </div>
          </div>
        </div>

        <DraggableTab defaultX={48} defaultY={210} constraintsRef={dragBoundsRef}>
          <SystemPanel
            title="DETAILS"
            metaLeft="SCOPE / ROLE / DELIVERABLES"
            metaRight="STATUS: SELECTED"
            tone="default"
            className="w-[min(420px,100%)] overflow-visible shadow-[0_22px_90px_rgba(0,0,0,0.25)]"
            contentClassName="px-4 py-4"
          >
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.26em] text-white/45">
              FIELDS
            </div>
            <div className="mt-4 space-y-2">
              {fields.map((f) => (
                <FieldLine
                  key={`${f.k}-${f.v}`}
                  k={f.k}
                  v={f.v}
                  projectTitle={project.title}
                  onHoverVisor={onHoverVisor}
                />
              ))}
            </div>
          </SystemPanel>
        </DraggableTab>
      </div>
    </section>
  );
}

