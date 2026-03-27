"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const breakdownCards = [
  {
    label: "Overview",
    title: "Dip To Win at a glance",
    body: "Dip To Win reframed Heinz dipping culture as a playful campaign world, anchored in a distinctive mark built to feel tactile, social, and instantly recognizable across formats.",
  },
  {
    label: "Context",
    title: "What the campaign needed to solve",
    body: "For International Fries Day, the system had to create attention fast, connect digital and physical touchpoints, and give partner locations a clear, ownable campaign expression.",
  },
  {
    label: "Creative Idea",
    title: "A logo meant to be dipped",
    body: "The central thought was simple and memorable: a Heinz logo sculpted in ketchup and treated as an interactive symbol, inviting people to choose their dipper identity.",
  },
  {
    label: "Visual System",
    title: "One language across every asset",
    body: "Bold Heinz red, high-contrast typography, close crop product moments, and modular campaign headlines formed a consistent visual rhythm from OOH to social and promo layouts.",
  },
  {
    label: "Experience",
    title: "How audiences engaged",
    body: "The campaign mixed tactile product storytelling with playful prompts, turning everyday dipping behavior into a participatory narrative across station takeovers, posters, and digital moments.",
  },
  {
    label: "Outcome",
    title: "Key takeaway",
    body: "Dip To Win shows how a focused brand mechanic can scale into a coherent storytelling system, balancing strong visual impact with simple, repeatable messaging.",
  },
];

export default function ProjectBreakdownSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".breakdown-intro",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (cardsGridRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>(".breakdown-card", cardsGridRef.current);
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: "top 76%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 px-5 pb-24 pt-20 md:px-8 md:pb-32">
      <div className="mx-auto w-full max-w-6xl">
        <div className="breakdown-intro mb-10 md:mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-white/70 md:text-[13px]">
            Campaign Logic
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
            Inside Dip To Win
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-[15px]">
            A structured look at the concept, context, and design decisions behind the project.
          </p>
        </div>

        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3"
        >
          {breakdownCards.map((card) => (
            <article
              key={card.title}
              className="breakdown-card rounded-2xl border border-white/20 bg-white/[0.06] p-5 backdrop-blur-[2px] md:p-6"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/65">
                {card.label}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/82 md:text-[15px]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
