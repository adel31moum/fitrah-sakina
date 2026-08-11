'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';

// ── Post templates (6 rotating) ─────────────────────────────────────────────
const POST_TEMPLATES = [
  {
    id: 1,
    emoji: '🌙',
    ar: {
      title: 'إطلاق منصة فطرة وسكينة',
      body: `﴿وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾\n\nزواج شرعي حقيقي على منهج السلف الصالح\n✅ بدون تواصل مباشر\n✅ تحت إشراف الولي في كل خطوة\n✅ توافق آلي فوري\n✅ ٩ لغات عالمية`,
      hashtags: '#فطرة_وسكينة #زواج_شرعي #سلفي #الجزائر',
    },
    en: {
      title: 'Fitrah & Sakina Platform Launch',
      body: `"And He placed between you affection and mercy"\n\nSharia-compliant marriage — Salafi methodology\n✅ No direct contact\n✅ Wali supervision every step\n✅ Instant AI matching\n✅ 9 world languages`,
      hashtags: '#FitrahSakina #IslamicMarriage #Salafi',
    },
  },
  {
    id: 2,
    emoji: '🕌',
    ar: {
      title: 'للشباب الذين يبحثون عن الزواج الحلال',
      body: `لا مواعدة · لا تواصل · لا صور\n\nفقط المسار الشرعي الصحيح:\nالتعارف → الشروط → الولي → الرؤية → الموعد\n\nسجّل الآن — أسبوع مجاني للمعسرين 🌿`,
      hashtags: '#زواج_حلال #منهج_السلف #عفة #فطرة_وسكينة',
    },
    en: {
      title: 'For youth seeking halal marriage',
      body: `No dating · No direct contact · No photos\n\nOnly the correct Sharia path:\nIntro → Conditions → Wali → Vision → Appointment\n\nRegister now — free week for those in hardship 🌿`,
      hashtags: '#HalalMarriage #SalafiManhaj #Chastity #FitrahSakina',
    },
  },
  {
    id: 3,
    emoji: '✈️',
    ar: {
      title: 'للمسلمين في أوروبا وكندا والمهجر',
      body: `سلفيون في المهجر يبحثون عن بيئة إسلامية صحيحة؟\n\nفطرة وسكينة تجمعكم بأهل المنهج في كل بلاد العالم\n🌍 الجزائر · فرنسا · ألمانيا · بريطانيا · كندا · وأكثر`,
      hashtags: '#مسلمو_أوروبا #هجرة #زواج_شرعي #فطرة_وسكينة',
    },
    en: {
      title: 'For Muslims in Europe, Canada & diaspora',
      body: `Salafis abroad seeking a sound Islamic environment?\n\nFitrah & Sakina connects you with Ahl al-Manhaj worldwide\n🌍 Algeria · France · Germany · UK · Canada & more`,
      hashtags: '#MuslimsAbroad #Hijrah #IslamicMarriage #FitrahSakina',
    },
  },
  {
    id: 4,
    emoji: '💚',
    ar: {
      title: 'صندوق زكاة المنصة — زواج المعسرين',
      body: `٣٠٪ من كل اشتراك يذهب مباشرةً لصندوق دعم زواج المعسرين\n\nاشتراكك يُعين أخاك على إتمام نصف دينه\n\nجزاك الله خيراً على كل مساهمة 🌿`,
      hashtags: '#زكاة #صدقة_جارية #زواج_المعسرين #فطرة_وسكينة',
    },
    en: {
      title: 'Platform Zakah Fund — Marriages for the needy',
      body: `30% of every subscription goes directly to the marriage hardship fund\n\nYour subscription helps your brother complete half his deen\n\nJazakAllah Khayr for every contribution 🌿`,
      hashtags: '#Zakah #SadaqahJariyah #IslamicCharity #FitrahSakina',
    },
  },
  {
    id: 5,
    emoji: '📖',
    ar: {
      title: 'توافق آلي بمعايير المنهج والهجرة والقرآن',
      body: `خوارزمية التوافق تحسب:\n• المنهج السلفي\n• الاستعداد للهجرة\n• حفظ القرآن الكريم\n• البلد والسن والمهر\n\nنسبة توافق فورية ودقيقة 🎯`,
      hashtags: '#توافق_شرعي #زواج_بمعايير #فطرة_وسكينة',
    },
    en: {
      title: 'AI matching by Manhaj, Hijrah & Quran criteria',
      body: `Matching algorithm scores:\n• Salafi methodology\n• Hijrah readiness\n• Quran memorization\n• Country, age & mahr\n\nInstant precise compatibility score 🎯`,
      hashtags: '#IslamicMatching #HalalMatch #FitrahSakina',
    },
  },
  {
    id: 6,
    emoji: '🛡',
    ar: {
      title: 'الولي — ركن أساسي في كل خطوة',
      body: `لا خطوة واحدة بدون الولي الشرعي\n\nالمنصة تُرسل إشعاراً لوليّك قبل كل قرار\nوتحفظ موافقته في سجل شرعي موثّق\n\nلأن الشرع قبل كل شيء 🛡`,
      hashtags: '#ولاية #شرع #محارم #فطرة_وسكينة',
    },
    en: {
      title: 'The Wali — essential at every step',
      body: `Not a single step without the Wali\n\nThe platform notifies your Wali before every decision\nAnd preserves his approval in a documented Sharia record\n\nBecause Sharia comes first 🛡`,
      hashtags: '#Wali #Guardianship #Sharia #FitrahSakina',
    },
  },
];

const CHANNELS = [
  { id: 'facebook', label: 'Facebook', icon: '🔵', color: 'rgba(24,119,242,0.15)', border: 'rgba(24,119,242,0.35)' },
  { id: 'telegram', label: 'Telegram', icon: '🔷', color: 'rgba(0,136,204,0.15)', border: 'rgba(0,136,204,0.35)' },
];

const INTERVAL_MS = 48 * 60 * 60 * 1000; // 48h real; display as mock timer

export function AutoPoster() {
  const { locale } = useFitrahStore();
  const isAr = locale === 'ar';

  const [running, setRunning] = useState(false);
  const [postIdx, setPostIdx] = useState(0);
  const [log, setLog] = useState<Array<{ time: string; channel: string; postId: number; ar: string }>>([]);
  const [mockCountdown, setMockCountdown] = useState(0); // seconds to next post (mock: 30s cycle)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['facebook', 'telegram']);
  const MOCK_CYCLE = 30; // 30 seconds mock = 48h real

  const pushLog = useCallback((channel: string, pId: number) => {
    const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const post = POST_TEMPLATES.find(p => p.id === pId);
    setLog(prev => [{
      time: now,
      channel,
      postId: pId,
      ar: post ? post.ar.title : '',
    }, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    if (!running) return;
    setMockCountdown(MOCK_CYCLE);

    const tick = setInterval(() => {
      setMockCountdown(prev => {
        if (prev <= 1) {
          // fire post
          const nextIdx = (postIdx + 1) % POST_TEMPLATES.length;
          setPostIdx(nextIdx);
          const nextPost = POST_TEMPLATES[nextIdx];
          selectedChannels.forEach(ch => pushLog(ch, nextPost.id));
          return MOCK_CYCLE;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, postIdx, selectedChannels, pushLog]);

  const currentPost = POST_TEMPLATES[postIdx];
  const content = isAr ? currentPost.ar : currentPost.en;

  function toggleChannel(id: string) {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  function startNow() {
    setRunning(true);
    selectedChannels.forEach(ch => pushLog(ch, currentPost.id));
    setMockCountdown(MOCK_CYCLE);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="text-center">
        <div className="text-3xl mb-2">📡</div>
        <h2 className="font-arabic text-[#D4AF37] text-2xl font-bold mb-1">
          {isAr ? 'الناشر التلقائي' : 'Auto-Poster'}
        </h2>
        <p className="font-arabic text-[#C19A6B]/70 text-sm">
          {isAr
            ? 'ينشر منشوراً شرعياً محترفاً كل ٤٨ ساعة تلقائياً على فيسبوك وتيليغرام'
            : 'Auto-publishes a professional Sharia post every 48 hours on Facebook & Telegram'}
        </p>
      </div>

      {/* Status bar */}
      <div className={`glass-panel p-4 flex items-center justify-between flex-wrap gap-3 border ${
        running ? 'border-[#2E5A44]/50' : 'border-[#D4AF37]/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${running ? 'bg-[#7EC8A4] animate-pulse' : 'bg-[#C19A6B]/30'}`} />
          <span className="font-arabic text-sm font-semibold" style={{ color: running ? '#7EC8A4' : '#C19A6B' }}>
            {running
              ? (isAr ? '🟢 يعمل — جاهز للنشر التلقائي' : '🟢 Running — ready to auto-post')
              : (isAr ? '⚪ متوقف' : '⚪ Stopped')}
          </span>
        </div>
        {running && (
          <div className="font-arabic text-[#D4AF37] text-sm">
            {isAr ? `⏱ المنشور التالي خلال: ${mockCountdown}ث (٤٨س حقيقي)` : `⏱ Next post in: ${mockCountdown}s (48h real)`}
          </div>
        )}
        <button
          onClick={() => running ? setRunning(false) : startNow()}
          className={`px-5 py-2 rounded-xl font-arabic text-sm font-bold transition-all ${
            running ? 'border border-red-500/30 text-red-400 hover:bg-red-500/10' : 'btn-gold'
          }`}
        >
          {running ? (isAr ? '⏸ إيقاف' : '⏸ Stop') : (isAr ? '▶ تفعيل الناشر' : '▶ Activate Poster')}
        </button>
      </div>

      {/* Channel selector */}
      <div className="glass-panel p-5">
        <p className="font-arabic text-[#C19A6B] text-xs font-semibold mb-3">
          {isAr ? 'قنوات النشر' : 'Publishing Channels'}
        </p>
        <div className="flex gap-3 flex-wrap">
          {CHANNELS.map(ch => (
            <button key={ch.id}
              onClick={() => toggleChannel(ch.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-arabic text-sm border transition-all ${
                selectedChannels.includes(ch.id)
                  ? 'text-[#F5ECD7]'
                  : 'border-[#D4AF37]/15 text-[#C19A6B]/40'
              }`}
              style={selectedChannels.includes(ch.id)
                ? { background: ch.color, border: `1px solid ${ch.border}` }
                : {}}>
              <span>{ch.icon}</span>
              <span>{ch.label}</span>
              {selectedChannels.includes(ch.id) && <span className="text-[#7EC8A4] text-xs">✓</span>}
            </button>
          ))}
        </div>
        <p className="font-arabic text-[#C19A6B]/40 text-[10px] mt-2">
          {isAr
            ? 'في النشر الحقيقي: يتصل بـ Facebook Graph API + Telegram Bot API تلقائياً'
            : 'In production: connects to Facebook Graph API + Telegram Bot API automatically'}
        </p>
      </div>

      {/* Current post preview */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-arabic text-[#D4AF37] text-sm font-semibold">
            {isAr ? `📝 المنشور القادم (${postIdx + 1}/${POST_TEMPLATES.length})` : `📝 Next post (${postIdx + 1}/${POST_TEMPLATES.length})`}
          </p>
          <div className="flex gap-1">
            {POST_TEMPLATES.map((_, i) => (
              <button key={i} onClick={() => setPostIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === postIdx ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40'}`} />
            ))}
          </div>
        </div>

        <div className="bg-[#D4AF37]/05 rounded-xl p-4 border border-[#D4AF37]/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{currentPost.emoji}</span>
            <span className="font-arabic text-[#F5ECD7] font-bold text-sm">{content.title}</span>
          </div>
          <pre className="font-arabic text-[#C19A6B]/85 text-xs leading-relaxed whitespace-pre-wrap mb-3">
            {content.body}
          </pre>
          <p className="font-arabic text-[#7EC8A4]/70 text-[10px]">{content.hashtags}</p>
        </div>

        {/* Cycle arrows */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => setPostIdx(i => (i - 1 + POST_TEMPLATES.length) % POST_TEMPLATES.length)}
            className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-arabic">
            {isAr ? '← السابق' : '← Prev'}
          </button>
          <button onClick={() => setPostIdx(i => (i + 1) % POST_TEMPLATES.length)}
            className="flex-1 btn-ghost px-3 py-1.5 rounded-lg text-xs font-arabic">
            {isAr ? 'التالي ←' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div className="glass-panel p-5">
          <p className="font-arabic text-[#C19A6B] text-xs font-semibold mb-3">
            📋 {isAr ? 'سجل النشر' : 'Activity Log'}
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {log.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-arabic">
                <span className="text-[#C19A6B]/40 flex-shrink-0" translate="no">{entry.time}</span>
                <span className="text-[#7EC8A4]/80">{entry.channel === 'facebook' ? '🔵' : '🔷'}</span>
                <span className="text-[#F5ECD7]/60 truncate">{entry.ar}</span>
                <span className="text-[#2E5A44]/60 flex-shrink-0">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-[#2E5A44]/10 border border-[#2E5A44]/25 rounded-xl p-4">
        <p className="font-arabic text-[#7EC8A4] text-xs font-semibold mb-2">
          ℹ️ {isAr ? 'كيف يعمل في الإنتاج الحقيقي؟' : 'How does it work in real production?'}
        </p>
        <ul className="font-arabic text-[#C19A6B]/65 text-[11px] space-y-1 leading-relaxed">
          {(isAr ? [
            'يُشغَّل Cron Job على Cloudflare Workers كل ٤٨ ساعة تلقائياً',
            'يُولّد المنشور من قالب دوّار ويُرسله لـ Facebook Graph API',
            'يُنشر في Telegram عبر Bot API مع الهاشتاقات والنص الكامل',
            'سجل النشر محفوظ في قاعدة البيانات للمراجعة',
          ] : [
            'Cron Job runs on Cloudflare Workers every 48h automatically',
            'Generates post from rotating template and sends to Facebook Graph API',
            'Posts to Telegram via Bot API with hashtags and full text',
            'Activity log stored in database for review',
          ]).map((item, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-[#7EC8A4]/60 mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
