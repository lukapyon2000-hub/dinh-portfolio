import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'events', label: 'Events' },
  { id: 'speculative', label: 'Speculative' },
  { id: 'academic', label: 'Academic' },
  { id: 'techcombank', label: 'Techcombank' },
];

export function Navbar({ activeSection, onNavigate, onOpenContact }: NavbarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0e0e10]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1120px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('hero')}
          className="text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#f87171] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Dinh Dinh
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Portfolio sections"
          className="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-300"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#c81e2b]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#c81e2b] hover:bg-[#b01824] text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-sm"
          >
            <span>Contact Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scroll reading progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c81e2b] origin-left"
        style={{ scaleX }}
      />
    </header>
  );
}
