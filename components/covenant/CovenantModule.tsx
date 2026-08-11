'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const PROPHETIC_SUPPLICATIONS = [
  {
    ar: 'بَارَكَ اللهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    en: "May Allah bless you, bless upon you, and join you both in goodness.",
    source: 'Abu Dawud',
  },
  {
    ar: 'اللَّهُمَّ بَارِكْ لَهُمَا فِيمَا رَزَقْتَهُمَا، وَاجْمَعْ شَمْلَهُمَا فِي خَيْرٍ وَعَافِيَةٍ',
    en: 'O Allah, bless them in what You have provided them, and unite them in goodness and wellbeing.',
    source: 'Ibn Al-Sunni',
  },
  {
    ar: 'اللَّهُمَّ اجْعَلْ بَيْنَهُمَا أُلْفَةً وَمَحَبَّةً وَرَحْمَةً',
    en: 'O Allah, place between them harmony, love, and mercy.',
    source: 'Athir tradition',
  },
];

const MEETING_SLOTS = [
  { day: 'السبت', dayEn: 'Saturday', slots: ['10:00', '14:00', '16:00'] },
  { day: 'الأحد', dayEn: 'Sunday', slots: ['11:00', '15:00', '17:00'] },
  { day: 'الاثنين', dayEn: 'Monday', slots: ['10:00', '13:00', '16:00'] },
  { day: 'الثلاثاء', dayEn: 'Tuesday', slots: ['11:00', '14:00'] },
];

export function CovenantModule() {
  const {
    locale, bookConditions, mahrSettings, tentSettings,
    interactionLocked, covenantDossier,
    generateDossier, lockInteraction, initiateCovenant,
    waliStatus,
  } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [groomAgrees, setGroomAgrees] = useState(false);
  const [brideAgrees, setBrideAgrees] = useState(false);
  const [waliAgrees, setWaliAgrees] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [covenantStep, setCovenantStep] = useState<'review' | 'agree' | 'complete'>('review');

  const lockedConditions = bookConditions.filter(c => c.locked);
  const allAgree = groomAgrees && brideAgrees && waliAgrees;

  function handleMutualAgreement() {
    if (!allAgree) {
      toast.error(locale === 'ar' ? 'يجب موافقة الجميع' : 'All parties must agree');
      return;
    }
    generateDossier();
    lockInteraction();
    initiateCovenant();
    setCovenantStep('complete');
    toast.success(locale === 'ar' ? 'تم تفعيل الميثاق الغليظ — بارك الله لكما' : 'The Solemn Covenant is sealed — BaarakAllahu Lakuma');
  }

  if (interactionLocked || covenantStep === 'complete') {
    return (
      <div dir={dir} className="max-w-3xl mx-auto px-4 py-8">
        <div className="glass-panel p-8 text-center animate-fade-in-up relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none"
            aria-hidden
          >
            <span className="font-arabic text-[200px] text-[#D4AF37]">ميثاق</span>
          </div>
          <div className="text-6xl mb-6">📜</div>
          <h1 className="font-arabic text-2xl text-[#D4AF37] text-glow-gold mb-3">
            {t(locale, 'covenant_title')}
          </h1>
          <p className="font-arabic text-[#F5ECD7] text-lg leading-relaxed mb-2">
            ﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾
          </p>
          <p className="text-[#C19A6B] text-sm mb-6">
            {locale === 'ar' ? '— سورة النساء: ٢١' : '— An-Nisa 4:21'}
          </p>

          {/* Supplications */}
          <div className="space-y-4 mb-8">
            {PROPHETIC_SUPPLICATIONS.map((d, i) => (
              <div key={i} className="glass-panel-light p-4 rounded-xl text-center">
                <p className="font-arabic text-[#F5ECD7] leading-loose text-base mb-1">{d.ar}</p>
                {dir === 'ltr' && <p className="text-[#C19A6B] text-xs italic">{d.en}</p>}
                <p className="text-[#D4AF37]/60 text-xs mt-1">— {d.source}</p>
              </div>
            ))}
          </div>

          {/* Dossier */}
          {covenantDossier.generated && (
            <div className="glass-panel-light p-4 rounded-xl mb-6 border-[#D4AF37]/40">
              <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold mb-2`}>
                {t(locale, 'generate_dossier')}
              </p>
              <p className="font-mono text-[#C19A6B] text-xs mb-3">
                Token: {covenantDossier.downloadToken}
              </p>
              <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-xs text-[#C19A6B] leading-relaxed`}>
                {locale === 'ar'
                  ? 'ملف الخطبة الشرعي المشفَّر يتضمن: شروط الكتاب، إعدادات الخيمة، مقدار المهر، وهوية الولي. يُرسل للولي مباشرة لإتمام الإجراءات الشرعية.'
                  : 'The encrypted Engagement Dossier contains: Book conditions, Tent settings, Mahr details, and Wali contact. Sent directly to the Wali to complete Sharia procedures.'}
              </p>
            </div>
          )}

          {/* Wali handover */}
          <div className="glass-panel p-4 rounded-xl border-[#2E5A44]/40 mb-6">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold mb-2`}>
              {t(locale, 'handover_protocol')}
            </p>
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm`}>
              {locale === 'ar'
                ? 'تم تسليم بيانات الولي الشرعي للأطراف المعنية. تتوقف جميع نوافذ التفاعل الرقمي على هذا الطلب. اللقاء الشخصي القادم تحت إشراف الولي مباشرة.'
                : 'Wali contact details have been transmitted to relevant parties. All digital interaction windows for this request are now closed. The next meeting will be in person under direct Wali supervision.'}
            </p>
          </div>

          {/* Schedule meeting */}
          <div>
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] font-medium mb-3`}>
              {t(locale, 'meeting_schedule')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MEETING_SLOTS.map(s => (
                <div key={s.day} className="glass-panel-light p-3 rounded-xl">
                  <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] text-xs font-bold mb-2`}>
                    {dir === 'rtl' ? s.day : s.dayEn}
                  </p>
                  {s.slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => {
                        setScheduledSlot(`${s.day} ${slot}`);
                        toast.success(locale === 'ar' ? `تم جدولة اللقاء: ${s.day} ${slot}` : `Meeting scheduled: ${s.dayEn} ${slot}`);
                      }}
                      className={`block w-full text-center px-2 py-1 rounded text-xs mb-1 border transition-all ${
                        scheduledSlot === `${s.day} ${slot}`
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                          : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Couple illustration banner with covenant verse ── */}
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ minHeight: '200px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/covenant-couple.jpg')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(14,11,7,0.55) 0%, rgba(14,11,7,0.88) 100%)' }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="ornament-line w-16 sm:w-24" />
            <span className="text-[#D4AF37] text-2xl">📜</span>
            <div className="ornament-line w-16 sm:w-24" />
          </div>
          <h1 className="font-arabic text-2xl sm:text-3xl text-[#D4AF37] mb-3 drop-shadow-lg">
            {t(locale, 'covenant_title')}
          </h1>
          <p className="font-arabic text-[#F5ECD7] text-xl leading-loose mb-2 drop-shadow">
            ﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾
          </p>
          <p className="text-[#D4AF37]/70 text-sm font-arabic">
            {locale === 'ar' ? 'سورة النساء — ٢١' : 'An-Nisa 4:21'}
          </p>
        </div>
      </div>

      {covenantStep === 'review' && (
        <div className="space-y-4">
          {/* Summary of agreed conditions */}
          <div className="glass-panel p-5">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold mb-3`}>
              {locale === 'ar' ? 'شروط الكتاب المتفق عليها' : 'Agreed Book Conditions'}
            </p>
            {lockedConditions.length === 0 ? (
              <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm`}>
                {locale === 'ar' ? 'لم يُقفَل أي شرط بعد — أكمل الكتاب أولاً' : 'No locked conditions yet — complete The Book first'}
              </p>
            ) : (
              lockedConditions.map(c => (
                <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-[#D4AF37]/08">
                  <span className="text-green-400 text-xs">🔒</span>
                  <span className="badge-sharia">{c.category}</span>
                  <span className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-xs`}>{c.value}</span>
                </div>
              ))
            )}
          </div>

          {/* Mahr summary */}
          <div className="glass-panel-light p-4 rounded-xl">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold mb-2`}>
              {t(locale, 'mahr_label')}
            </p>
            <p className={`text-[#F5ECD7] text-sm font-mono`}>
              {mahrSettings.amount.toLocaleString()} {mahrSettings.currency}
              &nbsp;·&nbsp;
              {mahrSettings.paymentType === 'immediate'
                ? (locale === 'ar' ? 'معجَّل' : 'Immediate')
                : mahrSettings.paymentType === 'deferred'
                ? (locale === 'ar' ? 'مؤجَّل' : 'Deferred')
                : (locale === 'ar' ? 'منقسم' : 'Split')}
            </p>
          </div>

          {/* Tent summary */}
          <div className="glass-panel-light p-4 rounded-xl">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold mb-2`}>
              {t(locale, 'tent_title')}
            </p>
            <p className={`text-[#C19A6B] text-xs`}>
              {tentSettings.location || (locale === 'ar' ? 'لم يُحدد السكن' : 'Housing not specified')}
              {tentSettings.hijrahTarget && ` · ${locale === 'ar' ? 'هجرة إلى: ' : 'Hijrah to: '}${tentSettings.hijrahTarget}`}
            </p>
          </div>

          <button onClick={() => setCovenantStep('agree')} className="w-full btn-gold py-3 rounded-xl font-bold">
            {locale === 'ar' ? 'المضي نحو الإبرام' : 'Proceed to Ratification'}
          </button>
        </div>
      )}

      {covenantStep === 'agree' && (
        <div className="glass-panel p-6 animate-fade-in-up">
          <p className="font-arabic text-[#F5ECD7] text-lg leading-loose text-center mb-6">
            ﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾
          </p>
          <div className="space-y-4 mb-6">
            {[
              { label: locale === 'ar' ? 'موافقة العريس' : 'Groom\'s Agreement', state: groomAgrees, setter: setGroomAgrees },
              { label: locale === 'ar' ? 'موافقة العروس' : 'Bride\'s Agreement', state: brideAgrees, setter: setBrideAgrees },
              { label: locale === 'ar' ? 'موافقة الولي' : 'Wali\'s Agreement', state: waliAgrees, setter: setWaliAgrees },
            ].map(({ label, state, setter }, i) => (
              <label key={i} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${state ? 'border-[#2E5A44]/50 bg-[#2E5A44]/12' : 'border-[#D4AF37]/20'}`}>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${state ? 'bg-[#2E5A44] border-[#2E5A44]' : 'border-[#D4AF37]/40'}`}
                  onClick={() => setter(!state)}
                >
                  {state && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4.5L4.5 8L11 1" stroke="#F5ECD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm`}>{label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleMutualAgreement}
            disabled={!allAgree}
            className={`w-full btn-gold py-3 rounded-xl font-bold ${!allAgree ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {locale === 'ar' ? 'إبرام الميثاق الغليظ — بسم الله' : 'Seal the Solemn Covenant — Bismillah'}
          </button>
          <button onClick={() => setCovenantStep('review')} className="w-full mt-2 text-[#C19A6B] text-sm py-2">
            {t(locale, 'back')}
          </button>
        </div>
      )}
    </div>
  );
}
