import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { HotspotItem, PortfolioSectionConfig } from '../types/portfolio';
import { MarqueeRibbon } from './MarqueeRibbon';

interface PortfolioSectionProps {
  section: PortfolioSectionConfig;
  isFirst?: boolean;
  showAllHotspots: boolean;
  hoveredHotspotId: string | null;
  onHoverHotspot: (hotspot: HotspotItem | null) => void;
  onActivateHotspot: (hotspot: HotspotItem) => void;
}

export function PortfolioSection({
  section,
  isFirst = false,
  showAllHotspots,
  hoveredHotspotId,
  onHoverHotspot,
  onActivateHotspot,
}: PortfolioSectionProps) {
  return (
    <motion.section
      id={section.id}
      data-nav-id={section.navId || section.id}
      aria-label={section.title}
      initial={isFirst ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.03 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden bg-[#111112]"
      style={{
        aspectRatio: `${section.width} / ${section.height}`,
      }}
    >
      {/* Original PDF Slice — zero distortion, exact original image & layout fidelity */}
      <img
        src={section.imageSrc}
        alt={section.title}
        width={section.width}
        height={section.height}
        loading={isFirst ? 'eager' : 'lazy'}
        decoding={isFirst ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        className="block w-full h-full object-fill select-none pointer-events-none"
      />

      {/* Live animated marquee ticker over horizontal divider ribbons */}
      {section.hasTopRibbon && section.topRibbonHeightPct && (
        <MarqueeRibbon heightPct={section.topRibbonHeightPct} />
      )}

      {/* Interactive Hotspot Overlay Layer */}
      <div className="absolute inset-0 z-20">
        {section.hotspots.map((hotspot) => {
          const isHovered = hoveredHotspotId === hotspot.id;
          const borderColor =
            hotspot.variant === 'light'
              ? 'border-white/90'
              : hotspot.variant === 'dark'
                ? 'border-zinc-900/90'
                : 'border-[#c81e2b]';
          const ringBg =
            hotspot.variant === 'light'
              ? 'bg-white/10'
              : 'bg-[#c81e2b]/10';

          return (
            <button
              key={hotspot.id}
              type="button"
              aria-label={`${hotspot.title} — ${hotspot.linkText}`}
              onMouseEnter={() => onHoverHotspot(hotspot)}
              onMouseLeave={() => onHoverHotspot(null)}
              onFocus={() => onHoverHotspot(hotspot)}
              onBlur={() => onHoverHotspot(null)}
              onClick={() => onActivateHotspot(hotspot)}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              className={`group absolute rounded-xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c81e2b] ${
                isHovered
                  ? `${ringBg} border-2 ${borderColor} shadow-[0_0_24px_rgba(200,30,43,0.28)] scale-[1.012]`
                  : showAllHotspots
                    ? 'bg-[#c81e2b]/8 border border-dashed border-[#c81e2b]/75'
                    : 'bg-transparent border border-transparent hover:border-[#c81e2b]/80'
              }`}
            >
              {/* Animated corner link badge on hover or discover mode */}
              {(isHovered || showAllHotspots) && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-2.5 -right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#c81e2b] text-white text-[10px] font-semibold shadow-md whitespace-nowrap pointer-events-none"
                >
                  <span className="hidden sm:inline max-w-[140px] truncate">
                    {hotspot.title}
                  </span>
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
