"use client";

import { ProjectsMasksGridSection } from "@/app/home/components/ProjectsMasksGridSection";

const ProjectGrid = () => {
  return (
    <ProjectsMasksGridSection
      onHoverVisor={() => {}}
      selectedProjectId="casa"
      onSelectProject={() => {}}
      projects={[
        {
          id: "casa",
          name: "Casa do Urso",
          client: "Casa do Urso",
          year: "",
          description:
            "A portfolio case study for Casa do Urso, focused on a tactile interface system and branded interaction language.",
          fields: [],
          active: true,
          iconSrc: "/casadourso.svg",
        },
        {
          id: "heinz",
          name: "Heinz Lab",
          client: "Heinz",
          year: "",
          description:
            "Interactive campaign experience with motion-driven transitions and a systems-first layout.",
          fields: [],
          active: true,
          iconSrc: "/Heinz/ithastobeheinz.svg",
        },
        {
          id: "pokerbros",
          name: "PokerBros",
          client: "PokerBros",
          year: "",
          description:
            "Design leadership for a global poker platform. Head of Design: visual identity, product UI, and art direction across app, web, podcasts, and marketing.",
          fields: [],
          active: true,
          iconSrc: "/spades.svg",
        },
      ]}
    />
  );
};

export default ProjectGrid;

"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

type Props = {
  children: React.ReactNode;
};

export function ProjectGridMotion({ children }: Props) {
  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 24,
      }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5% 0px", amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectCardReveal({ children }: Props) {
  return <motion.div variants={item}>{children}</motion.div>;
}
