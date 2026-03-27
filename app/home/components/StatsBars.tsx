"use client";

type Stat = {
  label: string;
  value: number; // 0..10
};

const DEFAULT_STATS: Stat[] = [
  { label: "STRENGTH", value: 4 },
  { label: "INTELLECT", value: 8 },
  { label: "AGILITY", value: 6 },
  { label: "SPIRIT", value: 7 },
  { label: "VITALITY", value: 5 },
  { label: "CREATIVITY", value: 9 },
];

type Props = {
  stats?: Stat[];
};

export function StatsBars({ stats = DEFAULT_STATS }: Props) {
  return (
    <div className="mt-6">
      <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/60">
        PLAYER STATS
      </div>

      <div className="mt-4 space-y-3">
        {stats.map((stat) => {
          const clamped = Math.max(0, Math.min(10, stat.value));
          return (
            <div key={stat.label} className="grid grid-cols-[110px_1fr_40px] items-center gap-3">
              <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
                {stat.label}
              </div>

              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const on = i < clamped;
                  return (
                    <span
                      key={i}
                      aria-hidden
                      className={[
                        "h-[10px] flex-1 border",
                        on ? "border-white/55 bg-white/20" : "border-white/12 bg-transparent",
                      ].join(" ")}
                    />
                  );
                })}
              </div>

              <div className="text-right font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/40">
                {String(clamped).padStart(2, "0")}/10
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

