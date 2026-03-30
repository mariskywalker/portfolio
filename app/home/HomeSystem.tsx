"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HOME_MODES, type HomeMode, type HomeModeId } from "./modes";
import { TopBar } from "./components/TopBar";
import { CommandBar } from "./components/CommandBar";
import { Spline3DLabSlider } from "./components/Spline3DLabSlider";
import { SelectionGrid } from "./components/SelectionGrid";
import { InfoPanel } from "./components/InfoPanel";
import type { VisorHoverInfo } from "./components/InfoPanel";
import { PlayerPanel } from "./components/PlayerPanel";
import { SystemOverlay } from "./components/SystemOverlay";
import { IntroSection } from "./components/IntroSection";
import { ProjectCard } from "@/app/components/ProjectCard";
import { useDrawerScroll, type DrawerSection } from "./components/useDrawerScroll";
import { DrawerCasaHeader } from "./components/DrawerCasaHeader";
import { HeinzEmbed } from "./components/HeinzEmbed";
import { PokerBrosEmbed } from "./components/PokerBrosEmbed";
import { ComicsEmbed } from "./components/ComicsEmbed";
import { PetzEmbed } from "./components/PetzEmbed";
import { TridentEmbed } from "./components/TridentEmbed";
import { ClinicImageSlider } from "./components/ClinicImageSlider";
import { MediaSlider } from "./components/MediaSlider";
import { ProjectGridSection } from "./components/ProjectGridSection";
import { LactaEmbed } from "./components/LactaEmbed";
import { CasaUrsoEmbed } from "./components/CasaUrsoEmbed";
import { AboutWhiteboardSection } from "./components/AboutWhiteboardSection";

/** Casa do Urso drawer, matches `public/BRIEF-casa-do-urso.md` section flow */
const CASA_DRAWER_ORDER: DrawerSection[] = [
  "overview",
  "problem",
  "tato",
  "process",
  "outcome",
  "deliverables",
];

const CASA_DRAWER_ENTRIES: { id: DrawerSection; label: string; n: number }[] = [
  { id: "overview", label: "Overview", n: 1 },
  { id: "problem", label: "Challenge", n: 2 },
  { id: "tato", label: "Tato", n: 3 },
  { id: "process", label: "Process", n: 4 },
  { id: "outcome", label: "Outcome", n: 5 },
  { id: "deliverables", label: "Deliverables", n: 6 },
];

const CASA_DELIVERABLES: { title: string; desc: string }[] = [
  { title: "Naming", desc: "Brand naming and verbal identity aligned with care and neurodevelopment." },
  { title: "Visual Identity", desc: "Colour system, grafismos, and modular composition across touchpoints." },
  { title: "Tato", desc: "Mascot and emotional anchor, character, application, and recognition." },
  { title: "Environmental Design", desc: "Clinic walls, spatial rhythm, and sensory balance (Snoezelen-informed)." },
  { title: "Inclusive Signage", desc: "Wayfinding and communication that supports diverse ages and needs." },
  { title: "Emocionário", desc: "Tools for naming and navigating emotions within the therapeutic journey." },
];

function SensoryIconSparkles({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      dx: number;
      dy: number;
      rot: number;
      color: string;
      opacity: number;
    }>
  >([]);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rectRef = useRef<DOMRect | null>(null);

  const spawn = (x: number, y: number) => {
    const now = performance.now();
    if (now - lastSpawnRef.current < 75) return;
    lastSpawnRef.current = now;

    const baseId = nextIdRef.current;
    nextIdRef.current += 1;

    const palette = [
      "#F5BF42", // amarelo
      "#F9746E", // rosa
      "#4497C3", // azul
      "#CD995B", // dourado/caramelo
      "#FCB346", // variação do amarelo
    ];

    // Dust-like neon particles (tuned for performance)
    const created = Array.from({ length: 6 }).map((_, i) => {
      const size = 1.2 + Math.random() * 2.2;
      const dx = (Math.random() - 0.5) * 12;
      const dy = 2 + Math.random() * 9;
      const rot = Math.random() * 360;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const opacity = 0.35 + Math.random() * 0.65;
      return {
        id: baseId + i,
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 22,
        size,
        dx,
        dy,
        rot,
        color,
        opacity,
      };
    });

    const createdIds = new Set(created.map((s) => s.id));
    setSparkles((prev) => [...prev, ...created].slice(-35));

    // Auto-expire: single timeout per batch (avoids many timers)
    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((p) => !createdIds.has(p.id)));
    }, 650);
  };

  return (
    <div
      className="relative inline-flex sensory-icon-sparkles"
      data-hovered={hovered ? "true" : "false"}
      onMouseEnter={(e) => {
        // Start fresh when re-entering
        setSparkles([]);
        setHovered(true);
        rectRef.current = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      }}
      onMouseLeave={() => {
        setHovered(false);
        rectRef.current = null;
      }}
      onMouseMove={(e) => {
        if (!hovered) return;
        const rect = rectRef.current ?? e.currentTarget.getBoundingClientRect();
        rectRef.current = rect;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spawn(x, y);
      }}
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : "true"}
        draggable={false}
        className={className ?? "h-[120px] w-auto opacity-90"}
      />

      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="sensory-sparkle"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              ["--dx" as any]: `${s.dx}px`,
              ["--dy" as any]: `${s.dy}px`,
              ["--rot" as any]: `${s.rot}deg`,
              ["--c" as any]: s.color,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SensoryDustTileSparkles({
  spriteUrl,
  bgPosition,
  palette,
  ariaLabel,
  size = 86,
}: {
  spriteUrl: string;
  bgPosition: "left top" | "right top" | "left bottom" | "right bottom";
  palette: string[];
  ariaLabel: string;
  size?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      dx: number;
      dy: number;
      rot: number;
      color: string;
      opacity: number;
    }>
  >([]);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawn = (x: number, y: number) => {
    const now = performance.now();
    if (now - lastSpawnRef.current < 40) return;
    lastSpawnRef.current = now;

    const baseId = nextIdRef.current;
    nextIdRef.current += 1;

    const created = Array.from({ length: 12 }).map((_, i) => {
      const size = 1.2 + Math.random() * 2.6;
      const dx = (Math.random() - 0.5) * 14;
      const dy = 3 + Math.random() * 12;
      const rot = Math.random() * 360;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const opacity = 0.25 + Math.random() * 0.7;
      return {
        id: baseId + i,
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        size,
        dx,
        dy,
        rot,
        color,
        opacity,
      };
    });

    setSparkles((prev) => [...prev, ...created].slice(-70));

    created.forEach((s) => {
      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((p) => p.id !== s.id));
      }, 700);
    });
  };

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative inline-flex sensory-icon-sparkles cursor-none select-none"
      data-hovered={hovered ? "true" : "false"}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${spriteUrl})`,
        backgroundSize: "200% 200%",
        backgroundPosition: bgPosition,
        backgroundRepeat: "no-repeat",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.02)",
      }}
      onMouseEnter={() => {
        setSparkles([]);
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onMouseMove={(e) => {
        if (!hovered) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spawn(x, y);
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="sensory-sparkle"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              ["--dx" as any]: `${s.dx}px`,
              ["--dy" as any]: `${s.dy}px`,
              ["--rot" as any]: `${s.rot}deg`,
              ["--c" as any]: s.color,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeSystem() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredId, setHoveredId] = useState<HomeModeId | null>(null);
  const [selectedId, setSelectedId] = useState<HomeModeId>("work");
  const [isMobile, setIsMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);
  const [playgroundInView, setPlaygroundInView] = useState(false);
  const [projectGridInView, setProjectGridInView] = useState(false);
  const [introScroll, setIntroScroll] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const transitionLockRef = useRef(false);
  const [splineHovered, setSplineHovered] = useState(false);
  const [splinePointerCoords, setSplinePointerCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeSplineSceneId, setActiveSplineSceneId] = useState<string>("void");

  const [visorInfo, setVisorInfo] = useState<VisorHoverInfo | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("casa");
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [heinzScrollTarget, setHeinzScrollTarget] = useState<
    "heinz-hero" | "heinz-dip" | "heinz-breakdown" | null
  >(null);
  const [pokerbrosScrollTarget, setPokerbrosScrollTarget] = useState<
    "overview" | "problem" | "process" | "outcome" | null
  >(null);
  const [pokerbrosActiveSection, setPokerbrosActiveSection] = useState<
    "overview" | "problem" | "process" | "outcome"
  >("overview");
  const [comicsScrollTarget, setComicsScrollTarget] = useState<
    "overview" | "problem" | "process" | "outcome" | null
  >(null);
  const [comicsActiveSection, setComicsActiveSection] = useState<
    "overview" | "problem" | "process" | "outcome"
  >("overview");
  const [petzScrollTarget, setPetzScrollTarget] = useState<
    "overview" | "problem" | "process" | "outcome" | null
  >(null);
  const [petzActiveSection, setPetzActiveSection] = useState<
    "overview" | "problem" | "process" | "outcome"
  >("overview");
  const drawerScrollOptions = useMemo(
    () =>
      selectedProjectId === "casa" ? { sectionOrder: CASA_DRAWER_ORDER } : undefined,
    [selectedProjectId]
  );
  const { activeSection, scrollTo, slideDirection } = useDrawerScroll(drawerScrollOptions);

  const [casaScrollTarget, setCasaScrollTarget] = useState<DrawerSection | null>(null);

  useEffect(() => {
    if (selectedProjectId !== "casa") return;
    const next = activeSection;
    if (next && next !== casaScrollTarget) setCasaScrollTarget(next);
  }, [activeSection, casaScrollTarget, selectedProjectId]);

  const [lactaScrollTarget, setLactaScrollTarget] = useState<
    "campaign" | "character" | "illus" | "ooh" | null
  >(null);

  useEffect(() => {
    if (selectedProjectId !== "lacta") return;
    const map: Record<DrawerSection, "campaign" | "character" | "illus" | "ooh"> = {
      overview: "campaign",
      problem: "character",
      // The 'illus' chapter was removed from the Lacta case HTML.
      // Use 'character' as a fallback so the drawer still scrolls to valid content.
      process: "character",
      outcome: "ooh",
      // Unused for Lacta because it uses the default 4-section order
      tato: "campaign",
      deliverables: "ooh",
    };
    const next = map[activeSection];
    if (next && next !== lactaScrollTarget) setLactaScrollTarget(next);
  }, [activeSection, lactaScrollTarget, selectedProjectId]);

  const casaDoUrsoContent = {
    overview: `Casa do Urso was designed as more than a brand, it is a sensory-driven system that translates neurodevelopment principles into a cohesive visual and spatial language.

The project integrates branding, environment, and interface design to create a safe, structured, and emotionally supportive experience for neurodivergent children and their families.

Inspired by therapeutic approaches such as Snoezelen, the system balances stimulation and calm through controlled color, rhythm, and modular composition.`,

    problem: `Most therapy spaces and brands in this context either lack identity or overwhelm users with visual noise.

The challenge was to design a system that could:
- support emotional regulation
- communicate clearly across different age groups
- create a sense of safety and familiarity
- bridge clinical structure with warmth and accessibility

All while maintaining consistency across physical and digital touchpoints.

A key layer of the project was the creation of Tato, the bear, not just as a mascot, but as an emotional anchor within the system.

In contrast to other clinics, where environments often feel impersonal or overstimulating, Tato was designed as a comfort object:
- a familiar presence across spaces
- a guide for interaction and communication
- a symbolic extension of safety and care

He exists between character and tool
helping children navigate emotions, transitions, and routines through recognition and attachment.

Tato transforms the brand from something seen into something felt and trusted.`,

    process: `The design process was built around translating psychological and sensory principles into tangible design decisions.

Color System  
Inspired by neurodiversity and emotional signaling, the palette balances softness and contrast, allowing controlled stimulation without overload.

Spatial Thinking  
Environments were designed as extensions of the brand, structured, modular, and predictable, reinforcing a sense of safety and orientation.

Interaction Language  
Interfaces follow a tactile logic, using clear hierarchy, spacing, and rhythm to reduce cognitive friction.

Sensory Design  
References from Snoezelen environments informed the balance between activation and calm, guiding lighting, composition, and visual density.

System Thinking  
Rather than isolated assets, the project was built as a flexible system that adapts across physical spaces, communication materials, and digital interfaces.`,

    outcome: `The result is a cohesive and scalable system that aligns brand, space, and interaction into a unified experience.

Casa do Urso becomes not just a clinic, but a recognizable and comforting environment, where design actively supports development, communication, and emotional well-being.

The project establishes a foundation for future expansion, maintaining consistency while allowing flexibility across new applications.`,
  };

  const heinzContent = {
    overview: `Heinz Dip to Win was an interactive campaign experience built around motion-driven transitions and a systems-first layout.

The project reframed Heinz dipping culture as a playful campaign world, anchored in a distinctive mark built to feel tactile, social, and instantly recognizable across formats.`,

    problem: `The challenge was to create a campaign that could stand out in a crowded OOH and social landscape while staying true to Heinz's bold, iconic identity.

The central thought was simple and memorable: a Heinz logo sculpted in ketchup and treated as an interactive symbol, inviting people to choose their dipper identity.`,

    process: `The design process combined bold Heinz red, high-contrast typography, close crop product moments, and modular campaign headlines.

A 3D bottle was built in Spline to serve as the hero asset for the interactive experience, tactile, shareable, and instantly recognizable.`,

    outcome: `The result is a cohesive campaign that feels cinematic while staying readable, modular, and performance-aware across OOH, social, and promo layouts.`,
  };

  const pokerbrosContent = {
    overview: `PokerBros reaches millions of players across dozens of markets. As Head of Design, I owned the visual identity: brand system, product UI, web, podcasts, and marketing. I defined the rules and standards, and ensured coherence across every channel.`,
    problem: `The platform spans app, web, content, and physical environments. Each channel had different needs, but the brand had to read as one. The challenge: maintain a strong identity, balance usability with personality, and scale without fragmenting.`,
    process: `Principles focused on recognition first, clarity under density, and boldness without aggression. Execution: brand system, product UI, content art direction, and formal guidelines. The system became the connective layer across teams and channels.`,
    outcome: `One visual language across multiple platforms. Stronger recognition. A documented system that scales. Brand and product aligned under one coherent visual ecosystem.`,
  };

  const HEINZ_PROJECT_URL = "/projects/heinz";

  type ProcessSectionMedia =
    | { src: string; type: "video" | "image" }
    | {
        type: "colorSwatches";
        icons: Array<{ label: string; sub: string; fill: string }>;
        note: string;
      }
    | {
        type: "spatialGrafismos";
        intro: string;
        heroImage?: string;
        colorBlocks?: Array<{ name: string; hex: string }>;
        pillars: Array<{ name: string; color: string; hex: string; grafismoSrc: string }>;
      }
    | { type: "imageSlider"; images: string[]; intervalMs?: number }
    | {
        type: "mediaSlider";
        items: Array<{ src: string; type: "video" | "image" }>;
        intervalMs?: number;
      }
    | { type: "customCanvas"; src?: string };
  const casaProcessSections: Array<{
    title?: string;
    text: string;
    media?: ProcessSectionMedia;
  }> = [
    {
      text: "The design process was built around translating psychological and sensory principles into tangible design decisions.",
    },
    {
      title: "Color System",
      text: "Inspired by neurodiversity and emotional signaling, the palette balances softness and contrast, allowing controlled stimulation without overload.",
      media: {
        type: "colorSwatches",
        icons: [
          { label: "Asterisk", sub: "School", fill: "#f5c042" },
          { label: "Heart", sub: "Clinic", fill: "#f97472" },
          { label: "House", sub: "Family", fill: "#44a0c4" },
          { label: "Bear", sub: "Methodology", fill: "#cd9459" },
        ],
        note: "The colored blocks reference building toys, reinforcing the connection with the children's universe.",
      },
    },
    {
      title: "Spatial Thinking",
      text: "The 4 pillars together form the foundation of care. Each pillar connects to the others, development is integral. Casa do Urso accompanies each dimension with care and evidence.",
      media: {
        type: "spatialGrafismos",
        intro: "These grafismos were painted on the clinic walls, symbolizing emotions and the four pillars of development.",
        heroImage: "/Fotos da clinica/_DSCcorredor.png",
        colorBlocks: [
          { name: "Candy", hex: "#E8858A" },
          { name: "Sky Blue", hex: "#4497C3" },
          { name: "Yellow", hex: "#F5BF42" },
          { name: "Mint", hex: "#5DC198" },
        ],
        pillars: [
          { name: "Emotional", color: "red", hex: "#F9746E", grafismoSrc: "/grafismo-emocional.png" },
          { name: "Social", color: "green", hex: "#5BC7AA", grafismoSrc: "/grafismo-social.png" },
          { name: "Communication", color: "blue", hex: "#4497C3", grafismoSrc: "/grafismo-comunicacao.png" },
          { name: "Autonomy", color: "yellow", hex: "#F5BF42", grafismoSrc: "/grafismo-autonomia.png" },
        ],
      },
    },
    {
      title: "Interaction Language",
      text: "Interfaces follow a tactile logic, using clear hierarchy, spacing, and rhythm to reduce cognitive friction.",
    },
    {
      title: "Sensory Design",
      text: "References from Snoezelen environments informed the balance between activation and calm, guiding lighting, composition, and visual density.",
      media: {
        type: "mediaSlider",
        items: [
          { src: "/Fotos e videos clinica/IMG_1738.MOV", type: "video" },
          { src: "/Fotos da clinica/_DSC3876-ALTA.JPG", type: "image" },
          { src: "/Fotos da clinica/_DSC3854-ALTA.JPG", type: "image" },
        ],
        intervalMs: 5000,
      },
    },
    {
      title: "System Thinking",
      text: "Rather than isolated assets, the project was built as a flexible system that adapts across physical spaces, communication materials, and digital interfaces.",
      media: { type: "customCanvas", src: "/grovia-cards.html" },
    },
  ];

  const renderCasaProcessSections = () => {
    const t86 = "text-black/86";
    const t60 = "text-black/60";
    const warmBg = "#e8dddd";
    const borderColor = "rgba(0,0,0,0.12)";

    return (
      <div className="space-y-8">
        {casaProcessSections.map((sec, i) => (
          <div key={i} className="space-y-3">
            {sec.media && (
              <div className="relative w-full overflow-hidden rounded-sm">
                {sec.media.type === "video" && "src" in sec.media && (
                  <video
                    src={sec.media.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-auto w-full object-contain"
                  />
                )}
                {sec.media.type === "image" && "src" in sec.media && (
                  <img
                    src={sec.media.src}
                    alt=""
                    aria-hidden
                    className="h-auto w-full object-contain"
                  />
                )}
                {sec.media.type === "colorSwatches" && (() => {
                  const swatches = sec.media;
                  return (
                  <div
                    className="rounded-sm p-5 md:p-6 space-y-8"
                    style={{ backgroundColor: warmBg, border: `1px solid rgba(0,0,0,0.08)` }}
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src="/icones_casadourso.svg"
                        alt=""
                        aria-hidden
                        className="h-[92px] w-auto max-w-full object-contain md:h-[108px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
                      {swatches.icons.map((ico, j) => (
                        <div key={j} className="flex flex-col items-center gap-2 text-center">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ico.fill }} aria-hidden />
                          <div>
                            <div className="font-sans text-[15px] font-bold text-black/90 leading-tight">
                              {ico.label}
                            </div>
                            <div className="mt-0.5 font-sans text-[13px] text-black/60">{ico.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="font-sans text-[13px] text-black/60 text-center border-t border-black/10 pt-4 mt-2">
                      {swatches.note}
                    </p>
                  </div>
                  );
                })()}
                {sec.media.type === "spatialGrafismos" && (
                  <div
                    className="rounded-sm overflow-hidden space-y-3"
                    style={{ backgroundColor: warmBg, border: `1px solid ${borderColor}` }}
                  >
                    {sec.media.colorBlocks && sec.media.colorBlocks.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-7 p-4">
                        {sec.media.colorBlocks.map((b, j) => (
                          <div key={j} className="flex flex-col items-center gap-2.5 text-center">
                            <div
                              className="h-[100px] w-[100px] rounded-[20px] shrink-0"
                              style={{ backgroundColor: b.hex }}
                            />
                            <div className="font-sans text-[14px] font-bold text-black/90">{b.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.media.heroImage && (
                      <div className="h-[280px] w-full overflow-hidden">
                        <img
                          src={sec.media.heroImage}
                          alt=""
                          aria-hidden
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {sec.media.pillars.map((p, j) => (
                        <div key={j} className="flex flex-col items-center gap-2">
                          <img
                            src={p.grafismoSrc}
                            alt=""
                            aria-hidden
                            className="h-16 w-auto object-contain"
                          />
                          <span
                            className="font-mono text-[11px] uppercase tracking-wider"
                            style={{ color: p.hex }}
                          >
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sec.media.type === "imageSlider" && (
                  <ClinicImageSlider
                    images={sec.media.images}
                    intervalMs={sec.media.intervalMs ?? 4000}
                  />
                )}
                {sec.media.type === "customCanvas" && (
                  <div
                    className="relative h-[min(62svh,520px)] w-full min-h-[280px] overflow-hidden rounded-sm border border-black/20 bg-black/5"
                    aria-label={sec.media.src ? "Grovia cards demo" : "Canvas placeholder"}
                  >
                    {sec.media.src ? (
                      <iframe
                        src={sec.media.src}
                        title="Grovia Customer Cards"
                        className="absolute inset-0 h-full w-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    ) : (
                      <div className="flex h-full min-h-[280px] items-center justify-center border border-dashed border-black/20">
                        <span className="font-mono text-[12px] text-black/40">Canvas placeholder, paste your code here</span>
                      </div>
                    )}
                  </div>
                )}
                {sec.media.type === "mediaSlider" && (
                  <MediaSlider
                    items={sec.media.items}
                    intervalMs={sec.media.intervalMs ?? 5000}
                  />
                )}
              </div>
            )}
            {sec.title && (
              <div className={`font-mono text-[13px] uppercase tracking-[0.22em] ${t60}`}>
                {sec.title}
              </div>
            )}
            <p className={`whitespace-pre-line font-mono text-[14px] leading-relaxed tracking-[0.01em] ${t86}`}>
              {sec.text}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const DEFAULT_DRAWER_ENTRIES = [
    { id: "overview" as const, label: "Overview", n: 1 },
    { id: "problem" as const, label: "Problem", n: 2 },
    { id: "process" as const, label: "Process", n: 3 },
    { id: "outcome" as const, label: "Outcome", n: 4 },
  ];

  const HEINZ_DRAWER_ENTRIES = [
    { id: "heinz-hero" as const, label: "Hero", n: 1 },
    { id: "heinz-dip" as const, label: "Dip to Win", n: 2 },
    { id: "heinz-breakdown" as const, label: "Breakdown", n: 3 },
  ] as const;

  type Field = { k: string; v: string };
  type ProjectData = {
    id: string;
    name: string;
    client: string;
    year: string;
    description: string;
    fields: Field[];
    active: boolean;
    iconSrc?: string;
    videoSrc?: string;
    fullCaseHref?: string;
  };
  const casaFields: Field[] = [
    { k: "ROLE", v: "vibe coder" },
    { k: "SCOPE", v: "interface system" },
    { k: "CATEGORY", v: "BRAND / DIGITAL" },
    { k: "DELIVERABLES", v: "design system" },
  ];

  /** Deliverables grid, aligned with BRIEF-casa-do-urso.md */
  const casaDeliverables: Array<{ title: string; desc: string }> = [
    { title: "Naming", desc: "Identity and verbal system aligned with clinical care." },
    { title: "Visual Identity", desc: "Colour, type, and modular composition across touchpoints." },
    { title: "Tato", desc: "Mascot as emotional anchor, character and application rules." },
    { title: "Environmental Design", desc: "Spatial language and wall grafismos for the clinic." },
    { title: "Inclusive Signage", desc: "Wayfinding and communication across age groups." },
    { title: "Emocionário", desc: "Tools for emotional literacy and regulation." },
  ];

  const heinzFields: Field[] = [
    { k: "ROLE", v: "art director" },
    { k: "SCOPE", v: "campaign experience" },
    { k: "CATEGORY", v: "CAMPAIGN / INTERACTIVE" },
    { k: "DELIVERABLES", v: "motion language" },
  ];

  const pokerFields: Field[] = [
    { k: "ROLE", v: "head of design" },
    { k: "SCOPE", v: "brand · product · media" },
    { k: "CATEGORY", v: "BRAND / PRODUCT / LEADERSHIP" },
    { k: "DELIVERABLES", v: "identity system" },
  ];

  const comicsFields: Field[] = [
    { k: "ROLE", v: "brand designer" },
    { k: "SCOPE", v: "identity · space · collateral" },
    { k: "CATEGORY", v: "BRAND / ARCHITECTURE" },
    { k: "DELIVERABLES", v: "brand system" },
  ];

  const petzFields: Field[] = [
    { k: "ROLE", v: "illustrator · art direction" },
    { k: "SCOPE", v: "social campaign · storytelling" },
    { k: "CATEGORY", v: "ADVERTISING / ILLUSTRATION" },
    { k: "DELIVERABLES", v: "short-form visual stories" },
  ];

  const tridentFields: Field[] = [
    { k: "ROLE", v: "art director" },
    { k: "SCOPE", v: "brand strategy · visual identity" },
    { k: "CATEGORY", v: "BRAND / CAMPAIGN" },
    { k: "DELIVERABLES", v: "packaging · POS · awareness" },
  ];

  const lactaFields: Field[] = [
    { k: "ROLE", v: "visual & illustration direction" },
    { k: "SCOPE", v: "campaign system · character world" },
    { k: "CATEGORY", v: "BRAND / ILLUSTRATION / CAMPAIGN" },
    { k: "DELIVERABLES", v: "serial fairy-tale · social · OOH" },
  ];

  const comicsContent = {
    overview: `Complete brand identity and architectural concept for Comics, a bar and entertainment venue in São Paulo built around the universe of comics, music, and stand-up comedy. The brand had to feel lived-in, layered, and unmistakably of its world.`,
    problem: `Most entertainment venues either lack a strong visual identity or feel generic. The challenge was to create a brand that felt immersive and authentic, drawing from urban noir, jazz-era clubs, and comic book culture while remaining bold and direct.`,
    process: `The concept was rooted in urban noir: dark alleyways, neon signs, rusted metals. Design principles: strong & direct typography, elegant decay (industrial rawness balanced with designed lighting), and typography as identity. BAHN became the backbone of the visual language.`,
    outcome: `A complete brand system from logo and brand manual to cardápio (menu designed as a collectible comic), collateral, signage, and full architectural concept for 340m². The identity scales from cocktail napkins to an illuminated Broadway-style facade.`,
  };

  const tridentContent = {
    overview: `What if chewing gum could help save a life? Trident's sugar-free gum enables saliva-based DNA testing. By integrating a secure, resealable plastic bag inside the gum's packaging, we turned every pack into a bone marrow registration kit. A campaign that turned a familiar product into a lifesaving tool.`,
    problem: `It's incredibly hard to find matching donors for patients from diverse ethnic backgrounds. The NHS even searches internationally to find compatible bone marrow matches. But most people don't register because the process feels complex or time-consuming.`,
    process: `The key was simplicity. We turned the registration process into a familiar, frictionless experience, no needles, no clinics. Just chew, pack, and drop. Chew it like any other Trident. Pack it in the resealable bag inside the pack. Drop it at a donation point in ASDA or Tesco.`,
    outcome: `Special edition Trident gum packaging, custom grip-seal inner pouch, POS displays for Tesco and ASDA, visual identity for the campaign, and awareness posters and video concepts for social media. The campaign made bone marrow registration as simple as chewing gum.`,
  };

  const petzContent = {
    overview: `Petz + Ogilvy Dia do SRD started as a collaborative social campaign where people shared what made their mixed-breed pets unique. Selected stories were transformed into illustrated social pieces.`,
    problem: `The challenge was celebrating SRD pets without generic communication. The campaign needed authentic, personal stories while still keeping a clear visual language for brand channels.`,
    process: `The flow was collect, curate, and illustrate: audience traits were gathered, selected profiles were distilled, and each pet story became a short visual narrative designed for Stories and Facebook.`,
    outcome: `A participatory campaign format that translated real audience submissions into branded illustrated content. This first drawer version sets the case framework; next we can add full Behance visuals and process frames.`,
  };

  const lactaContent = {
    overview: `Lacta, Coelho de Natal is a Christmas campaign that turned a familiar fairy tale into a clear home-first message, anchored by a character-led illustration world.`,
    problem: `In 2020, the context demanded clarity without losing wonder. The challenge was to keep the narrative engaging while communicating a simple, important message.`,
    process: `The system built a serial fairy-tale rollout with a consistent character world. Campaign chapters expanded across social formats and translated into a cohesive visual language for OOH.`,
    outcome: `A unified campaign universe spanning animation/reveal moments, illustration chapters, and public placements, reinforcing recognition through one shared story and hashtag: #PapaiNoelFicaEmCasa.`,
  };

  const projects = useMemo<ProjectData[]>(
    () => [
      {
        id: "comics",
        name: "Comics",
        client: "Comics Bar",
        year: "2019",
        description:
          "Complete brand identity and architectural concept for a bar and entertainment venue in São Paulo. Brand system, space concept, and collateral built around comics, music, and stand-up comedy.",
        fields: comicsFields,
        active: true,
        iconSrc: "/comics/comics-01-hero.png?v=20260325",
        videoSrc: "/comics/Comics_.mp4?v=20260325",
        fullCaseHref: "/comics/comics-case.html?v=20260330b",
      },
      {
        id: "casa",
        name: "Casa do Urso",
        client: "Casa do Urso",
        year: "",
        description:
          "A portfolio case study for Casa do Urso, focused on a tactile interface system and branded interaction language. Built to translate a warm identity into a controlled UI rhythm, with modular panels and high-contrast typography.",
        fields: casaFields,
        active: true,
        iconSrc: "/casadourso-cover.png",
        videoSrc: "/casadourso-scene-2.mp4",
        fullCaseHref: "/casa-do-urso-case.html",
      },
      {
        id: "heinz",
        name: "Heinz Lab",
        client: "Heinz",
        year: "",
        description:
          "A portfolio case study for Heinz, presenting an interactive campaign experience with motion-driven transitions and a systems-first layout. Designed to feel cinematic while staying readable, modular, and performance-aware.",
        fields: heinzFields,
        active: true,
        iconSrc: "/Heinz/ithastobeheinz.svg",
        videoSrc: "/Typography 05.mp4",
        fullCaseHref: "/projects/heinz",
      },
      {
        id: "lacta",
        name: "Lacta",
        client: "Lacta",
        year: "2020",
        description:
          "Coelho de Natal: a character-led Christmas campaign system built as a serial fairy tale, anchored by a clear stay-home message across social and OOH.",
        fields: lactaFields,
        active: true,
        iconSrc: "/LACTA/lacta-cover.jpg",
        fullCaseHref: "/LACTA/lacta-case.html",
      },
      {
        id: "petz",
        name: "Petz",
        client: "Petz + Ogilvy Brasil",
        year: "2020",
        description:
          "Collaborative social campaign for Dia do SRD: audience-submitted pet traits transformed into illustrated short stories for Instagram Stories and Facebook.",
        fields: petzFields,
        active: true,
        iconSrc: "/petz/petz-cover.png?v=20260325",
        fullCaseHref: "/petz/petz-drawer-embed.html?v=20260325",
      },
      {
        id: "trident",
        name: "Trident",
        client: "Trident",
        year: "2019",
        description:
          "Bone Marrow campaign: What if chewing gum could help save a life? Saliva-based DNA testing via Trident's packaging, every pack became a bone marrow registration kit.",
        fields: tridentFields,
        active: true,
        fullCaseHref: "/Trident/trident-case.html",
      },
      {
        id: "pokerbros",
        name: "PokerBros",
        client: "PokerBros",
        year: "",
        description:
          "Design leadership for a global poker platform. Head of Design: visual identity, product UI, and art direction across app, web, podcasts, and marketing. One coherent system across all touchpoints.",
        fields: pokerFields,
        active: true,
        iconSrc: "/spades.svg",
        // Use the embed directly (no confirmation card on mobile).
        fullCaseHref: "/Pokerbros/pokerbros-drawer-embed.html?v=20260330",
      },
    ],
    []
  );

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId]
  );

  const drawerNavButtons =
    selectedProject.id === "heinz"
      ? HEINZ_DRAWER_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setHeinzScrollTarget(entry.id)}
            className="flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5"
          >
            <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
            <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
              {entry.n}
            </span>
          </button>
        ))
      : selectedProject.id === "pokerbros"
        ? DEFAULT_DRAWER_ENTRIES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setPokerbrosScrollTarget(entry.id as "overview" | "problem" | "process" | "outcome")}
              className={`flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5 ${pokerbrosActiveSection === entry.id ? "bg-black/10" : ""}`}
            >
              <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
              <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
                {entry.n}
              </span>
            </button>
          ))
        : selectedProject.id === "comics"
          ? DEFAULT_DRAWER_ENTRIES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setComicsScrollTarget(entry.id as "overview" | "problem" | "process" | "outcome")}
                className={`flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5 ${comicsActiveSection === entry.id ? "bg-black/10" : ""}`}
              >
                <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
                <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
                  {entry.n}
                </span>
              </button>
            ))
          : selectedProject.id === "petz"
            ? DEFAULT_DRAWER_ENTRIES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setPetzScrollTarget(entry.id as "overview" | "problem" | "process" | "outcome")}
                  className={`flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5 ${petzActiveSection === entry.id ? "bg-black/10" : ""}`}
                >
                  <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
                  <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
                    {entry.n}
                  </span>
                </button>
              ))
          : selectedProject.id === "trident"
            ? (
                <a
                  href="/Trident/trident-case.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5"
                >
                  <span className="font-sans text-[22px] leading-[0.9]">Open case study</span>
                  <span className="text-black/40">↗</span>
                </a>
              )
            : selectedProject.id === "casa"
              ? CASA_DRAWER_ENTRIES.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => scrollTo(entry.id)}
                    className={`flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5 ${activeSection === entry.id ? "bg-black/10" : ""}`}
                  >
                    <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
                    <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
                      {entry.n}
                    </span>
                  </button>
                ))
            : DEFAULT_DRAWER_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => scrollTo(entry.id as DrawerSection)}
            className={`flex w-full items-center justify-between border-b border-black/30 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/5 ${activeSection === entry.id ? "bg-black/10" : ""}`}
          >
            <span className="font-sans text-[44px] leading-[0.9]">{entry.label}</span>
            <span className="flex h-6 w-6 items-center justify-center bg-black font-mono text-[13px] tracking-widest text-white">
              {entry.n}
            </span>
          </button>
        ));

  const activeDrawerCopy =
    selectedProjectId === "casa"
      ? casaDoUrsoContent
      : selectedProjectId === "heinz"
        ? heinzContent
        : selectedProjectId === "pokerbros"
          ? pokerbrosContent
          : selectedProjectId === "comics"
            ? comicsContent
            : selectedProjectId === "petz"
              ? petzContent
            : selectedProjectId === "trident"
              ? tridentContent
              : selectedProjectId === "lacta"
                ? lactaContent
                : null;

  const cardsForGrid = useMemo(() => {
    const content: Record<string, { overview: string; problem: string; process: string; outcome: string }> = {
      casa: casaDoUrsoContent,
      heinz: heinzContent,
      pokerbros: pokerbrosContent,
      comics: comicsContent,
      petz: petzContent,
      trident: tridentContent,
      lacta: lactaContent,
    };
    return projects.map((p, i) => ({
      id: p.id,
      index: i + 1,
      name: p.name,
      tags: p.fields.map((f) => f.v),
      year: p.year,
      coverSrc: p.videoSrc ?? p.iconSrc,
      accentColor:
        p.id === "casa"
          ? "#F9746E"
          : p.id === "heinz"
            ? "#cc0000"
            : p.id === "pokerbros"
              ? "#FED201"
              : p.id === "comics"
                ? "#C8202A"
                : p.id === "petz"
                  ? "#6dcf6d"
                : p.id === "trident"
                  ? "#2d8b6e"
                  : p.id === "lacta"
                    ? "#40c8e8"
                    : "#4497C3",
      overview: content[p.id]?.overview ?? p.description,
      problem: content[p.id]?.problem ?? p.description,
      process: content[p.id]?.process ?? p.description,
      outcome: content[p.id]?.outcome ?? p.description,
    }));
  }, [projects]);

  const handleSelectProject = (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (isMobile && p?.fullCaseHref) {
      const href = p.fullCaseHref;
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
      return;
    }
    setSelectedProjectId(id);
    setProjectDrawerOpen(true);
  };

  useEffect(() => {
    if (!projectDrawerOpen) return;
    scrollTo("overview");
  }, [projectDrawerOpen, selectedProjectId]);

  const selectedMode = useMemo<HomeMode>(() => {
    return HOME_MODES.find((m) => m.id === selectedId) || HOME_MODES[0];
  }, [selectedId]);

  const hoveredMode = useMemo<HomeMode | null>(() => {
    if (!hoveredId) return null;
    return HOME_MODES.find((m) => m.id === hoveredId) || null;
  }, [hoveredId]);

  const handleSelect = (id: HomeModeId) => {
    setSelectedId(id);
  };

  const handleEnter = () => {
    const mode = selectedMode;
    if (mode.status === "locked") return;
    if (!mode.href) return;

    if (mode.href.startsWith("http")) {
      window.open(mode.href, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(mode.href);
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (transitionLockRef.current) return;
      if (window.scrollY > 16) return;
      if (e.deltaY <= 0) return;
      // cinematic lock moment + controlled descent
      transitionLockRef.current = true;
      e.preventDefault();
      const startY = window.scrollY;
      const targetY = window.innerHeight;
      const start = performance.now();
      const dur = 420;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const y = startY + (targetY - startY) * ease(t);
        window.scrollTo(0, y);
        if (t < 1) requestAnimationFrame(tick);
        else {
          window.setTimeout(() => {
            transitionLockRef.current = false;
          }, 80);
        }
      };
      requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("home.profileOpen");
      if (saved === "0") setProfileOpen(false);
      if (saved === "1") setProfileOpen(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("home.profileOpen", profileOpen ? "1" : "0");
    } catch {
      // ignore
    }
  }, [profileOpen]);

  useEffect(() => {
    const target = document.getElementById("playground-section");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlaygroundInView(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = document.getElementById("project-grid");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setProjectGridInView(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative w-full text-white" style={{ background: "var(--sys-bg)" }}>
      <div className="fixed inset-0 z-0">
        <SystemOverlay
          accentActive={selectedMode.status !== "locked"}
          transitionProgress={introScroll}
        />
      </div>

      <SystemTitleBridge
        show={introReady}
        progress={introScroll}
        text="MARI // CREATIVE SYSTEM"
      />

      <div
        ref={containerRef}
        className="relative z-10 w-full"
      >
        <ScrollObserver onProgress={setIntroScroll} />

        <div style={{ scrollSnapAlign: "start" }}>
          <IntroSection scrollProgress={introScroll} onReady={() => setIntroReady(true)} />
        </div>

        <section
          style={{ scrollSnapAlign: "start" }}
          className="relative h-[100svh] w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: introScroll >= 0.1 ? 1 : 0,
              y: introScroll >= 0.1 ? 0 : 40,
            }}
            transition={{ duration: 0.18, ease: "linear" }}
          >
            <TopBar version="v1.0.0" statusText="STATUS: ACTIVE" />
          </motion.div>

          <div className="absolute inset-0 pt-[56px] pb-[72px]">
            {/* Video background, fundo do void na página toda */}
            {activeSplineSceneId === "void" && (
              <div className="pointer-events-none absolute inset-0 z-0">
                <video
                  src="/Glitch Typo Logo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  aria-hidden
                />
              </div>
            )}
            {/* Spline central; esquerda = PlayerPanel (md+); direita = System Visor + Node Grid (md+) */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 md:pl-[min(420px,28vw)] md:pr-[min(420px,28vw)]">
              <section className="relative h-full w-full max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{
                    opacity: introScroll >= 0.22 ? 1 : 0,
                    scale: introScroll >= 0.22 ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.18, ease: "linear" }}
                  className="relative z-20 h-full w-full"
                >
                  <Spline3DLabSlider
                    pulseKey={selectedId}
                    splineHovered={splineHovered}
                    splinePointerCoords={splinePointerCoords}
                    onHoverChange={(h) => {
                      setSplineHovered(h);
                      if (!h) setSplinePointerCoords(null);
                    }}
                    onPointerMove={(x, y) => setSplinePointerCoords({ x, y })}
                    onActiveSceneChange={setActiveSplineSceneId}
                  />
                </motion.div>
              </section>
            </div>

            {/* Right sidebar, System Visor + Node Grid, colado à lateral direita */}
            <div className="absolute right-0 top-0 bottom-0 z-20 hidden w-[min(380px,26vw)] flex-col border-l border-white/10 bg-[var(--sys-bg)]/80 p-2 backdrop-blur-sm md:flex md:w-[min(420px,28vw)] md:p-3">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{
                  opacity: introScroll >= 0.22 ? 1 : 0,
                  y: introScroll >= 0.22 ? 0 : 26,
                }}
                transition={{ duration: 0.18, ease: "linear" }}
                className="hidden min-h-[280px] flex-shrink-0 md:block"
              >
                <InfoPanel
                  selectedMode={selectedMode}
                  selectedId={selectedId}
                  hoveredMode={hoveredMode}
                  splineHovered={splineHovered}
                  activeSplineSceneId={activeSplineSceneId}
                  visorInfo={visorInfo}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{
                  opacity: introScroll >= 0.28 ? 1 : 0,
                  y: introScroll >= 0.28 ? 0 : 26,
                }}
                transition={{ duration: 0.18, ease: "linear" }}
                className="min-h-0 flex-1 overflow-y-auto"
              >
                <SelectionGrid
                  modes={HOME_MODES}
                  hoveredId={hoveredId}
                  selectedId={selectedId}
                  onHover={setHoveredId}
                  onSelect={handleSelect}
                  splineHovered={splineHovered}
                  activeSplineSceneId={activeSplineSceneId}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: introScroll >= 0.45 ? 1 : 0,
              scale: introScroll >= 0.45 ? 1 : 0.98,
            }}
            transition={{ duration: 0.18, ease: "linear" }}
          >
            <PlayerPanel
              open={profileOpen}
              showPlayerPanel={!playgroundInView && !projectGridInView}
              onClose={() => setProfileOpen(false)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: introScroll >= 0.18 ? 1 : 0,
              y: introScroll >= 0.18 ? 0 : 14,
            }}
            transition={{ duration: 0.18, ease: "linear" }}
          >
            <CommandBar
              hoveredMode={selectedMode}
              activeModeId={selectedId}
              onEnter={handleEnter}
            />
          </motion.div>
        </section>

        <ProjectGridSection
          projects={projects}
          cardsForGrid={cardsForGrid}
          onHoverVisor={setVisorInfo}
          onSelectProject={handleSelectProject}
        />
        <AboutWhiteboardSection />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {projectDrawerOpen ? (
          <motion.section
            key={selectedProject.id}
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.92 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[90] w-[70vw] overflow-hidden border-l border-white/20 bg-[#141414]/96 backdrop-blur-xl lg:w-[66.666vw]"
          >
            <div className="mx-auto flex h-full w-full flex-col px-5 py-5 md:px-8 md:py-7">
              <div className="grid h-full min-h-0 grid-cols-1 gap-5 pt-2 md:grid-cols-[380px_1fr]">
                <aside className="flex h-full min-h-0 flex-col border border-black/20 bg-[#e8dddd] text-black">
                  <div className="flex items-start justify-between px-4 pt-4">
                    <span className="font-mono text-[32px] leading-none tracking-tight">0{projects.findIndex((p) => p.id === selectedProject.id) + 1}.</span>
                    <button
                      type="button"
                      onClick={() => setProjectDrawerOpen(false)}
                      className="h-7 w-7 bg-black font-mono text-[14px] leading-none text-white"
                      aria-label="Close drawer"
                    >
                      ×
                    </button>
                  </div>

                  <div className="px-4 pt-8">
                    {selectedProject.id === "casa" ? (
                      <DrawerCasaHeader />
                    ) : selectedProject.id === "comics" ? (
                      <>
                        <img
                          src="/comics/hori.svg"
                          alt="Comics"
                          className="h-[360px] w-auto object-contain object-left"
                        />
                        <div className="mt-6 border-t border-black/30" />
                        <p className="mt-6 font-mono text-[13px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                          {selectedProject.description}
                        </p>
                      </>
                    ) : selectedProject.id === "petz" ? (
                      <>
                        <h2 className="font-heading text-[52px] leading-[0.95] tracking-tight">
                          PETZ
                        </h2>
                        <div className="mt-6 border-t border-black/30" />
                        <p className="mt-6 font-mono text-[13px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                          {selectedProject.description}
                        </p>
                      </>
                    ) : selectedProject.id === "trident" ? (
                      <>
                        <div className="flex min-h-[120px] items-center justify-center border border-black/15 bg-black/[0.04] px-4 py-8">
                          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/40">
                            Trident &middot; UI
                          </span>
                        </div>
                        <div className="mt-6 border-t border-black/30" />
                        <p className="mt-6 font-mono text-[13px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                          {selectedProject.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-heading text-[52px] leading-[0.95] tracking-tight">
                          {selectedProject.name}
                        </h2>
                        <div className="mt-6 border-t border-black/30" />
                        <p className="mt-6 font-mono text-[13px] uppercase leading-[1.15] tracking-[0.08em] text-black/90">
                          {selectedProject.description}
                        </p>
                      </>
                    )}
                  </div>

                  {selectedProject.id === "casa" && (
                    <div className="mt-6 rounded border border-black/20 bg-black/5 p-4">
                      <div style={{ fontFamily: "Poppins, system-ui, sans-serif" }} className="text-[11px] uppercase tracking-[0.16em] text-black/60">
                        Activation → Calm ( *  ♥  Casa  Urso )
                      </div>
                      <div className="mt-3 flex w-full items-center justify-center">
                        <SensoryIconSparkles src="/icones.svg" alt="" />
                      </div>
                    </div>
                  )}

                  <div className="mt-auto border-t border-black/30">
                    {selectedProject.fullCaseHref && (
                      <a
                        href={selectedProject.fullCaseHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between border-b border-black/30 px-4 py-3 text-left transition-colors duration-200 hover:bg-black/5"
                      >
                        <span className="font-sans text-[18px] leading-[0.95] tracking-tight">
                          View full case
                        </span>
                        <span className="text-black/40" aria-hidden>
                          ↗
                        </span>
                      </a>
                    )}
                    {drawerNavButtons}
                  </div>
                </aside>

                <div
                  className={`relative min-h-0 h-full overflow-hidden border ${
                    selectedProject.id === "casa"
                      ? "border-black/20 bg-[#e8dddd] text-black"
                      : selectedProject.id === "heinz"
                        ? "border-white/12 bg-[#0d0d0d]"
                        : selectedProject.id === "pokerbros"
                          ? "border-white/12 bg-[#0a0818]"
                          : selectedProject.id === "comics"
                            ? "border-white/12 bg-[#0a0a08]"
                            : selectedProject.id === "petz"
                              ? "border-black/25 bg-[#F8D800]"
                            : selectedProject.id === "trident"
                              ? "border-white/12 bg-[#0d1512] text-white"
                              : "border-white/12 bg-[#0d0d0d] text-white"
                  }`}
                >
                  {selectedProject.id === "heinz" ? (
                    <div className="absolute inset-0 min-h-0">
                      <HeinzEmbed
                        scrollToSection={heinzScrollTarget}
                        onScrollDone={() => setHeinzScrollTarget(null)}
                      />
                    </div>
                  ) : selectedProject.id === "pokerbros" ? (
                    <div className="absolute inset-0 min-h-0">
                      <PokerBrosEmbed
                        scrollToSection={pokerbrosScrollTarget}
                        onSectionChange={setPokerbrosActiveSection}
                        onScrollSent={() => setPokerbrosScrollTarget(null)}
                      />
                    </div>
                  ) : selectedProject.id === "comics" ? (
                    <div className="absolute inset-0 min-h-0">
                      <ComicsEmbed
                        scrollToSection={comicsScrollTarget}
                        onSectionChange={setComicsActiveSection}
                        onScrollSent={() => setComicsScrollTarget(null)}
                      />
                    </div>
                  ) : selectedProject.id === "petz" ? (
                    <div className="absolute inset-0 min-h-0">
                      <PetzEmbed
                        scrollToSection={petzScrollTarget}
                        onSectionChange={setPetzActiveSection}
                        onScrollSent={() => setPetzScrollTarget(null)}
                      />
                    </div>
                  ) : selectedProject.id === "trident" ? (
                    <div className="absolute inset-0 min-h-0">
                      <TridentEmbed />
                    </div>
                  ) : selectedProject.id === "lacta" ? (
                    <div className="absolute inset-0 min-h-0">
                      <LactaEmbed scrollToSection={lactaScrollTarget} />
                    </div>
                  ) : selectedProject.id === "casa" ? (
                    <div className="absolute inset-0 min-h-0">
                      <CasaUrsoEmbed
                        scrollToSection={casaScrollTarget}
                      />
                    </div>
                  ) : (
                  <div className="flex h-full min-h-0 flex-1 flex-col">
                    {selectedProject.id === "casa" && (
                      <div
                        className="flex h-1.5 w-full shrink-0"
                        aria-hidden
                        title="Spectrum: School · Clinic · Family · Methodology"
                      >
                        <div className="flex-1 bg-[#F5BF42]" />
                        <div className="flex-1 bg-[#F9746E]" />
                        <div className="flex-1 bg-[#4497C3]" />
                        <div className="flex-1 bg-[#CD995B]" />
                      </div>
                    )}
                    <div className="relative min-h-0 flex-1">
                  <AnimatePresence mode="sync" initial={false} custom={slideDirection}>
                    {activeSection === "overview" && (
                      <motion.div
                        key={`overview-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6"
                      >
                        <section className="transition-colors duration-200">
                          <div className="relative w-full overflow-hidden rounded-sm">
                            {selectedProject.videoSrc ? (
                              <video
                                key={selectedProject.videoSrc}
                                src={selectedProject.videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="h-auto w-full object-contain transition-opacity duration-300 opacity-100"
                              />
                            ) : selectedProject.iconSrc ? (
                              <img
                                src={selectedProject.iconSrc}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                className="h-auto w-full object-contain transition-opacity duration-300 opacity-100"
                              />
                            ) : null}
                          </div>
                          <div className="pt-5">
                            <div className={`font-mono text-[13px] uppercase tracking-[0.22em] ${selectedProject.id === "casa" ? "text-black/60" : "text-white/60"}`}>
                              OVERVIEW
                            </div>
                            <p className={`mt-3 whitespace-pre-line font-mono text-[14px] leading-relaxed md:text-[15px] ${selectedProject.id === "casa" ? "text-black/86" : "text-white/86"}`}>
                              {activeDrawerCopy
                                ? activeDrawerCopy.overview
                                : selectedProject.description}
                            </p>
                          </div>
                        </section>
                      </motion.div>
                    )}

                    {activeSection === "problem" && (
                      <motion.div
                        key={`problem-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6 pl-0 pr-0 md:pl-0 md:pr-0"
                      >
                        <section className="transition-colors duration-200 space-y-5 mx-0">
                          <div className={`font-mono text-[13px] uppercase tracking-[0.22em] ml-[6px] ${selectedProject.id === "casa" ? "text-black/60" : "text-white/60"}`}>
                            {selectedProject.id === "casa" ? "CHALLENGE" : "PROBLEM"}
                          </div>
                          {selectedProject.id === "casa" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="relative w-full sm:col-span-2 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch min-h-[280px] sm:min-h-[340px] pl-0 pr-0">
                                <div className="flex-1 min-w-0 flex items-center justify-center overflow-hidden rounded-sm bg-[#e8dddd]">
                                  <img
                                    src="/capa-so-evolucao.png"
                                    alt="Só Evolução, DJ Tato feat. Tio Anderson"
                                    className="h-full w-auto max-w-full object-contain object-center text-transparent ml-[14px]"
                                    draggable={false}
                                  />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center justify-center overflow-hidden rounded-sm bg-[#e8dddd]">
                                  <video
                                    src="/anderson%20e%20tato.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedProject.id === "casa" && (
                            <blockquote className="mx-[23px] border-l-[3px] border-[#c9a882] pl-4 font-mono text-[15px] italic leading-snug text-black/85 md:text-[16px]">
                              Tato transforms the brand from something seen into something felt and trusted.
                            </blockquote>
                          )}
                          <p className={`whitespace-pre-line font-mono text-[14px] leading-relaxed tracking-[0.01em] mx-[23px] ${selectedProject.id === "casa" ? "text-black/84" : "text-white/84"}`}>
                            {activeDrawerCopy
                              ? activeDrawerCopy.problem
                              : "Translate project goals into a structured system where visual identity, interaction rhythm, and content hierarchy remain clear across contexts."}
                          </p>
                        </section>
                      </motion.div>
                    )}

                    {activeSection === "tato" && (
                      <motion.div
                        key={`tato-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6"
                      >
                        <section className="transition-colors duration-200">
                          <div className="font-mono text-[13px] uppercase tracking-[0.22em] text-black/60">
                            TATO
                          </div>
                          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                            <div
                              className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-black/10 p-6"
                              style={{
                                backgroundColor: "rgba(245, 191, 66, 0.18)",
                                backgroundImage:
                                  "radial-gradient(circle, rgba(3, 46, 77, 0.14) 1px, transparent 1px)",
                                backgroundSize: "10px 10px",
                              }}
                            >
                              <img
                                src="/casadourso.svg"
                                alt="Tato, Casa do Urso"
                                className="max-h-[200px] w-auto object-contain"
                                draggable={false}
                              />
                            </div>
                            <div className="space-y-4">
                              <h3 className="font-heading text-[28px] leading-tight tracking-tight text-black/90">
                                Tato
                              </h3>
                              <p className="font-mono text-[14px] leading-relaxed text-black/80">
                                The bear is not just a mascot, he is an emotional anchor: a comfort object that helps children navigate emotions, transitions, and routines through recognition and attachment.
                              </p>
                              <ul className="list-disc space-y-2 pl-5 font-mono text-[13px] leading-relaxed text-black/78">
                                <li>Familiar presence across physical and digital spaces</li>
                                <li>Guide for interaction and communication</li>
                                <li>Symbolic extension of safety and care</li>
                                <li>Exists between character and tool, felt and trusted</li>
                              </ul>
                            </div>
                          </div>
                        </section>
                      </motion.div>
                    )}

                    {activeSection === "process" && (
                      <motion.div
                        key={`process-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6"
                      >
                        <section className="transition-colors duration-200">
                          {selectedProject.id === "casa" ? (
                            <>
                              <div className={`font-mono text-[13px] uppercase tracking-[0.22em] mb-5 ${selectedProject.id === "casa" ? "text-black/60" : "text-white/60"}`}>
                                PROCESS
                              </div>
                              {renderCasaProcessSections()}
                            </>
                          ) : (
                            <>
                              <div className="relative w-full overflow-hidden rounded-sm">
                                {selectedProject.iconSrc ? (
                                  <img
                                    src={selectedProject.iconSrc}
                                    alt=""
                                    aria-hidden="true"
                                    draggable={false}
                                    className="h-auto w-full object-contain transition-opacity duration-300 opacity-100"
                                  />
                                ) : null}
                              </div>
                              <div className="pt-5">
                                <div className={`font-mono text-[13px] uppercase tracking-[0.22em] ${selectedProject.id === "casa" ? "text-black/60" : "text-white/60"}`}>
                                  PROCESS
                                </div>
                                {activeDrawerCopy ? (
                                  selectedProjectId === "heinz" ? (
                                    <div className="mt-3 space-y-4">
                                      <p className={`whitespace-pre-line font-mono text-[14px] leading-relaxed tracking-[0.01em] ${selectedProject.id === "casa" ? "text-black/86" : "text-white/86"}`}>
                                        {activeDrawerCopy.process}
                                      </p>
                                      <a
                                        href={HEINZ_PROJECT_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-3 font-mono text-[13px] uppercase tracking-[0.18em] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                                      >
                                        View 3D bottle (Spline) →
                                      </a>
                                    </div>
                                  ) : (
                                    <p className={`mt-3 whitespace-pre-line font-mono text-[14px] leading-relaxed tracking-[0.01em] ${selectedProject.id === "casa" ? "text-black/86" : "text-white/86"}`}>
                                      {activeDrawerCopy.process}
                                    </p>
                                  )
                                ) : (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedProject.fields.map((field) => (
                                      <span
                                        key={`${selectedProject.id}-${field.k}`}
                                        className={`px-2 py-1 font-mono text-[13px] uppercase tracking-[0.16em] ${
                                          selectedProject.id === "casa"
                                            ? "border border-black/20 bg-black/5 text-black/72"
                                            : "border border-white/15 bg-white/[0.03] text-white/72"
                                        }`}
                                      >
                                        {field.k}: {field.v}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </section>
                      </motion.div>
                    )}

                    {activeSection === "outcome" && (
                      <motion.div
                        key={`outcome-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6"
                      >
                        <section className="transition-colors duration-200">
                          <div className={`font-mono text-[13px] uppercase tracking-[0.22em] ${selectedProject.id === "casa" ? "text-black/60" : "text-white/60"}`}>
                            OUTCOME
                          </div>
                          {selectedProject.id === "casa" && (
                            <div className="relative mt-4 h-[min(62svh,520px)] w-full min-h-[280px] overflow-hidden rounded-sm border border-black/10">
                              <iframe
                                src="/casa-urso-counter.html"
                                title="Casa do Urso Counter"
                                className="absolute inset-0 h-full w-full border-0"
                                sandbox="allow-scripts allow-same-origin"
                              />
                            </div>
                          )}
                          <p className={`mt-3 whitespace-pre-line font-mono text-[14px] leading-relaxed tracking-[0.01em] ${selectedProject.id === "casa" ? "text-black/84" : "text-white/84"}`}>
                            {activeDrawerCopy
                              ? activeDrawerCopy.outcome
                              : "A clear project narrative with stronger focus on mockups and key visuals, allowing navigation by chapter while preserving a cinematic flow inside the drawer."}
                          </p>
                          {selectedProject.id === "casa" && (
                            <div className="relative mt-6 w-full overflow-hidden rounded-sm border border-black/10">
                              <video
                                src="/webcasadourso.mp4"
                                className="h-[480px] w-full object-cover md:h-[520px]"
                                playsInline
                                autoPlay
                                loop
                                muted
                                title="Casa do Urso, Web video"
                              />
                            </div>
                          )}
                        </section>
                      </motion.div>
                    )}

                    {activeSection === "deliverables" && (
                      <motion.div
                        key={`deliverables-${selectedProject.id}`}
                        custom={slideDirection}
                        initial={{ y: slideDirection >= 0 ? "100%" : "-100%", opacity: 0.6 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection >= 0 ? "-100%" : "100%", opacity: 0.6 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10 overflow-y-auto no-scrollbar p-5 md:p-6"
                      >
                        <section className="transition-colors duration-200">
                          <div className="font-mono text-[13px] uppercase tracking-[0.22em] text-black/60">
                            DELIVERABLES
                          </div>
                          <p className="mt-3 max-w-prose font-mono text-[14px] leading-relaxed text-black/75">
                            Scope of what shipped as a unified system, naming, identity, character, space, and emotional tools.
                          </p>
                          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {CASA_DELIVERABLES.map((d) => (
                              <div
                                key={d.title}
                                className="rounded-md border border-black/10 bg-black/[0.03] p-4 transition-colors hover:bg-black/[0.06]"
                              >
                                <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
                                  {d.title}
                                </div>
                                <p className="mt-2 font-mono text-[13px] leading-relaxed text-black/82">{d.desc}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function ScrollObserver({ onProgress }: { onProgress: (p: number) => void }) {
  useEffect(() => {
    const calc = () => {
      const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
      onProgress(p);
    };
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [onProgress]);
  return null;
}

function SystemTitleBridge({
  show,
  progress,
  text,
}: {
  show: boolean;
  progress: number;
  text: string;
}) {
  const p = Math.max(0, Math.min(1, progress));
  const opacity = p < 0.15 ? 0 : Math.min(1, (p - 0.15) / 0.25);
  const y = 14 - p * 14;
  const scale = 1 - Math.min(0.25, p * 0.25);
  if (!show) return null;
  return (
    <div
      className="pointer-events-none fixed left-6 top-6 z-50 md:left-10 md:top-6"
      style={{ opacity, transform: `translate3d(0, ${y}px, 0) scale(${scale})` }}
    >
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.28em] text-white/55">
        SYSTEM TITLE
      </div>
      <div className="mt-1 font-heading text-[16px] font-semibold uppercase tracking-[0.12em] text-white">
        <span className="glitch" data-text={text}>
          {text}
        </span>
      </div>
    </div>
  );
}

