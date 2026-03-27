import Link from "next/link";
import DipToWinScrollSection from "./visual-elements/components/DipToWinScrollSection";
import ProjectBreakdownSection from "./visual-elements/components/ProjectBreakdownSection";
import ScrollRevealScene from "./visual-elements/components/ScrollRevealScene";

type Props = { searchParams?: Promise<{ embed?: string }> | { embed?: string } };

export default async function HeinzOfficialPage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams ?? {});
  const isEmbed = params.embed === "1";

  return (
    <main className="min-h-screen bg-[#0b0304] text-white">
      {isEmbed && (
        <style>{`
          html:has(.heinz-embed-mode), html:has(.heinz-embed-mode) body {
            height: 100%;
            min-height: 100%;
          }
          .heinz-embed-mode { min-height: 100%; height: 100%; }
          .heinz-embed-content {
            transform: scale(0.78);
            transform-origin: top center;
            width: 128.2%;
            margin-left: -14.1%;
          }
          html:has(.heinz-embed-mode) {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          html:has(.heinz-embed-mode) ::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }
        `}</style>
      )}
      {!isEmbed && (
        <Link
          href="/#project-grid"
          className="fixed left-6 top-5 z-50 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 no-underline"
        >
          Back to Project Grid
        </Link>
      )}

      <div className={`relative isolate bg-[#c8102e] ${isEmbed ? "heinz-embed-mode overflow-visible" : "overflow-hidden"}`}>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_12%,rgba(200,16,46,0.28)_56%,rgba(200,16,46,0.72)_100%)]" />

        <div className={`relative z-10 ${isEmbed ? "heinz-embed-content" : ""}`}>
          <div id="heinz-hero">
            <ScrollRevealScene embed={isEmbed} />
          </div>
          <div id="heinz-dip">
            <DipToWinScrollSection embed={isEmbed} />
          </div>
          <div id="heinz-breakdown">
            <ProjectBreakdownSection />
          </div>
        </div>
      </div>
    </main>
  );
}
