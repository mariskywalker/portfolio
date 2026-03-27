"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileCase } from "./FileCase";
import { SystemPanel } from "./SystemPanel";
import type { VisorHoverInfo } from "./InfoPanel";

type Field = { k: string; v: string };

type ShowcaseFilters = {
  role: string | null;
  scope: string | null;
  category: string | null;
  deliverables: string | null;
};

type Props = {
  year?: string;
  description: string;
  fields?: Field[];
  filters: ShowcaseFilters;
  onFilterChange: (key: keyof ShowcaseFilters, value: string | null) => void;
  roleOptions: string[];
  scopeOptions: string[];
  categoryOptions: string[];
  deliverablesOptions: string[];
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
};

export function CasaDoUrsoFileCaseSection({
  year = "—",
  description,
  fields = [],
  filters,
  onFilterChange,
  roleOptions,
  scopeOptions,
  categoryOptions,
  deliverablesOptions,
  onHoverVisor,
}: Props) {
  const dragBoundsRef = useRef<HTMLDivElement | null>(null);

  const toUnique = (arr: string[]) => Array.from(new Set(arr));
  const deriveOptionsFromFields = (fieldKey: string) =>
    toUnique(
      fields
        .filter((f) => f.k === fieldKey)
        .map((f) => f.v)
        .filter((v) => v !== "—")
    );

  const menuOptions = {
    role: roleOptions.length ? roleOptions : deriveOptionsFromFields("ROLE"),
    scope: scopeOptions.length ? scopeOptions : deriveOptionsFromFields("SCOPE"),
    category: categoryOptions.length
      ? categoryOptions
      : deriveOptionsFromFields("CATEGORY"),
    deliverables: deliverablesOptions.length
      ? deliverablesOptions
      : deriveOptionsFromFields("DELIVERABLES"),
  } satisfies Record<keyof ShowcaseFilters, string[]>;

  return (
    <section style={{ scrollSnapAlign: "start" }} className="relative h-[50svh] w-full">
      <div
        ref={dragBoundsRef}
        className="absolute inset-0 pt-[28px] pb-[36px]"
      >
        <div className="mx-auto grid h-full max-w-7xl grid-cols-12 gap-0 px-0 md:px-0">
          <div className="col-span-12 h-full md:col-span-12">
            <div className="relative h-full p-2 md:p-3 group">
              <div className="pointer-events-none absolute left-1/2 top-0 z-20 flex w-[min(860px,92vw)] -translate-x-1/2 select-none items-center justify-center">
                <img
                  src="/icones_casadourso.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-auto max-h-[48%] w-full object-contain opacity-24"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <FileCase
                  title="CASA DO URSO"
                  description={description}
                  cornerTag={`YEAR ${year}`}
                  rightSlot={null}
                  reveal={false}
                />
              </div>
            </div>
          </div>
        </div>
        <DraggableTab
          defaultX={48}
          defaultY={80}
          constraintsRef={dragBoundsRef}
        >
          <SystemPanel
            title="DETAILS"
            metaLeft="SCOPE / ROLE / DELIVERABLES"
            metaRight="STATUS: ARCHIVED"
            tone="default"
              className="z-30 w-[min(420px,100%)] overflow-visible shadow-[0_22px_90px_rgba(0,0,0,0.25)]"
            contentClassName="px-4 py-4"
          >
            <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.26em] text-white/45">
              FIELDS
            </div>
            <div className="mt-4 space-y-2">
              <FilterFieldLine
                k="ROLE"
                value={filters.role}
                options={menuOptions.role}
                onSelect={(v) => onFilterChange("role", v)}
                onHoverVisor={onHoverVisor}
              />
              <FilterFieldLine
                k="SCOPE"
                value={filters.scope}
                options={menuOptions.scope}
                onSelect={(v) => onFilterChange("scope", v)}
                onHoverVisor={onHoverVisor}
              />
              <FilterFieldLine
                k="CATEGORY"
                value={filters.category}
                options={menuOptions.category}
                onSelect={(v) => onFilterChange("category", v)}
                onHoverVisor={onHoverVisor}
              />
              <FilterFieldLine
                k="DELIVERABLES"
                value={filters.deliverables}
                options={menuOptions.deliverables}
                onSelect={(v) => onFilterChange("deliverables", v)}
                onHoverVisor={onHoverVisor}
              />
            </div>
          </SystemPanel>
        </DraggableTab>
      </div>
    </section>
  );
}

function FilterFieldLine({
  k,
  value,
  options,
  onSelect,
  onHoverVisor,
}: {
  k: string;
  value: string | null;
  options: string[];
  onSelect: (value: string | null) => void;
  onHoverVisor?: (info: VisorHoverInfo | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const display = value ?? "—";
  const hasOptions = options.length > 0;

  const fieldDescription = (() => {
    const lowerK = k.toLowerCase();
    return lowerK === "role"
      ? `ROLE descreve o papel da sua atuação em Casa do Urso — como você dirige o sistema e a narrativa da interface.`
      : lowerK === "scope"
        ? `SCOPE define o perímetro do que foi construído: da ideia ao comportamento da UI em ritmo controlado.`
        : lowerK === "category"
          ? `CATEGORY posiciona Casa do Urso na sua linguagem: marca e experiência digital como um mesmo sistema.`
          : lowerK === "deliverables"
            ? `DELIVERABLES lista os resultados que viram prática no projeto — o que permanece como produto do sistema.`
            : `Campo ${k} da seção.`;
  })();

  const items = useMemo(() => {
    return [
      { label: "—", value: null as string | null },
      ...options.map((o) => ({ label: o, value: o })),
    ];
  }, [options]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onPointerDown={(e) => {
          // Prevent drag starting while interacting with dropdown.
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerEnter={() => {
          onHoverVisor?.({
            metaLeft: "HOVER / CASA DO URSO",
            metaRight: "STATUS: FIELD",
            kicker: "HOVER FIELD",
            title: `${k.toUpperCase()}: ${display}`,
            description: fieldDescription,
            target: `FIELD: ${k.toUpperCase()}`,
            action: `VALUE: ${display}`,
          });
        }}
        onPointerLeave={() => onHoverVisor?.(null)}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasOptions) return;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 border border-white/10 bg-black/20 px-3 py-2 text-left"
      >
        <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/45">
          {k}
        </div>

        <div className="flex items-center gap-2">
          <div className="truncate text-right font-[var(--font-geist-mono)] text-[13px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {display}
          </div>
          <div className="text-white/35">{hasOptions ? (open ? "▲" : "▼") : null}</div>
        </div>
      </button>

      {open ? (
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute left-0 right-0 z-[60] mt-2 rounded-md border border-white/10 bg-black/80 px-2 py-2 shadow-[0_22px_90px_rgba(0,0,0,0.25)] backdrop-blur"
        >
          {items.map((it) => {
            const selected = (it.value ?? "—") === display;
            return (
              <button
                key={`${k}-${it.label}`}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(it.value);
                  setOpen(false);
                }}
                className={[
                  "w-full rounded px-2 py-2 text-left",
                  selected
                    ? "bg-[color:var(--sys-accent-soft)] text-white"
                    : "text-white/70 hover:bg-white/5",
                ].join(" ")}
              >
                <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.18em]">
                  {it.label}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
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
  constraintsRef: React.RefObject<HTMLElement | null>;
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

