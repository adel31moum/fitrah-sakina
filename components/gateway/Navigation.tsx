'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES, type Locale } from '@/lib/i18n';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { key: 'council',  label: { ar: 'المجلس',  en: 'Council'  }, icon: '🤖', highlight: true  },
  { key: 'matching', label: { ar: 'التوافق', en: 'Matching' }, icon: '💍', highlight: true  },
  { key: 'wali',     label: { ar: 'الولي',   en: 'Wali'     }, icon: '🛡', highlight: false },
  { key: 'covenant', label: { ar: 'الميثاق', en: 'Covenant' }, icon: '📜', highlight: false },
  { key: 'dawah',    label: { ar: 'الدعوة',  en: "Da'wah"   }, icon: '📖', highlight: false },
  { key: 'sub',        label: { ar: 'الاشتراك', en: 'Plans'      }, icon: '💳', highlight: false },
  { key: 'autoposter', label: { ar: 'الناشر',   en: 'Auto-Post' }, icon: '📡', highlight: false },
  { key: 'admin',      label: { ar: 'الإدارة',  en: 'Admin'     }, icon: '⚙️', highlight: false },
] as const;

const ROLE_LABELS: Record<string, { ar: string; en: string; color: string }> = {
  groom:   { ar: 'عريس',  en: 'Groom',   color: '#D4AF37' },
  bride:   { ar: 'عروس',  en: 'Bride',   color: '#F0A0B8' },
  wali:    { ar: 'ولي',   en: 'Wali',    color: '#7EC8A4' },
  visitor: { ar: 'زائر',  en: 'Visitor', color: '#C19A6B' },
};

export function Navigation() {
  const { locale, setLocale, activeModule, setActiveModule, role, pledge, resetOnboarding } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isRtl = dir === 'rtl';
  const roleInfo = ROLE_LABELS[role] ?? ROLE_LABELS.visitor;
  const [menuOpen, setMenuOpen] = useState(false);

  function handleReset() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitrah-sakina-state');
      toast.success(locale === 'ar' ? 'تم إعادة ضبط التطبيق' : 'App reset — reloading…');
      setTimeout(() => window.location.reload(), 800);
    }
  }

  const visibleItems = NAV_ITEMS.slice(0, 5);
  const moreItems = NAV_ITEMS.slice(5);

  return (
    <header
      className="sticky top-0 z-50"
      dir={dir}
      style={{
        background: 'rgba(8,6,3,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">

        {/* ── Brand ── */}
        <button
          onClick={() => setActiveModule('council')}
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-7 h-7 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
            <span className="font-arabic text-[#D4AF37] text-xs font-bold">ف</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-arabic text-[#D4AF37] font-bold text-sm leading-none">فطرة وسكينة</div>
            <div className="text-[#C19A6B]/60 text-[10px] leading-none mt-0.5">Fitrah &amp; Sakina</div>
          </div>
        </button>

        {/* ── Nav tabs (main 5) ── */}
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 justify-center">
          {visibleItems.map((item) => {
            const isActive = activeModule === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                    : item.highlight
                      ? 'text-[#D4AF37]/80 hover:text-[#D4AF37] hover:bg-[#D4AF37]/08 border border-[#D4AF37]/18'
                      : 'text-[#C19A6B] hover:text-[#F5ECD7] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span className={`hidden sm:inline ${isRtl ? 'font-arabic' : ''}`}>
                  {isRtl ? item.label.ar : item.label.en}
                </span>
              </button>
            );
          })}

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(m => !m)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs transition-all border ${
                menuOpen ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' : 'text-[#C19A6B] border-transparent hover:border-[#D4AF37]/20'
              }`}
            >
              <span className="text-sm">⋯</span>
            </button>
            {menuOpen && (
              <div
                className="absolute top-10 z-50 glass-panel py-1.5 min-w-[140px]"
                style={{ [isRtl ? 'right' : 'left']: 0 }}
              >
                {moreItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => { setActiveModule(item.key); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
                      activeModule === item.key ? 'text-[#D4AF37]' : 'text-[#C19A6B] hover:text-[#F5ECD7]'
                    } ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                  >
                    <span>{item.icon}</span>
                    <span>{isRtl ? item.label.ar : item.label.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Role badge */}
          <button
            onClick={resetOnboarding}
            title={isRtl ? 'تغيير الدور' : 'Change role'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:scale-105"
            style={{ borderColor: `${roleInfo.color}40`, background: `${roleInfo.color}10` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: roleInfo.color }} />
            <span className={`text-[10px] font-medium ${isRtl ? 'font-arabic' : ''}`} style={{ color: roleInfo.color }}>
              {isRtl ? roleInfo.ar : roleInfo.en}
            </span>
          </button>

          {/* Language selector */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="bg-transparent border border-[#D4AF37]/25 text-[#C19A6B] text-[10px] rounded-md px-1.5 py-1 cursor-pointer hover:border-[#D4AF37]/55 focus:outline-none"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#1A1410] text-[#F5ECD7]">
                {l.nativeName}
              </option>
            ))}
          </select>

          {/* Reset */}
          {pledge.accepted && (
            <button
              onClick={handleReset}
              title={locale === 'ar' ? 'إعادة ضبط' : 'Reset'}
              className="w-6 h-6 rounded-md border border-[#D4AF37]/20 text-[#C19A6B]/50 hover:text-red-400 hover:border-red-800/50 transition-colors flex items-center justify-center text-xs"
            >
              ↺
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
