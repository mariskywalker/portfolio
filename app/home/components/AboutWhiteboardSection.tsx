"use client";
import BentoGrid from "./BentoGrid";

const SERVICES = [
  {
    title: "Art Direction and Visual Storytelling",
    text: "For brands that want to speak with soul.",
  },
  {
    title: "Motion Design",
    text: "From playful microinteractions to bold campaign videos.",
  },
  {
    title: "Brand and Digital Design",
    text: "Visual systems that are strategic and expressive.",
  },
];

const FLOATING_NOTES: Array<{
  text: string;
  rotate: string;
  top: string;
  left?: string;
  right?: string;
  crystal?: boolean;
}> = [
  {
    text: "Coffee, fashion and magic",
    rotate: "5deg",
    top: "66%",
    right: "8%",
    crystal: true,
  },
];

export function AboutWhiteboardSection() {
  return (
    <section
      id="playground-section"
      className="relative w-full overflow-x-hidden border-t border-black/10 bg-[#f4f4f4] pb-16 text-black lg:min-h-[3000px] lg:pb-0"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "max(80px, min(22vw, 140px)) max(80px, min(22vw, 140px))",
        }}
      />

      <div className="flex flex-col gap-12 px-[4%] pt-8 lg:contents lg:px-0 lg:pt-0">
        <div className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 justify-between lg:absolute lg:left-0 lg:right-0 lg:top-[72px] lg:mx-0 lg:w-full lg:max-w-none lg:justify-between lg:px-[4%]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">About me</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">My playground</p>
        </div>

        <article className="relative z-10 mx-auto w-full max-w-6xl md:w-[62%] lg:absolute lg:left-[4%] lg:top-[170px] lg:mx-0 lg:w-[56%]">
          <h2 className="max-w-5xl text-3xl font-semibold leading-[0.98] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            I am Mari, creative director, illustrator, and motion tinkerer.
          </h2>
          <div className="mt-8 max-w-4xl lg:mt-10">
            <div className="space-y-0 border-y border-black/35">
              <div className="border-b border-black/25 py-4">
                <div>
                  <p className="font-mono text-lg font-semibold uppercase tracking-[0.05em] text-black/92 sm:text-[20px] md:text-[22px]">
                    UAL /{" "}
                    <span
                      className="decoration-black/25 underline decoration-dotted underline-offset-4"
                      data-cursor-image="/about/lcc-graduation.png"
                    >
                      LCC
                    </span>{" "}
                    ↗
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/45 sm:text-[12px] md:text-[13px]">
                    University of the Arts London, London College of Communication
                  </p>
                </div>
              </div>

              <div className="border-b border-black/25 py-4">
                <div>
                  <p className="font-mono text-lg font-semibold uppercase tracking-[0.05em] text-black/92 sm:text-[20px] md:text-[22px]">
                    UH ↗
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/45 sm:text-[12px] md:text-[13px]">
                    University of Hertfordshire, Master&apos;s in Model Design
                  </p>
                </div>
              </div>

              <div className="py-4">
                <div>
                  <p className="font-mono text-lg font-semibold uppercase tracking-[0.05em] text-black/92 sm:text-[20px] md:text-[22px]">
                    PUC ↗
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/45 sm:text-[12px] md:text-[13px]">
                    Postgrad in Philosophy, History and Sociology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="relative z-10 mx-auto w-full max-w-xl lg:absolute lg:left-[62%] lg:top-[210px] lg:mx-0 lg:w-[34%] lg:max-w-none">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">What I do</p>
          <div className="mt-4 inline-block border border-black/25 bg-[#fff8d8] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/85 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            I can tattoo
          </div>
          <div className="mt-8 space-y-6 opacity-80">
            {SERVICES.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">{item.title}</h3>
                <p className="mt-1 text-sm text-black/70">{item.text}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="relative z-30 mx-auto flex w-full max-w-6xl flex-row flex-wrap items-end justify-center gap-4 sm:gap-5 lg:absolute lg:left-[4%] lg:top-[760px] lg:mx-0 lg:w-auto lg:max-w-none lg:justify-start">
          <figure className="relative w-[min(42vw,180px)] shrink-0 rotate-[-3deg] border border-black/20 bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.14)] sm:w-[200px] lg:w-[220px]">
            <span className="pin-wiggle absolute top-0 right-0 text-[4rem] lg:text-[7.5rem]" aria-hidden>
              📌
            </span>
            <img
              src="/about/DSCF4013.JPG"
              alt="Black and white candid portrait"
              className="aspect-square w-full object-cover"
              draggable={false}
            />
            <figcaption className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-black/55">
              Late night study
            </figcaption>
          </figure>

          <figure className="relative w-[min(46vw,200px)] shrink-0 rotate-[2deg] border border-black/20 bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.14)] sm:w-[240px] lg:w-[260px]">
            <span
              className="pin-wiggle absolute top-0 right-0 text-[4rem] lg:text-[7.5rem]"
              style={{ filter: "hue-rotate(118deg) saturate(1.6)", animationDelay: "0.35s" }}
              aria-hidden
            >
              📌
            </span>
            <img
              src="/about/nyxc.jpg"
              alt="Street coffee shop scene"
              className="aspect-square w-full object-cover"
              draggable={false}
            />
            <figcaption className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-black/55">
              Coffee + city
            </figcaption>
          </figure>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl lg:absolute lg:left-[4%] lg:top-[1120px] lg:mx-0 lg:w-[92%] lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">Whiteboard energy</p>
              <p className="mt-3 text-2xl font-semibold leading-[1.05] tracking-tight sm:text-3xl md:text-4xl lg:text-[65px] lg:leading-tight">
                You have the same amount of hours in a day as{" "}
                <span className="inline-flex items-center gap-2 rounded-xl border border-black/35 px-2 py-1">
                  Beyoncé
                  <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-black/25 bg-white sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                    <img
                      src="/about/beyonce-circle.png"
                      alt="Beyonce illustration"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </span>
                </span>
                .
              </p>
              <div className="mt-10 flex max-w-[620px] flex-wrap gap-4 sm:mt-16 lg:mt-28 lg:gap-5">
                <figure className="relative w-full rotate-[1.5deg] border border-black/20 bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.14)] md:w-[calc(50%-0.625rem)]">
                  <span
                    className="pin-wiggle absolute top-0 right-0 text-[4rem] lg:text-[6rem]"
                    style={{ filter: "hue-rotate(205deg) saturate(2)", animationDelay: "0.25s" }}
                    aria-hidden
                  >
                    📌
                  </span>
                  <img
                    src="/about/dog-cool-brasil.png"
                    alt="Dog composition with Brazil flag"
                    className="h-[140px] w-full object-cover sm:h-[160px] lg:h-[170px]"
                    draggable={false}
                  />
                </figure>
              </div>
              <span
                className="mt-4 block text-center text-[clamp(4.5rem,18vw,12.5rem)] leading-none -rotate-12 lg:pointer-events-none lg:absolute lg:left-[min(360px,50vw)] lg:top-[560px] lg:mt-0 lg:block lg:text-[200px]"
                aria-hidden
              >
                🦄
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-2xl lg:absolute lg:left-[50%] lg:top-[680px] lg:mx-0 lg:w-[46%] lg:max-w-none">
          <div className="relative mb-8 inline-block w-full max-w-full border-[3px] border-black bg-white p-3 shadow-[0_18px_80px_rgba(0,0,0,0.12)] sm:mb-10 sm:p-4 lg:w-fit">
            <button
              type="button"
              aria-label="Close media preview"
              className="pointer-events-none absolute -right-[3px] -top-[3px] grid h-10 w-10 place-items-center border-[3px] border-black bg-white text-3xl leading-none text-black sm:h-12 sm:w-12 sm:text-4xl"
            >
              ×
            </button>
            <div className="w-full max-w-full overflow-hidden border border-black/25 bg-white lg:w-fit">
              <img
                src="/about/pixel-designer.png"
                alt="Pixel art character, designer portrait"
                className="mx-auto block h-auto max-h-[min(55vh,420px)] w-auto max-w-full object-contain object-center sm:max-h-[min(65vh,520px)]"
                draggable={false}
              />
            </div>
          </div>
          <BentoGrid />
          <div className="mt-10 flex flex-col gap-y-2 text-3xl font-semibold leading-[0.96] tracking-[-0.01em] sm:mt-14 sm:gap-y-3 sm:text-4xl md:mt-20 md:text-5xl lg:mt-[22rem] lg:gap-y-3 lg:text-[72px]">
            <span>🌱 curious</span>
            <span>🧿 greek + brazilian</span>
            <span>🎬 motion lover</span>
            <span>☕ coffee powered</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl lg:absolute lg:left-[4%] lg:top-[2000px] lg:mx-0 lg:w-[92%] lg:max-w-none">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">My method</p>
          <div className="relative mt-6 inline-block w-full max-w-[720px] border-[3px] border-black bg-white p-3 shadow-[0_18px_80px_rgba(0,0,0,0.12)] sm:mt-8 sm:p-4 lg:mt-8">
            <button
              type="button"
              aria-label="Close media preview"
              className="pointer-events-none absolute -right-[3px] -top-[3px] grid h-10 w-10 place-items-center border-[3px] border-black bg-white text-3xl leading-none text-black sm:h-12 sm:w-12 sm:text-4xl"
            >
              ×
            </button>
            <div className="overflow-hidden border border-black/25 bg-black">
              <video
                src="/about/playground-lab.mp4"
                className="h-auto w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          <p className="mt-8 text-2xl font-semibold leading-[1.04] sm:text-3xl md:text-5xl">
            I am not your average designer.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/75 sm:mt-7">
            I move between strategy, storytelling, and execution. The goal is always the same: create
            work that challenges the ordinary and feels deeply human.
          </p>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl pb-4 lg:absolute lg:bottom-20 lg:left-[4%] lg:mx-0 lg:w-[92%] lg:max-w-none lg:pb-0">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <a
            href="mailto:d.oliveiramariana@gmail.com?subject=Hello"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-black/35 px-4 py-3 text-xl font-semibold tracking-tight text-black transition-colors hover:bg-black/[0.04] active:bg-black/[0.06] sm:text-2xl md:px-2 md:py-1 md:text-4xl"
          >
            Want to chat?
          </a>
          <a
            href="https://www.linkedin.com/in/marideoliveira/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-black/35 px-4 py-3 text-xl font-semibold tracking-tight text-black transition-colors hover:bg-black/[0.04] active:bg-black/[0.06] sm:text-2xl md:px-2 md:py-1 md:text-4xl"
          >
            Linkedin <span className="ml-2 text-[1.35em] leading-none">🔗</span>
          </a>
          </div>
        </div>
      </div>

      {FLOATING_NOTES.map((note) => (
        <div
          key={note.text}
          className="pointer-events-none absolute z-30 hidden xl:flex xl:flex-row xl:items-center xl:gap-4"
          style={{
            top: note.top,
            left: note.left,
            right: note.right,
          }}
        >
          {note.crystal ? (
            <span
              className="shrink-0 text-[120px] leading-none"
              style={{ transform: "rotate(-6deg)" }}
              aria-hidden
            >
              🔮
            </span>
          ) : null}
          <div
            className="border border-black/25 bg-[#fff8d8] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/85 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            style={{ transform: `rotate(${note.rotate})` }}
          >
            {note.text}
          </div>
        </div>
      ))}
    </section>
  );
}
