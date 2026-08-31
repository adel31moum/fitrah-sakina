'use client';

import React from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const HIJRAH_COUNTRIES = [
  { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
  { ar: 'المملكة المغربية', en: 'Morocco' },
  { ar: 'الجمهورية التركية', en: 'Turkey' },
  { ar: 'جمهورية مصر العربية', en: 'Egypt' },
  { ar: 'الجمهورية الإندونيسية', en: 'Indonesia' },
  { ar: 'باكستان', en: 'Pakistan' },
  { ar: 'الإمارات العربية المتحدة', en: 'UAE' },
  { ar: 'الأردن', en: 'Jordan' },
  { ar: 'تونس', en: 'Tunisia' },
  { ar: 'أخرى', en: 'Other Muslim land' },
];

const HOUSING_TYPES = [
  { ar: 'مسكن مستقل بعيداً عن الأسرة', en: 'Independent housing away from extended family' },
  { ar: 'مسكن بالقرب من أسرة الزوج', en: 'Housing near husband\'s family (with boundaries)' },
  { ar: 'مسكن مؤقت ريثما يُوفَّر المستقل', en: 'Temporary housing while preparing independent home' },
  { ar: 'مسكن مستأجر أو مملوك', en: 'Rented or owned — either acceptable' },
];

export function TentModule() {
  const { locale, tentSettings, updateTent } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';

  function toggle(field: keyof typeof tentSettings, value: boolean | string) {
    updateTent({ [field]: value });
    toast.success(locale === 'ar' ? 'تم التحديث' : 'Updated');
  }

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">🏕</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'tent_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'tent_desc')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Independent living */}
        <div className="glass-panel-light p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium`}>
              {locale === 'ar' ? 'الاستعداد للسكن المستقل' : 'Ready for independent living'}
            </p>
            <button
              onClick={() => toggle('independentLiving', !tentSettings.independentLiving)}
              className={`w-12 h-6 rounded-full border transition-all relative ${
                tentSettings.independentLiving
                  ? 'bg-[#2E5A44] border-[#2E5A44]'
                  : 'bg-[#D4AF37]/15 border-[#D4AF37]/30'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#F5ECD7] shadow transition-all ${
                  tentSettings.independentLiving
                    ? (dir === 'rtl' ? 'left-0.5' : 'right-0.5')
                    : (dir === 'rtl' ? 'right-0.5' : 'left-0.5')
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            {HOUSING_TYPES.map((h, i) => (
              <button
                key={i}
                onClick={() => toggle('location', dir === 'rtl' ? h.ar : h.en)}
                className={`w-full text-start px-3 py-2 rounded-lg text-xs border transition-all ${
                  tentSettings.location === (dir === 'rtl' ? h.ar : h.en)
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'border-[#D4AF37]/15 text-[#C19A6B] hover:border-[#D4AF37]/30'
                } ${dir === 'rtl' ? 'font-arabic' : ''}`}
              >
                {dir === 'rtl' ? h.ar : h.en}
              </button>
            ))}
          </div>
        </div>

        {/* Relocation */}
        <div className="glass-panel-light p-4 rounded-xl flex items-center justify-between">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm`}>
            {locale === 'ar' ? 'قدرة وقبول للانتقال الجغرافي' : 'Ability and willingness to relocate'}
          </p>
          <button
            onClick={() => toggle('relocationCapability', !tentSettings.relocationCapability)}
            className={`w-12 h-6 rounded-full border transition-all relative ${
              tentSettings.relocationCapability
                ? 'bg-[#2E5A44] border-[#2E5A44]'
                : 'bg-[#D4AF37]/15 border-[#D4AF37]/30'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#F5ECD7] shadow transition-all ${
                tentSettings.relocationCapability
                  ? (dir === 'rtl' ? 'left-0.5' : 'right-0.5')
                  : (dir === 'rtl' ? 'right-0.5' : 'left-0.5')
              }`}
            />
          </button>
        </div>

        {/* Hijrah intention */}
        <div className="glass-panel-light p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium`}>
              {locale === 'ar' ? 'نية الهجرة إلى بلاد إسلامية' : 'Intention to make Hijrah to a Muslim land'}
            </p>
            <button
              onClick={() => toggle('hijrahIntention', !tentSettings.hijrahIntention)}
              className={`w-12 h-6 rounded-full border transition-all relative ${
                tentSettings.hijrahIntention
                  ? 'bg-[#2E5A44] border-[#2E5A44]'
                  : 'bg-[#D4AF37]/15 border-[#D4AF37]/30'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#F5ECD7] shadow transition-all ${
                  tentSettings.hijrahIntention
                    ? (dir === 'rtl' ? 'left-0.5' : 'right-0.5')
                    : (dir === 'rtl' ? 'right-0.5' : 'left-0.5')
                }`}
              />
            </button>
          </div>
          {tentSettings.hijrahIntention && (
            <div>
              <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-xs mb-2`}>
                {locale === 'ar' ? 'البلد المستهدف للهجرة' : 'Target Hijrah country'}
              </p>
              <div className="flex flex-wrap gap-2">
                {HIJRAH_COUNTRIES.map((c) => (
                  <button
                    key={c.ar}
                    onClick={() => toggle('hijrahTarget', dir === 'rtl' ? c.ar : c.en)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      tentSettings.hijrahTarget === (dir === 'rtl' ? c.ar : c.en)
                        ? 'bg-[#2E5A44]/30 border-[#2E5A44]/60 text-green-300'
                        : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                    } ${dir === 'rtl' ? 'font-arabic' : ''}`}
                  >
                    {dir === 'rtl' ? c.ar : c.en}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {(tentSettings.location || tentSettings.hijrahTarget) && (
          <div className="glass-panel-light p-4 rounded-xl border-[#D4AF37]/25">
            <p className="text-xs text-[#D4AF37] font-medium mb-2">
              {locale === 'ar' ? 'ملخص الخيمة' : 'Tent Summary'}
            </p>
            <div className="space-y-1 text-xs text-[#C19A6B]">
              <div className="flex gap-2">
                <span>🏠</span>
                <span>{tentSettings.location || (locale === 'ar' ? 'لم يُحدد' : 'Not specified')}</span>
              </div>
              <div className="flex gap-2">
                <span>📍</span>
                <span>{tentSettings.hijrahTarget || (locale === 'ar' ? 'لا هجرة محددة' : 'No Hijrah target')}</span>
              </div>
              <div className="flex gap-2">
                <span>{tentSettings.relocationCapability ? '✅' : '❌'}</span>
                <span>{locale === 'ar' ? 'انتقال جغرافي' : 'Geographic relocation'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
