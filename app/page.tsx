'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PledgeGateway } from '@/components/gateway/PledgeGateway';
import { Navigation } from '@/components/gateway/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { VerseStrip } from '@/components/VerseStrip';
import { CouncilDashboard } from '@/components/council/CouncilDashboard';
import { WaliGateway } from '@/components/wali/WaliGateway';
import { DawahPortal } from '@/components/dawah/DawahPortal';
import { CovenantModule } from '@/components/covenant/CovenantModule';
import { IntroScreen } from '@/components/IntroScreen';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { SadaqaWidget } from '@/components/SadaqaWidget';
import { SalafiChannel } from '@/components/SalafiChannel';
import { StoryDetail } from '@/components/StoryDetail';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MatchingEngine } from '@/components/matching/MatchingEngine';
import { SubscriptionWidget } from '@/components/payment/SubscriptionWidget';
import { RegistrationForm } from '@/components/RegistrationForm';
import { AutoPoster } from '@/components/marketing/AutoPoster';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

function MainApp() {
  const { activeModule, locale, onboardingDone, completeOnboarding, activeStoryId } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [dir, locale]);

  return (
    <div className="min-h-dvh bg-desert flex flex-col">
      {!onboardingDone && <OnboardingWizard onDone={completeOnboarding} />}
      {activeStoryId && <StoryDetail />}

      <Navigation />

      <main className="flex-1">
        {activeModule === 'council' && (
          <>
            <HeroSection />
            <VerseStrip />
            <SalafiChannel />
            <SadaqaWidget />
            <CouncilDashboard />
            {/* ── Registration form — smooth-scroll target ── */}
            <RegistrationForm />
          </>
        )}
        {activeModule === 'matching'  && <MatchingEngine />}
        {activeModule === 'wali'      && <WaliGateway />}
        {activeModule === 'dawah'     && <DawahPortal />}
        {activeModule === 'covenant'  && <CovenantModule />}
        {activeModule === 'sub'       && <SubscriptionWidget />}
        {activeModule === 'autoposter' && <AutoPoster />}
        {activeModule === 'admin'     && <AdminDashboard />}
      </main>

      <footer dir={dir} className="border-t border-[#D4AF37]/12 pt-8 pb-6 px-4 mt-12"
        style={{ background: 'rgba(8,6,3,0.96)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Row 1: Brand + tagline ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <div className="text-center sm:text-right">
              <div className="font-arabic text-[#D4AF37] font-bold text-lg mb-0.5">فطرة وسكينة</div>
              <div className="text-[#C19A6B]/50 text-xs">Fitrah &amp; Sakina · منهج السلف الصالح</div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#C19A6B]/50 flex-wrap justify-center">
              <span className="font-arabic">🔐 بيانات مشفرة</span>
              <span>·</span>
              <span className="font-arabic">📵 لا تواصل مباشر</span>
              <span>·</span>
              <span className="font-arabic">🛡 إشراف الولي</span>
            </div>
            <div className="font-arabic text-[#D4AF37]/35 text-3xl">﷽</div>
          </div>

          {/* ── Ornament ── */}
          <div className="ornament-line w-full opacity-40" />

          {/* ── Row 2: Signature — البحار الغريب ── */}
          <div className="text-center py-2">
            <div
              className="inline-flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(193,154,107,0.04) 100%)',
                border: '1px solid rgba(212,175,55,0.18)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🌊</span>
                <span className="font-arabic text-[#D4AF37]/85 font-semibold text-sm">
                  رؤية وصناعة: البحار الغريب
                </span>
                <span className="text-xl">🌊</span>
              </div>
              <p className="font-arabic text-[#C19A6B]/65 text-xs leading-relaxed">
                إبحارٌ نحو العفاف والسكينة عبر الآفاق
              </p>
            </div>
          </div>

          {/* ── CCP / Postal account (hidden — activate when ready) ── */}
          {/* ADMIN_SHOW_CCP=true → reveal this section to the public */}
          {process.env.NEXT_PUBLIC_SHOW_CCP === 'true' && (
            <div className="border border-[#D4AF37]/15 rounded-xl p-4 text-center bg-[#D4AF37]/04">
              <p className="font-arabic text-[#D4AF37]/70 text-xs font-semibold mb-1">
                {locale === 'ar' ? '🏦 الحساب البريدي (CCP) للتبرع المباشر' : '🏦 Postal Account (CCP) — Direct donation'}
              </p>
              <p className="font-arabic text-[#C19A6B]/70 text-xs" translate="no">
                CCP: 0012345678 — الجزائر
              </p>
              <p className="font-arabic text-[#C19A6B]/40 text-[10px] mt-1">
                {locale === 'ar'
                  ? 'للدعم المباشر · ٧٠٪ من الاشتراكات تذهب لهذا الحساب'
                  : 'Direct support · 70% of subscriptions go to this account'}
              </p>
            </div>
          )}

          {/* ── Row 3: Legal ── */}
          <div className="text-center font-arabic text-[#C19A6B]/35 text-[10px]">
            {locale === 'ar'
              ? '© ١٤٤٧هـ / ٢٠٢٦م · فطرة وسكينة · جميع الحقوق محفوظة · لا يجوز إعادة النشر دون إذن'
              : '© 1447H / 2026 · Fitrah & Sakina · All rights reserved'}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [mounted,       setMounted      ] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [introVisible,  setIntroVisible ] = useState(true);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    safetyRef.current = setTimeout(() => {
      setIntroComplete(true);
      setIntroVisible(false);
    }, 32_000);
    return () => { if (safetyRef.current) clearTimeout(safetyRef.current); };
  }, [mounted]);

  function handleIntroComplete() {
    if (safetyRef.current) clearTimeout(safetyRef.current);
    setIntroComplete(true);
    setTimeout(() => setIntroVisible(false), 1_200);
  }

  if (!mounted) {
    return (
      <div className="min-h-dvh bg-desert flex flex-col items-center justify-center gap-6">
        <div className="font-arabic text-[#D4AF37] text-4xl" style={{ textShadow: '0 0 32px rgba(212,175,55,0.45)' }}>﷽</div>
        <div className="font-arabic text-[#D4AF37]/70 text-xl animate-pulse">فطرة وسكينة</div>
        <div className="flex gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 animate-pulse"
              style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {introVisible && <IntroScreen onComplete={handleIntroComplete} />}
      <div
        aria-hidden={!introComplete}
        style={{
          opacity: introComplete ? 1 : 0,
          visibility: introComplete ? 'visible' : 'hidden',
          transition: 'opacity 0.8s ease',
          ...(introComplete ? {} : { pointerEvents: 'none' }),
        }}
      >
        <PledgeGateway>
          <MainApp />
        </PledgeGateway>
      </div>
    </>
  );
}
