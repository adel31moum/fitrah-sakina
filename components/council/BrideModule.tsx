'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const BRIDE_FIELDS = [
  { key: 'quranLevel', labelAr: 'حفظ القرآن الكريم', labelEn: "Qur'an Memorisation", options: ['لا حفظ', 'جزء عم', 'ثلاثة أجزاء', 'عشرة أجزاء', 'خمسة عشر جزءاً', 'حافظة للقرآن كاملاً'] },
  { key: 'islamicKnowledge', labelAr: 'مستوى العلم الشرعي', labelEn: 'Islamic Knowledge Level', options: ['مبتدئة', 'متوسطة', 'متقدمة', 'طالبة علم'] },
  { key: 'prayerCommitment', labelAr: 'الالتزام بالصلاة', labelEn: 'Prayer Commitment', options: ['الفرائض فقط', 'مع السنن الراتبة', 'مع قيام الليل'] },
  { key: 'hijabStatus', labelAr: 'ارتداء الحجاب الشرعي', labelEn: 'Wearing Proper Hijab', options: ['نعم — الحجاب الشرعي الكامل', 'نعم — مع النقاب', 'لا تزال في طريق الالتزام'] },
  { key: 'maritalStatus', labelAr: 'الحالة الزوجية', labelEn: 'Marital Status', options: ['بكر', 'مطلقة', 'أرملة', 'مسلمة جديدة'] },
  { key: 'ageRange', labelAr: 'الفئة العمرية', labelEn: 'Age Range', options: ['18-22', '23-27', '28-32', '33-37', '38-42', '43+'] },
  { key: 'nationality', labelAr: 'الجنسية / منطقة الإقامة', labelEn: 'Nationality / Region', options: ['دول عربية', 'باكستان / الهند', 'جنوب شرق آسيا', 'أوروبا / أمريكا', 'أفريقيا', 'أخرى'] },
  { key: 'expectations', labelAr: 'التوقعات الجوهرية', labelEn: 'Core Expectations', options: ['رجل ملتزم بالسنة', 'استقرار مادي كافٍ', 'سكن مستقل', 'مشاركة في التربية الإسلامية', 'الجمع بين كل ما سبق'] },
];

export function BrideModule() {
  const { locale, role } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const isBride = role === 'bride';

  function handleSelect(key: string, value: string) {
    if (!isBride) {
      toast.error(locale === 'ar' ? 'هذا الحقل متاح للعروس فقط' : 'This field is for the Bride only');
      return;
    }
    setSelections(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!isBride) return;
    setSubmitted(true);
    toast.success(locale === 'ar' ? 'تم حفظ البيانات بخصوصية تامة' : 'Profile saved with full privacy');
  }

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">🌸</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'bride_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'bride_desc')}</p>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#2E5A44]/15 border border-[#2E5A44]/30 mb-4">
        <span className="text-green-400 text-sm mt-0.5">🔒</span>
        <p className="text-xs text-green-300/80 leading-relaxed">
          {locale === 'ar'
            ? 'هويتك الشخصية محجوبة تماماً — لا صور، لا أسماء — حفاظاً على الحياء والكرامة'
            : 'Your personal identity is fully concealed — no photos, no names — preserving modesty and dignity'}
        </p>
      </div>

      {!isBride && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-900/15 border border-amber-700/25 mb-4">
          <span className="text-amber-400 text-sm">⚠</span>
          <p className="text-xs text-amber-300/80">
            {locale === 'ar'
              ? 'يمكن للعروس فقط تعبئة هذا الحقل'
              : 'Only the Bride may fill this profile section'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {submitted ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">✅</div>
            <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#D4AF37] text-lg font-semibold`}>
              {locale === 'ar' ? 'تم حفظ ملفك الشخصي' : 'Profile Saved'}
            </p>
            <p className="text-[#C19A6B] text-sm mt-2">
              {locale === 'ar' ? 'يمكن للولي مراجعة البيانات' : 'The Wali may review your data'}
            </p>
          </div>
        ) : (
          <>
            {BRIDE_FIELDS.map(field => (
              <div key={field.key} className="glass-panel-light p-4 rounded-xl">
                <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm font-medium mb-3`}>
                  {dir === 'rtl' ? field.labelAr : field.labelEn}
                </p>
                <div className="flex flex-wrap gap-2">
                  {field.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => isBride ? handleSelect(field.key, opt) : undefined}
                      disabled={!isBride}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        selections[field.key] === opt
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]'
                          : 'border-[#D4AF37]/20 text-[#C19A6B]'
                      } ${isBride ? 'hover:border-[#D4AF37]/40 hover:text-[#F5ECD7] cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {isBride && !submitted && (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selections).length === 0}
                className={`w-full btn-gold py-3 rounded-xl text-sm font-bold mt-2 ${Object.keys(selections).length === 0 ? 'opacity-40' : ''}`}
              >
                {locale === 'ar'
                  ? `حفظ الملف الشخصي (${Object.keys(selections).length}/${BRIDE_FIELDS.length} ✓)`
                  : `Save Profile (${Object.keys(selections).length}/${BRIDE_FIELDS.length} ✓)`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
