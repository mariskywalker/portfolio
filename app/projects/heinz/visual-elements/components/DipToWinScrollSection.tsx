"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, Draggable);

const cardConfigs = [
  {
    id: "hero",
    title: "Dip To Win Box",
    caption: "Primary campaign artifact",
    image: "/heinz-lab/dip-box-hero.png",
    variant: "heroBox",
    className:
      "left-1/2 top-1/2 z-50 w-[min(64vw,820px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(58vw,820px)]",
    mediaWrapClassName: "bg-transparent border-transparent",
    imageClassName: "h-auto w-full object-contain",
    from: { x: 0, y: 120, rotate: -2, scale: 0.9 },
    drift: { x: 0, y: -8, rotate: 0.3 },
    depth: -80,
    entryAt: 0.6,
  },
  {
    id: "headline",
    title: "Campaign Headline",
    caption: "HOW DIP CAN YOU GO?",
    image: "/Heinz/friesday.png",
    className:
      "right-[4%] top-[8%] w-[min(26vw,360px)] md:right-[6%] md:top-[10%] md:w-[min(24vw,360px)]",
    from: { x: 260, y: -160, rotate: 10, scale: 0.9 },
    drift: { x: 10, y: -8, rotate: 1.6 },
    depth: -180,
    entryAt: 7,
  },
  {
    id: "product",
    title: "Product Shot",
    caption: "Pack & bottle expression",
    image: "/Heinz/Heinz.png",
    className:
      "right-[8%] top-[56%] w-[min(44vw,620px)] md:right-[10%] md:top-[54%] md:w-[min(40vw,620px)]",
    from: { x: 300, y: 120, rotate: 7, scale: 0.86 },
    drift: { x: 6, y: -12, rotate: 1.2 },
    depth: -260,
    entryAt: 10,
  },
  {
    id: "packaging",
    title: "Packaging Detail",
    caption: "Dip kit and visual fragments",
    image: "/Heinz/diptowinbbq-preview.png",
    className:
      "left-[5%] bottom-[11%] z-10 w-[min(36vw,520px)] md:left-[7%] md:bottom-[10%] md:w-[min(34vw,520px)]",
    from: { x: -220, y: 260, rotate: -12, scale: 0.84 },
    drift: { x: -10, y: -10, rotate: -1.8 },
    depth: -220,
    entryAt: 8,
  },
  {
    id: "ooh",
    title: "OOH Fragment",
    caption: "Street presence and station takeovers",
    image: "/Heinz/pre-campaign.png",
    className:
      "left-[8%] top-[12%] w-[min(44vw,620px)] md:left-[10%] md:top-[14%] md:w-[min(40vw,620px)]",
    from: { x: -20, y: -240, rotate: -5, scale: 0.9 },
    drift: { x: 8, y: -14, rotate: 0.8 },
    depth: -140,
    entryAt: 12,
  },
  {
    id: "grid-phones",
    title: "Social Phones Grid",
    caption: "Campaign posts and mobile feed rhythm",
    image: "/heinz-lab/phones-grid.mp4",
    className:
      "left-[14%] top-[34%] w-[min(44vw,620px)] md:left-[16%] md:top-[34%] md:w-[min(40vw,620px)]",
    from: { x: -80, y: 120, rotate: -4, scale: 0.88 },
    drift: { x: 8, y: -6, rotate: 0.8 },
    depth: -180,
    entryAt: 10.8,
  },
  {
    id: "grid",
    title: "Social System",
    caption: "It has to be Heinz grid cadence",
    image: "/Heinz/chefes_.mp4",
    className:
      "left-[34%] bottom-[5%] w-[min(44vw,620px)] md:left-[36%] md:bottom-[5%] md:w-[min(40vw,620px)]",
    from: { x: 40, y: 220, rotate: 9, scale: 0.86 },
    drift: { x: 12, y: -6, rotate: 1.1 },
    depth: -200,
    entryAt: 14,
  },
];

type Props = { embed?: boolean };

export default function DipToWinScrollSection({ embed = false }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardsLayerRef = useRef<HTMLDivElement | null>(null);
  const stageBgRef = useRef<HTMLDivElement | null>(null);
  const fryCursorRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;
    let cleanupMouseMove: (() => void) | null = null;
    let cleanupInteractive: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const cards = cardConfigs
        .map((cfg) => ({
          cfg,
          el: sectionRef.current?.querySelector<HTMLElement>(
            `[data-dip-card="${cfg.id}"]`,
          ),
        }))
        .filter((item): item is { cfg: (typeof cardConfigs)[number]; el: HTMLElement } => !!item.el);
      const heroCard = cards.find((item) => item.cfg.id === "hero");
      const supportCards = cards.filter((item) => item.cfg.id !== "hero");

      gsap.set(cardsLayerRef.current, { transformPerspective: 1500 });
      gsap.set(stageBgRef.current, { scale: 1, y: 0 });
      gsap.set(fryCursorRef.current, {
        autoAlpha: embed ? 1 : 0,
        xPercent: -50,
        yPercent: -50,
        scale: embed ? 1 : 0.84,
        rotate: embed ? 0 : -8,
      });

      const pinNode = pinRef.current;
      const fryNode = fryCursorRef.current;
      const xTo = fryNode
        ? gsap.quickTo(fryNode, "x", { duration: 0.18, ease: "power3.out" })
        : null;
      const yTo = fryNode
        ? gsap.quickTo(fryNode, "y", { duration: 0.18, ease: "power3.out" })
        : null;

      const handleMouseMove = (event: MouseEvent) => {
        if (!pinNode || !xTo || !yTo) return;
        const rect = pinNode.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
      };

      pinNode?.addEventListener("mousemove", handleMouseMove);
      if (pinNode && xTo && yTo) {
        const rect = pinNode.getBoundingClientRect();
        xTo(rect.width * 0.5);
        yTo(rect.height * 0.58);
      }
      cleanupMouseMove = () => {
        pinNode?.removeEventListener("mousemove", handleMouseMove);
      };

      const interactiveEls = gsap.utils.toArray<HTMLElement>(
        '[data-dip-interactive="true"]',
      );
      let activeTopZ = 40;
      const clickHandlers: Array<{
        element: HTMLElement;
        handler: EventListener;
      }> = [];

      const draggables = Draggable.create(interactiveEls, {
        type: "x,y",
        bounds: pinNode || undefined,
        dragClickables: true,
        onPress() {
          const target = this.target as HTMLElement;
          target.style.cursor = "grabbing";
          activeTopZ += 1;
          gsap.set(target, { zIndex: activeTopZ });
        },
        onRelease() {
          const target = this.target as HTMLElement;
          target.style.cursor = "grab";
        },
      });

      interactiveEls.forEach((element) => {
        element.style.cursor = "grab";
        const handler = () => {
          gsap.fromTo(
            element,
            { scale: 1 },
            {
              scale: 1.06,
              duration: 0.16,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
              overwrite: "auto",
            },
          );
        };
        element.addEventListener("click", handler);
        clickHandlers.push({ element, handler });
      });

      cleanupInteractive = () => {
        draggables.forEach((item) => item.kill());
        clickHandlers.forEach(({ element, handler }) => {
          element.removeEventListener("click", handler);
        });
      };

      cards.forEach(({ el, cfg }) => {
        if (embed) {
          gsap.set(el, {
            autoAlpha: 1,
            x: cfg.drift.x,
            y: cfg.drift.y,
            rotate: cfg.drift.rotate,
            scale: 1,
            z: 0,
            filter: "blur(0px)",
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          });
          return;
        }
        if (cfg.id === "hero") {
          gsap.set(el, {
            autoAlpha: 0,
            x: 0,
            y: 20,
            rotate: -1,
            scale: 0.96,
            z: -30,
            filter: "blur(2px)",
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          });
          return;
        }

        gsap.set(el, {
          autoAlpha: 0,
          x: cfg.from.x,
          y: cfg.from.y,
          rotate: cfg.from.rotate,
          scale: cfg.from.scale,
          z: cfg.depth,
          filter: "blur(5px)",
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        });
      });

      if (embed) {
        gsap.set(stageBgRef.current, { scale: 1.07, y: -24 });
        gsap.set(cardsLayerRef.current, { xPercent: 0, yPercent: 0 });
      }

      if (embed) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: pinRef.current,
          pinType: "fixed",
          pinReparent: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: chapter intro
      if (heroCard) {
        const { el, cfg } = heroCard;
        const heroOvershootY = -14;
        const heroOvershootScale = 1.02;
        const heroOvershootRotate = -0.35;

        tl.to(
          el,
          {
            autoAlpha: 1,
            x: 0,
            y: heroOvershootY,
            z: -16,
            rotate: heroOvershootRotate,
            scale: heroOvershootScale,
            filter: "blur(0px)",
            duration: 4.5,
            ease: "power3.out",
          },
          9.5,
        );
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            scale: 1,
            duration: 4,
            ease: "back.out(1.08)",
          },
          11.8,
        );
      }
      tl.to(
        fryCursorRef.current,
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 3.5, ease: "power2.out" },
        10.2,
      );

      // Phase 2: flying card reveal (staggered choreography)
      tl.to(
        stageBgRef.current,
        { scale: 1.05, y: -14, duration: 22, ease: "power2.inOut" },
        16,
      );
      tl.to(
        cardsLayerRef.current,
        { xPercent: -1.2, yPercent: -1.2, duration: 22, ease: "power2.inOut" },
        16,
      );

      supportCards.forEach(({ el, cfg }, idx) => {
        const overshootX = -cfg.from.x * 0.08;
        const overshootY = -cfg.from.y * 0.08;
        const overshootRotate = -cfg.from.rotate * 0.1;

        const delayedEntry = cfg.entryAt + 16;
        const settleStagger = idx * 0.12;
        tl.to(
          el,
          {
            autoAlpha: 1,
            x: overshootX,
            y: overshootY,
            z: -20,
            rotate: overshootRotate,
            scale: 1.035,
            filter: "blur(0px)",
            duration: 5,
            ease: "power3.out",
          },
          delayedEntry,
        );
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            scale: 1,
            duration: 4.5,
            ease: "back.out(1.08)",
          },
          delayedEntry + 4.5 + settleStagger,
        );
      });

      // Phase 3: composition lock
      tl.to(cardsLayerRef.current, { xPercent: 0, yPercent: 0, duration: 5, ease: "power2.inOut" }, 36);

      // Phase 4: living scene drift (overlaps slightly with lock for smoother transition)
      tl.to(stageBgRef.current, { scale: 1.07, y: -24, duration: 10, ease: "power2.inOut" }, 42);
      cards.forEach(({ el, cfg }) => {
        tl.to(
          el,
          {
            x: cfg.drift.x,
            y: cfg.drift.y,
            rotate: cfg.drift.rotate,
            duration: 10,
            ease: "power2.inOut",
          },
          42,
        );
      });

    }, sectionRef);

    return () => {
      cleanupMouseMove?.();
      cleanupInteractive?.();
      ctx.revert();
    };
  }, [embed]);

  return (
    <section ref={sectionRef} className={`relative ${embed ? "h-screen min-h-[600px]" : "h-[120vh]"} ${embed ? "overflow-visible" : ""}`}>
      <div
        ref={pinRef}
        style={{ top: 0, left: 0 }}
        className={`relative h-screen bg-transparent ${embed ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div
          ref={stageBgRef}
          className="pointer-events-none absolute inset-0 overflow-hidden bg-transparent"
        >
          <div className="absolute inset-0 bg-[#c8102e]" />
        </div>

        <div
          ref={cardsLayerRef}
          className={`absolute -top-[31px] bottom-0 z-20 [perspective:1500px] [transform-style:preserve-3d] ${
            embed ? "left-0 right-0 origin-center scale-[1.02]" : "left-[14px] right-0"
          }`}
        >
          <img
            src="/Heinz/capsule.png"
            alt="Dip capsule"
            draggable={false}
            className="pointer-events-none absolute bottom-[14%] left-[28%] z-30 w-[166px] select-none object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.28)]"
          />
          <img
            ref={fryCursorRef}
            src="/Heinz/batata.svg"
            alt="Fry cursor"
            draggable={false}
            className="pointer-events-none absolute left-0 top-0 z-40 w-[54px] select-none object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)] md:w-[68px]"
          />

          {cardConfigs.map((card) => {
            const heroCompact = embed && card.id === "hero";
            const photoInFront = embed && card.id !== "hero";
            const className = heroCompact
              ? "left-1/2 top-1/2 z-50 w-[min(58vw,620px)] -translate-x-1/2 -translate-y-1/2"
              : card.className;
            const zClass = photoInFront ? "z-10" : "";
            return (
            <article
              key={card.id}
              data-dip-card={card.id}
              data-dip-interactive="true"
              className={`absolute ${className} ${zClass} cursor-grab bg-transparent p-0 shadow-none backdrop-blur-0 [transform-style:preserve-3d] active:cursor-grabbing`}
            >
              <div
                className={`overflow-hidden ${card.mediaWrapClassName ?? ""}`}
              >
                {/\.(mp4|webm|mov)(\?|$)/i.test(card.image) ? (
                  <video
                    src={card.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full select-none ${
                      card.imageClassName ?? "h-auto object-contain"
                    }`}
                  />
                ) : (
                  <img
                    src={card.image}
                    alt={card.title}
                    draggable={false}
                    className={`w-full select-none ${
                      card.imageClassName ?? "h-auto object-contain"
                    }`}
                  />
                )}
              </div>
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
}
