'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'free',
    nameAr: 'مجاني',
    nameEn: 'Free',
    priceUSD: 0,
    icon: '🌙',
    features: {
      ar: ['قراءة المحتوى الشرعي','المشاركة في القناة السلفية','التعريف بالدور'],
      en: ['Read Sharia content','Join Salafi channel','Set your role'],
    },
    disabled: ['ar:التوافق الآلي الفوري','ar:الرؤية الشرعية','ar:التواصل عبر الولي','ar:إنشاء ملف احترافي'],
  },
  {
    id: 'premium',
    nameAr: 'بريميوم',
    nameEn: 'Premium',
    priceUSD: 15,
    priceMonthly: true,
    icon: '⭐',
    highlight: true,
    features: {
      ar: ['كل المجاني +','التوافق الآلي الفوري','مسار الخطبة الكامل','الرؤية الشرعية ٤ثوانٍ','موعد الزيارة الميدانية','عقد الزواج الرقمي','المساعد الشرعي الكامل','إشعارات الولي الفورية'],
      en: ['All Free +','Instant smart matching','Full betrothal track','4-sec Sharia vision','Field visit scheduling','Digital marriage contract','Full AI advisor','Instant Wali notifications'],
    },
  },
  {
    id: 'wali',
    nameAr: 'ولي محترف',
    nameEn: 'Pro Wali',
    priceUSD: 8,
    priceMonthly: true,
    icon: '🛡',
    features: {
      ar: ['لوحة تحكم الولي','إدارة حتى ٥ بنات','التحقق الموثق','اتصال مباشر بالمراكز','سجل العقود'],
      en: ['Wali dashboard','Manage up to 5 wards','Verified badge','Direct centre contact','Contract records'],
    },
  },
];

// Fund split ratios
const SPLIT = { fund: 0.30, ccp: 0.70 };

export function SubscriptionWidget() {
  const { locale, role } = useFitrahStore();
  const isAr = locale === 'ar';

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [fundExtra, setFundExtra] = useState(0);
  const [showSplit, setShowSplit] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const totalUSD = plan.priceUSD + fundExtra;
  const toFund = (totalUSD * SPLIT.fund).toFixed(2);
  const toCCP  = (totalUSD * SPLIT.ccp).toFixed(2);

  function handlePay() {
    if (plan.priceUSD === 0) {
      toast.success(isAr ? 'أنت على الخطة المجانية — لا يلزم دفع' : 'You are on the free plan');
      return;
    }
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      toast.success(isAr ? '✅ تم الدفع — بارك الله فيك' : '✅ Payment complete — JazakAllah Khayr');
    }, 2000);
  }

  if (paid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center" dir={isAr?'rtl':'ltr'}>
        <div className="text-6xl mb-4">🌟</div>
        <h3 className="font-arabic text-[#D4AF37] text-2xl font-bold mb-3">
          {isAr ? 'تم تفعيل الاشتراك' : 'Subscription Activated'}
        </h3>
        <p className="font-arabic text-[#C19A6B]/80 text-sm mb-6 leading-relaxed">
          {isAr
            ? `جزاك الله خيراً — تم توزيع ${toFund}$ لصندوق المعسرين و${toCCP}$ للحساب البريدي (CCP)`
            : `JazakAllah Khayr — $${toFund} to the hardship fund, $${toCCP} to CCP account`}
        </p>
        <button onClick={() => setPaid(false)} className="btn-ghost px-6 py-2.5 rounded-xl font-arabic text-sm">
          {isAr ? '← العودة' : '← Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir={isAr?'rtl':'ltr'}>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="ornament-line w-16" />
          <span className="text-[#D4AF37]/50">✦</span>
          <div className="ornament-line w-16" />
        </div>
        <h2 className="font-arabic text-[#D4AF37] text-2xl font-bold mb-2 animate-shimmer">
          {isAr ? 'الاشتراك والدفع الذكي' : 'Smart Subscription & Payment'}
        </h2>
        <p className="font-arabic text-[#C19A6B]/70 text-sm">
          {isAr ? '٣٠٪ من كل اشتراك يذهب لصندوق دعم زواج المعسرين — بارك الله فيكم' : '30% of every subscription goes to support marriages of those in need'}
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {PLANS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlan(p.id)}
            className={`glass-panel p-5 text-right sm:text-right transition-all relative ${
              selectedPlan === p.id
                ? 'border-[#D4AF37]/60 shadow-lg shadow-[#D4AF37]/10'
                : 'hover:border-[#D4AF37]/30'
            } ${p.highlight ? 'order-first sm:order-none' : ''}`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0E0B07] text-[10px] font-bold px-3 py-0.5 rounded-full font-arabic whitespace-nowrap">
                {isAr ? '⭐ الأكثر طلباً' : '⭐ Most Popular'}
              </div>
            )}
            <div className="text-3xl mb-3">{p.icon}</div>
            <div className="font-arabic text-[#F5ECD7] font-bold text-lg mb-1">
              {isAr ? p.nameAr : p.nameEn}
            </div>
            <div className="font-arabic mb-4">
              {p.priceUSD === 0
                ? <span className="text-[#7EC8A4] font-bold text-xl">مجاني</span>
                : <span className="text-[#D4AF37] font-black text-2xl">${p.priceUSD}<span className="text-xs text-[#C19A6B]/70 font-normal">/{isAr?'شهر':'mo'}</span></span>
              }
            </div>
            <ul className="space-y-1.5 font-arabic text-xs">
              {(isAr ? p.features.ar : p.features.en).map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[#F5ECD7]/80">
                  <span className="text-[#7EC8A4] mt-0.5">✓</span> {f}
                </li>
              ))}
              {p.disabled?.map((f, i) => (
                <li key={'d'+i} className="flex items-start gap-1.5 text-[#C19A6B]/35 line-through">
                  <span className="text-[#C19A6B]/35 mt-0.5">✕</span> {f.replace('ar:','')}
                </li>
              ))}
            </ul>
            {selectedPlan === p.id && (
              <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0E0B07] text-[10px] font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Fund extra donation */}
      {selectedPlan !== 'free' && (
        <div className="glass-panel p-5 mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h4 className="font-arabic text-[#D4AF37] font-bold text-sm">
                💰 {isAr ? 'إضافة للصندوق (اختياري)' : 'Add to Fund (optional)'}
              </h4>
              <p className="font-arabic text-[#C19A6B]/60 text-xs">
                {isAr ? 'ساعد في تمويل زواج المعسرين — صدقة جارية' : 'Help fund a marriage for those in need — ongoing sadaqah'}
              </p>
            </div>
            <div className="flex gap-2">
              {[0,5,10,25,50].map(a => (
                <button key={a} onClick={() => setFundExtra(a)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    fundExtra === a
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'border border-[#D4AF37]/15 text-[#C19A6B] hover:border-[#D4AF37]/35'
                  }`}>
                  {a === 0 ? isAr?'بدون':'0' : `+$${a}`}
                </button>
              ))}
            </div>
          </div>

          {/* Split visualisation */}
          <button onClick={() => setShowSplit(s=>!s)}
            className="font-arabic text-[#C19A6B]/60 text-xs flex items-center gap-1 hover:text-[#C19A6B] transition-colors">
            <span>{showSplit?'▲':'▼'}</span>
            {isAr ? 'كيف يُوزَّع المبلغ؟' : 'How is the payment split?'}
          </button>

          {showSplit && (
            <div className="mt-4 p-4 rounded-xl bg-[#D4AF37]/05 border border-[#D4AF37]/15">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-arabic text-[#7EC8A4] text-2xl font-black">${toFund}</div>
                  <div className="font-arabic text-[#7EC8A4]/70 text-xs">
                    {isAr ? '٣٠٪ → صندوق المعسرين' : '30% → Hardship Fund'}
                  </div>
                  <div className="h-1 rounded-full bg-[#7EC8A4]/20 mt-2">
                    <div className="h-full rounded-full bg-[#7EC8A4]" style={{ width: '30%' }} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-arabic text-[#D4AF37] text-2xl font-black">${toCCP}</div>
                  <div className="font-arabic text-[#D4AF37]/70 text-xs">
                    {isAr ? '٧٠٪ → الحساب البريدي (CCP)' : '70% → Postal Account (CCP)'}
                  </div>
                  <div className="h-1 rounded-full bg-[#D4AF37]/20 mt-2">
                    <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
              <p className="font-arabic text-[#C19A6B]/50 text-[10px] text-center mt-3">
                {isAr
                  ? 'الحساب البريدي: CCP 1234567 — الجزائر | رقم SWIFT سيضاف عند النشر الرسمي'
                  : 'CCP Account: 1234567 — Algeria | SWIFT code added at official launch'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Total + Pay */}
      {selectedPlan !== 'free' && (
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4 font-arabic flex-wrap gap-2">
            <span className="text-[#C19A6B]/80 text-sm">{isAr ? 'الإجمالي الشهري' : 'Monthly total'}</span>
            <span className="text-[#D4AF37] text-3xl font-black">${totalUSD}</span>
          </div>
          <div className="text-[10px] font-arabic text-[#C19A6B]/50 mb-4">
            {isAr
              ? `${toFund}$ صندوق المعسرين · ${toCCP}$ حساب CCP`
              : `$${toFund} hardship fund · $${toCCP} CCP account`}
          </div>
          <button onClick={handlePay} disabled={paying}
            className="w-full btn-gold py-4 rounded-xl font-arabic font-bold text-base disabled:opacity-50">
            {paying
              ? (isAr ? '⏳ جارٍ المعالجة…' : '⏳ Processing…')
              : (isAr ? `💳 اشتراك بـ $${totalUSD}/شهر` : `💳 Subscribe for $${totalUSD}/mo`)}
          </button>
          <p className="font-arabic text-[#C19A6B]/40 text-[10px] text-center mt-3">
            {isAr
              ? 'محاكاة — في الإصدار الرسمي: Stripe + CCP + بطاقات دولية'
              : 'Simulation — live launch: Stripe + CCP + international cards'}
          </p>
        </div>
      )}

      {selectedPlan === 'free' && (
        <div className="text-center">
          <button onClick={handlePay} className="btn-secondary py-3 px-8 rounded-xl font-arabic font-bold">
            {isAr ? 'استمرار بالخطة المجانية' : 'Continue with Free Plan'}
          </button>
        </div>
      )}
    </div>
  );
}
