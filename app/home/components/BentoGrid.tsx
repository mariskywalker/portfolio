"use client";

import { useState } from "react";
import { Sparkles, Palette, Layers, Megaphone, Briefcase } from "lucide-react";

const flags: Record<string, string> = {
  EN: "https://flagcdn.com/w320/gb.png",
  GR: "https://flagcdn.com/w320/gr.png",
  PT: "https://flagcdn.com/w320/br.png",
  ES: "https://flagcdn.com/w320/es.png",
};

const FlagToggle = ({ code, flag, defaultOn = false }: { code: string; flag: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className="flex touch-manipulation items-center gap-2 sm:gap-3"
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 ${
          on
            ? "border border-border/40 bg-card text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]"
            : "bg-bento/60 text-muted-foreground"
        }`}
      >
        {code}
      </span>
      <div
        className={`relative h-12 w-28 cursor-pointer overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          on
            ? "shadow-[0_4px_16px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08)]"
            : "border border-border/50 bg-bento shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]"
        }`}
      >
        <img
          src={flag}
          alt={code}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-1.5 z-10 h-9 w-9 rounded-full border border-white/50 bg-gradient-to-b from-white/95 to-white/75 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_2px_10px_rgba(0,0,0,0.15),0_0px_0px_1px_rgba(255,255,255,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] ${on ? "left-[4.25rem]" : "left-1.5"}`}
        >
          <div className="absolute inset-x-1.5 top-1 h-3.5 rounded-full bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </button>
  );
};

const LanguagesWidget = () => (
  <div className="bento-card col-span-2 flex flex-col gap-5 p-6 md:p-8">
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      {Object.entries(flags).map(([code, flag], i) => (
        <FlagToggle key={code} code={code} flag={flag} defaultOn={i < 2} />
      ))}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Languages I speak</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">Multilingual</p>
    </div>
  </div>
);

const ToolsWidget = () => {
  const tools = [
    { icon: Sparkles, label: "Vibe Coding" },
    { icon: Layers, label: "Design System" },
    { icon: Palette, label: "Brand Design" },
    { icon: Megaphone, label: "Advertising" },
    { icon: Briefcase, label: "Product" },
  ];
  return (
    <div className="bento-card col-span-2 p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tools & Skills</p>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <div
            key={tool.label}
            className="group flex items-center gap-2 rounded-xl bg-bento px-4 py-2.5 transition-colors hover:bg-bento-accent-soft"
          >
            <tool.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-bento-accent" />
            <span className="text-sm font-medium text-foreground">{tool.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BentoGrid() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-0 py-2 sm:p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <LanguagesWidget />
          <ToolsWidget />
        </div>
    </div>
  );
}

