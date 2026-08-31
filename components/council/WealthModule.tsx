'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

// PPP adjustment factors (approximate, relative to USD)
const PPP_FACTORS: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
  EGP: 30.9,
  MAD: 10.1,
  TRY: 32.0,
  PKR: 279.0,
  IDR: 15600,
  MYR: 4.65,
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP — British Pound' },
  { code: 'SAR', symbol: '﷼', label: 'SAR — Saudi Riyal' },
  { code: 'EGP', symbol: 'ج.م', label: 'EGP — Egyptian Pound' },
  { code: 'MAD', symbol: 'د.م', label: 'MAD — Moroccan Dirham' },
  { code: 'TRY', symbol: '₺', label: 'TRY — Turkish Lira' },
  { code: 'PKR', symbol: '₨', label: 'PKR — Pakistani Rupee' },
  { code: 'IDR', symbol: 'Rp', label: 'IDR — Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', label: 'MYR — Malaysian Ringgit' },
];

const PAYMENT_TYPES = [
  { key: 'immediate', ar: 'معجَّل (فوري)', en: 'Immediate (Prompt)' },
  { key: 'deferred', ar: 'مؤجَّل', en: 'Deferred' },
  { key: 'split', ar: 'نصف معجَّل ونصف مؤجَّل', en: 'Half immediate, half deferred' },
];

export function WealthModule() {
  const { locale, mahrSettings, updateMahr } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [employmentStatus, setEmploymentStatus] = useState<'employed' | 'unemployed' | 'student'>('employed');

  const currency = CURRENCIES.find(c => c.code === mahrSettings.currency) || CURRENCIES[0];
  const pppFactor = PPP_FACTORS[mahrSettings.currency] || 1;
  const pppEquivalentUSD = mahrSettings.amount / pppFactor;
  const isWaiverEligible = employmentStatus !== 'employed';

  function handleAmountChange(v: number) {
    const adjusted = Math.round(v / pppFactor * 100) / 100;
    updateMahr({ amount: v, pppAdjusted: adjusted });
  }

  function applyWaiver() {
    updateMahr({ waiverApplied: true });
    toast.success(locale === 'ar' ? 'تم تطبيق الإعفاء من الرسوم' : '100% Fee waiver applied');
  }

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">💰</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'wealth_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'wealth_desc')}</p>
        </div>
      </div>

      {/* Mahr Hadith card */}
      <div
        className="glass-panel-light p-4 rounded-xl mb-4 text-center"
        style={{ borderColor: 'rgba(212,175,55,0.30)' }}
      >
        <p className="font-arabic text-[#F5ECD7] text-sm leading-loose mb-1">
          «خَيْرُ الصَّدَاقِ أَيْسَرُهُ» — «أَعْظَمُ النِّسَاءِ بَرَكَةً أَيْسَرُهُنَّ مَهْرًا»
        </p>
        <p className="text-[#D4AF37]/60 text-xs font-arabic">
          {locale === 'ar' ? '— رواه أحمد والحاكم — صحيح' : '— Ahmad & Al-Hakim — Sahih'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Currency selector */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'عملة المهر' : 'Mahr Currency'}
          </p>
          <select
            value={mahrSettings.currency}
            onChange={e => updateMahr({ currency: e.target.value })}
            className="w-full bg-[#0E0B07] border border-[#D4AF37]/30 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code} className="bg-[#1A1410]">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mahr amount */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {t(locale, 'mahr_amount')}
          </p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#D4AF37] font-bold text-lg">{currency.symbol}</span>
            <input
              type="number"
              value={mahrSettings.amount}
              onChange={e => handleAmountChange(Number(e.target.value))}
              className="flex-1 bg-[#0E0B07] border border-[#D4AF37]/30 text-[#F5ECD7] text-base rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60 font-mono"
              min={0}
            />
          </div>
          <input
            type="range"
            min={0}
            max={mahrSettings.currency === 'USD' ? 50000 : 50000 * pppFactor}
            step={mahrSettings.currency === 'USD' ? 100 : Math.round(pppFactor * 100)}
            value={mahrSettings.amount}
            onChange={e => handleAmountChange(Number(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
          {/* PPP display */}
          <div className="mt-3 p-3 rounded-lg bg-[#D4AF37]/08 border border-[#D4AF37]/20">
            <p className="text-xs text-[#C19A6B]">
              {locale === 'ar' ? 'المعادل بالقوة الشرائية (USD):' : 'PPP Equivalent (USD):'}
            </p>
            <p className="text-[#D4AF37] font-bold font-mono">
              ≈ ${pppEquivalentUSD.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Payment type */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'نوع الدفع' : 'Payment Type'}
          </p>
          <div className="space-y-2">
            {PAYMENT_TYPES.map(pt => (
              <button
                key={pt.key}
                onClick={() => updateMahr({ paymentType: pt.key as 'immediate' | 'deferred' | 'split' })}
                className={`w-full text-start px-3 py-2 rounded-lg text-xs border transition-all ${
                  mahrSettings.paymentType === pt.key
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'border-[#D4AF37]/15 text-[#C19A6B] hover:border-[#D4AF37]/30'
                } ${dir === 'rtl' ? 'font-arabic' : ''}`}
              >
                {dir === 'rtl' ? pt.ar : pt.en}
              </button>
            ))}
          </div>
        </div>

        {/* Fee waiver */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'حالة العمل — بروتوكول الإعفاء' : 'Employment Status — Fee Waiver Protocol'}
          </p>
          <div className="flex gap-2 mb-3">
            {(['employed', 'unemployed', 'student'] as const).map(s => (
              <button
                key={s}
                onClick={() => setEmploymentStatus(s)}
                className={`flex-1 py-2 rounded-lg text-xs border transition-all ${
                  employmentStatus === s
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'border-[#D4AF37]/20 text-[#C19A6B]'
                }`}
              >
                {s === 'employed'
                  ? (locale === 'ar' ? 'موظف' : 'Employed')
                  : s === 'unemployed'
                  ? (locale === 'ar' ? 'غير موظف' : 'Unemployed')
                  : (locale === 'ar' ? 'طالب' : 'Student')}
              </button>
            ))}
          </div>
          {isWaiverEligible && (
            <div className="p-3 rounded-lg bg-[#2E5A44]/20 border border-[#2E5A44]/40">
              <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-green-300 text-xs mb-2`}>
                {locale === 'ar'
                  ? '✅ مؤهَّل للإعفاء التام من رسوم المنصة (100%)'
                  : '✅ Eligible for 100% platform fee waiver'}
              </p>
              {!mahrSettings.waiverApplied ? (
                <button onClick={applyWaiver} className="btn-palm px-4 py-1.5 rounded-lg text-xs">
                  {locale === 'ar' ? 'تطبيق الإعفاء' : 'Apply Waiver'}
                </button>
              ) : (
                <span className="badge-sharia">{locale === 'ar' ? 'تم تطبيق الإعفاء' : 'Waiver Applied'}</span>
              )}
            </div>
          )}
        </div>

        {/* Wali co-payment note */}
        <div className="glass-panel-light p-3 rounded-xl border-[#D4AF37]/20">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-xs text-[#C19A6B] leading-relaxed`}>
            {locale === 'ar'
              ? '📌 بروتوكول المشاركة: يُغطي الولي 50% من رسوم المنصة — يضمن الجدية والالتزام'
              : '📌 Co-payment Protocol: The Wali covers 50% of platform fees — ensuring seriousness and commitment'}
          </p>
        </div>
      </div>
    </div>
  );
}
