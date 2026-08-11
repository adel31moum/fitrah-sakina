'use client';

import React, { useEffect, useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';

// ── Trust signals (for non-Muslims / global visitors) ──────────────
const TRUST_BADGES = [
  { icon: '🔐', ar: 'خصوصية مطلقة', en: 'Zero data sold' },
  { icon: '📵', ar: 'لا تواصل مباشر', en: 'No direct contact' },
  { icon: '🛡', ar: 'إشراف شرعي', en: 'Sharia oversight' },
  { icon: '🌍', ar: '٩ لغات عالمية', en: '9 global languages' },
];

// ── Comparison table — Islamic vs secular ──────────────────────────
const COMPARE = [
  { feature: { ar: 'معيار الاختيار', en: 'Selection Criteria' }, islamic: { ar: 'الدين والخُلق', en: 'Religion & Character' }, secular: { ar: 'المظهر والمال', en: 'Looks & Wealth' } },
  { feature: { ar: 'حماية المرأة', en: 'Woman\'s Protection' }, islamic: { ar: 'وليّ شرعي + مهر مكفول', en: 'Wali + guaranteed Mahr' }, secular: { ar: 'لا ضمانات', en: 'No guarantees' } },
  { feature: { ar: 'معدل الاستقرار', en: 'Stability Rate' }, islamic: { ar: 'أعلى بكثير إحصائياً', en: 'Statistically far higher' }, secular: { ar: '٥٠٪+ طلاق', en: '50%+ divorce rate' } },
  { feature: { ar: 'حقوق مكفولة', en: 'Guaranteed Rights' }, islamic: { ar: 'من اليوم الأول', en: 'From day one' }, secular: { ar: 'بعد سنوات من التقاضي', en: 'After years of litigation' } },
];

const VERSES = [
  { ar: '﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾', ref: 'الروم ٣٠:٢١', en: '"And of His signs is that He created for you mates that you may find tranquillity in them, and He placed between you affection and mercy." (Ar-Rum 30:21)', bg: 'مودة' },
  { ar: '﴿هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ﴾', ref: 'البقرة ٢:١٨٧', en: '"They are a garment for you and you are a garment for them." (Al-Baqarah 2:187)', bg: 'سكينة' },
];

const STATS = [
  { n: '9', labelAr: 'لغات عالمية', labelEn: 'Languages', icon: '🌍' },
  { n: '٠', labelAr: 'تواصل مباشر', labelEn: 'Direct contact', icon: '📵' },
  { n: '١٠٠٪', labelAr: 'خصوصية', labelEn: 'Privacy', icon: '🔐' },
  { n: '٢٤/٧', labelAr: 'مساعد ذكي', labelEn: 'AI advisor', icon: '🤖' },
];

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function HeroSection() {
  const { locale, setActiveModule } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isRtl = dir === 'rtl';
  const [scrollY, setScrollY] = useState(0);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section dir={dir} className="relative overflow-hidden">

      {/* ══ HERO BANNER ══ */}
      <div className="relative flex flex-col items-center justify-center px-4 pb-12 pt-16 sm:pt-20"
        style={{ minHeight: 'clamp(560px, 78vh, 820px)' }}>

        {/* Parallax BG */}
        <div className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url('/images/hero-cinematic.jpg')",
            backgroundPosition: 'center 30%',
            transform: `translateY(${scrollY * 0.28}px)`,
          }} aria-hidden />

        {/* Overlays */}
        <div className="absolute inset-0" aria-hidden
          style={{ background: 'linear-gradient(180deg,rgba(8,6,3,0.75) 0%,rgba(14,11,7,0.60) 35%,rgba(14,11,7,0.92) 78%,rgba(14,11,7,1) 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 pointer-events-none" aria-hidden
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(212,175,55,0.20) 0%, transparent 70%)', filter: 'blur(24px)' }} />

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" aria-hidden
            style={{
              width: 1 + (i % 3), height: 1 + (i % 3),
              left: `${((i * 53 + 7) % 95) + 2}%`,
              top: `${((i * 37 + 11) % 55) + 3}%`,
              background: i % 4 === 0 ? '#D4AF37' : '#F5ECD7',
              opacity: 0.08 + (i % 5) * 0.06,
              animation: `hs_twinkle ${3 + i % 5}s ease-in-out ${i * 0.4}s infinite alternate`,
            }} />
        ))}

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">

          {/* Basmala */}
          <div className="mb-3 animate-fade-in-up">
            <span className="font-arabic text-[#D4AF37]/65 text-2xl sm:text-3xl tracking-widest">
              بسم الله الرحمن الرحيم
            </span>
          </div>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="ornament-line w-16 sm:w-24" />
            <GeomStar />
            <div className="ornament-line w-16 sm:w-24" />
          </div>

          {/* Platform name */}
          <h1 className="font-arabic font-black mb-2 animate-fade-in-up leading-tight"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 5rem)',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5ECD7 45%, #C19A6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 48px rgba(212,175,55,0.55))',
              animationDelay: '0.25s',
            }}>
            فطرة وسكينة
          </h1>

          {/* Tagline bilingual */}
          <p className="font-arabic text-[#C19A6B] text-sm sm:text-base tracking-wide mb-2 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            {isRtl ? 'منصة الزواج الإسلامي الشرعي على المنهج السلفي' : 'Islamic Matrimonial Platform — Salafi Methodology'}
          </p>
          <p className="text-[#C19A6B]/55 text-xs mb-6 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            {isRtl
              ? 'بدون تواصل مباشر · بدون صور وجوه · تحت إشراف الولي · موثَّق شرعياً'
              : 'No direct contact · No face photos · Under Wali supervision · Sharia-documented'}
          </p>

          {/* Trust badges row */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
                <span className="text-sm">{b.icon}</span>
                <span className="font-arabic text-[#C19A6B] text-[10px]">{isRtl ? b.ar : b.en}</span>
              </div>
            ))}
          </div>

          {/* ── MAIN CTA — single, bold ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.65s' }}>
            <button
              onClick={() => smoothScrollTo('register-section')}
              className="btn-primary px-8 py-4 text-base font-arabic group flex items-center gap-3 rounded-2xl shadow-lg"
              style={{ boxShadow: '0 0 32px rgba(212,175,55,0.25)' }}>
              <span className="text-xl">🌟</span>
              <span>{isRtl ? 'ابدأ مسيرتك الآن' : 'Start Your Journey Now'}</span>
              <span className="opacity-50 group-hover:opacity-100 transition-opacity text-lg">{isRtl ? '↓' : '↓'}</span>
            </button>

            <button
              onClick={() => setShowCompare(!showCompare)}
              className="btn-ghost px-5 py-3 text-sm font-arabic rounded-xl flex items-center gap-2">
              <span>⚖️</span>
              <span>{isRtl ? 'لماذا الزواج الإسلامي؟' : 'Why Islamic marriage?'}</span>
            </button>
          </div>

          {/* ── Compare panel (expandable) ── */}
          {showCompare && (
            <div className="mt-6 glass-panel rounded-2xl p-4 text-start animate-fade-in-up max-w-2xl mx-auto">
              <p className="font-arabic text-[#D4AF37] text-sm font-semibold text-center mb-3">
                {isRtl ? '📊 الزواج الإسلامي مقابل النموذج العلماني' : '📊 Islamic vs Secular Marriage Model'}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="font-arabic text-[#C19A6B]/50 pb-2 text-start">{isRtl ? 'المعيار' : 'Feature'}</th>
                      <th className="font-arabic text-[#D4AF37] pb-2 px-3 text-center">☪️ {isRtl ? 'إسلامي' : 'Islamic'}</th>
                      <th className="font-arabic text-[#C19A6B]/50 pb-2 text-center">🌐 {isRtl ? 'علماني' : 'Secular'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE.map((row, i) => (
                      <tr key={i} className="border-t border-[#D4AF37]/08">
                        <td className="font-arabic text-[#C19A6B]/70 py-2 pr-2">{isRtl ? row.feature.ar : row.feature.en}</td>
                        <td className="font-arabic text-[#7EC8A4] py-2 px-3 text-center font-medium">✦ {isRtl ? row.islamic.ar : row.islamic.en}</td>
                        <td className="font-arabic text-[#C19A6B]/40 py-2 text-center">✗ {isRtl ? row.secular.ar : row.secular.en}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-3">
                <button onClick={() => setActiveModule('council')} className="btn-primary px-5 py-2 text-xs rounded-xl font-arabic">
                  🤖 {isRtl ? 'استشر المساعد الشرعي' : 'Consult the AI Advisor'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ STATS STRIP ══ */}
      <div className="relative py-5 border-y border-[#D4AF37]/12"
        style={{ background: 'rgba(10,8,4,0.88)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="font-mono text-lg sm:text-xl font-black mb-0.5"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#C19A6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {s.n}
                </div>
                <div className="font-arabic text-[#C19A6B]/60 text-[10px]">
                  {isRtl ? s.labelAr : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ VERSE CARDS ══ */}
      <div className="px-4 py-8" style={{ background: 'rgba(12,9,4,0.70)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {VERSES.map((v, i) => (
              <div key={i} className="glass-panel p-5 text-center relative overflow-hidden" style={{ borderColor: 'rgba(212,175,55,0.30)' }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none" aria-hidden>
                  <span className="font-arabic text-[#D4AF37]" style={{ fontSize: 110 }}>{v.bg}</span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.50),transparent)' }} />
                <p className="font-arabic text-[#F5ECD7] text-base sm:text-lg leading-loose mb-2 relative z-10">{v.ar}</p>
                {!isRtl && <p className="text-[#C19A6B]/60 text-xs italic mb-2 relative z-10">{v.en}</p>}
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="h-px w-8 bg-[#D4AF37]/30" />
                  <span className="text-[#D4AF37]/65 text-xs font-arabic">{v.ref}</span>
                  <div className="h-px w-8 bg-[#D4AF37]/30" />
                </div>
              </div>
            ))}
          </div>

          {/* Hadith strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.20)' }}>
            <span className="text-[#D4AF37] text-lg">🌙</span>
            <span className="font-arabic text-[#F5ECD7] text-sm">
              {isRtl
                ? '«النِّكَاحُ مِنْ سُنَّتِي، فَمَنْ رَغِبَ عَنْ سُنَّتِي فَلَيْسَ مِنِّي»'
                : '"Marriage is from my Sunnah; whoever turns away from my Sunnah is not from me."'}
            </span>
            <span className="text-[#C19A6B]/45 text-xs font-arabic">— {isRtl ? 'متفق عليه' : 'Agreed upon'}</span>
          </div>
        </div>
      </div>

      {/* ══ 6-PRINCIPLE GRID ══ */}
      <div className="relative px-4 py-8" style={{ background: 'rgba(11,8,3,0.65)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-arabic text-center text-[#D4AF37]/50 text-xs mb-5 tracking-widest uppercase">
            {isRtl ? 'ستة مبادئ راسخة' : 'Six Core Principles'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: '🛡', ar: 'حفظ الدين والنسب', en: 'Protect Religion & Lineage' },
              { icon: '📜', ar: 'عقد شرعي موثَّق', en: 'Documented Sharia Contract' },
              { icon: '🔒', ar: 'خصوصية مطلقة', en: 'Absolute Privacy' },
              { icon: '🤖', ar: 'مساعد ذكي شرعي', en: 'AI Sharia Guidance' },
              { icon: '🌍', ar: 'وصول عالمي ٩ لغات', en: 'Global in 9 Languages' },
              { icon: '💛', ar: 'زكاة الزواج للمعسرين', en: 'Marriage Zakat for the needy' },
            ].map((p, i) => (
              <div key={i} className="glass-panel-light p-3 rounded-xl text-center transition-all hover:border-[#D4AF37]/35 group cursor-pointer"
                onClick={() => i === 5 ? setActiveModule('dawah') : setActiveModule('council')}>
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{p.icon}</div>
                <p className="font-arabic text-[#C19A6B] text-[10px] leading-relaxed">
                  {isRtl ? p.ar : p.en}
                </p>
              </div>
            ))}
          </div>

          {/* Security ribbon */}
          <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
            {[
              { icon: '🔐', ar: 'تشفير شامل', en: 'End-to-End Encrypted' },
              { icon: '📵', ar: 'لا روابط خارجية', en: 'No External Links' },
              { icon: '👁', ar: 'جميع التفاعلات مراقَبة', en: 'All Interactions Monitored' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-sm">{s.icon}</span>
                <span className="font-arabic text-[10px] text-[#C19A6B]/45">{isRtl ? s.ar : s.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes hs_twinkle { from { opacity:0.06 } to { opacity:0.35 } }`}</style>
    </section>
  );
}

function GeomStar() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <polygon points="14,2 16.5,11 26,11 18.5,17 21,26 14,20 7,26 9.5,17 2,11 11.5,11" fill="rgba(212,175,55,0.75)" />
      <circle cx="14" cy="14" r="3" fill="rgba(212,175,55,0.50)" />
    </svg>
  );
}
