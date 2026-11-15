import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Mail,
  MousePointerClick,
  Phone,
  Play,
  Sparkles,
} from 'lucide-react';
import type { HotspotActionType, HotspotItem } from '../types/portfolio';

interface CursorLinkTooltipProps {
  activeHotspot: HotspotItem | null;
}

function getActionIcon(actionType: HotspotActionType) {
  switch (actionType) {
    case 'mailto':
      return Mail;
    case 'tel':
      return Phone;
    case 'external':
      return ExternalLink;
    case 'modal-scenario':
      return Play;
    case 'modal-research':
      return FileText;
    case 'modal-contact':
      return Sparkles;
    case 'scroll':
    case 'modal-event':
    default:
      return ArrowUpRight;
  }
}

export function CursorLinkTooltip({ activeHotspot }: CursorLinkTooltipProps) {
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const mouseX = useMotionValue(-999);
  const mouseY = useMotionValue(-999);

  const springX = useSpring(mouseX, { stiffness: 520, damping: 36, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 520, damping: 36, mass: 0.4 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setFlipX(e.clientX > window.innerWidth - 310);
      setFlipY(e.clientY > window.innerHeight - 160);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [mouseX, mouseY]);

  const Icon = activeHotspot ? getActionIcon(activeHotspot.actionType) : ArrowUpRight;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 pointer-events-none hidden md:block"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <AnimatePresence mode="wait">
        {activeHotspot && (
          <motion.div
            key={activeHotspot.id}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate(${flipX ? 'calc(-100% - 16px)' : '18px'}, ${
                flipY ? 'calc(-100% - 16px)' : '18px'
              })`,
            }}
            className="w-[272px] rounded-xl bg-[#111114]/95 text-white border border-white/15 shadow-2xl backdrop-blur-md p-3"
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/10">
              <span
                className="text-[11px] text-[#f87171] truncate max-w-[215px]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {activeHotspot.linkText}
              </span>
              <span className="w-5 h-5 rounded-md bg-[#c81e2b] text-white flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[13px] font-semibold leading-snug text-white">
              {activeHotspot.title}
            </p>
            <p className="text-[11.5px] leading-relaxed text-zinc-400 mt-0.5 line-clamp-2">
              {activeHotspot.subtitle}
            </p>
            <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-zinc-300">
              <MousePointerClick className="w-3 h-3 text-[#f87171]" />
              <span>Nhấn để mở tương tác</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
