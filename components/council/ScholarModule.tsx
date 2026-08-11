'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';

const FATWA_DATA = [
  {
    id: 'f1',
    category: 'أركان النكاح',
    categoryEn: 'Pillars of Marriage',
    source: 'صحيح البخاري',
    sourceEn: 'Sahih Al-Bukhari',
    ar: 'لا نكاح إلا بولي — النكاح لا يصح إلا بولي وشاهدَين عدلَين، وهذا مذهب جمهور أهل السنة والجماعة.',
    en: 'There is no marriage without a guardian (Wali). Marriage is only valid with a Wali and two just witnesses — this is the position of the overwhelming majority of Ahl Al-Sunnah.',
  },
  {
    id: 'f2',
    category: 'المهر الشرعي',
    categoryEn: 'The Sharia Mahr',
    source: 'صحيح مسلم',
    sourceEn: 'Sahih Muslim',
    ar: 'المهر حق واجب للمرأة لا يسقط بالإسقاط، وأفضل المهور أيسرها. قال النبي ﷺ: "خير النساء أيسرهن مهراً".',
    en: "The Mahr is an obligatory right of the wife that cannot be waived. The best Mahr is the lightest. The Prophet ﷺ said: 'The best women are those with the lightest Mahr.'",
  },
  {
    id: 'f3',
    category: 'شروط عقد الزواج',
    categoryEn: 'Marriage Contract Conditions',
    source: 'ابن قدامة — المغني',
    sourceEn: "Ibn Qudama — Al-Mughni",
    ar: 'يجوز اشتراط الزوجة ألا تُخرج من بلدها، وألا يتزوج عليها، وغير ذلك من الشروط المباحة. فمن شرط شرطاً كان أحق الناس بالوفاء به.',
    en: 'The wife may stipulate conditions such as not being relocated from her city, or that the husband not marry an additional wife, and other permissible conditions. Whoever stipulates a condition has the greatest right to have it fulfilled.',
  },
  {
    id: 'f4',
    category: 'حق المرأة في الاختيار',
    categoryEn: "Women's Right of Choice",
    source: 'صحيح البخاري',
    sourceEn: 'Sahih Al-Bukhari',
    ar: 'لا تُنكح الأيم حتى تُستأمر، ولا البكر حتى تُستأذن. قالوا: يا رسول الله، وكيف إذنها؟ قال: أن تسكت.',
    en: "A previously married woman should not be married without her explicit permission, and a virgin should not be married without her permission. They said: O Messenger of Allah, how is her permission given? He ﷺ said: Her silence (indicates permission).",
  },
  {
    id: 'f5',
    category: 'التعدد وضوابطه',
    categoryEn: 'Polygyny and Its Conditions',
    source: 'سورة النساء ٣',
    sourceEn: 'Surah An-Nisa 4:3',
    ar: '﴿فَإِنْ خِفْتُمْ أَلَّا تَعْدِلُوا فَوَاحِدَةً﴾. العدل بين الزوجات واجب فيما يملكه الإنسان، وهو شرط لجواز التعدد.',
    en: '"If you fear that you will not be just, then [marry only] one." Justice between wives in matters within one\'s control is obligatory and a condition for the permissibility of polygyny.',
  },
  {
    id: 'f6',
    category: 'ولاية المرأة المسلمة الجديدة',
    categoryEn: 'Guardianship of New Muslim Women',
    source: 'الإمام الشافعي',
    sourceEn: 'Imam Al-Shafi\'i',
    ar: 'المرأة التي أسلمت وليس لها ولي مسلم، يتولى أمرها الإمام أو من ينوب عنه من القضاة والمراكز الإسلامية المعتمدة.',
    en: 'A woman who has embraced Islam without a Muslim Wali — her guardianship is undertaken by the Imam, or whoever acts in his place from among accredited judges and Islamic centres.',
  },
  {
    id: 'f7',
    category: 'الميثاق الغليظ',
    categoryEn: 'The Solemn Covenant (Mithaq Ghaliz)',
    source: 'سورة النساء ٤:٢١',
    sourceEn: 'An-Nisa 4:21',
    ar: '﴿وَكَيْفَ تَأْخُذُونَهُ وَقَدْ أَفْضَىٰ بَعْضُكُمْ إِلَىٰ بَعْضٍ وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾. وصف الله عقد الزواج بالميثاق الغليظ وهو أشد الأوصاف دلالةً على أهمية الوفاء بهذا العقد المقدس.',
    en: '"And how could you take it back when you have already given yourselves to each other, and she has taken from you a solemn covenant." Allah described the marriage contract as the "Mithaq Ghaliz" — the most solemn of covenants — emphasising the sanctity of honouring it.',
  },
  {
    id: 'f8',
    category: 'الوصية بالنساء',
    categoryEn: 'The Prophetic Counsel Regarding Women',
    source: 'صحيح البخاري ومسلم',
    sourceEn: 'Sahih Al-Bukhari & Muslim',
    ar: 'قال النبي ﷺ: «اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا، فَإِنَّهُنَّ خُلِقْنَ مِنْ ضِلَعٍ، وَإِنَّ أَعْوَجَ شَيْءٍ فِي الضِّلَعِ أَعْلَاهُ، فَإِنْ ذَهَبْتَ تُقِيمُهُ كَسَرْتَهُ، وَإِنِ اسْتَمْتَعْتَ بِهِ اسْتَمْتَعْتَ بِهِ وَفِيهِ عِوَجٌ». دلالة على وجوب الرفق والحكمة في معاملة الزوجة.',
    en: 'The Prophet ﷺ said: "Take good care of women, for a woman was created from a rib; and the most curved part of the rib is the uppermost. If you try to straighten it, you will break it, and if you leave it, it will remain curved." — A lesson in treating a wife with gentleness and wisdom.',
  },
  {
    id: 'f9',
    category: 'أنكحوا الأيامى',
    categoryEn: 'Facilitation of Marriage',
    source: 'سورة النور ٢٤:٣٢',
    sourceEn: 'An-Nur 24:32',
    ar: '﴿وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ﴾. أمر الله بتيسير الزواج وعدم التشديد المادي فيه، والله هو الرازق الكريم.',
    en: '"And marry the unmarried among you and the righteous among your male slaves and female slaves. If they should be poor, Allah will enrich them from His bounty." — A divine command to facilitate marriage and not place excessive material barriers before it.',
  },
  {
    id: 'f10',
    category: 'اختيار صاحب الدين',
    categoryEn: 'Choosing the Religious Spouse',
    source: 'صحيح البخاري',
    sourceEn: 'Sahih Al-Bukhari',
    ar: 'قال النبي ﷺ: «تُنْكَحُ الْمَرْأَةُ لِأَرْبَعٍ: لِمَالِهَا، وَلِحَسَبِهَا، وَلِجَمَالِهَا، وَلِدِينِهَا، فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ». معيار الدين هو المعيار الأساسي في الاختيار، وهذا هو جوهر فلسفة منصة فطرة وسكينة.',
    en: 'The Prophet ﷺ said: "A woman is married for four things: her wealth, her lineage, her beauty, and her religion. Prioritise the one of religion, may you prosper." — The standard of Deen (religion) is the primary criterion of selection, and this is the core philosophy of Fitrah & Sakina.',
  },
];

export function ScholarModule() {
  const { locale } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">📚</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'scholar_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'scholar_desc')}</p>
        </div>
      </div>

      {/* AI-block notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#2E5A44]/15 border border-[#2E5A44]/30 mb-4">
        <span className="text-green-400 text-sm">🔒</span>
        <p className="text-xs text-green-300/80">
          {locale === 'ar'
            ? 'جميع النصوص من مصادر سلفية موثوقة — لا يُستخدم الذكاء الاصطناعي لإصدار الفتاوى'
            : 'All texts from verified Salafi sources — AI is hard-blocked from issuing religious rulings'}
        </p>
      </div>

      {/* Fatwa list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {FATWA_DATA.map((f) => (
          <div
            key={f.id}
            className={`glass-panel-light rounded-xl cursor-pointer transition-all ${
              selected === f.id ? 'border-[#D4AF37]/50 bg-[#D4AF37]/08' : 'hover:border-[#D4AF37]/30'
            }`}
            onClick={() => setSelected(selected === f.id ? null : f.id)}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="badge-sharia">
                  {dir === 'rtl' ? f.category : f.categoryEn}
                </span>
                <p className="text-xs text-[#C19A6B] mt-1">
                  {dir === 'rtl' ? f.source : f.sourceEn}
                </p>
              </div>
              <span className="text-[#D4AF37]/60 text-sm transition-transform" style={{ transform: selected === f.id ? 'rotate(180deg)' : 'none' }}>
                ▾
              </span>
            </div>
            {selected === f.id && (
              <div className="px-4 pb-4 border-t border-[#D4AF37]/10 mt-1 pt-3">
                <p className={`${dir === 'rtl' ? 'font-arabic' : 'font-sans'} text-[#F5ECD7] leading-relaxed text-sm`}>
                  {dir === 'rtl' ? f.ar : f.en}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-[#C19A6B]/60">
          {locale === 'ar'
            ? '⚠ هذه المنصة للتعريف فقط — يُرجع للعلماء المعتمدين في مسائل الفتوى الخاصة'
            : '⚠ This platform is for reference only — consult qualified scholars for personal Fatwas'}
        </p>
      </div>
    </div>
  );
}
