'use client';

/**
 * SadaqaWidget — ركن التبرع الملكي لزكاة الزواج
 * يتيح للأثرياء السلفيين وغيرهم تمويل زواج المعسرين
 */

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

// ── بيانات النداءات الحية (mock) ────────────────────────────────────
const CASES = [
  {
    id: 'c1',
    flag: '🇩🇿',
    regionAr: 'الجزائر — وهران',
    regionEn: 'Algeria — Oran',
    descAr: 'شاب طالب علم، ٢٧ سنة، يحفظ القرآن، يبحث عن ٦٠٠$ للمهر المعجّل',
    descEn: 'Young student of knowledge, 27, Quran memoriser — needs $600 for immediate Mahr',
    goal: 600,
    raised: 410,
    daysLeft: 9,
    donors: 14,
  },
  {
    id: 'c2',
    flag: '🇫🇷',
    regionAr: 'فرنسا — ليون',
    regionEn: 'France — Lyon',
    descAr: 'أخت مسلمة جديدة، ٢٤ سنة، بلا وليّ مادي، تحتاج دعماً لتكاليف العقد',
    descEn: 'New Muslim sister, 24, no financial guardian — needs support for contract costs',
    goal: 400,
    raised: 155,
    daysLeft: 14,
    donors: 7,
  },
  {
    id: 'c3',
    flag: '🇮🇩',
    regionAr: 'إندونيسيا — جاوة',
    regionEn: 'Indonesia — Java',
    descAr: 'عائلة كريمة تطلب مساعدة على تكاليف وليمة العرس السنيّة',
    descEn: 'Honorable family seeking support for Sunnah wedding Walima costs',
    goal: 300,
    raised: 290,
    daysLeft: 3,
    donors: 21,
  },
];

const PRESETS = [25, 50, 100, 250, 500];

const TX = {
  ar: {
    title: 'زكاة الزواج',
    subtitle: 'أعِن أخاك في الله على إتمام نصف دينه',
    hadith: '«مَنْ يَسَّرَ عَلَى مُعْسِرٍ، يَسَّرَ اللهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ» — صحيح مسلم',
    liveTitle: 'النداءات الحيّة',
    goal: 'الهدف',
    raised: 'جُمع',
    days: 'يوم',
    donors: 'متبرع',
    fund: 'أسهم الآن',
    anonymous: 'مجهول النسب (مستحب)',
    monthly: 'تبرع شهري دائم',
    impact: 'أثر تبرعك',
    impactLine: 'كل ٥٠$ = يغطي مهر معجّل في دولة فقيرة',
    stats: [
      { n: '٤٧', label: 'زواج مكتمل هذا الشهر' },
      { n: '$٣٢٬٠٠٠', label: 'مجموع ما جُمع' },
      { n: '٣١', label: 'دولة مشاركة' },
    ],
    or: 'أو',
    customAmount: 'مبلغ حر ($)',
    confirm: 'تأكيد التبرع',
    confirmNote: '(سيُوجَّه لبوابة الدفع الآمنة)',
    thanks: 'جزاك الله خيراً — تبرعك في ميزان حسناتك',
    shareTitle: 'شارك هذا الركن مع إخوانك الأثرياء',
    shareLine: 'انشر رابط المنصة وادعُ من يملك إلى أن يُيسِّر',
  },
  en: {
    title: 'Marriage Zakat',
    subtitle: 'Help your brother complete half of his religion',
    hadith: '"Whoever eases the burden of someone in difficulty, Allah will ease his burden in this life and the Hereafter." — Sahih Muslim',
    liveTitle: 'Live Requests',
    goal: 'Goal',
    raised: 'Raised',
    days: 'days',
    donors: 'donors',
    fund: 'Contribute Now',
    anonymous: 'Anonymous (recommended)',
    monthly: 'Recurring monthly sadaqa',
    impact: 'Your Impact',
    impactLine: 'Every $50 covers an immediate Mahr in a low-income country',
    stats: [
      { n: '47', label: 'Marriages completed this month' },
      { n: '$32K', label: 'Total donations received' },
      { n: '31', label: 'Countries participating' },
    ],
    or: 'or',
    customAmount: 'Custom amount ($)',
    confirm: 'Confirm Donation',
    confirmNote: '(You will be redirected to secure payment)',
    thanks: 'Jazak Allah Khayran — your sadaqa is recorded',
    shareTitle: 'Share this corner with wealthy brothers & sisters',
    shareLine: 'Spread the platform link and invite those who have means',
  },
};

export function SadaqaWidget() {
  const { locale } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isAr = locale === 'ar';
  const tx = isAr ? TX.ar : TX.en;

  const [selected, setSelected] = useState<number | null>(50);
  const [custom, setCustom] = useState('');
  const [anon, setAnon] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [donated, setDonated] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  const amount = custom ? parseFloat(custom) : selected ?? 0;

  function handleDonate() {
    if (amount > 0) setDonated(true);
  }

  return (
    <section dir={dir} className="relative px-4 py-12">
      {/* Gold ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-full px-5 py-2 mb-4">
            <span className="text-xl">💛</span>
            <span className="font-arabic text-[#D4AF37] text-sm font-semibold">{tx.title}</span>
          </div>
          <h2 className="font-arabic text-2xl sm:text-3xl text-[#F5ECD7] font-bold mb-3">{tx.subtitle}</h2>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl max-w-2xl"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.20)' }}>
            <span className="text-[#D4AF37] text-lg">🌙</span>
            <p className="font-arabic text-[#C19A6B] text-sm italic">{tx.hadith}</p>
          </div>
        </div>

        {/* ── Impact stats ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
          {tx.stats.map((s, i) => (
            <div key={i} className="glass-panel-light rounded-xl p-4 text-center">
              <div className="font-mono text-xl sm:text-2xl font-black mb-1"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C19A6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.n}
              </div>
              <div className="font-arabic text-[#C19A6B]/65 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Live cases column ── */}
          <div>
            <h3 className="font-arabic text-[#D4AF37] text-base font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              {tx.liveTitle}
            </h3>
            <div className="space-y-3">
              {CASES.map((c) => {
                const pct = Math.round((c.raised / c.goal) * 100);
                const isOpen = activeCase === c.id;
                return (
                  <div key={c.id}
                    className="rounded-xl overflow-hidden transition-all cursor-pointer"
                    style={{
                      background: isOpen ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.025)',
                      border: isOpen ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(212,175,55,0.10)',
                    }}
                    onClick={() => setActiveCase(isOpen ? null : c.id)}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{c.flag}</span>
                          <div>
                            <div className="font-arabic text-[#D4AF37] text-xs font-semibold">
                              {isAr ? c.regionAr : c.regionEn}
                            </div>
                            <div className="font-arabic text-[#C19A6B]/65 text-[10px]">
                              {isAr ? c.descAr : c.descEn}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono text-[#D4AF37] text-xs font-bold">{pct}%</div>
                          <div className="text-[#C19A6B]/50 text-[9px]">{c.daysLeft} {tx.days}</div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.12)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: pct >= 90
                              ? 'linear-gradient(90deg,#2E5A44,#7EC8A4)'
                              : 'linear-gradient(90deg,#D4AF37,#C19A6B)',
                          }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[#C19A6B]/55 text-[9px] font-arabic">
                          ${c.raised} {tx.raised}
                        </span>
                        <span className="text-[#C19A6B]/55 text-[9px] font-arabic">
                          {tx.goal} ${c.goal} · {c.donors} {tx.donors}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Donation form column ── */}
          <div className="glass-panel rounded-2xl p-5">
            {donated ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">💛</div>
                <p className="font-arabic text-[#D4AF37] text-xl font-bold mb-2">
                  {isAr ? 'تبرعت بـ $' + amount : 'You donated $' + amount}
                </p>
                <p className="font-arabic text-[#C19A6B] text-sm">{tx.thanks}</p>
                <button onClick={() => { setDonated(false); setSelected(50); setCustom(''); }}
                  className="btn-ghost mt-5 px-5 py-2 rounded-xl font-arabic text-sm">
                  {isAr ? 'تبرع مرة أخرى' : 'Donate again'}
                </button>
              </div>
            ) : (
              <>
                {/* Preset amounts */}
                <p className="font-arabic text-[#C19A6B]/70 text-xs mb-3">{isAr ? 'اختر المبلغ ($)' : 'Select amount ($)'}</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {PRESETS.map(p => (
                    <button key={p}
                      onClick={() => { setSelected(p); setCustom(''); }}
                      className="py-2 rounded-lg text-xs font-mono transition-all"
                      style={{
                        background: selected === p && !custom ? 'rgba(212,175,55,0.20)' : 'rgba(255,255,255,0.04)',
                        border: selected === p && !custom ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.12)',
                        color: selected === p && !custom ? '#D4AF37' : '#C19A6B',
                      }}>
                      ${p}
                    </button>
                  ))}
                </div>

                {/* Custom */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#C19A6B]/40 text-xs font-arabic">{tx.or}</span>
                  <div className="h-px flex-1 bg-[#D4AF37]/10" />
                  <input
                    type="number"
                    min={1}
                    placeholder={tx.customAmount}
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setSelected(null); }}
                    className="flex-1 bg-transparent border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-[#F5ECD7] text-xs focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {[
                    { val: anon, set: setAnon, label: tx.anonymous, icon: '🕵' },
                    { val: monthly, set: setMonthly, label: tx.monthly, icon: '🔄' },
                  ].map(({ val, set, label, icon }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => set(!val)}
                        className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
                        style={{
                          background: val ? 'rgba(212,175,55,0.25)' : 'transparent',
                          borderColor: val ? '#D4AF37' : 'rgba(212,175,55,0.25)',
                        }}>
                        {val && <span className="text-[#D4AF37] text-[8px]">✓</span>}
                      </div>
                      <span className="font-arabic text-[#C19A6B] text-xs">{icon} {label}</span>
                    </label>
                  ))}
                </div>

                {/* Impact line */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                  style={{ background: 'rgba(46,90,68,0.15)', border: '1px solid rgba(46,90,68,0.30)' }}>
                  <span className="text-sm">🌿</span>
                  <p className="font-arabic text-[#7EC8A4] text-[10px]">{tx.impactLine}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleDonate}
                  disabled={!amount || amount <= 0}
                  className="btn-primary w-full py-3 rounded-xl font-arabic text-base disabled:opacity-30"
                >
                  {tx.fund}
                  {amount > 0 && <span className="opacity-75 ml-2 font-mono">${amount}</span>}
                </button>
                <p className="font-arabic text-[#C19A6B]/35 text-[9px] text-center mt-2">{tx.confirmNote}</p>
              </>
            )}
          </div>
        </div>

        {/* ── Share strip ── */}
        <div className="mt-8 text-center glass-panel-light rounded-xl p-4">
          <p className="font-arabic text-[#F5ECD7] text-sm font-medium mb-1">🤝 {tx.shareTitle}</p>
          <p className="font-arabic text-[#C19A6B]/60 text-xs">{tx.shareLine}</p>
        </div>
      </div>
    </section>
  );
}
