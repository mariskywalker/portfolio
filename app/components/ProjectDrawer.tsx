"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProjectsMasksGridSection } from "@/app/home/components/ProjectsMasksGridSection";

type GridField = { k: string; v: string };

interface SubItem {
  id: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  image: string;
  href?: string;
}

interface Project {
  id: string;
  index: string;
  title: string;
  description: string;
  color: string;
  items: SubItem[];
}

type GridProject = {
  id: string;
  name: string;
  client: string;
  year: string;
  description: string;
  fields: GridField[];
  active: boolean;
  iconSrc?: string;
};

const PROJECTS: Project[] = [
  {
    id: "heinz",
    index: "01.",
    title: "Heinz Lab",
    description:
      "Campaign-driven interactive work with strong art direction, modular storytelling, and high-contrast visual rhythm.",
    color: "#cc0000",
    items: [
      {
        id: "heinz-01",
        title: "Campaign Narrative System",
        description:
          "Editorial campaign direction translated into interactive layouts, pacing rules, and bold narrative transitions.",
        year: "2024",
        tags: ["CAMPAIGN", "ART DIRECTION"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "heinz-02",
        title: "Motion-Driven Product Stories",
        description:
          "Scroll storytelling and module choreography for digital launch moments, balancing speed and clarity.",
        year: "2024",
        tags: ["MOTION", "DIGITAL"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "heinz-03",
        title: "Asset Framework",
        description:
          "Reusable scene components and composition rules to keep campaign outputs consistent across channels.",
        year: "2023",
        tags: ["SYSTEM", "CONTENT"],
        image: "/projects/placeholder.jpg",
      },
    ],
  },
  {
    id: "casa",
    index: "02.",
    title: "Casa do Urso",
    description:
      "Brand identity and tactile UI system translating handcrafted warmth into a controlled digital interface language.",
    color: "#cc0000",
    items: [
      {
        id: "casa-01",
        title: "Identity Core",
        description:
          "Logo system, visual signatures, and tone direction built to preserve emotional texture across touchpoints.",
        year: "2024",
        tags: ["BRANDING", "IDENTITY"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "casa-02",
        title: "Tactile Interface System",
        description:
          "Panel behaviors and spacing logic designed to feel physical while staying modular and performant.",
        year: "2024",
        tags: ["UI SYSTEM", "INTERACTION"],
        image: "/projects/placeholder.jpg",
      },
    ],
  },
  {
    id: "pokerbros",
    index: "03.",
    title: "PokerBros",
    description:
      "Design leadership for a global poker platform. Led visual identity, product interface, and art direction across app, web, podcasts, and marketing.",
    color: "#FED201",
    items: [
      {
        id: "poker-01",
        title: "Brand Identity",
        description:
          "Unified visual system across touchpoints. Brand creation, guidelines, cross-platform consistency.",
        year: "2023–24",
        tags: ["BRAND", "IDENTITY"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "poker-02",
        title: "Product & App",
        description:
          "Product interface and UI system. Clarity under density, recognizability, scalability.",
        year: "2024",
        tags: ["PRODUCT", "UI"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "poker-03",
        title: "Web, Content & Media",
        description:
          "Art direction across web, podcasts, and marketing. One cohesive visual ecosystem.",
        year: "2023–24",
        tags: ["MEDIA", "CONTENT"],
        image: "/projects/placeholder.jpg",
      },
    ],
  },
  {
    id: "projeto-04",
    index: "04.",
    title: "Projeto 04",
    description:
      "TBD case study under development. Structure reserved for upcoming visual system and product narrative.",
    color: "#cc0000",
    items: [
      {
        id: "p4-01",
        title: "Direction Pending",
        description:
          "Initial exploration phase documenting references, context, and platform constraints.",
        year: "2025",
        tags: ["TBD", "RESEARCH"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "p4-02",
        title: "System Draft",
        description:
          "Draft chapter reserved for component architecture and visual rules.",
        year: "2025",
        tags: ["TBD", "SYSTEM"],
        image: "/projects/placeholder.jpg",
      },
    ],
  },
  {
    id: "projeto-05",
    index: "05.",
    title: "Projeto 05",
    description:
      "TBD case study in progress with an emphasis on experimental direction and narrative interaction.",
    color: "#cc0000",
    items: [
      {
        id: "p5-01",
        title: "Concept Setup",
        description:
          "Early concept module outlining goals, constraints, and hypothesis.",
        year: "2025",
        tags: ["TBD", "CONCEPT"],
        image: "/projects/placeholder.jpg",
      },
      {
        id: "p5-02",
        title: "Experience Outline",
        description:
          "Narrative experience draft with initial interaction map and flow proposals.",
        year: "2025",
        tags: ["TBD", "EXPERIENCE"],
        image: "/projects/placeholder.jpg",
      },
    ],
  },
];

export default function ProjectDrawer() {
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(PROJECTS[0].items[0].id);

  const selectedProject = useMemo<Project>(
    () => PROJECTS.find((p) => p.id === selectedProjectId) ?? PROJECTS[0],
    [selectedProjectId]
  );

  const selectedItem = useMemo<SubItem>(() => {
    return selectedProject.items.find((item) => item.id === selectedItemId) ?? selectedProject.items[0];
  }, [selectedProject, selectedItemId]);

  const gridProjects = useMemo<GridProject[]>(
    () => [
      {
        id: "casa",
        name: "Casa do Urso",
        client: "Casa do Urso",
        year: "",
        description: "Brand identity and tactile UI system.",
        fields: [{ k: "TYPE", v: "BRANDING" }],
        active: true,
        iconSrc: "/casadourso.svg",
      },
      {
        id: "heinz",
        name: "Heinz Lab",
        client: "Heinz",
        year: "",
        description: "Campaign-driven interactive work.",
        fields: [{ k: "TYPE", v: "CAMPAIGN" }],
        active: true,
        iconSrc: "/Heinz/ithastobeheinz.svg",
      },
      {
        id: "pokerbros",
        name: "PokerBros",
        client: "PokerBros",
        year: "",
        description: "Design leadership for a global poker platform. Head of Design: brand, product, and media.",
        fields: [{ k: "TYPE", v: "BRAND / PRODUCT / LEADERSHIP" }],
        active: true,
        iconSrc: "/spades.svg",
      },
      {
        id: "projeto-04",
        name: "Projeto 04",
        client: "TBD",
        year: "",
        description: "Upcoming case study.",
        fields: [{ k: "TYPE", v: "TBD" }],
        active: true,
      },
      {
        id: "projeto-05",
        name: "Projeto 05",
        client: "TBD",
        year: "",
        description: "Upcoming case study.",
        fields: [{ k: "TYPE", v: "TBD" }],
        active: true,
      },
    ],
    []
  );

  const handleProjectSelect = (id: string) => {
    const nextProject = PROJECTS.find((project) => project.id === id);
    if (!nextProject) return;
    setSelectedProjectId(nextProject.id);
    setSelectedItemId(nextProject.items[0].id);
    setDrawerOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <ProjectsMasksGridSection
        projects={gridProjects}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleProjectSelect}
        onHoverVisor={() => {}}
      />

      <section className="relative z-30 mx-auto w-full max-w-7xl px-4 pb-8">
        <AnimatePresence mode="wait">
          {drawerOpen ? (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border border-white/20"
              style={{ backgroundColor: selectedProject.color || "#cc0000" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[380px_1fr]">
                <motion.aside
                  initial={{ x: -26, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -26, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-white/20 md:border-b-0 md:border-r md:border-white/20"
                >
                  <div className="px-6 pt-5">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[13px] tracking-widest text-white/95">
                        {selectedProject.index}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                        className="border border-white/30 px-2 py-0.5 font-mono text-[13px] leading-none text-white transition-colors hover:bg-white/10"
                        aria-label="Close drawer"
                      >
                        ×
                      </button>
                    </div>

                    <h2 className="mt-4 font-sans text-[38px] leading-[0.95] tracking-tight text-white">
                      {selectedProject.title}
                    </h2>

                    <div className="mt-4 border-t border-white/30" />

                    <p className="mt-4 pb-5 font-mono text-[13px] uppercase leading-[1.3] tracking-[0.14em] text-white/95">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="border-t border-white/20">
                    {selectedProject.items.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItemId(item.id)}
                        className="flex w-full items-center justify-between border-b border-white/20 px-6 py-4 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="font-sans text-[15px] text-white">{item.title}</span>
                        <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.aside>

                <div className="bg-[#0d0d0d]">
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={selectedItem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative h-full"
                    >
                      {selectedItem.href ? (
                        <a
                          href={selectedItem.href}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute right-4 top-4 z-10 border border-white/20 px-3 py-1 font-mono text-[13px] tracking-widest text-white transition-colors hover:border-white"
                        >
                          READ MORE HERE
                        </a>
                      ) : (
                        <span className="absolute right-4 top-4 z-10 border border-white/20 px-3 py-1 font-mono text-[13px] tracking-widest text-white/90">
                          READ MORE HERE
                        </span>
                      )}

                      <div className="relative w-full overflow-hidden rounded-sm">
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.title}
                          className="h-auto w-full object-contain"
                        />
                      </div>

                      <div className="px-6 py-5">
                        <h3 className="font-sans text-[28px] leading-tight text-white">
                          {selectedItem.title}
                        </h3>
                        <p className="mt-3 max-w-3xl font-mono text-[13px] uppercase leading-[1.35] tracking-[0.14em] text-white/85">
                          {selectedItem.description}
                        </p>
                        <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.14em] text-white/72">
                          {selectedItem.year} | {selectedItem.tags.join(", ")}
                        </p>
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}

