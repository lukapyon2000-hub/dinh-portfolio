import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Phone,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import type { ModalDetailContent, ScenarioChallenge } from '../types/portfolio';

interface DetailModalProps {
  detail: ModalDetailContent | null;
  scenarioMode: { open: boolean; initialTab?: 'business' | 'hr' | 'legal' };
  contactOpen: boolean;
  scenarios: ScenarioChallenge[];
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export function DetailModal({
  detail,
  scenarioMode,
  contactOpen,
  scenarios,
  onClose,
  onShowToast,
}: DetailModalProps) {
  const [activeScenarioTab, setActiveScenarioTab] = useState<'business' | 'hr' | 'legal'>(
    'business'
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderOrg, setSenderOrg] = useState('');
  const [senderMessage, setSenderMessage] = useState('');

  useEffect(() => {
    if (scenarioMode.initialTab) {
      setActiveScenarioTab(scenarioMode.initialTab);
    }
  }, [scenarioMode.initialTab]);

  useEffect(() => {
    const isAnyOpen = Boolean(detail) || scenarioMode.open || contactOpen;
    if (!isAnyOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detail, scenarioMode.open, contactOpen, onClose]);

  const copyValue = async (value: string, field: 'email' | 'phone', label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      onShowToast(`Đã sao chép ${label}: ${value}`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      onShowToast(`${label}: ${value}`);
    }
  };

  const isAnyOpen = Boolean(detail) || scenarioMode.open || contactOpen;
  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioTab) ?? scenarios[0];
  const chosenOptionId = activeScenario ? selectedOptions[activeScenario.id] : undefined;
  const chosenOption = activeScenario?.options.find((o) => o.id === chosenOptionId);

  const handleComposeMail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[Collaboration / Techcombank] ${senderOrg || senderName || 'Portfolio Inquiry'}`
    );
    const body = encodeURIComponent(
      `Chào Đình Đình,\n\nTên: ${senderName}\nTổ chức / Doanh nghiệp: ${senderOrg}\n\nNội dung:\n${senderMessage}\n`
    );
    window.location.href = `mailto:nguyendinhdinh72@gmail.com?subject=${subject}&body=${body}`;
    onShowToast('Đang mở ứng dụng email với nội dung đã soạn sẵn');
  };

  return (
    <AnimatePresence>
      {isAnyOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl bg-[#161619] text-zinc-100 border border-white/15 shadow-2xl overflow-hidden my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng hộp thoại"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 1. Event / Project / Research Detail View */}
            {detail && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="pr-10">
                  <div className="flex items-center gap-2 text-xs text-[#f87171] font-medium">
                    <span>{detail.category}</span>
                    {detail.timeline && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-zinc-400">{detail.timeline}</span>
                      </>
                    )}
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mt-1.5 leading-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {detail.title}
                  </h2>
                  <p className="text-sm text-zinc-300 mt-1">{detail.subtitle}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    Vai trò: <span className="text-white font-medium">{detail.role}</span>
                  </p>
                </div>

                {detail.metrics && detail.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {detail.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5"
                      >
                        <div
                          className="text-xl font-bold text-white tabular-nums"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {m.value}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2.5">
                  <h3 className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
                    Điểm nhấn triển khai
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-200 leading-relaxed">
                    {detail.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#c81e2b] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {detail.deliverables && detail.deliverables.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs text-zinc-400 mb-1.5">Hồ sơ & Đầu mục thực hiện:</div>
                    <div className="text-xs text-zinc-200 leading-relaxed">
                      {detail.deliverables.join(' · ')}
                    </div>
                  </div>
                )}

                {detail.partners && detail.partners.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs text-zinc-400 mb-1.5">Đối tác & Đơn vị phối hợp:</div>
                    <div className="text-xs text-white font-medium">
                      {detail.partners.join(' · ')}
                    </div>
                  </div>
                )}

                {detail.externalUrl && (
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                    <a
                      href={detail.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c81e2b] hover:bg-[#b01824] text-white text-xs font-semibold transition-colors"
                    >
                      <span>{detail.previewUrlLabel || 'Mở liên kết'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 2. Interactive Techcombank 3-Minute Crisis Simulation */}
            {scenarioMode.open && activeScenario && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="pr-10">
                  <div className="flex items-center gap-2 text-xs text-[#f87171] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Speculative Project · Techcombank 3-Min Challenge</span>
                  </div>
                  <h2
                    className="text-2xl font-bold text-white mt-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Thử tài xử lý khủng hoảng trong 3 phút
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Trải nghiệm trực tiếp mô hình tuyển dụng tương tác mà Đình Đình đề xuất cho sinh
                    viên Luật tại Ngày hội việc làm Techcombank.
                  </p>
                </div>

                {/* Scenario Selector Tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.05] rounded-xl border border-white/10">
                  {scenarios.map((sc) => {
                    const active = sc.id === activeScenario.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setActiveScenarioTab(sc.id)}
                        className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#c81e2b] text-white shadow-sm'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {sc.name}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                  <div className="text-[11px] font-medium text-[#f87171] mb-1">
                    {activeScenario.badge}
                  </div>
                  <p className="text-sm text-zinc-100 leading-relaxed">{activeScenario.prompt}</p>
                </div>

                <div className="space-y-2.5">
                  {activeScenario.options.map((opt) => {
                    const isSelected = chosenOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [activeScenario.id]: opt.id,
                          }))
                        }
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer text-sm ${
                          isSelected
                            ? opt.isOptimal
                              ? 'bg-emerald-500/15 border-emerald-400/60 text-white'
                              : 'bg-amber-500/15 border-amber-400/60 text-white'
                            : 'bg-white/[0.03] border-white/10 text-zinc-200 hover:bg-white/[0.07]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {chosenOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 border text-xs leading-relaxed ${
                      chosenOption.isOptimal
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
                        : 'bg-amber-950/50 border-amber-500/40 text-amber-100'
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {chosenOption.isOptimal
                        ? 'Góc nhìn chuẩn Tech Banker & Pháp chế:'
                        : 'Gợi ý tối ưu hơn:'}
                    </div>
                    {chosenOption.feedback}
                  </motion.div>
                )}
              </div>
            )}

            {/* 3. Direct Contact & Collaboration Modal */}
            {contactOpen && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="pr-10">
                  <div className="text-xs text-[#f87171] font-medium">
                    Techcombank Campus Ambassador 2026 · Contact
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mt-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Kết nối với Nguyễn Đình Đình
                  </h2>
                  <p className="text-sm text-zinc-300 mt-1">
                    Sinh viên năm 2 — Trường Đại học Luật TP.HCM · Phụ trách Đối ngoại & Tổ chức
                    Sự kiện.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5 flex items-center justify-between gap-2">
                    <a
                      href="mailto:nguyendinhdinh72@gmail.com"
                      className="flex items-center gap-2.5 min-w-0 hover:text-[#f87171] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#c81e2b] shrink-0" />
                      <span className="text-xs font-medium truncate">
                        nguyendinhdinh72@gmail.com
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        copyValue('nguyendinhdinh72@gmail.com', 'email', 'Email')
                      }
                      aria-label="Sao chép email"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5 flex items-center justify-between gap-2">
                    <a
                      href="tel:+84937893143"
                      className="flex items-center gap-2.5 min-w-0 hover:text-[#f87171] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#c81e2b] shrink-0" />
                      <span
                        className="text-xs font-medium tabular-nums truncate"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        +84 937 893 143
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyValue('+84 937 893 143', 'phone', 'Số điện thoại')}
                      aria-label="Sao chép số điện thoại"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleComposeMail} className="space-y-3 pt-2 border-t border-white/10">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên của bạn"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#c81e2b]"
                    />
                    <input
                      type="text"
                      placeholder="Đơn vị / Doanh nghiệp"
                      value={senderOrg}
                      onChange={(e) => setSenderOrg(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#c81e2b]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Lời nhắn trao đổi hợp tác, phỏng vấn hoặc sự kiện..."
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#c81e2b] resize-none"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href="./assets/aistudio/__NH___NH_PORTFOLIO_B_N_G_C_compressed_4a6aa595.pdf"
                      download="Nguyen_Dinh_Dinh_Portfolio.pdf"
                      className="text-xs text-zinc-300 hover:text-white underline underline-offset-4"
                    >
                      Tải bản PDF gốc
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c81e2b] hover:bg-[#b01824] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi email ngay</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
