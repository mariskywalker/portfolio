"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const lineReveal = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.9,
    },
  },
};

export function HeroAnimated() {
  return (
    <section
      style={{
        padding: "clamp(80px, 15vw, 140px) 24px clamp(60px, 12vw, 100px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ maxWidth: 1000, margin: "0 auto" }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          style={{
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#666666",
            marginBottom: 20,
          }}
        >
          Visual & Brand Designer · London
        </motion.p>

        <motion.h1
          variants={item}
          style={{
            fontSize: "clamp(42px, 8vw, 72px)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: "0 0 24px",
            color: "#111111",
          }}
        >
          Design made visible.
        </motion.h1>

        <motion.p
          variants={item}
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "#555555",
            lineHeight: 1.45,
            margin: "0 0 32px",
            maxWidth: 480,
          }}
        >
          Coherent visual worlds for brands and people, strategy, identity,
          campaigns, digital.
        </motion.p>

        <motion.div variants={item}>
          <a
            href="#projects"
            style={{
              display: "inline-block",
              padding: "14px 0",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#111111",
            }}
          >
            Discover
          </a>
          <motion.div
            variants={lineReveal}
            style={{
              height: 1,
              background: "rgba(0,0,0,0.4)",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
