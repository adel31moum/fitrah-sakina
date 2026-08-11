'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const WALI_CENTRES = [
  { country: 'United Kingdom', countryAr: 'المملكة المتحدة', centre: 'Islamic Sharia Council (ISC), London', contact: '+44-20-XXXX-XXXX', verified: true },
  { country: 'United States', countryAr: 'الولايات المتحدة', centre: 'Fiqh Council of North America (FCNA)', contact: '+1-XXX-XXX-XXXX', verified: true },
  { country: 'France', countryAr: 'فرنسا', centre: 'Conseil Français du Culte Musulman (CFCM)', contact: '+33-1-XXXX-XXXX', verified: true },
  { country: 'Germany', countryAr: 'ألمانيا', centre: 'Zentralrat der Muslime in Deutschland (ZMD)', contact: '+49-XXX-XXXX', verified: true },
  { country: 'Canada', countryAr: 'كندا', centre: 'Canadian Council of Muslim Theologians', contact: '+1-XXX-XXX-XXXX', verified: true },
  { country: 'Australia', countryAr: 'أستراليا', centre: 'Australian National Imams Council (ANIC)', contact: '+61-XXX-XXX-XXX', verified: true },
  { country: 'Indonesia', countryAr: 'إندونيسيا', centre: 'Majelis Ulama Indonesia (MUI)', contact: '+62-21-XXXX-XXXX', verified: true },
  { country: 'Malaysia', countryAr: 'ماليزيا', centre: 'Jabatan Kemajuan Islam Malaysia (JAKIM)', contact: '+60-3-XXXX-XXXX', verified: true },
  { country: 'South Africa', countryAr: 'جنوب أفريقيا', centre: 'Jamiatul Ulama South Africa', contact: '+27-11-XXXX-XXXX', verified: true },
  { country: 'Pakistan', countryAr: 'باكستان', centre: 'Central Ruet-e-Hilal Committee / Local Madrasah', contact: '+92-XXX-XXX-XXXX', verified: true },
];

export function WaliGateway() {
  const { locale, waliStatus, setWaliStatus, waliContact, setWaliContact, waliOtpVerified, verifyWaliOtp } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [search, setSearch] = useState('');
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [step, setStep] = useState<'search' | 'request' | 'otp' | 'confirmed'>('search');

  const filtered = WALI_CENTRES.filter(c =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.countryAr.includes(search) ||
    c.centre.toLowerCase().includes(search.toLowerCase())
  );

  function handleRequest() {
    if (!selectedCentre) {
      toast.error(locale === 'ar' ? 'يجب اختيار مركز إسلامي' : 'Select an Islamic centre');
      return;
    }
    if (!phoneInput.trim()) {
      toast.error(locale === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number');
      return;
    }
    setWaliContact(phoneInput);
    setWaliStatus('pending_assignment');
    setStep('otp');
    toast.success(locale === 'ar' ? 'تم إرسال رمز التحقق على هاتفك' : 'OTP sent to your phone');
  }

  function handleVerifyOtp() {
    // Mock: accept 1234 as valid OTP
    if (otpInput === '1234' || otpInput.length === 4) {
      verifyWaliOtp();
      setWaliStatus('assigned');
      setStep('confirmed');
      toast.success(locale === 'ar' ? 'تم التحقق من هوية الولي بنجاح' : 'Wali identity verified successfully');
    } else {
      toast.error(locale === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid OTP');
    }
  }

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="ornament-line w-16 sm:w-24" />
          <span className="text-[#D4AF37]/60 font-arabic">🛡</span>
          <div className="ornament-line w-16 sm:w-24" />
        </div>
        <h1 className="font-arabic text-2xl sm:text-3xl text-[#D4AF37] mb-2">
          {t(locale, 'wali_title')}
        </h1>
        <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm max-w-xl mx-auto`}>
          {t(locale, 'wali_subtitle')}
        </p>
      </div>

      {/* Hadith card — La Nikaha illa bi Wali */}
      <div
        className="glass-panel p-5 mb-4 text-center relative overflow-hidden"
        style={{ borderColor: 'rgba(212,175,55,0.40)' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none"
          aria-hidden
        >
          <span className="font-arabic text-[180px] text-[#D4AF37]">ولي</span>
        </div>
        <p className="font-arabic text-[#F5ECD7] text-lg leading-loose mb-2 relative z-10">
          «لَا نِكَاحَ إِلَّا بِوَلِيٍّ»
        </p>
        <p className="text-[#D4AF37]/70 text-xs relative z-10 font-arabic">
          — رواه الإمام أحمد وأبو داود والترمذي وابن ماجه — صحيح
        </p>
        <div className="ornament-line w-32 mx-auto mt-3 mb-3" />
        <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-xs relative z-10`}>
          {locale === 'ar'
            ? 'اشتراط الولي هو مذهب جمهور أهل السنة والجماعة، ومنهج السلف الصالح في تأمين حقوق المرأة المسلمة'
            : 'The requirement of a Wali is the position of the overwhelming majority of Ahl Al-Sunnah, and the way of the Pious Predecessors in securing the rights of the Muslim woman.'}
        </p>
      </div>

      {/* Sharia basis */}
      <div className="glass-panel p-5 mb-6">
        <p className="font-arabic text-[#F5ECD7] leading-loose text-sm text-center">
          {locale === 'ar'
            ? '"المرأة التي أسلمت وليس لها ولي مسلم — يتولى أمرها الإمام أو من ينوب عنه من القضاة والمراكز الإسلامية المعتمدة"'
            : '"A woman who has embraced Islam without a Muslim Wali — her guardianship is undertaken by the Imam, or whoever acts in his place from accredited Islamic centres."'}
        </p>
        <p className="text-xs text-[#C19A6B] text-center mt-2">
          {locale === 'ar' ? '— الإمام الشافعي' : '— Imam Al-Shafi\'i'}
        </p>
      </div>

      {step === 'search' && (
        <>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={locale === 'ar' ? 'ابحث عن دولة أو مركز إسلامي...' : 'Search by country or centre...'}
              className={`w-full bg-[#0E0B07] border border-[#D4AF37]/30 text-[#F5ECD7] ${dir === 'rtl' ? 'font-arabic' : ''} text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/60 placeholder-[#C19A6B]/50`}
            />
          </div>

          {/* Centres list */}
          <div className="space-y-3 mb-6">
            {filtered.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedCentre(c.centre);
                  setStep('request');
                }}
                className={`glass-panel-light p-4 rounded-xl cursor-pointer transition-all hover:border-[#D4AF37]/40 ${
                  selectedCentre === c.centre ? 'border-[#D4AF37]/50 bg-[#D4AF37]/08' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-sharia">{dir === 'rtl' ? c.countryAr : c.country}</span>
                      {c.verified && <span className="text-green-400 text-xs">✓ {t(locale, 'verified')}</span>}
                    </div>
                    <p className="text-[#F5ECD7] text-sm font-medium">{c.centre}</p>
                  </div>
                  <span className="text-[#D4AF37]/50 text-lg">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Proxy wali note */}
          <div className="glass-panel p-4 border-[#2E5A44]/40">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">🕌</span>
              <div>
                <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-1`}>
                  {locale === 'ar' ? 'بروتوكول انتظار الولي الوكيل' : 'Proxy Wali Awaiting Protocol'}
                </p>
                <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-xs leading-relaxed`}>
                  {locale === 'ar'
                    ? 'إذا كانت تعيين الولي قيد الانتظار، يُحفظ وضع التفاعل في حالة الانتظار لحين التحقق من الولي الوكيل. لا يبدأ أي حوار قبل اكتمال التحقق.'
                    : 'If Wali assignment is pending, interaction state is gracefully held until the proxy Wali is verified. No dialogue begins before verification is complete.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'request' && (
        <div className="glass-panel p-6 animate-fade-in-up">
          <h3 className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold text-lg mb-2`}>
            {selectedCentre}
          </h3>
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm mb-6`}>
            {locale === 'ar' ? 'أدخل رقم هاتف ولي الأمر لاستقبال رمز التحقق' : 'Enter the Wali phone number to receive the OTP verification code'}
          </p>
          <div className="mb-4">
            <label className="text-xs text-[#C19A6B] mb-2 block">
              {locale === 'ar' ? 'رقم هاتف الولي (مع رمز الدولة)' : 'Wali phone number (with country code)'}
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="+1234567890"
              className="w-full bg-[#0E0B07] border border-[#D4AF37]/30 text-[#F5ECD7] font-mono text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/60"
              dir="ltr"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('search')} className="px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-[#C19A6B] text-sm">
              {t(locale, 'back')}
            </button>
            <button onClick={handleRequest} className="flex-1 btn-gold py-2 rounded-xl text-sm font-bold">
              {locale === 'ar' ? 'إرسال رمز التحقق' : 'Send OTP'}
            </button>
          </div>
        </div>
      )}

      {step === 'otp' && (
        <div className="glass-panel p-6 animate-fade-in-up text-center">
          <div className="text-5xl mb-4">📱</div>
          <h3 className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold text-lg mb-2`}>
            {locale === 'ar' ? 'التحقق من هوية الولي (2FA)' : 'Wali Identity Verification (2FA)'}
          </h3>
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm mb-6`}>
            {locale === 'ar'
              ? `تم إرسال رمز التحقق إلى ${phoneInput} — أدخل الرمز هنا`
              : `OTP sent to ${phoneInput} — enter the code below`}
          </p>
          <p className="text-xs text-[#C19A6B]/60 mb-4">
            {locale === 'ar' ? '(للعرض التجريبي: أدخل 1234)' : '(Demo: enter 1234)'}
          </p>
          <input
            type="text"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0000"
            className="w-32 mx-auto block bg-[#0E0B07] border border-[#D4AF37]/40 text-[#F5ECD7] font-mono text-2xl text-center rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]/80 tracking-widest"
            dir="ltr"
            maxLength={4}
          />
          <button onClick={handleVerifyOtp} className="btn-gold mt-4 px-8 py-2 rounded-xl text-sm font-bold">
            {locale === 'ar' ? 'تحقق من الرمز' : 'Verify Code'}
          </button>
        </div>
      )}

      {step === 'confirmed' && (
        <div className="glass-panel p-8 animate-fade-in-up text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] font-bold text-xl mb-3`}>
            {locale === 'ar' ? 'تم التحقق من الولي الشرعي' : 'Wali Successfully Verified'}
          </h3>
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm mb-2`}>
            {selectedCentre}
          </p>
          <span className="badge-sharia">{t(locale, 'verified')}</span>
          <div className="mt-6 p-4 rounded-xl bg-[#2E5A44]/15 border border-[#2E5A44]/30">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-green-300 text-sm`}>
              {locale === 'ar'
                ? 'يمكن الآن المضي في حوار النكاح تحت إشراف الولي المعتمد'
                : 'You may now proceed with the marriage dialogue under the supervision of the verified Wali'}
            </p>
          </div>
          <div className="mt-4 text-xs text-[#C19A6B]/60">
            {t(locale, 'all_interactions_monitored')}
          </div>
        </div>
      )}
    </div>
  );
}
