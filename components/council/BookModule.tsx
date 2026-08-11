'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

const CONDITION_TEMPLATES = [
  { category: 'السكن', categoryEn: 'Housing', key: 'housing_independence', ar: 'شرط السكن المستقل', en: 'Independent housing required' },
  { category: 'العمل', categoryEn: 'Work', key: 'wife_work', ar: 'إذن عمل الزوجة', en: "Wife's right to work" },
  { category: 'التعليم', categoryEn: 'Education', key: 'wife_education', ar: 'استمرار تعليم الزوجة', en: "Wife's right to continue education" },
  { category: 'الطلاق', categoryEn: 'Divorce', key: 'divorce_right', ar: 'حق الزوجة في الخلع', en: "Wife's right to Khul'" },
  { category: 'الزوجة الثانية', categoryEn: 'Second Wife', key: 'no_second_wife', ar: 'اشتراط عدم التزوج على الزوجة', en: 'Condition of not taking a second wife' },
  { category: 'الهجرة', categoryEn: 'Relocation', key: 'hijrah', ar: 'الاستعداد للهجرة إلى بلاد إسلامية', en: 'Willingness to make Hijrah to Muslim lands' },
];

export function BookModule() {
  const { locale, bookConditions, addBookCondition, lockBookCondition, agreeToCondition, role } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customValue, setCustomValue] = useState('');

  function handleAddCondition() {
    const tpl = CONDITION_TEMPLATES.find(t => t.key === selectedTemplate);
    if (!tpl) return;
    addBookCondition({
      category: dir === 'rtl' ? tpl.category : tpl.categoryEn,
      key: tpl.key,
      value: dir === 'rtl' ? tpl.ar : tpl.en,
    });
    setSelectedTemplate('');
    toast.success(locale === 'ar' ? 'تمت إضافة الشرط' : 'Condition added');
  }

  function handleAgree(id: string) {
    if (role === 'visitor') {
      toast.error(locale === 'ar' ? 'يجب تحديد دورك أولاً' : 'Select your role first');
      return;
    }
    agreeToCondition(id, role as 'groom' | 'bride' | 'wali');
    toast.success(locale === 'ar' ? 'تم تسجيل موافقتك' : 'Agreement recorded');
  }

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">📋</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'book_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'book_desc')}</p>
        </div>
      </div>

      {/* Add condition */}
      <div className="glass-panel-light p-4 mb-4 rounded-xl">
        <p className="text-xs text-[#C19A6B] mb-3 font-medium">
          {locale === 'ar' ? 'إضافة شرط من العقد' : 'Add a Contract Condition'}
        </p>
        <div className="flex gap-2">
          <select
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
            className="flex-1 bg-[#0E0B07] border border-[#D4AF37]/25 text-[#F5ECD7] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60"
          >
            <option value="">{locale === 'ar' ? '-- اختر شرطاً --' : '-- Select condition --'}</option>
            {CONDITION_TEMPLATES.map(tpl => (
              <option key={tpl.key} value={tpl.key} className="bg-[#1A1410]">
                {dir === 'rtl' ? tpl.ar : tpl.en}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCondition}
            disabled={!selectedTemplate}
            className="btn-gold px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-40"
          >
            {locale === 'ar' ? 'أضف' : 'Add'}
          </button>
        </div>
      </div>

      {/* Conditions list */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {bookConditions.length === 0 ? (
          <div className="text-center py-8 text-[#C19A6B]/50 text-sm">
            <div className="text-4xl mb-2">📜</div>
            {locale === 'ar' ? 'لا توجد شروط بعد — ابدأ بإضافة شروط العقد' : 'No conditions yet — start adding contract terms'}
          </div>
        ) : (
          bookConditions.map((cond) => (
            <div
              key={cond.id}
              className={`glass-panel-light p-4 rounded-xl ${cond.locked ? 'border-[#2E5A44]/60' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="badge-sharia">{cond.category}</span>
                  <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-sm mt-2 leading-relaxed`}>
                    {cond.value}
                  </p>
                </div>
                {cond.locked && (
                  <span className="text-green-400 text-lg flex-shrink-0">🔒</span>
                )}
              </div>

              {/* Agreement status */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#D4AF37]/10">
                {(['groom', 'bride', 'wali'] as const).map(r => (
                  <span
                    key={r}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      cond.agreedBy.includes(r)
                        ? 'bg-[#2E5A44]/30 border-[#2E5A44]/50 text-green-400'
                        : 'border-[#D4AF37]/20 text-[#C19A6B]/50'
                    }`}
                  >
                    {r === 'groom' ? (locale === 'ar' ? 'العريس ✓' : 'Groom ✓') :
                     r === 'bride' ? (locale === 'ar' ? 'العروس ✓' : 'Bride ✓') :
                     (locale === 'ar' ? 'الولي ✓' : 'Wali ✓')}
                  </span>
                ))}
                <div className="flex-1" />
                {!cond.locked && (
                  <>
                    <button
                      onClick={() => handleAgree(cond.id)}
                      className="text-xs px-3 py-1 rounded-lg btn-palm"
                    >
                      {locale === 'ar' ? 'أوافق' : 'Agree'}
                    </button>
                    {cond.agreedBy.length === 3 && (
                      <button
                        onClick={() => lockBookCondition(cond.id)}
                        className="text-xs px-3 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]"
                      >
                        {locale === 'ar' ? 'إقفال' : 'Lock'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {bookConditions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#D4AF37]/10">
          <div className="flex justify-between text-xs text-[#C19A6B]">
            <span>{locale === 'ar' ? 'إجمالي الشروط:' : 'Total conditions:'} {bookConditions.length}</span>
            <span>{locale === 'ar' ? 'المقفلة:' : 'Locked:'} {bookConditions.filter(c => c.locked).length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
