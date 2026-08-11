'use client';

/**
 * SalafiChannel — قسم بث المنهج السلفي
 * قصص صحابة، أحاديث الزواج، حث على اتباع السلف الصالح
 * تصميم "بث مباشر" تفاعلي — يتجدد كل زيارة
 */

import React, { useState } from 'react';
import { LOCALES } from '@/lib/i18n';
import { useFitrahStore } from '@/store/fitrahStore';
import { STORIES } from '@/components/StoryDetail';

const TX = {
  ar: {
    sectionTitle: 'بث المنهج السلفي',
    sectionSub: 'من هدي النبي ﷺ والصحابة الكرام — قصص وأحاديث للثبات على المنهج',
    allLabel: 'الكل',
    types: { story: 'قصص', hadith: 'أحاديث', principle: 'منهج' },
    lesson: 'الدرس',
    source: 'المصدر',
    share: 'شارك',
    next: 'التالي →',
    prev: '← السابق',
    liveTag: 'بثّ مباشر',
    hadithDaily: 'حديث اليوم',
    callToSalaf: '📢 نداء للمسلم',
    callBody: 'الفرقة الناجية هي من اتبع الكتاب والسنة بفهم السلف الصالح. اسأل نفسك: هل أنا على هذا المنهج في حياتي الزوجية والأسرية؟',
    callBtn: 'ابدأ باستشارة المساعد الشرعي',
  },
  en: {
    sectionTitle: 'Salafi Methodology Channel',
    sectionSub: 'From the guidance of the Prophet ﷺ and the noble Companions — stories and hadiths for steadfastness',
    allLabel: 'All',
    types: { story: 'Stories', hadith: 'Hadiths', principle: 'Methodology' },
    lesson: 'Lesson',
    source: 'Source',
    share: 'Share',
    next: 'Next →',
    prev: '← Previous',
    liveTag: 'Live Feed',
    hadithDaily: "Today's Hadith",
    callToSalaf: '📢 A Call to the Muslim',
    callBody: 'The Saved Group (Al-Firqa al-Najiya) is those who follow the Book and Sunnah with the understanding of the righteous Salaf. Ask yourself: Am I on this methodology in my marital and family life?',
    callBtn: 'Start with the AI Sharia Advisor',
  },
};

type StoryType = 'all' | 'story' | 'hadith' | 'principle';

export function SalafiChannel() {
  const { locale, setActiveModule, openStory } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isAr = locale === 'ar';
  const tx = isAr ? TX.ar : TX.en;

  const [filter, setFilter] = useState<StoryType>('all');
  const [current, setCurrent] = useState(0);

  const filtered = filter === 'all' ? STORIES : STORIES.filter(s => s.type === filter);
  const story = filtered[current] ?? filtered[0];

  function next() { setCurrent(i => (i + 1) % filtered.length); }
  function prev() { setCurrent(i => (i - 1 + filtered.length) % filtered.length); }

  if (!story) return null;

  const typeColors: Record<string, string> = {
    story: '#D4AF37',
    hadith: '#7EC8A4',
    principle: '#C19A6B',
  };
  const color = typeColors[story.type] ?? '#D4AF37';
  const tag = isAr ? story.tagAr : story.tagEn;

  return (
    <section dir={dir} className="relative px-4 py-12"
      style={{ background: 'rgba(10,8,4,0.60)' }}>

      {/* Green ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(46,90,68,0.10) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 border border-[#2E5A44]/40 bg-[#2E5A44]/10 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#7EC8A4] animate-pulse" />
            <span className="text-[#7EC8A4] text-xs">{tx.liveTag}</span>
          </div>
          <h2 className="font-arabic text-2xl sm:text-3xl text-[#F5ECD7] font-bold mb-2">{tx.sectionTitle}</h2>
          <p className="font-arabic text-[#C19A6B]/70 text-sm max-w-xl mx-auto">{tx.sectionSub}</p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {(['all', 'story', 'hadith', 'principle'] as StoryType[]).map(f => (
            <button key={f}
              onClick={() => { setFilter(f); setCurrent(0); }}
              className="px-3 py-1.5 rounded-full text-xs font-arabic transition-all"
              style={{
                background: filter === f ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.04)',
                border: filter === f ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.12)',
                color: filter === f ? '#D4AF37' : '#C19A6B',
              }}>
              {f === 'all' ? tx.allLabel : tx.types[f]}
              <span className="opacity-50 ml-1 font-mono text-[9px]">
                {f === 'all' ? STORIES.length : STORIES.filter(s => s.type === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Story card ── */}
        <div className="glass-panel rounded-2xl overflow-hidden mb-4"
          style={{ borderColor: `${color}35` }}>
          {/* Card top bar */}
          <div className="h-1" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />

          <div className="p-5 sm:p-7">
            {/* Tag + nav */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{story.icon}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-arabic"
                  style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
                  {tag}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#C19A6B]/40 text-xs font-mono">
                <span>{current + 1}</span>
                <span>/</span>
                <span>{filtered.length}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-arabic text-lg sm:text-xl text-[#F5ECD7] font-bold mb-4 leading-relaxed">
              {isAr ? story.titleAr : story.titleEn}
            </h3>

            {/* Body */}
            <p className="font-arabic text-[#C19A6B] text-sm sm:text-base leading-loose whitespace-pre-line mb-4">
              {isAr ? story.bodyAr : story.bodyEn}
            </p>

            {/* Lesson badge + Read full */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                <span className="text-sm">💡</span>
                <span className="font-arabic text-sm font-semibold" style={{ color }}>
                  {tx.lesson}: {isAr ? story.lesson.ar : story.lesson.en}
                </span>
              </div>

              {/* ── Read full button ── */}
              <button
                onClick={() => openStory(story.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-arabic text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg,${color}22,${color}10)`,
                  border: `1px solid ${color}50`,
                  color,
                  boxShadow: `0 0 16px ${color}15`,
                }}
              >
                <span className="text-base">📖</span>
                <span>{isAr ? 'اقرأ التفاصيل الكاملة' : 'Read Full Story'}</span>
                <span className="opacity-60">{isAr ? '←' : '→'}</span>
              </button>
            </div>

            {/* Source */}
            <div className="font-arabic text-[#C19A6B]/40 text-xs">
              {tx.source}: {isAr ? story.sourceAr : story.sourceEn}
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prev} className="btn-ghost px-4 py-2 rounded-xl font-arabic text-sm">
            {tx.prev}
          </button>
          {/* Dots */}
          <div className="flex gap-1.5">
            {filtered.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === current ? '#D4AF37' : 'rgba(212,175,55,0.20)' }} />
            ))}
          </div>
          <button onClick={next} className="btn-ghost px-4 py-2 rounded-xl font-arabic text-sm">
            {tx.next}
          </button>
        </div>

        {/* ── Call to Salaf banner ── */}
        <div className="glass-panel rounded-2xl p-6 text-center relative overflow-hidden"
          style={{ borderColor: 'rgba(46,90,68,0.40)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg,rgba(46,90,68,0.08),transparent 60%)' }} />
          <h3 className="font-arabic text-[#7EC8A4] text-base font-bold mb-2 relative z-10">
            {tx.callToSalaf}
          </h3>
          <p className="font-arabic text-[#C19A6B] text-sm leading-relaxed mb-4 max-w-xl mx-auto relative z-10">
            {tx.callBody}
          </p>
          <button
            onClick={() => setActiveModule('council')}
            className="btn-primary px-6 py-2.5 rounded-xl font-arabic text-sm relative z-10">
            🤖 {tx.callBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
