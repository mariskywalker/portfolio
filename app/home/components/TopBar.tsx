"use client";

type Props = {
  version?: string;
  statusText?: string;
};

export function TopBar({
  version = "v0.9.3",
  statusText = "STATUS: ACTIVE",
}: Props) {
  return (
    <header className="pointer-events-auto absolute left-0 right-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-start justify-between px-4 py-4 md:px-8">
        <div className="flex flex-col gap-1">
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/80">
            MARI SYSTEMS
          </div>
          <div className="font-heading text-[15px] font-semibold tracking-tight text-white">
              {/* INTERFACE HOME */}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/70">
            {statusText}
          </div>
          <div className="font-[var(--font-geist-mono)] text-[13px] uppercase tracking-[0.22em] text-white/55">
            VERSION: {version} / INDEX: 0001
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />
    </header>
  );
}

