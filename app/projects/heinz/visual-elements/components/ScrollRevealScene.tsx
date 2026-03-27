"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable, ScrollTrigger } from "gsap/all";

import SplineStage from "./SplineStage";

gsap.registerPlugin(ScrollTrigger, Draggable);

type Props = { embed?: boolean };

export default function ScrollRevealScene({ embed = false }: Props) {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const introTitleRef = useRef<HTMLHeadingElement | null>(null);
  const introSubRef = useRef<HTMLParagraphElement | null>(null);
  const redLayerRef = useRef<HTMLDivElement | null>(null);
  const splineStageRef = useRef<HTMLDivElement | null>(null);
  const blackVeilRef = useRef<HTMLDivElement | null>(null);
  const splashCursorRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !pinRef.current) return;
    let cleanupMouseMove: (() => void) | null = null;
    let cleanupInteractive: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const labels = gsap.utils.toArray<HTMLElement>(".heinz-label");
      const assets = gsap.utils.toArray<HTMLElement>(".heinz-float");

      gsap.set(redLayerRef.current, { yPercent: 112 });
      gsap.set(splineStageRef.current, {
        y: embed ? 0 : 120,
      });
      gsap.set(blackVeilRef.current, { autoAlpha: 1 });
      gsap.set(labels, {
        autoAlpha: 0,
        y: 54,
        scale: 0.92,
      });
      gsap.set(assets, {
        autoAlpha: 0,
        y: 120,
        scale: 0.86,
      });
      gsap.set(".heinz-float-a", { x: -90, rotate: -12 });
      gsap.set(".heinz-float-b", { x: 80, rotate: 10 });
      gsap.set(".heinz-float-c", { x: -70, rotate: -8 });
      gsap.set(".heinz-float-d", { x: 70, rotate: 14 });
      gsap.set(".heinz-float-e", { x: -120, rotate: -16 });
      gsap.set(".heinz-float-f", { x: 108, rotate: 14 });
      gsap.set(".heinz-float-g", { x: -95, rotate: -12 });
      gsap.set(".heinz-float-h", { x: 84, rotate: 11 });
      gsap.set(".heinz-float-i", { x: -82, rotate: -10 });
      gsap.set(splashCursorRef.current, {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 0.88,
        rotate: -6,
      });

      const pinNode = pinRef.current;
      const splashNode = splashCursorRef.current;
      const xTo = splashNode
        ? gsap.quickTo(splashNode, "x", { duration: 0.18, ease: "power3.out" })
        : null;
      const yTo = splashNode
        ? gsap.quickTo(splashNode, "y", { duration: 0.18, ease: "power3.out" })
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
        xTo(rect.width * 0.52);
        yTo(rect.height * 0.62);
      }
      cleanupMouseMove = () => {
        pinNode?.removeEventListener("mousemove", handleMouseMove);
      };

      const interactiveEls = gsap.utils.toArray<HTMLElement>(".heinz-interactive");
      const bounceEls = gsap.utils.toArray<HTMLElement>(".heinz-bounce");
      let activeTopZ = 50;
      const clickHandlers: Array<{ element: HTMLElement; handler: EventListener }> = [];
      const bounceTweens = bounceEls.map((element, idx) =>
        gsap.to(element, {
          y: -14,
          duration: 2.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0,
        }),
      );

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
              scale: 1.07,
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
        bounceTweens.forEach((item) => item.kill());
        clickHandlers.forEach(({ element, handler }) => {
          element.removeEventListener("click", handler);
        });
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: pinRef.current,
          pinType: "fixed",
          pinReparent: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: intro hold
      timeline.to({}, { duration: 20 });

      // Phase 2: reveal tied to scroll progress
      timeline.to(
        redLayerRef.current,
        { yPercent: 0, duration: 45 },
        20,
      );
      timeline.to(
        splineStageRef.current,
        {
          y: embed ? -20 : -40,
          duration: 45,
        },
        20,
      );
      timeline.to(
        introTitleRef.current,
        { autoAlpha: 0, y: -56, duration: 40 },
        22,
      );
      timeline.to(
        introSubRef.current,
        { autoAlpha: 0, y: -40, duration: 35 },
        24,
      );
      timeline.to(
        blackVeilRef.current,
        { autoAlpha: 0, duration: 45 },
        20,
      );
      timeline.to(
        splashCursorRef.current,
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 8 },
        44,
      );

      // Phase 3: floating elements return, scrubbed and reversible
      timeline.to(
        labels,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 12,
          stagger: 2.2,
        },
        56,
      );
      timeline.to(
        ".heinz-float-a",
        {
          autoAlpha: 1,
          x: 0,
          y: 26,
          rotate: 0,
          scale: 1.02,
          duration: 12,
        },
        60,
      );
      timeline.to(
        ".heinz-float-b",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 12,
        },
        64,
      );
      timeline.to(
        ".heinz-float-c",
        {
          autoAlpha: 0,
          x: -70,
          y: 120,
          rotate: -8,
          scale: 0.86,
          duration: 12,
        },
        68,
      );
      timeline.to(
        ".heinz-float-d",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1.03,
          duration: 12,
        },
        72,
      );
      timeline.to(
        ".heinz-float-e",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1.02,
          duration: 12,
        },
        62,
      );
      timeline.to(
        ".heinz-float-f",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 12,
        },
        66,
      );
      timeline.to(
        ".heinz-float-g",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.98,
          duration: 12,
        },
        70,
      );
      timeline.to(
        ".heinz-float-h",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 12,
        },
        74,
      );
      timeline.to(
        ".heinz-float-i",
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 12,
        },
        76,
      );

      // Phase 4: settle + living drift
      timeline.to(
        splineStageRef.current,
        {
          y: embed ? -30 : -54,
          duration: 15,
        },
        85,
      );
      timeline.to(
        ".heinz-float-a",
        { x: -18, y: 6, rotate: -1.4, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-b",
        { x: 16, y: -14, rotate: 1.2, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-c",
        { x: -70, y: 120, rotate: -8, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-d",
        { x: 12, y: -10, rotate: 1.1, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-e",
        { x: -14, y: -10, rotate: -1.3, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-f",
        { x: 14, y: -11, rotate: 1.1, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-g",
        { x: -11, y: -8, rotate: -1, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-h",
        { x: 10, y: -9, rotate: 1, duration: 15 },
        85,
      );
      timeline.to(
        ".heinz-float-i",
        { x: -10, y: -8, rotate: -1, duration: 15 },
        85,
      );
    }, containerRef);

    return () => {
      cleanupMouseMove?.();
      cleanupInteractive?.();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className={`relative ${embed ? "h-screen" : "h-[320vh]"}`}>
      <div ref={pinRef} className="relative h-screen overflow-hidden bg-transparent">

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="px-6 text-center">
            <h1
              ref={introTitleRef}
              className="text-[18vw] font-black uppercase leading-[0.86] tracking-tight text-white md:text-[124px]"
            >
              Heinz Lab
            </h1>
            <p
              ref={introSubRef}
              className="mt-4 text-[13px] font-bold uppercase tracking-[0.24em] text-white/80"
            >
              Scroll to explore
            </p>
          </div>
        </div>

        <div
          ref={redLayerRef}
          className="absolute inset-0 z-10 origin-bottom overflow-hidden bg-transparent"
        >
          <img
            ref={splashCursorRef}
            src="/heinz-lab/splash.png"
            alt="Splash cursor"
            draggable={false}
            className="pointer-events-none absolute left-0 top-0 z-30 w-[76px] select-none object-contain md:w-[94px]"
          />

          <div
            ref={splineStageRef}
            className="spline-stage absolute inset-0"
          >
            <SplineStage />
          </div>

          <div className="pointer-events-none absolute -top-[31px] bottom-0 left-[14px] right-0 z-20">
            <div className="heinz-label heinz-bounce pointer-events-none absolute left-1/2 top-[12%] z-30 -translate-x-1/2 rounded-full border border-white/35 bg-white/15 px-4 py-2.5 text-[14px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md md:text-[15px]">
              <span className="block">Heinz Lab</span>
            </div>
            <div className="heinz-label heinz-bounce pointer-events-none absolute left-[8%] top-[38%] -translate-x-0 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md md:text-[13px]">
              <span className="block">Interactive interfaces</span>
            </div>
            <div className="heinz-label heinz-bounce pointer-events-none absolute right-[8%] top-[36%] translate-x-0 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md md:text-[13px]">
              <span className="block">Spatial Storytelling</span>
            </div>
            <div className="heinz-label heinz-bounce pointer-events-none absolute bottom-[18%] left-1/2 -translate-x-1/2 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md md:text-[13px]">
              <span className="block">Web responsive</span>
            </div>

            <div className="heinz-float heinz-float-a heinz-interactive pointer-events-auto absolute left-[4%] top-[12%]">
              <img
                src="/Heinz/tomato57.png"
                alt="Heinz 57 varieties tomato"
                draggable={false}
                className="heinz-bounce w-[228px] select-none object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.34)]"
              />
            </div>
            <div className="heinz-float heinz-float-b heinz-interactive pointer-events-auto absolute bottom-[10%] right-[11%]">
              <img
                src="/heinz-lab/tomato.png"
                alt="Tomato slice"
                draggable={false}
                className="heinz-bounce w-[162px] select-none object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.34)]"
              />
            </div>
            <div className="heinz-float heinz-float-c heinz-interactive pointer-events-auto absolute bottom-[12%] left-[16%]">
              <img
                src="/heinz-lab/splash.png"
                alt="Ketchup splash"
                draggable={false}
                className="heinz-bounce w-[286px] select-none object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.34)]"
              />
            </div>
            <div className="heinz-float heinz-float-d heinz-interactive pointer-events-auto absolute right-[14%] top-[40%]">
              <img
                src="/heinz-lab/sachet.png"
                alt="Ketchup sachet"
                draggable={false}
                className="heinz-bounce w-[218px] select-none object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.34)]"
              />
            </div>

            <div className="heinz-float heinz-float-e heinz-interactive pointer-events-auto absolute left-[18%] top-[8%]">
              <img
                src="/Heinz/leaf-a.png"
                alt="Leaf asset"
                draggable={false}
                className="heinz-bounce w-[144px] select-none object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)]"
              />
            </div>
            <div className="heinz-float heinz-float-f heinz-interactive pointer-events-auto absolute right-[18%] top-[14%]">
              <img
                src="/Heinz/leaf-b.png"
                alt="Leaf accent"
                draggable={false}
                className="heinz-bounce w-[138px] select-none object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)]"
              />
            </div>
            <div className="heinz-float heinz-float-g heinz-interactive pointer-events-auto absolute bottom-[18%] right-[28%]">
              <img
                src="/Heinz/leaf-c.png"
                alt="Leaf detail"
                draggable={false}
                className="heinz-bounce w-[122px] select-none object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)]"
              />
            </div>
            <div className="heinz-float heinz-float-h heinz-interactive pointer-events-auto absolute bottom-[14%] left-[28%]">
              <img
                src="/Heinz/capsule.png"
                alt="Dip capsule"
                draggable={false}
                className="heinz-bounce w-[166px] select-none object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.28)]"
              />
            </div>
            <div className="heinz-float heinz-float-i heinz-interactive pointer-events-auto absolute left-[6%] top-[46%]">
              <img
                src="/Heinz/tomate-aberto.png"
                alt="Tomato slice detail"
                draggable={false}
                className="heinz-bounce w-[152px] select-none object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.28)]"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/80 md:text-[13px]">
            Mari Pappou - Client: Kraft Heinz Year: 2023
          </p>
        </div>

        <div ref={blackVeilRef} className="pointer-events-none absolute inset-0 z-20 bg-[#020202]" />
      </div>
    </section>
  );
}
