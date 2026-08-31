'use client';

import React, { useState, useEffect } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { ScholarModule } from './ScholarModule';
import { BookModule } from './BookModule';
import { BrideModule } from './BrideModule';
import { ChildrenModule } from './ChildrenModule';
import { TentModule } from './TentModule';
import { WealthModule } from './WealthModule';
import { DialogueModule } from './DialogueModule';
import { ShariaAdvisor } from '@/components/ai/ShariaAdvisor';

const MODULES = [
  {
    key: 'ai',
    icon: '🤖',
    labelAr: 'المساعد الذكي',
    labelEn: 'AI Advisor',
    descAr: 'توجيه شرعي فوري',
    descEn: 'Instant Sharia Guidance',
    component: ShariaAdvisor,
    accent: '#D4AF37',
    glow: 'rgba(212,175,55,0.10)',
  },
  {
    key: 'scholar',
    icon: '📚',
    labelAr: 'الشيخ',
    labelEn: 'Scholar',
    descAr: 'الفقه والأحاديث',
    descEn: 'Fiqh & Hadith',
    component: ScholarModule,
    accent: '#D4AF37',
    glow: 'rgba(212,175,55,0.07)',
  },
  {
    key: 'book',
    icon: '📋',
    labelAr: 'عقد الزواج',
    labelEn: 'Contract',
    descAr: 'العقد الشرعي الرقمي',
    descEn: 'Digital Sharia Contract',
    component: BookModule,
    accent: '#C19A6B',
    glow: 'rgba(193,154,107,0.07)',
  },
  {
    key: 'bride',
    icon: '🌸',
    labelAr: 'بوابة الأخت',
    labelEn: 'Sister\'s Portal',
    descAr: 'استمارة الزوجة',
    descEn: 'Bride Profile Form',
    component: BrideModule,
    accent: '#f0a0b8',
    glow: 'rgba(240,160,184,0.06)',
  },
  {
    key: 'dialogue',
    icon: '💬',
    labelAr: 'نافذة الحوار',
    labelEn: 'Dialogue',
    descAr: 'أسئلة منضبطة فقط',
    descEn: 'Structured Q&A Only',
    component: DialogueModule,
    accent: '#818cf8',
    glow: 'rgba(99,102,241,0.07)',
  },
  {
    key: 'wealth',
    icon: '💰',
    labelAr: 'المهر والنفقة',
    labelEn: 'Mahr & Nafaqa',
    descAr: 'الحقوق المالية',
    descEn: 'Financial Rights',
    component: WealthModule,
    accent: '#D4AF37',
    glow: 'rgba(212,175,55,0.09)',
  },
  {
    key: 'children',
    icon: '👶',
    labelAr: 'تربية الأبناء',
    labelEn: 'Child Upbringing',
    descAr: 'المنهج السلفي للتربية',
    descEn: 'Islamic Parenting',
    component: ChildrenModule,
    accent: '#7EC8A4',
    glow: 'rgba(46,90,68,0.09)',
  },
  {
    key: 'tent',
    icon: '🏕',
    labelAr: 'السكن والهجرة',
    labelEn: 'Housing & Hijrah',
    descAr: 'البيئة المناسبة للأسرة',
    descEn: 'Islamic Home & Migration',
    component: TentModule,
    accent: '#7EC8A4',
    glow: 'rgba(46,90,68,0.07)',
  },
] as const;

type ModuleKey = typeof MODULES[number]['key'];

export function CouncilDashboard() {
  const { locale, role, setRole, bookConditions, dialoguePrompts } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isRtl = dir === 'rtl';
  const [activeKey, setActiveKey] = useState<ModuleKey>('ai');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeModule = MODULES.find(m => m.key === activeKey)!;
  const ActiveComponent = activeModule.component;

  const badgeCounts: Record<string, number | undefined> = {
    book: bookConditions.length || undefined,
    dialogue: dialoguePrompts.length || undefined,
  };

  return (
    <div dir={dir} className="max-w-7xl mx-auto px-4 pb-16">

      {/* ─── Section header ─── */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="ornament-line w-16 sm:w-28" />
          <span className="text-[#D4AF37]/50 text-base">✦</span>
          <div className="ornament-line w-16 sm:w-28" />
        </div>
        <h2 className="font-arabic text-2xl sm:text-3xl text-[#D4AF37] mb-2 animate-shimmer">
          {t(locale, 'council_title')}
        </h2>
        <p className="font-arabic text-[#C19A6B]/70 text-sm">
          {isRtl ? 'المساعد الذكي + أدوات الزواج الشرعي — كل ما تحتاجه في مكان واحد' : 'AI Advisor + Sharia marriage tools — all in one place'}
        </p>
      </div>

      {/* ─── Role selector (compact) ─── */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(['groom', 'bride', 'wali'] as const).map(r => {
          const L = { groom: { ar: '🤵 عريس', en: '🤵 Groom' }, bride: { ar: '🌸 عروس', en: '🌸 Bride' }, wali: { ar: '🛡 ولي', en: '🛡 Wali' } };
          return (
            <button key={r} onClick={() => setRole(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-arabic border transition-all ${
                role === r
                  ? 'bg-[#D4AF37] text-[#0E0B07] border-[#D4AF37] shadow-md shadow-[#D4AF37]/20'
                  : 'border-[#D4AF37]/25 text-[#C19A6B] hover:border-[#D4AF37]/50 hover:text-[#F5ECD7]'
              }`}>
              {isRtl ? L[r].ar : L[r].en}
            </button>
          );
        })}
      </div>

      {isMobile ? (
        /* ─── MOBILE ─── */
        <div>
          {/* Tab bar */}
          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-none mb-4 -mx-1 px-1">
            {MODULES.map(m => (
              <button key={m.key} onClick={() => setActiveKey(m.key)}
                className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all min-w-[72px] ${
                  activeKey === m.key ? 'glass-panel border-[#D4AF37]/50 text-[#D4AF37]' : 'glass-panel-light border-[#D4AF37]/12 text-[#C19A6B]'
                }`}>
                <span className="text-xl leading-none">{m.icon}</span>
                <span className="font-arabic text-center leading-tight text-[10px]">
                  {isRtl ? m.labelAr : m.labelEn}
                </span>
                {badgeCounts[m.key] && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0E0B07] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badgeCounts[m.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div key={activeKey} className="glass-panel p-4 animate-fade-in-up"
            style={{ minHeight: 520, boxShadow: `0 8px 40px rgba(0,0,0,0.55), inset 0 0 60px ${activeModule.glow}` }}>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#D4AF37]/10">
              <span className="text-lg">{activeModule.icon}</span>
              <div>
                <span className="font-arabic text-[#D4AF37] font-bold text-sm">{isRtl ? activeModule.labelAr : activeModule.labelEn}</span>
                <span className="font-arabic text-[#C19A6B]/60 text-[10px] block">{isRtl ? activeModule.descAr : activeModule.descEn}</span>
              </div>
            </div>
            <ActiveComponent />
          </div>
        </div>
      ) : (
        /* ─── DESKTOP ─── */
        <div className="flex gap-5 items-start">

          {/* Sidebar */}
          <div className="w-56 flex-shrink-0 flex flex-col gap-1.5">

            {/* AI first — highlighted */}
            {MODULES.filter(m => m.key === 'ai').map(m => (
              <SidebarBtn key={m.key} m={m} active={activeKey === m.key} isRtl={isRtl}
                badge={badgeCounts[m.key]} onClick={() => setActiveKey(m.key)} highlight />
            ))}

            <div className="ornament-line my-2" />

            {/* Core modules */}
            <p className="font-arabic text-[9px] text-[#D4AF37]/35 tracking-widest uppercase px-2 mb-0.5">
              {isRtl ? 'أدوات الزواج' : 'Marriage Tools'}
            </p>
            {MODULES.filter(m => m.key !== 'ai').map(m => (
              <SidebarBtn key={m.key} m={m} active={activeKey === m.key} isRtl={isRtl}
                badge={badgeCounts[m.key]} onClick={() => setActiveKey(m.key)} />
            ))}
          </div>

          {/* Main panel */}
          <div key={activeKey} className="flex-1 glass-panel p-6 animate-fade-in-up"
            style={{
              minHeight: 580,
              boxShadow: `0 8px 48px rgba(0,0,0,0.60), inset 0 0 100px ${activeModule.glow}, inset 0 1px 0 rgba(212,175,55,0.10)`,
            }}>

            {/* Panel header */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#D4AF37]/12">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: `linear-gradient(135deg,${activeModule.glow.replace('0.07','0.25')},rgba(14,11,7,0.8))`, border: `1px solid ${activeModule.accent}35` }}>
                {activeModule.icon}
              </div>
              <div>
                <span className="font-arabic text-[#D4AF37] font-bold">{isRtl ? activeModule.labelAr : activeModule.labelEn}</span>
                <span className="font-arabic text-[#C19A6B]/55 text-xs block">{isRtl ? activeModule.descAr : activeModule.descEn}</span>
              </div>
              <div className="ms-auto flex items-center gap-2">
                <span className="badge-sharia">
                  {role === 'groom' ? (isRtl ? 'عريس' : 'Groom') : role === 'bride' ? (isRtl ? 'عروس' : 'Bride') : role === 'wali' ? (isRtl ? 'ولي' : 'Wali') : (isRtl ? 'زائر' : 'Guest')}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <ActiveComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar button ───────────────────────────────────────────────────────────
function SidebarBtn({
  m, active, isRtl, badge, onClick, highlight = false,
}: {
  m: typeof MODULES[number];
  active: boolean;
  isRtl: boolean;
  badge?: number;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-start group ${
        active
          ? 'glass-panel border-[#D4AF37]/50 text-[#D4AF37] gold-ring'
          : highlight
            ? 'glass-panel-light border-[#D4AF37]/28 text-[#C19A6B] hover:border-[#D4AF37]/50 hover:text-[#F5ECD7]'
            : 'glass-panel-light border-[#D4AF37]/10 text-[#C19A6B] hover:border-[#D4AF37]/28 hover:text-[#F5ECD7]'
      }`}
      style={highlight && !active ? { background: 'rgba(212,175,55,0.04)' } : {}}>

      <span className="text-base leading-none flex-shrink-0">{m.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-arabic font-medium text-xs leading-tight truncate">
          {isRtl ? m.labelAr : m.labelEn}
        </div>
        <div className="font-arabic text-[9px] opacity-50 truncate leading-tight mt-0.5">
          {isRtl ? m.descAr : m.descEn}
        </div>
      </div>

      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0 animate-pulse" />}
      {badge && !active && (
        <span className="bg-[#D4AF37]/18 text-[#D4AF37] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
          {badge}
        </span>
      )}
    </button>
  );
}
