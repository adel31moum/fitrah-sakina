'use client';

import React, { useState, useEffect } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES, type Locale } from '@/lib/i18n';
import { toast } from 'sonner';

export function PledgeGateway({ children }: { children: React.ReactNode }) {
  const { pledge, locale, setLocale, acceptPledge } = useFitrahStore();
  const [mounted, setMounted] = useState(false);
  const [oath1, setOath1] = useState(false);
  const [oath2, setOath2] = useState(false);
  const [oath3, setOath3] = useState(false);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Show minimal loader while Zustand hydrates (prevents flash)
  if (!mounted) {
    return (
      <div className="min-h-dvh bg-desert flex flex-col items-center justify-center gap-4">
        <div className="font-arabic text-[#D4AF37] text-3xl animate-pulse">﷽</div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 animate-pulse"
              style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </div>
      </div>
    );
  }
  if (pledge.accepted) return <>{children}</>;

  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const allChecked = oath1 && oath2 && oath3;

  function handleAccept() {
    setAttempted(true);
    if (!allChecked) {
      toast.error(
        locale === 'ar'
          ? 'يجب الموافقة على جميع بنود التعهد الثلاثة'
          : 'All three oaths must be acknowledged before entering',
        { duration: 3000 }
      );
      return;
    }
    acceptPledge(true, true, true);
    toast.success(
      locale === 'ar'
        ? 'جزاك الله خيراً — أهلاً بك في فطرة وسكينة'
        : 'JazakAllah Khayr — Welcome to Fitrah & Sakina',
      { duration: 4000 }
    );
  }

  const oaths = [
    { state: oath1, setter: setOath1, key: 'pledge_oath_1' as const },
    { state: oath2, setter: setOath2, key: 'pledge_oath_2' as const },
    { state: oath3, setter: setOath3, key: 'pledge_oath_3' as const },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      dir={dir}
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 65%), ' +
          'linear-gradient(160deg, #0A0804 0%, #0E0B07 50%, #0C1009 100%)',
      }}
    >
      {/* Top gold rule */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70 z-10" />

      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl animate-fade-in-up">

          {/* Language bar */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code as Locale)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  locale === l.code
                    ? 'bg-[#D4AF37] text-[#0E0B07] border-[#D4AF37] shadow-md shadow-[#D4AF37]/30'
                    : 'border-[#D4AF37]/30 text-[#C19A6B] hover:border-[#D4AF37]/60 hover:text-[#F5ECD7]'
                }`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{
              background: 'rgba(16, 12, 6, 0.82)',
              backdropFilter: 'blur(24px)',
              borderColor: 'rgba(212,175,55,0.28)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.15)',
            }}
          >
            {/* Background Arabic watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden
            >
              <span
                className="font-arabic text-[#D4AF37]"
                style={{ fontSize: 200, opacity: 0.025, lineHeight: 1 }}
              >
                بسم الله
              </span>
            </div>

            <div className="relative z-10 p-6 sm:p-10">
              {/* Ornament + Bismillah */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="ornament-line w-14 sm:w-20" />
                  <div className="w-2 h-2 rotate-45 bg-[#D4AF37] opacity-80" />
                  <div className="ornament-line w-14 sm:w-20" />
                </div>
                <h1 className="font-arabic text-[#D4AF37] text-glow-gold leading-relaxed mb-3"
                  style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>
                  {t(locale, 'pledge_title')}
                </h1>
                <p className={`${dir === 'rtl' ? 'font-arabic' : 'font-sans'} text-[#C19A6B] text-sm leading-relaxed max-w-lg mx-auto`}>
                  {t(locale, 'pledge_subtitle')}
                </p>
              </div>

              {/* Quranic verse */}
              <div
                className="p-4 rounded-xl mb-8 text-center"
                style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.16)' }}
              >
                <p className="font-arabic text-[#F5ECD7] leading-loose text-sm sm:text-base">
                  {t(locale, 'quran_rum_2130')}
                </p>
                <p className="text-xs text-[#C19A6B]/70 mt-2">
                  {locale === 'ar' ? '— سورة الروم: ٢١' : '— Surah Ar-Rum 30:21'}
                </p>
              </div>

              {/* The Three Oaths */}
              <div className="space-y-3 mb-8">
                {oaths.map((oath, i) => {
                  const isError = attempted && !oath.state;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => oath.setter(!oath.state)}
                      className={`w-full text-start flex items-start gap-4 p-4 rounded-xl transition-all border pledge-checkbox-wrapper ${
                        oath.state
                          ? 'border-[#2E5A44]/60 bg-[#2E5A44]/12'
                          : isError
                          ? 'border-red-700/50 bg-red-950/20'
                          : 'border-[#D4AF37]/18 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/04'
                      }`}
                    >
                      {/* Checkbox visual */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            oath.state
                              ? 'bg-[#2E5A44] border-[#2E5A44]'
                              : isError
                              ? 'border-red-600/60 bg-transparent'
                              : 'border-[#D4AF37]/45 bg-transparent'
                          }`}
                        >
                          {oath.state && (
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                              <path d="M1 4.5L4.5 8L11 1" stroke="#F5ECD7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#C19A6B] font-medium tracking-wider uppercase block mb-1">
                          {locale === 'ar' ? `البند ${['١', '٢', '٣'][i]}` : `Oath ${i + 1}`}
                        </span>
                        <p className={`${dir === 'rtl' ? 'font-arabic' : 'font-sans'} text-[#F5ECD7] leading-relaxed text-sm`}>
                          {t(locale, oath.key)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 h-1 rounded-full bg-[#D4AF37]/10 overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full"
                    style={{ width: `${([oath1, oath2, oath3].filter(Boolean).length / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#C19A6B] font-mono flex-shrink-0">
                  {[oath1, oath2, oath3].filter(Boolean).length}/3
                </span>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 mb-6 p-3 rounded-lg bg-amber-950/20 border border-amber-800/25">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">⚠</span>
                <p className={`${dir === 'rtl' ? 'font-arabic' : 'font-sans'} text-xs text-amber-300/75 leading-relaxed`}>
                  {t(locale, 'pledge_warning')}
                </p>
              </div>

              {/* Accept button */}
              <button
                onClick={handleAccept}
                className={`w-full py-4 px-6 rounded-xl text-sm font-bold tracking-wide transition-all btn-gold ${
                  !allChecked ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {allChecked ? (
                  <span className={dir === 'rtl' ? 'font-arabic' : ''}>{t(locale, 'pledge_btn_accept')}</span>
                ) : (
                  <span className={dir === 'rtl' ? 'font-arabic' : ''}>
                    {locale === 'ar'
                      ? `أكمل التعهد (${[oath1, oath2, oath3].filter(Boolean).length}/3 ✓)`
                      : `Complete the oath (${[oath1, oath2, oath3].filter(Boolean).length}/3 ✓)`}
                  </span>
                )}
              </button>

              {/* Bottom ornament */}
              <div className="flex items-center gap-3 mt-6 justify-center">
                <div className="ornament-line w-16" />
                <span className="text-[#D4AF37]/40 text-xs font-arabic">✦</span>
                <div className="ornament-line w-16" />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-[#C19A6B]/50 mt-5 leading-relaxed">
            {locale === 'ar'
              ? 'جميع البيانات مشفرة | لا تواصل مباشر | جميع التفاعلات مراقبة'
              : 'All data encrypted | No direct messaging | All interactions monitored'}
          </p>
        </div>
      </div>
    </div>
  );
}
