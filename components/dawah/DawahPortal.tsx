'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';

const DAWAH_SECTIONS = [
  {
    id: 'tawheed',
    iconAr: '☀️',
    titleAr: 'التوحيد — أساس السكينة الأسرية',
    titleEn: 'Tawheed — The Foundation of Family Tranquillity',
    contentAr: 'قال الله تعالى: ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾ — الروم: ٢١. السكينة الحقيقية لا تُبنى إلا على التوحيد الخالص لله رب العالمين. الأسرة التي يوحّد أفرادها ربهم هي الأسرة المتماسكة في الدنيا والآخرة.',
    contentEn: 'Allah says: "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them, and He placed between you affection and mercy." (Ar-Rum 30:21). True tranquillity is built only upon pure monotheism (Tawheed). The family united in worshipping their Lord alone is the family that endures in this life and the next.',
  },
  {
    id: 'womens_rights',
    iconAr: '⚖️',
    titleAr: 'حقوق المرأة المُعلَّقة في الإسلام — الحقيقة الكاملة',
    titleEn: "Women's Elevated Rights in Islam — The Full Truth",
    contentAr: 'أعطى الإسلام المرأة حقوقاً ثابتة ومضمونة منذ 1400 سنة قبل أن تعرفها حضارة الغرب: حق التملك، حق الاختيار الزواجي، حق المهر كملكية خاصة لا ينازعها فيه أحد، حق الخلع، حق الميراث، حق العلم. قال النبي ﷺ: "استوصوا بالنساء خيرًا".',
    contentEn: "Islam granted women established and guaranteed rights 1,400 years before Western civilisation recognised them: the right to own property, the right to choose a spouse, the right to Mahr as personal property that no one can take from her, the right to seek divorce (Khul'), the right of inheritance, the right to knowledge. The Prophet ﷺ said: 'Take good care of women.'",
  },
  {
    id: 'secular_decay',
    iconAr: '📉',
    titleAr: 'أزمة الأسرة العلمانية — الواقع والأرقام',
    titleEn: 'The Crisis of the Secular Family — Facts and Figures',
    contentAr: 'تشير الإحصاءات العالمية إلى أن معدل الطلاق في الدول العلمانية تجاوز 50% في كثير من الدول الغربية، وأن نسبة كبيرة من الأطفال يُولدون خارج إطار الزواج. الزواج الشرعي المبني على الشريعة الإسلامية يضمن حقوقاً واضحة وعادلة لجميع الأطراف منذ اليوم الأول.',
    contentEn: 'Global statistics indicate that divorce rates in secular societies exceed 50% in many Western countries, with large proportions of children born outside marriage. Sharia-based marriage guarantees clear, just rights for all parties from day one, with defined roles, responsibilities, and protections.',
  },
  {
    id: 'nikah_procedure',
    iconAr: '📜',
    titleAr: 'إجراءات النكاح الشرعي — خطوة بخطوة',
    titleEn: 'Nikah Procedure — Step by Step',
    contentAr: '١) الخطبة الشرعية: التعارف تحت إشراف الولي.\n٢) الاتفاق على المهر.\n٣) إيجاب وقبول بحضور شاهدَين عدلَين.\n٤) الإعلان والوليمة.\n٥) تسجيل مدني حيثما أوجبه القانون المحلي.',
    contentEn: '1) The Proposal (Khitbah): introductions under Wali supervision.\n2) Agreement on the Mahr.\n3) Offer and acceptance (Ijab and Qabul) in the presence of two just witnesses.\n4) Announcement (I\'lan) and the wedding feast (Walimah).\n5) Civil registration where required by local law.',
  },
  {
    id: 'legal_notes',
    iconAr: '🏛',
    titleAr: 'الإرشادات القانونية المحلية',
    titleEn: 'Local Legal Guidance',
    contentAr: 'يُستحسن تسجيل عقد النكاح مدنياً لحماية حقوق الزوجين والأبناء أمام القانون المحلي. يُرجع إلى المراكز الإسلامية المعتمدة في كل دولة للحصول على التوجيه اللازم حسب التشريع المحلي.',
    contentEn: 'It is advisable to register the Nikah contract civilly to protect the rights of both spouses and children under local law. Consult accredited Islamic centres in each country for guidance according to local legislation. Procedures vary: UK (Sharia Council documentation), USA (civil marriage license), France (civil marriage required first), etc.',
  },
];

export function DawahPortal() {
  const { locale } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [openSection, setOpenSection] = useState<string | null>('tawheed');

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="ornament-line w-16 sm:w-24" />
          <span className="font-arabic text-[#D4AF37] text-2xl">📖</span>
          <div className="ornament-line w-16 sm:w-24" />
        </div>
        <h1 className="font-arabic text-2xl sm:text-3xl text-[#D4AF37] mb-2">
          {t(locale, 'dawah_title')}
        </h1>
        <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm max-w-xl mx-auto`}>
          {t(locale, 'dawah_subtitle')}
        </p>
      </div>

      {/* Quranic verse hero */}
      <div className="glass-panel p-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="font-arabic text-[200px] text-[#D4AF37]">الله</span>
        </div>
        <p className="font-arabic text-[#F5ECD7] text-xl leading-loose mb-3 relative z-10">
          ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾
        </p>
        <p className="text-[#C19A6B] text-sm relative z-10">{t(locale, 'quran_rum_2130')}</p>
        <div className="ornament-line w-48 mx-auto mt-4" />
        <p className="font-arabic text-[#D4AF37]/80 text-sm mt-2 italic relative z-10">
          {t(locale, 'hadith_nikah')}
        </p>
      </div>

      {/* Sections accordion */}
      <div className="space-y-3">
        {DAWAH_SECTIONS.map(s => (
          <div key={s.id} className="glass-panel-light rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
              className="w-full flex items-center gap-3 p-4 text-start"
            >
              <span className="text-xl flex-shrink-0">{s.iconAr}</span>
              <h3 className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] font-medium text-sm flex-1`}>
                {dir === 'rtl' ? s.titleAr : s.titleEn}
              </h3>
              <span
                className="text-[#D4AF37]/60 transition-transform flex-shrink-0"
                style={{ transform: openSection === s.id ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </span>
            </button>
            {openSection === s.id && (
              <div className="px-4 pb-4 border-t border-[#D4AF37]/10 pt-3">
                <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm leading-relaxed whitespace-pre-line`}>
                  {dir === 'rtl' ? s.contentAr : s.contentEn}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA for seekers */}
      <div className="glass-panel p-6 mt-8 text-center">
        <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-base font-medium mb-3`}>
          {locale === 'ar'
            ? 'مهتم بمعرفة المزيد عن الإسلام؟'
            : 'Interested in learning more about Islam?'}
        </p>
        <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-sm mb-4`}>
          {locale === 'ar'
            ? 'ابدأ رحلتك مع الإسلام من خلال مراكز إسلامية معتمدة في منطقتك'
            : 'Begin your journey with Islam through accredited Islamic centres in your region'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Yaqeen Institute', 'IslamQA (Sheikh Al-Munajjid)', 'Dar Al-Ifta', 'Islam.ru'].map(r => (
            <span key={r} className="badge-sharia text-xs px-3 py-1.5">{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
