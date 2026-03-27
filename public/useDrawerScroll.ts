import { useRef, useCallback, useEffect, useState } from "react";

export type DrawerSection = "overview" | "problem" | "process" | "outcome";

const SECTIONS: DrawerSection[] = ["overview", "problem", "process", "outcome"];

interface UseDrawerScrollOptions {
  onSectionChange?: (section: DrawerSection) => void;
}

export function useDrawerScroll(options?: UseDrawerScrollOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<DrawerSection, HTMLElement | null>>>({});
  const [activeSection, setActiveSection] = useState<DrawerSection>("overview");
  const isScrollingTo = useRef(false); // prevents observer from fighting manual scroll

  // Called when user clicks a menu item
  const scrollTo = useCallback((id: DrawerSection) => {
    const container = scrollRef.current;
    const target = sectionRefs.current[id];
    if (!container || !target) return;

    isScrollingTo.current = true;
    setActiveSection(id);

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = targetTop - containerTop + container.scrollTop - 16;

    container.scrollTo({ top: offset, behavior: "smooth" });

    // Re-enable observer after animation (~700ms)
    setTimeout(() => {
      isScrollingTo.current = false;
    }, 700);
  }, []);

  // IntersectionObserver: updates active menu item as user scrolls
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return;

        // Pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.section as DrawerSection;
          if (id) {
            setActiveSection(id);
            options?.onSectionChange?.(id);
          }
        }
      },
      {
        root: container,
        // Trigger when section enters the top 60% of the container
        rootMargin: "0px 0px -40% 0px",
        threshold: 0.1,
      }
    );

    // Observe all registered sections
    SECTIONS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [options]);

  // Helper to register a section ref (use as callback ref)
  const registerRef = useCallback(
    (id: DrawerSection) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
      if (el) el.dataset.section = id; // tag element for observer lookup
    },
    []
  );

  return {
    scrollRef,       // attach to the scrollable container
    registerRef,     // attach to each section div
    activeSection,
    scrollTo,
  };
}
