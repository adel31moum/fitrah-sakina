'use client';

/**
 * OnboardingWizard — يظهر مرة واحدة بعد القَسَم مباشرة
 * يسأل المستخدم عن دوره ثم يعرض مسار خطواته الشخصي
 */

import React, { useState } from 'react';
import { useFitrahStore, UserRole } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

// ── نصوص ثنائية اللغة ──────────────────────────────────────────────
const TX = {
  ar: {
    welcome: 'أهلاً بك في فطرة وسكينة',
    sub: 'لنبدأ بمعرفة دورك حتى نوجّهك مباشرةً إلى ما يخصك',
    chooseRole: 'من أنت؟',
    groom:  { icon: '👤', label: 'عريس', desc: 'أبحث عن زوجة صالحة' },
    bride:  { icon: '👤', label: 'عروس', desc: 'أبحث عن زوج صالح' },
    wali:   { icon: '🛡', label: 'وليّ أمر', desc: 'أُشرف على تزويج موليّتي' },
    visitor:{ icon: '📖', label: 'زائر / باحث', desc: 'أتعرّف على المنصة' },
    yourPath: 'مسارك خطوة بخطوة',
    start: 'ابدأ الآن',
    change: 'تغيير الدور',
    paths: {
      groom: [
        { icon: '🤖', step: '١', title: 'استشر المساعد الذكي', desc: 'اسأله عن شروط النكاح، المهر، والولاية' },
        { icon: '🛡', step: '٢', title: 'أدخل بيانات الوليّ', desc: 'ابعث له رمز التحقق لتوثيق موافقته' },
        { icon: '📚', step: '٣', title: 'أعِدّ كتاب الشروط', desc: 'سجّل شروطك بالتفصيل في ملف موثّق' },
        { icon: '📜', step: '٤', title: 'أصدر الميثاق', desc: 'احصل على وثيقة PDF رسمية للعاقد' },
      ],
      bride: [
        { icon: '🤖', step: '١', title: 'استشري المساعد الذكي', desc: 'اسأليه عن حقوقك وشروط النكاح' },
        { icon: '🛡', step: '٢', title: 'ربط الوليّ بالمنصة', desc: 'أرسلي له رمز التحقق ليُتابع ويوافق' },
        { icon: '📚', step: '٣', title: 'ضعي شروطك في الكتاب', desc: 'المهر، السكن، التعليم، وكل ما تودّين' },
        { icon: '📜', step: '٤', title: 'الميثاق النهائي', desc: 'وثيقة تُسلَّم للعاقد بعد موافقة الطرفين' },
      ],
      wali: [
        { icon: '🛡', step: '١', title: 'بوابة الوليّ', desc: 'أدخل بياناتك وابدأ الإشراف' },
        { icon: '📋', step: '٢', title: 'راجع شروط الكتاب', desc: 'وافق على كل بند أو أضف ملاحظاتك' },
        { icon: '🤖', step: '٣', title: 'استشر المساعد الذكي', desc: 'أسئلة فقهية حول إجراءات الزواج' },
        { icon: '📜', step: '٤', title: 'أقرّ الميثاق', desc: 'توقيعك الرقمي يُنهي العملية' },
      ],
      visitor: [
        { icon: '🤖', step: '١', title: 'تعرّف على المساعد', desc: 'اطرح أسئلتك الفقهية بحرية' },
        { icon: '📖', step: '٢', title: 'بوابة الدعوة', desc: 'شارك المنصة وادعُ أصحابك' },
        { icon: '📜', step: '٣', title: 'مبادئ المنهج', desc: 'اقرأ أسس المنصة الشرعية' },
      ],
    },
    moduleMap: {
      groom:   'council',
      bride:   'council',
      wali:    'wali',
      visitor: 'council',
    } as Record<UserRole, string>,
    moduleLabel: {
      groom:   '🤖 افتح المساعد الذكي',
      bride:   '🤖 افتح المساعد الذكي',
      wali:    '🛡 افتح بوابة الوليّ',
      visitor: '📖 تصفّح المنصة',
    } as Record<UserRole, string>,
  },
  en: {
    welcome: 'Welcome to Fitrah & Sakina',
    sub: 'Let us know your role so we can guide you directly to what matters',
    chooseRole: 'Who are you?',
    groom:  { icon: '👤', label: 'Groom', desc: 'Seeking a righteous wife' },
    bride:  { icon: '👤', label: 'Bride', desc: 'Seeking a righteous husband' },
    wali:   { icon: '🛡', label: 'Guardian (Wali)', desc: 'Overseeing a marriage arrangement' },
    visitor:{ icon: '📖', label: 'Visitor / Researcher', desc: 'Exploring the platform' },
    yourPath: 'Your Step-by-Step Path',
    start: 'Get Started',
    change: 'Change Role',
    paths: {
      groom: [
        { icon: '🤖', step: '1', title: 'Consult the AI Advisor', desc: 'Ask about marriage conditions, mahr & guardianship' },
        { icon: '🛡', step: '2', title: 'Register Your Wali', desc: 'Send him a verification code to confirm his role' },
        { icon: '📚', step: '3', title: 'Build the Conditions Book', desc: 'Record your terms in a documented file' },
        { icon: '📜', step: '4', title: 'Issue the Covenant', desc: 'Receive an official PDF for the marriage officiant' },
      ],
      bride: [
        { icon: '🤖', step: '1', title: 'Consult the AI Advisor', desc: 'Ask about your rights and marriage conditions' },
        { icon: '🛡', step: '2', title: 'Link Your Guardian', desc: 'Send him a code so he can follow and approve' },
        { icon: '📚', step: '3', title: 'Add Your Conditions', desc: 'Mahr, housing, education and anything you need' },
        { icon: '📜', step: '4', title: 'The Final Covenant', desc: 'A document handed to the officiant after mutual approval' },
      ],
      wali: [
        { icon: '🛡', step: '1', title: 'Wali Gateway', desc: 'Enter your details and start oversight' },
        { icon: '📋', step: '2', title: 'Review the Conditions Book', desc: 'Approve each clause or add your remarks' },
        { icon: '🤖', step: '3', title: 'Consult the AI Advisor', desc: 'Fiqh questions about marriage procedures' },
        { icon: '📜', step: '4', title: 'Approve the Covenant', desc: 'Your digital signature finalises the process' },
      ],
      visitor: [
        { icon: '🤖', step: '1', title: 'Meet the AI Advisor', desc: 'Ask your Islamic questions freely' },
        { icon: '📖', step: '2', title: 'Dawah Portal', desc: 'Share the platform and invite friends' },
        { icon: '📜', step: '3', title: 'Platform Principles', desc: 'Read the Islamic foundations of this platform' },
      ],
    },
    moduleMap: {
      groom:   'council',
      bride:   'council',
      wali:    'wali',
      visitor: 'council',
    } as Record<UserRole, string>,
    moduleLabel: {
      groom:   '🤖 Open AI Advisor',
      bride:   '🤖 Open AI Advisor',
      wali:    '🛡 Open Wali Gateway',
      visitor: '📖 Browse Platform',
    } as Record<UserRole, string>,
  },
};

// ── الأدوار ──────────────────────────────────────────────────────────
const ROLES: UserRole[] = ['groom', 'bride', 'wali', 'visitor'];

interface Props {
  onDone: () => void;
}

export function OnboardingWizard({ onDone }: Props) {
  const { locale, setRole, setActiveModule, role } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isAr = locale === 'ar';
  const tx = isAr ? TX.ar : TX.en;

  const [selected, setSelected] = useState<UserRole | null>(null);
  const [step, setStep] = useState<'choose' | 'path'>('choose');

  function handleSelect(r: UserRole) {
    setSelected(r);
  }

  function handleConfirm() {
    if (!selected) return;
    setRole(selected);
    setStep('path');
  }

  function handleStart() {
    if (!selected) return;
    setActiveModule(tx.moduleMap[selected]);
    onDone();
  }

  const pathItems = selected ? tx.paths[selected] : [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      dir={dir}
      style={{ background: 'rgba(8,6,3,0.92)', backdropFilter: 'blur(16px)' }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg,rgba(30,22,8,0.98),rgba(20,15,5,0.99))',
          border: '1px solid rgba(212,175,55,0.25)',
          boxShadow: '0 0 60px rgba(212,175,55,0.08)',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#D4AF37,transparent)' }} />

        <div className="p-6 sm:p-8">

          {/* ─── STEP 1: اختيار الدور ─────────────────────────────── */}
          {step === 'choose' && (
            <>
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">بسم الله</div>
                <h2 className="font-arabic text-xl sm:text-2xl text-[#D4AF37] font-bold mb-1">
                  {tx.welcome}
                </h2>
                <p className="text-[#C19A6B]/70 text-sm">{tx.sub}</p>
              </div>

              <p className="font-arabic text-[#C19A6B] text-sm mb-3 text-center">{tx.chooseRole}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map((r) => {
                  const info = tx[r] as { icon: string; label: string; desc: string };
                  const active = selected === r;
                  return (
                    <button
                      key={r}
                      onClick={() => handleSelect(r)}
                      className="rounded-xl p-4 text-start transition-all"
                      style={{
                        background: active
                          ? 'linear-gradient(135deg,rgba(212,175,55,0.18),rgba(193,154,107,0.10))'
                          : 'rgba(255,255,255,0.03)',
                        border: active ? '1.5px solid #D4AF37' : '1px solid rgba(212,175,55,0.12)',
                        boxShadow: active ? '0 0 20px rgba(212,175,55,0.12)' : 'none',
                      }}
                    >
                      <div className="text-2xl mb-1">{info.icon}</div>
                      <div className="font-arabic text-[#D4AF37] font-semibold text-sm">{info.label}</div>
                      <div className="text-[#C19A6B]/60 text-xs mt-0.5">{info.desc}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="btn-primary w-full py-3 rounded-xl font-arabic text-base disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isAr ? 'متابعة ←' : 'Continue →'}
              </button>
            </>
          )}

          {/* ─── STEP 2: المسار الشخصي ───────────────────────────── */}
          {step === 'path' && selected && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-xl">{(tx[selected] as { icon: string }).icon}</span>
                  <span className="font-arabic text-[#D4AF37] font-semibold text-sm">
                    {(tx[selected] as { label: string }).label}
                  </span>
                </div>
                <h3 className="font-arabic text-lg text-[#D4AF37] font-bold">{tx.yourPath}</h3>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                {pathItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,175,55,0.10)',
                    }}
                  >
                    {/* Step number circle */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: 'linear-gradient(135deg,rgba(212,175,55,0.25),rgba(193,154,107,0.15))',
                        border: '1px solid rgba(212,175,55,0.35)',
                        color: '#D4AF37',
                        fontFamily: 'var(--font-arabic)',
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span>{item.icon}</span>
                        <span className="font-arabic text-[#D4AF37] text-sm font-semibold">{item.title}</span>
                      </div>
                      <p className="text-[#C19A6B]/65 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <button
                onClick={handleStart}
                className="btn-primary w-full py-3 rounded-xl font-arabic text-base mb-2"
              >
                {tx.moduleLabel[selected]}
              </button>

              <button
                onClick={() => { setSelected(null); setStep('choose'); }}
                className="btn-ghost w-full py-2 rounded-xl font-arabic text-sm"
              >
                {tx.change}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
