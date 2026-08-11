'use client';

import React from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const CHILDREN_COUNT = ['1', '2', '3', '4', '5', '6+', 'ما شاء الله'];
const EDUCATION_GOALS = [
  { ar: 'التعليم الإسلامي الأصيل في المنزل', en: 'Authentic Islamic home-schooling' },
  { ar: 'مدرسة إسلامية خاصة', en: 'Private Islamic school' },
  { ar: 'مدرسة حكومية مع تعزيز إسلامي', en: 'State school + Islamic reinforcement' },
  { ar: 'مدرسة دولية مع التزام ديني', en: 'International school with religious commitment' },
  { ar: 'مركز حفظ القرآن الكريم', en: "Qur'an memorisation centre" },
];
const QURAN_GOALS = ['جزء عم', '5 أجزاء', '10 أجزاء', '15 جزءاً', '20 جزءاً', 'الختمة الكاملة'];
const PARENTING_VALUES = [
  { ar: 'التوحيد أولاً والأخلاق الإسلامية', en: 'Tawheed first, then Islamic character' },
  { ar: 'اللغة العربية بطلاقة', en: 'Fluency in Arabic' },
  { ar: 'التربية على السنة النبوية', en: 'Raised upon the Prophetic Sunnah' },
  { ar: 'الجمع بين العلم الشرعي والدنيوي', en: 'Combining Islamic and worldly knowledge' },
  { ar: 'إعداد جيل مسلم واعٍ', en: 'Raising a conscious Muslim generation' },
];

export function ChildrenModule() {
  const { locale, childrenSettings, updateChildren } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';

  function toggle(field: keyof typeof childrenSettings, value: string) {
    updateChildren({ [field]: value });
    toast.success(locale === 'ar' ? 'تم التحديث' : 'Updated');
  }

  return (
    <div dir={dir} className="h-full flex flex-col">
      {/* Al-Kahf verse banner with image background */}
      <div className="relative rounded-xl overflow-hidden mb-5" style={{ minHeight: '110px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/children-kahf.jpg')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(14,11,7,0.82)' }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-5">
          <p className="font-arabic text-[#F5ECD7] text-base sm:text-lg leading-loose mb-1">
            ﴿وَكَانَ أَبُوهُمَا صَالِحًا﴾
          </p>
          <p className="text-[#D4AF37]/70 text-xs font-arabic">الكهف ١٨:٨٢</p>
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B]/80 text-xs mt-1`}>
            {locale === 'ar'
              ? 'قد يحفظ الله الأبناء بصلاح آبائهم'
              : 'Allah may protect children because of their parents\' righteousness'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">👶</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'children_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'children_desc')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Desired count */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'عدد الأولاد المرغوب' : 'Desired number of children'}
          </p>
          <div className="flex flex-wrap gap-2">
            {CHILDREN_COUNT.map(c => (
              <button
                key={c}
                onClick={() => toggle('desiredCount', c)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all font-arabic ${
                  childrenSettings.desiredCount === c
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]'
                    : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Education goal */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'الهدف التعليمي' : 'Educational goal'}
          </p>
          <div className="space-y-2">
            {EDUCATION_GOALS.map((g, i) => (
              <button
                key={i}
                onClick={() => toggle('educationGoal', dir === 'rtl' ? g.ar : g.en)}
                className={`w-full text-start px-3 py-2 rounded-lg text-xs border transition-all ${
                  childrenSettings.educationGoal === (dir === 'rtl' ? g.ar : g.en)
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'border-[#D4AF37]/15 text-[#C19A6B] hover:border-[#D4AF37]/30'
                } ${dir === 'rtl' ? 'font-arabic' : ''}`}
              >
                {dir === 'rtl' ? g.ar : g.en}
              </button>
            ))}
          </div>
        </div>

        {/* Quran memorisation goal */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'هدف حفظ القرآن للأبناء' : "Qur'an memorisation goal for children"}
          </p>
          <div className="flex flex-wrap gap-2">
            {QURAN_GOALS.map(g => (
              <button
                key={g}
                onClick={() => toggle('quranMemorisationGoal', g)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all font-arabic ${
                  childrenSettings.quranMemorisationGoal === g
                    ? 'bg-[#2E5A44]/30 border-[#2E5A44]/60 text-green-300'
                    : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Parenting values */}
        <div className="glass-panel-light p-4 rounded-xl">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
            {locale === 'ar' ? 'أولويات التربية الإسلامية' : 'Islamic parenting priorities'}
          </p>
          <div className="space-y-2">
            {PARENTING_VALUES.map((v, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#D4AF37]/05 border border-[#D4AF37]/10">
                <span className="text-[#D4AF37] text-xs">✦</span>
                <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-xs leading-relaxed`}>
                  {dir === 'rtl' ? v.ar : v.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic schooling toggle */}
        <div className="glass-panel-light p-4 rounded-xl flex items-center justify-between">
          <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm`}>
            {locale === 'ar' ? 'الالتزام بالمدرسة الإسلامية' : 'Commitment to Islamic schooling'}
          </p>
          <button
            onClick={() => updateChildren({ islamicSchooling: !childrenSettings.islamicSchooling })}
            className={`w-12 h-6 rounded-full border transition-all relative ${
              childrenSettings.islamicSchooling
                ? 'bg-[#2E5A44] border-[#2E5A44]'
                : 'bg-[#D4AF37]/15 border-[#D4AF37]/30'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#F5ECD7] shadow transition-all ${
                childrenSettings.islamicSchooling
                  ? (dir === 'rtl' ? 'left-0.5' : 'right-0.5')
                  : (dir === 'rtl' ? 'right-0.5' : 'left-0.5')
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
