interface MarqueeRibbonProps {
  heightPct: number;
}

const RIBBON_TEXT =
  'DINH DINH PORTFOLIO  |  COMMUNICATION  |  PARTNERSHIP  |  EVENTS  |  TECHCOMBANK CAMPUS AMBASSADOR 2026  |  ';

export function MarqueeRibbon({ heightPct }: MarqueeRibbonProps) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `${heightPct}%` }}
      className="absolute top-0 left-0 right-0 z-10 bg-[#111112] overflow-hidden flex items-center border-y border-white/10 pointer-events-none select-none"
    >
      <div className="flex whitespace-nowrap animate-marquee text-white/95 font-medium tracking-[0.12em] uppercase text-[clamp(8px,1.15vw,13px)]">
        <span>{RIBBON_TEXT}</span>
        <span>{RIBBON_TEXT}</span>
        <span>{RIBBON_TEXT}</span>
        <span>{RIBBON_TEXT}</span>
      </div>
    </div>
  );
}
