"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SystemPanel } from "./SystemPanel";
import type { VisorHoverInfo } from "./InfoPanel";

type Field = { k: string; v: string };

type Props = {
  name: string;
  client: string;
  year?: string;
  description: string;
  fields?: Field[];
  leftSlot?: ReactNode;
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
  compact?: boolean;
};

export function ProjectCaseSection({
  name,
  client,
  year = "",
  description,
  fields = [],
  leftSlot,
  onHoverVisor,
  compact = false,
}: Props) {
  const leftFields: Field[] = [
    { k: "CLIENT", v: client },
    { k: "YEAR", v: year },
  ];

  const rightFields = fields;
  const sectionClass = compact ? "relative h-[50svh] w-full" : "relative h-[100svh] w-full";
  const padClass = compact ? "pt-[28px] pb-[36px]" : "pt-[56px] pb-[72px]";

  return (
    <section style={{ scrollSnapAlign: "start" }} className={sectionClass}>
      <div className={`absolute inset-0 ${padClass}`}>
        <div className="mx-auto grid h-full max-w-7xl grid-cols-12 gap-0 px-0 md:px-0">
          <div className="col-span-12 h-full md:col-span-4">
            <div className="h-full p-2 md:p-3">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.35, once: true }}
                transition={{ duration: 0.18, ease: "linear" }}
                className="h-full"
              >
                {leftSlot ? leftSlot : null}
              </motion.div>
            </div>
          </div>

          <section className="relative col-span-12 h-full md:col-span-4">
            <div className="absolute inset-0 p-2 md:p-3">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.35, once: true }}
                transition={{ duration: 0.18, ease: "linear" }}
                className="h-full"
                onPointerEnter={() => {
                  onHoverVisor?.({
                    metaLeft: `HOVER / ${name.toUpperCase()}`,
                    metaRight: "STATUS: OVERVIEW",
                    kicker: "PROJECT VISOR",
                    title: `${name.toUpperCase()} / OVERVIEW`,
                    description,
                    target: "MODULE: PROJECT CASE",
                    action: "HOVER PREVIEW",
                  });
                }}
                onPointerLeave={() => onHoverVisor?.(null)}
              >
                <SystemPanel
                  title="PROJECT CASE"
                  metaLeft={`${name.toUpperCase()} / CLIENT: ${client.toUpperCase()}`}
                  metaRight={`YEAR: ${year}`}
                  tone="default"
                  className="h-full shadow-[0_28px_120px_rgba(0,0,0,0.78)]"
                >
                  <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
                    OVERVIEW
                  </div>
                  <div className="mt-2 font-heading text-[26px] font-black uppercase tracking-[0.12em] text-white md:text-[30px]">
                    {name}
                  </div>

                  <div className="mt-5 h-px w-full bg-white/10" />

                  <p className="mt-5 font-[var(--font-geist-mono)] text-[13px] leading-relaxed tracking-[0.06em] text-white/55">
                    {description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {leftFields.map((f) => (
                      <FieldChip key={f.k} k={f.k} v={f.v} />
                    ))}
                  </div>
                </SystemPanel>
              </motion.div>
            </div>
          </section>

          <div className="col-span-12 h-full md:col-span-4">
            <div className="h-full p-2 md:p-3">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.35, once: true }}
                transition={{ duration: 0.18, ease: "linear", delay: 0.02 }}
                className="h-full"
              >
                <SystemPanel
                  title="DETAILS"
                  metaLeft="SCOPE / ROLE / DELIVERABLES"
                  metaRight="STATUS: ARCHIVED"
                  tone="default"
                  className="h-full shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
                  contentClassName="px-4 py-4"
                >
                  <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.26em] text-white/45">
                    FIELDS
                  </div>
                  <div className="mt-4 space-y-2">
                    {rightFields.length ? (
                      rightFields.map((f) => (
                        <FieldLine
                          key={f.k}
                          projectName={name}
                          onHoverVisor={onHoverVisor}
                          k={f.k}
                          v={f.v}
                        />
                      ))
                    ) : (
                      <>
                        <FieldLine
                          projectName={name}
                          onHoverVisor={onHoverVisor}
                          k="ROLE"
                          v=""
                        />
                        <FieldLine
                          projectName={name}
                          onHoverVisor={onHoverVisor}
                          k="SCOPE"
                          v=""
                        />
                        <FieldLine
                          projectName={name}
                          onHoverVisor={onHoverVisor}
                          k="CATEGORY"
                          v=""
                        />
                        <FieldLine
                          projectName={name}
                          onHoverVisor={onHoverVisor}
                          k="DELIVERABLES"
                          v=""
                        />
                      </>
                    )}
                  </div>
                </SystemPanel>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldChip({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-3">
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
        {k}
      </div>
      <div className="mt-2 truncate font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.22em] text-white/75">
        {v}
      </div>
    </div>
  );
}

function FieldLine({
  projectName,
  onHoverVisor,
  k,
  v,
}: {
  projectName: string;
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
  k: string;
  v: string;
}) {
  const lowerK = k.toLowerCase();
  const fieldDescription =
    lowerK === "role"
      ? `O ROLE define o papel que você assumiu em ${projectName}.`
      : lowerK === "scope"
        ? `SCOPE descreve o perímetro do que foi construído em ${projectName}.`
        : lowerK === "category"
          ? `CATEGORY mostra como ${projectName} se posiciona na sua linguagem de design.`
          : lowerK === "deliverables"
            ? `DELIVERABLES lista os resultados que viraram “sistema” em ${projectName}.`
            : `Campo ${k} do projeto ${projectName}.`;

  return (
    <div
      className="flex items-center justify-between gap-4 border border-white/10 bg-black/20 px-3 py-2 transition-colors hover:border-white/20"
      onPointerEnter={() => {
        onHoverVisor?.({
          metaLeft: `HOVER / ${projectName.toUpperCase()}`,
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

