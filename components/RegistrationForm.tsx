'use client';

import React, { useState, useId } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { toast } from 'sonner';

const COUNTRIES = [
  { code: 'DZ', flag: '🇩🇿', ar: 'الجزائر',    en: 'Algeria'      },
  { code: 'MA', flag: '🇲🇦', ar: 'المغرب',      en: 'Morocco'      },
  { code: 'TN', flag: '🇹🇳', ar: 'تونس',        en: 'Tunisia'      },
  { code: 'EG', flag: '🇪🇬', ar: 'مصر',          en: 'Egypt'        },
  { code: 'SA', flag: '🇸🇦', ar: 'السعودية',     en: 'Saudi Arabia' },
  { code: 'AE', flag: '🇦🇪', ar: 'الإمارات',     en: 'UAE'          },
  { code: 'FR', flag: '🇫🇷', ar: 'فرنسا',        en: 'France'       },
  { code: 'DE', flag: '🇩🇪', ar: 'ألمانيا',      en: 'Germany'      },
  { code: 'GB', flag: '🇬🇧', ar: 'بريطانيا',     en: 'UK'           },
  { code: 'CA', flag: '🇨🇦', ar: 'كندا',         en: 'Canada'       },
  { code: 'US', flag: '🇺🇸', ar: 'الولايات المتحدة', en: 'USA'       },
  { code: 'SE', flag: '🇸🇪', ar: 'السويد',       en: 'Sweden'       },
  { code: 'NO', flag: '🇳🇴', ar: 'النرويج',      en: 'Norway'       },
  { code: 'NL', flag: '🇳🇱', ar: 'هولندا',       en: 'Netherlands'  },
  { code: 'BE', flag: '🇧🇪', ar: 'بلجيكا',       en: 'Belgium'      },
  { code: 'ID', flag: '🇮🇩', ar: 'إندونيسيا',    en: 'Indonesia'    },
  { code: 'MY', flag: '🇲🇾', ar: 'ماليزيا',      en: 'Malaysia'     },
  { code: 'TR', flag: '🇹🇷', ar: 'تركيا',        en: 'Turkey'       },
  { code: 'PK', flag: '🇵🇰', ar: 'باكستان',      en: 'Pakistan'     },
  { code: 'SO', flag: '🇸🇴', ar: 'الصومال',      en: 'Somalia'      },
  { code: 'OT', flag: '🌍', ar: 'أخرى',           en: 'Other'        },
];

interface Step1 {
  role: 'youth' | 'wali' | '';
  name: string;
  age: string;
  country: string;
  whatsapp: string;
  plan: 'free' | 'premium';
  needy: boolean;
}

interface Step2 {
  manhaj: 'salafi' | 'other' | '';
  hijrahReady: boolean;
  hijrahTarget: string;
  quranJuz: string;
  mahr: string;
  conditions: string;
  waliName: string;
  waliPhone: string;
}

export function RegistrationForm() {
  const { locale, sessionId } = useFitrahStore();
  const isAr = locale === 'ar';
  const formId = useId();

  const [phase, setPhase] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1>({
    role: '', name: '', age: '', country: '', whatsapp: '', plan: 'free', needy: false,
  });
  const [step2, setStep2] = useState<Step2>({
    manhaj: 'salafi', hijrahReady: false, hijrahTarget: '',
    quranJuz: '', mahr: '', conditions: '', waliName: '', waliPhone: '',
  });
  const [errors1, setErrors1] = useState<Partial<Record<keyof Step1, string>>>({});
  const [errors2, setErrors2] = useState<Partial<Record<keyof Step2, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string; plan: string; message: string; freeWeek?: boolean } | null>(null);

  /* ── Validation ── */
  function validate1(): boolean {
    const e: Partial<Record<keyof Step1, string>> = {};
    if (!step1.role)    e.role    = isAr ? 'اختر صفتك'       : 'Select your role';
    if (!step1.name.trim() || step1.name.length < 2)
                        e.name    = isAr ? 'أدخل اسمك الكريم' : 'Enter your name';
    if (!step1.age || isNaN(Number(step1.age)) || Number(step1.age) < 18 || Number(step1.age) > 70)
                        e.age     = isAr ? 'عمر صحيح (١٨–٧٠)' : 'Valid age (18–70)';
    if (!step1.country) e.country = isAr ? 'اختر بلدك'         : 'Select your country';
    if (!step1.whatsapp.trim() || step1.whatsapp.length < 6)
                        e.whatsapp= isAr ? 'رقم واتساب صحيح'   : 'Valid WhatsApp number';
    setErrors1(e);
    return Object.keys(e).length === 0;
  }

  function validate2(): boolean {
    const e: Partial<Record<keyof Step2, string>> = {};
    if (!step2.manhaj)  e.manhaj  = isAr ? 'حدّد المنهج'       : 'Select methodology';
    if (step2.hijrahReady && !step2.hijrahTarget.trim())
                        e.hijrahTarget = isAr ? 'أين تريد الهجرة؟' : 'Where to?';
    if (step1.role === 'youth' && !step2.waliName.trim())
                        e.waliName = isAr ? 'اسم الولي مطلوب'  : 'Wali name required';
    setErrors2(e);
    return Object.keys(e).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit() {
    if (!validate2()) return;
    setLoading(true);
    const isNeedy = step1.needy;
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...step1, ...step2,
          age: Number(step1.age),
          sessionId,
          freeWeek: isNeedy,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const responseData = { ...data, freeWeek: isNeedy };
        setSuccess(responseData);
        toast.success(isAr
          ? (isNeedy ? '🌙 تم منحك أسبوعاً مجانياً — بارك الله فيك' : data.message)
          : (isNeedy ? '🌙 Free week granted — JazakAllah Khayr' : data.message)
        );
      } else {
        toast.error(isAr ? 'حدث خطأ — حاول مرة أخرى' : 'Error — please retry');
      }
    } catch {
      toast.error(isAr ? 'تعذر الاتصال — تحقق من الإنترنت' : 'Connection error');
    } finally {
      setLoading(false);
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div id="register-section" className="max-w-lg mx-auto px-4 py-12 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="glass-panel p-8 animate-fade-in-up">
          <div className="text-5xl mb-4">{success.freeWeek ? '🌙' : '🌟'}</div>
          <h3 className="font-arabic text-[#D4AF37] text-2xl font-bold mb-3">
            {isAr ? 'تم التسجيل بنجاح' : 'Registration Successful'}
          </h3>
          <div className="bg-[#2E5A44]/20 border border-[#2E5A44]/40 rounded-xl p-4 mb-4">
            <p className="font-arabic text-[#7EC8A4] text-sm font-bold mb-1">
              {isAr ? `رقم طلبك: #${success.id}` : `Your ID: #${success.id}`}
            </p>
            <p className="font-arabic text-[#C19A6B]/80 text-xs leading-relaxed">{success.message}</p>
          </div>
          {success.freeWeek && (
            <div className="bg-[#2E5A44]/15 border border-[#2E5A44]/40 rounded-xl p-3 mb-4">
              <p className="font-arabic text-[#7EC8A4] text-xs font-bold mb-1">
                {isAr ? '🎁 أسبوع مجاني مُمنوح تلقائياً' : '🎁 Free week granted automatically'}
              </p>
              <p className="font-arabic text-[#C19A6B]/70 text-[10px]">
                {isAr
                  ? 'تم رصد حالتك كمعسر — مُنح الوصول الكامل لأسبوع كامل دون مراجعة يدوية'
                  : 'Hardship case detected — full access granted for 1 week without manual review'}
              </p>
            </div>
          )}
          {success.plan === 'premium' && !success.freeWeek && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-3 mb-4">
              <p className="font-arabic text-[#D4AF37] text-xs">
                {isAr
                  ? '⭐ تم تفعيل الاشتراك البريميوم — ستصلك رسالة واتساب للتفعيل خلال ٢٤ساعة'
                  : '⭐ Premium activated — WhatsApp confirmation within 24h'}
              </p>
            </div>
          )}
          <p className="font-arabic text-[#C19A6B]/60 text-xs mb-6">
            {isAr
              ? 'تم إرسال بياناتك إلى فريق المنصة — بارك الله فيك وأعانك على الخير'
              : 'Data sent to the platform team — BaarakAllahu Feek'}
          </p>
          <button
            onClick={() => {
              setSuccess(null);
              setPhase(1);
              setStep1({ role:'', name:'', age:'', country:'', whatsapp:'', plan:'free', needy: false });
              setStep2({ manhaj:'salafi', hijrahReady:false, hijrahTarget:'', quranJuz:'', mahr:'', conditions:'', waliName:'', waliPhone:'' });
            }}
            className="btn-ghost px-6 py-2.5 rounded-xl font-arabic text-sm"
          >
            {isAr ? '← العودة للنموذج' : '← Back to form'}
          </button>
        </div>
      </div>
    );
  }

  const inp = (err?: string) =>
    `w-full bg-transparent border text-[#F5ECD7] text-sm rounded-xl px-4 py-3 font-arabic outline-none transition-all placeholder-[#C19A6B]/40 ${
      err
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-[#D4AF37]/25 focus:border-[#D4AF37] focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]'
    }`;

  return (
    <section
      id="register-section"
      dir={isAr ? 'rtl' : 'ltr'}
      className="w-full py-16 px-4"
      style={{ background: 'linear-gradient(160deg, rgba(26,18,8,0.98) 0%, rgba(14,11,7,1) 100%)' }}
    >
      {/* Section header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="ornament-line w-20" />
          <span className="text-[#D4AF37]/60 text-lg">✦</span>
          <div className="ornament-line w-20" />
        </div>
        <h2 className="font-arabic text-[#D4AF37] text-3xl font-bold mb-3 text-glow-gold">
          {isAr ? 'ابدأ مسيرتك الآن' : 'Start Your Journey Now'}
        </h2>
        <p className="font-arabic text-[#C19A6B]/80 text-base leading-loose max-w-md mx-auto">
          {isAr
            ? 'سجّل بياناتك ويتواصل معك فريق المنصة لإرشادك خلال المسار الشرعي الكامل'
            : 'Register and our team will guide you through the complete Sharia-compliant journey'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <span className="badge-sharia font-arabic text-[10px]">✓ {isAr?'تحت إشراف الولي':'Under Wali supervision'}</span>
          <span className="badge-sharia font-arabic text-[10px]">✓ {isAr?'بدون تواصل مباشر':'No direct contact'}</span>
          <span className="badge-sharia font-arabic text-[10px]">✓ {isAr?'وفق المنهج السلفي':'Salafi methodology'}</span>
        </div>
      </div>

      {/* Phase progress bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2].map(n => (
            <React.Fragment key={n}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold font-arabic border-2 transition-all ${
                phase >= n
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-transparent border-[#C19A6B]/30 text-[#C19A6B]/50'
              }`}>{n}</div>
              {n < 2 && <div className={`flex-1 h-0.5 transition-all ${phase >= 2 ? 'bg-[#D4AF37]/50' : 'bg-[#C19A6B]/20'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between">
          <span className={`font-arabic text-[10px] ${phase === 1 ? 'text-[#D4AF37]' : 'text-[#C19A6B]/50'}`}>
            {isAr ? 'البيانات الأساسية' : 'Basic Info'}
          </span>
          <span className={`font-arabic text-[10px] ${phase === 2 ? 'text-[#D4AF37]' : 'text-[#C19A6B]/50'}`}>
            {isAr ? 'معايير التوافق والولي' : 'Matching Criteria & Wali'}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto glass-panel p-6 sm:p-8">

        {/* ══════ PHASE 1 ══════ */}
        {phase === 1 && (
          <div className="space-y-5">
            {/* Plan toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/05">
              {[
                { v: 'free',    ar: '🌙 تجربة مجانية · أسبوع',    en: '🌙 Free Trial · 1 Week' },
                { v: 'premium', ar: '⭐ اشتراك مباشر · $15/شهر', en: '⭐ Direct Sub · $15/mo' },
              ].map(p => (
                <button key={p.v} type="button"
                  onClick={() => setStep1(f => ({ ...f, plan: p.v as 'free'|'premium' }))}
                  className={`py-3 rounded-xl font-arabic text-xs font-semibold transition-all ${
                    step1.plan === p.v
                      ? p.v === 'premium'
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/50 shadow-md'
                        : 'bg-[#2E5A44]/30 text-[#7EC8A4] border border-[#2E5A44]/50 shadow-md'
                      : 'text-[#C19A6B]/60 hover:text-[#C19A6B]'
                  }`}>
                  {isAr ? p.ar : p.en}
                </button>
              ))}
            </div>
            <p className="font-arabic text-center text-[#C19A6B]/50 text-[10px] -mt-3">
              {step1.plan === 'free'
                ? (isAr ? 'أسبوع مجاني كامل — ثم $15/شهر إن شئت الاستمرار' : 'Full week free — then $15/mo if you continue')
                : (isAr ? '٣٠٪ من اشتراكك يذهب لصندوق دعم زواج المعسرين' : '30% funds marriages for those in need')}
            </p>

            {/* Role */}
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'صفتك *' : 'Your role *'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: 'youth', ar: '🤵 شاب / عريس', en: '🤵 Suitor / Groom' },
                  { v: 'wali',  ar: '🛡 ولي أمر',    en: '🛡 Guardian / Wali' },
                ].map(r => (
                  <button key={r.v} type="button"
                    onClick={() => { setStep1(f => ({ ...f, role: r.v as 'youth'|'wali' })); setErrors1(e => ({ ...e, role: undefined })); }}
                    className={`py-3 rounded-xl font-arabic text-sm font-medium border transition-all ${
                      step1.role === r.v
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/60'
                        : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                    }`}>
                    {isAr ? r.ar : r.en}
                  </button>
                ))}
              </div>
              {errors1.role && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors1.role}</p>}
            </div>

            {/* Name */}
            <div>
              <label htmlFor={`${formId}-name`} className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'الاسم (يُكتفى بالكنية) *' : 'Name (kunya) *'}
              </label>
              <input id={`${formId}-name`} type="text" value={step1.name}
                onChange={e => { setStep1(f=>({...f,name:e.target.value})); setErrors1(e=>({...e,name:undefined})); }}
                placeholder={isAr ? 'أبو فلان / أم فلانة' : 'Abu Fulaan / Umm Fulanah'}
                className={inp(errors1.name)} autoComplete="nickname" />
              {errors1.name && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors1.name}</p>}
            </div>

            {/* Age + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${formId}-age`} className="font-arabic text-[#C19A6B] text-xs block mb-2">
                  {isAr ? 'السن *' : 'Age *'}
                </label>
                <input id={`${formId}-age`} type="number" min={18} max={70} value={step1.age}
                  onChange={e => { setStep1(f=>({...f,age:e.target.value})); setErrors1(e=>({...e,age:undefined})); }}
                  placeholder="25" className={inp(errors1.age)} />
                {errors1.age && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors1.age}</p>}
              </div>
              <div>
                <label htmlFor={`${formId}-country`} className="font-arabic text-[#C19A6B] text-xs block mb-2">
                  {isAr ? 'البلد *' : 'Country *'}
                </label>
                <select id={`${formId}-country`} value={step1.country}
                  onChange={e => { setStep1(f=>({...f,country:e.target.value})); setErrors1(e=>({...e,country:undefined})); }}
                  className={`${inp(errors1.country)} bg-[#1A1410]`}>
                  <option value="">{isAr ? 'اختر…' : 'Select…'}</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} className="bg-[#1A1410]">
                      {c.flag} {isAr ? c.ar : c.en}
                    </option>
                  ))}
                </select>
                {errors1.country && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors1.country}</p>}
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor={`${formId}-wa`} className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'رقم واتساب / التواصل *' : 'WhatsApp number *'}
              </label>
              <input id={`${formId}-wa`} type="tel" value={step1.whatsapp}
                onChange={e => { setStep1(f=>({...f,whatsapp:e.target.value})); setErrors1(e=>({...e,whatsapp:undefined})); }}
                placeholder={isAr ? '+213 XXX XXX XXX' : '+1 XXX XXX XXXX'}
                className={inp(errors1.whatsapp)} autoComplete="tel" />
              <p className="font-arabic text-[#C19A6B]/40 text-[10px] mt-1">
                {isAr ? 'يستخدم فقط للتواصل الإداري عبر الولي — لا يُعطى لأحد' : 'Admin/Wali coordination only — never shared directly'}
              </p>
              {errors1.whatsapp && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors1.whatsapp}</p>}
            </div>

            {/* Needy checkbox — free week */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#2E5A44]/30 bg-[#2E5A44]/10 cursor-pointer hover:border-[#2E5A44]/50 transition-all">
              <input type="checkbox" checked={step1.needy}
                onChange={e => setStep1(f=>({...f, needy: e.target.checked, plan: e.target.checked ? 'free' : f.plan}))}
                className="accent-[#7EC8A4] w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-arabic text-[#7EC8A4] text-sm font-semibold block">
                  {isAr ? '🌿 أنا من المعسرين أو العاطلين' : '🌿 I am in financial hardship / unemployed'}
                </span>
                <span className="font-arabic text-[#C19A6B]/60 text-[10px] leading-relaxed">
                  {isAr
                    ? 'سيُمنح لك أسبوع مجاني كامل تلقائياً — بدون مراجعة يدوية — إعانةً من صندوق زكاة المنصة'
                    : 'A full free week will be auto-granted — no manual review — from the platform Zakah fund'}
                </span>
              </div>
            </label>

            <button
              type="button"
              onClick={() => { if (validate1()) setPhase(2); }}
              className="w-full btn-gold py-4 rounded-2xl font-arabic font-bold text-base shadow-lg"
              style={{ boxShadow: '0 0 32px rgba(212,175,55,0.25)' }}
            >
              {isAr ? 'التالي: معايير التوافق ←' : 'Next: Matching Criteria →'}
            </button>
          </div>
        )}

        {/* ══════ PHASE 2 ══════ */}
        {phase === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setPhase(1)} className="text-[#C19A6B]/60 hover:text-[#C19A6B] text-sm font-arabic transition-colors">
                {isAr ? '← رجوع' : '← Back'}
              </button>
              <span className="font-arabic text-[#D4AF37] font-bold text-base flex-1 text-center">
                {isAr ? 'معايير التوافق والولي' : 'Matching Criteria & Wali'}
              </span>
            </div>

            {/* Manhaj */}
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'المنهج *' : 'Methodology *'}
              </label>
              <div className="flex gap-2">
                {[
                  { v: 'salafi', ar: '📿 سلفي على المنهج', en: '📿 Salafi Manhaj' },
                  { v: 'other',  ar: '🌙 ملتزم عام',        en: '🌙 Generally Observant' },
                ].map(m => (
                  <button key={m.v} type="button"
                    onClick={() => { setStep2(s=>({...s,manhaj:m.v as 'salafi'|'other'})); setErrors2(e=>({...e,manhaj:undefined})); }}
                    className={`flex-1 py-2.5 rounded-xl font-arabic text-xs font-medium border transition-all ${
                      step2.manhaj === m.v
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/60'
                        : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                    }`}>
                    {isAr ? m.ar : m.en}
                  </button>
                ))}
              </div>
              {errors2.manhaj && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors2.manhaj}</p>}
            </div>

            {/* Hijrah */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={step2.hijrahReady}
                  onChange={e => setStep2(s=>({...s,hijrahReady:e.target.checked}))}
                  className="accent-[#D4AF37] w-4 h-4" />
                <span className="font-arabic text-[#F5ECD7]/80 text-sm">
                  {isAr ? '✈️ مستعد للهجرة' : '✈️ Ready for Hijrah'}
                </span>
              </label>
              {step2.hijrahReady && (
                <input value={step2.hijrahTarget}
                  onChange={e => { setStep2(s=>({...s,hijrahTarget:e.target.value})); setErrors2(e=>({...e,hijrahTarget:undefined})); }}
                  placeholder={isAr ? 'البلد المستهدف (السعودية، مصر…)' : 'Target country (Saudi, Egypt…)'}
                  className={inp(errors2.hijrahTarget)} />
              )}
              {errors2.hijrahTarget && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors2.hijrahTarget}</p>}
            </div>

            {/* Quran + Mahr */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                  {isAr ? 'حفظ القرآن (أجزاء)' : 'Quran memorized (Juz)'}
                </label>
                <input type="number" min={0} max={30} value={step2.quranJuz}
                  onChange={e => setStep2(s=>({...s,quranJuz:e.target.value}))}
                  placeholder="0–30" className={inp()} />
              </div>
              <div>
                <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                  {isAr ? 'المهر المعروض ($)' : 'Mahr offered ($)'}
                </label>
                <input type="number" min={0} value={step2.mahr}
                  onChange={e => setStep2(s=>({...s,mahr:e.target.value}))}
                  placeholder="500" className={inp()} />
              </div>
            </div>

            {/* Conditions */}
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'الشروط (اختياري)' : 'Conditions (optional)'}
              </label>
              <textarea value={step2.conditions}
                onChange={e => setStep2(s=>({...s,conditions:e.target.value}))}
                rows={2}
                placeholder={isAr ? 'سكن مستقل، إذن العمل، …' : 'Independent housing, work permission, …'}
                className={`${inp()} resize-none`} />
            </div>

            {/* Wali info — only for youth/suitor */}
            {step1.role === 'youth' && (
              <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/05 space-y-3">
                <p className="font-arabic text-[#D4AF37] text-xs font-semibold">
                  🛡 {isAr ? 'بيانات الولي' : 'Wali Information'}
                </p>
                <div>
                  <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                    {isAr ? 'اسم الولي *' : 'Wali name *'}
                  </label>
                  <input value={step2.waliName}
                    onChange={e => { setStep2(s=>({...s,waliName:e.target.value})); setErrors2(e=>({...e,waliName:undefined})); }}
                    placeholder={isAr ? 'الاسم الكامل للولي' : 'Full name of guardian'}
                    className={inp(errors2.waliName)} />
                  {errors2.waliName && <p className="font-arabic text-red-400 text-[11px] mt-1">{errors2.waliName}</p>}
                </div>
                <div>
                  <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                    {isAr ? 'واتساب الولي (اختياري)' : 'Wali WhatsApp (optional)'}
                  </label>
                  <input type="tel" value={step2.waliPhone}
                    onChange={e => setStep2(s=>({...s,waliPhone:e.target.value}))}
                    placeholder="+213…" className={inp()} />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full btn-gold py-4 rounded-2xl font-arabic font-bold text-base shadow-lg disabled:opacity-50"
              style={{ boxShadow: '0 0 32px rgba(212,175,55,0.30)' }}
            >
              {loading
                ? (isAr ? '⏳ جارٍ التسجيل…' : '⏳ Registering…')
                : step1.needy
                  ? (isAr ? '🌿 سجّل واحصل على أسبوع مجاني' : '🌿 Register & Claim Free Week')
                  : step1.plan === 'premium'
                    ? (isAr ? '💳 اشترك الآن واحجز مقعدك' : '💳 Subscribe Now & Reserve Spot')
                    : (isAr ? '🌙 ابدأ التجربة المجانية' : '🌙 Start Free Trial')}
            </button>

            <p className="font-arabic text-[#C19A6B]/40 text-[10px] text-center">
              {isAr
                ? 'بالتسجيل أنت توافق على ضوابط منصة فطرة وسكينة الشرعية — لا مخالفة بدون ولي'
                : "By registering you agree to Fitrah & Sakina's Sharia guidelines — Wali required"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
