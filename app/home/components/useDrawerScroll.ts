"use client";

import { useRef, useCallback, useEffect, useState, useMemo } from "react";

export type DrawerSection =
  | "overview"
  | "problem"
  | "process"
  | "outcome"
  | "tato"
  | "deliverables";

const DEFAULT_ORDER: DrawerSection[] = ["overview", "problem", "process", "outcome"];

interface UseDrawerScrollOptions {
  onSectionChange?: (section: DrawerSection) => void;
  /** When set (e.g. Casa do Urso), navigation uses this order instead of the default 4 sections */
  sectionOrder?: DrawerSection[];
}

export function useDrawerScroll(options?: UseDrawerScrollOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<DrawerSection, HTMLElement | null>>>({});
  const sectionOrder = options?.sectionOrder ?? DEFAULT_ORDER;
  const orderKey = useMemo(() => sectionOrder.join(","), [sectionOrder]);

  const [activeSection, setActiveSection] = useState<DrawerSection>(
    () => sectionOrder[0] ?? "overview"
  );
  const prevSectionRef = useRef<DrawerSection>(sectionOrder[0] ?? "overview");
  const activeSectionRef = useRef<DrawerSection>(sectionOrder[0] ?? "overview");
  const isScrollingTo = useRef(false);

  activeSectionRef.current = activeSection;

  useEffect(() => {
    const first = sectionOrder[0] ?? "overview";
    prevSectionRef.current = first;
    activeSectionRef.current = first;
    setActiveSection(first);
  }, [orderKey, sectionOrder]);

  const scrollTo = useCallback(
    (id: DrawerSection) => {
      prevSectionRef.current = activeSectionRef.current;
      setActiveSection(id);
      options?.onSectionChange?.(id);

      const container = scrollRef.current;
      const target = sectionRefs.current[id];
      if (!container || !target) return;

      isScrollingTo.current = true;
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const offset = targetTop - containerTop + container.scrollTop - 16;

      container.scrollTo({ top: offset, behavior: "smooth" });

      setTimeout(() => {
        isScrollingTo.current = false;
      }, 700);
    },
    [options]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.section as DrawerSection;
          if (id) {
            prevSectionRef.current = activeSectionRef.current;
            setActiveSection(id);
            options?.onSectionChange?.(id);
          }
        }
      },
      {
        root: container,
        rootMargin: "0px 0px -40% 0px",
        threshold: 0.1,
      }
    );

    sectionOrder.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [options, orderKey, sectionOrder]);

  const registerRef = useCallback(
    (id: DrawerSection) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
      if (el) el.dataset.section = id;
    },
    []
  );

  const fromIdx = sectionOrder.indexOf(prevSectionRef.current);
  const toIdx = sectionOrder.indexOf(activeSection);
  const slideDirection = toIdx >= fromIdx ? 1 : -1;

  return {
    scrollRef,
    registerRef,
    activeSection,
    scrollTo,
    slideDirection,
    sectionOrder,
  };
}
