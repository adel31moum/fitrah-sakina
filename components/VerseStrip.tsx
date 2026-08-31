'use client';

import React, { useEffect, useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

const VERSES = [
  {
    ar: '﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾',
    en: '"And of His signs is that He created for you from yourselves mates that you may find tranquillity in them"',
    source_ar: 'الروم ٣٠:٢١',
    source_en: 'Ar-Rum 30:21',
    type: 'verse',
  },
  {
    ar: '﴿وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا﴾',
    en: '"Our Lord! Bless us with pious spouses and offspring who will be the joy of our hearts, and make us models for the righteous."',
    source_ar: 'الفرقان ٢٥:٧٤',
    source_en: 'Al-Furqan 25:74',
    type: 'verse',
  },
  {
    ar: '﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾',
    en: '"And they have taken from you a solemn covenant."',
    source_ar: 'النساء ٤:٢١',
    source_en: 'An-Nisa 4:21',
    type: 'verse',
  },
  {
    ar: '﴿وَكَانَ أَبُوهُمَا صَالِحًا﴾',
    en: '"And their father had been a righteous man."',
    source_ar: 'الكهف ١٨:٨٢',
    source_en: 'Al-Kahf 18:82',
    type: 'verse',
  },
  {
    ar: 'قال النبي ﷺ: «النِّكَاحُ مِنْ سُنَّتِي، فَمَنْ رَغِبَ عَنْ سُنَّتِي فَلَيْسَ مِنِّي»',
    en: 'The Prophet ﷺ said: "Marriage is of my Sunnah. Whoever turns away from my Sunnah is not of me."',
    source_ar: 'رواه البخاري ومسلم',
    source_en: 'Al-Bukhari & Muslim',
    type: 'hadith',
  },
  {
    ar: 'قال النبي ﷺ: «اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا»',
    en: 'The Prophet ﷺ said: "Take good care of women."',
    source_ar: 'متفق عليه',
    source_en: 'Agreed Upon',
    type: 'hadith',
  },
];

export function VerseStrip() {
  const { locale } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(c => (c + 1) % VERSES.length);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const v = VERSES[current];
  const isHadith = v.type === 'hadith';

  return (
    <div
      dir={dir}
      className="relative py-8 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(46,90,68,0.12) 0%, rgba(14,11,7,0.60) 50%, rgba(46,90,68,0.08) 100%)',
        borderTop: '1px solid rgba(212,175,55,0.15)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* Geometric background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]"
        aria-hidden
      >
        <span className="font-arabic text-[280px] text-[#D4AF37] leading-none">✦</span>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Navigation dots */}
        <div className="flex justify-center gap-1.5 mb-5">
          {VERSES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setVisible(true); }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-[#D4AF37] w-4' : 'bg-[#D4AF37]/30'
              }`}
              aria-label={`Verse ${i + 1}`}
            />
          ))}
        </div>

        {/* Verse / Hadith card */}
        <div
          className="text-center transition-all duration-500"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
        >
          {isHadith && (
            <span className="font-arabic text-[#D4AF37]/60 text-xs tracking-widest block mb-2">
              ─── حديث شريف ───
            </span>
          )}
          <p className={`font-arabic text-[#F5ECD7] text-lg sm:text-xl leading-loose mb-3 ${
            isHadith ? 'italic' : ''
          }`}>
            {dir === 'rtl' ? v.ar : v.en}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="ornament-line w-12" />
            <span className={`font-arabic text-[#D4AF37]/70 text-xs`}>
              {dir === 'rtl' ? v.source_ar : v.source_en}
            </span>
            <div className="ornament-line w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
