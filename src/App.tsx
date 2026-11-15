/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, CheckCircle2, Download, Eye, EyeOff } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CursorLinkTooltip } from './components/CursorLinkTooltip';
import { PortfolioSection } from './components/PortfolioSection';
import { DetailModal } from './components/DetailModal';
import {
  MODAL_DETAILS,
  PORTFOLIO_SECTIONS,
  SCENARIO_CHALLENGES,
} from './data/portfolioData';
import type { HotspotItem, ModalDetailContent } from './types/portfolio';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotItem | null>(null);
  const [showAllHotspots, setShowAllHotspots] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const [activeDetail, setActiveDetail] = useState<ModalDetailContent | null>(null);
  const [scenarioModal, setScenarioModal] = useState<{
    open: boolean;
    initialTab?: 'business' | 'hr' | 'legal';
  }>({ open: false });
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasExportBundles, setHasExportBundles] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.protocol === 'file:') return;
    fetch('./dinh-dinh-portfolio-github.zip', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasExportBundles(true);
      })
      .catch(() => {});
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Track active section in viewport for top navigation underline
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-nav-id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const navId = entry.target.getAttribute('data-nav-id');
            if (navId) setActiveSection(navId);
          }
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0.01 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 560);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTarget = useCallback((targetId: string) => {
    if (targetId === 'about-card-anchor') {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const y = heroEl.offsetTop + heroEl.offsetHeight * 0.57;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveDetail(null);
    setScenarioModal({ open: false });
    setContactOpen(false);
  }, []);

  const handleActivateHotspot = useCallback(
    async (hotspot: HotspotItem) => {
      switch (hotspot.actionType) {
        case 'scroll':
          scrollToTarget(hotspot.target);
          break;
        case 'mailto':
          try {
            await navigator.clipboard.writeText(hotspot.target);
            showToast(`Đã sao chép email: ${hotspot.target}`);
          } catch {
            // Fallback to mailto directly
          }
          window.location.href = `mailto:${hotspot.target}`;
          break;
        case 'tel':
          try {
            await navigator.clipboard.writeText(hotspot.target);
            showToast(`Đã sao chép số điện thoại: ${hotspot.target}`);
          } catch {
            // Fallback to tel directly
          }
          window.location.href = `tel:${hotspot.target}`;
          break;
        case 'external':
          window.open(hotspot.target, '_blank', 'noopener,noreferrer');
          break;
        case 'modal-scenario':
          closeAllModals();
          setScenarioModal({
            open: true,
            initialTab: hotspot.target as 'business' | 'hr' | 'legal',
          });
          break;
        case 'modal-contact':
          closeAllModals();
          setContactOpen(true);
          break;
        case 'modal-event':
        case 'modal-research': {
          const detail = MODAL_DETAILS[hotspot.target];
          if (detail) {
            closeAllModals();
            setActiveDetail(detail);
          }
          break;
        }
      }
    },
    [closeAllModals, scrollToTarget, showToast]
  );

  return (
    <div className="min-h-screen bg-[#111113] text-zinc-100 selection:bg-[#c81e2b] selection:text-white">
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToTarget}
        onOpenContact={() => {
          closeAllModals();
          setContactOpen(true);
        }}
      />

      {/* Spring-physics cursor-following link preview */}
      <CursorLinkTooltip activeHotspot={hoveredHotspot} />

      {/* Main Seamless Portfolio Stage — preserves 100% of original PDF layout & image positions */}
      <main className="w-full px-0 sm:px-4 md:px-6 pt-0 sm:pt-4 pb-8">
        <div className="max-w-[1080px] mx-auto bg-[#111112] sm:rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)] border-x sm:border border-white/10">
          {PORTFOLIO_SECTIONS.map((section, index) => (
            <PortfolioSection
              key={section.id}
              section={section}
              isFirst={index === 0}
              showAllHotspots={showAllHotspots}
              hoveredHotspotId={hoveredHotspot?.id ?? null}
              onHoverHotspot={setHoveredHotspot}
              onActivateHotspot={handleActivateHotspot}
            />
          ))}
        </div>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="max-w-[1080px] mx-auto px-4 sm:px-6 pb-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div>
          © 2026 Nguyễn Đình Đình · Techcombank Campus Ambassador Portfolio
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {hasExportBundles && (
            <>
              <a
                href="./DinhDinh_Portfolio_Offline.html"
                download="DinhDinh_Portfolio_Offline.html"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải 1 file HTML xem offline</span>
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="./dinh-dinh-portfolio-github.zip"
                download="dinh-dinh-portfolio-github.zip"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải bộ code GitHub (.zip)</span>
              </a>
              <span aria-hidden="true">·</span>
            </>
          )}
          <a
            href="./assets/aistudio/__NH___NH_PORTFOLIO_B_N_G_C_compressed_4a6aa595.pdf"
            download="Nguyen_Dinh_Dinh_Portfolio.pdf"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải PDF gốc</span>
          </a>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => {
              closeAllModals();
              setContactOpen(true);
            }}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            Liên hệ hợp tác
          </button>
        </div>
      </footer>

      {/* Floating Quick Utility Controls (kept compact for mobile <=15% sticky cap) */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAllHotspots((prev) => !prev)}
          aria-pressed={showAllHotspots}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium backdrop-blur-md shadow-lg transition-colors cursor-pointer whitespace-nowrap ${
            showAllHotspots
              ? 'bg-[#c81e2b] border-[#c81e2b] text-white'
              : 'bg-[#18181b]/90 border-white/15 text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          {showAllHotspots ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span>{showAllHotspots ? 'Ẩn vùng link' : 'Hiện vùng link'}</span>
        </button>

        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.16 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Lên đầu trang"
              className="w-9 h-9 rounded-lg bg-[#18181b]/90 hover:bg-zinc-800 border border-white/15 text-zinc-200 flex items-center justify-center backdrop-blur-md shadow-lg cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-16 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181b] border border-emerald-500/40 text-xs font-medium text-white shadow-2xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case Study, 3-Min Scenario Simulator & Contact Modals */}
      <DetailModal
        detail={activeDetail}
        scenarioMode={scenarioModal}
        contactOpen={contactOpen}
        scenarios={SCENARIO_CHALLENGES}
        onClose={closeAllModals}
        onShowToast={showToast}
      />
    </div>
  );
}
