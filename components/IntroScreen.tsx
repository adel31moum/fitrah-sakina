'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const CRISIS_STATS = [
  { num: '63%', label_ar: 'من الزيجات تنتهي بالطلاق في دول الغرب', icon: '💔' },
  { num: '71%', label_ar: 'من التطليق تبادر به المرأة عبر المحاكم المدنية', icon: '⚖️' },
  { num: '40M', label_ar: 'طفل يعيش مع والد واحد فقط في أمريكا وحدها', icon: '👦' },
  { num: '85%', label_ar: 'من زواج التطبيقات فشل خلال السنة الأولى', icon: '📱' },
  { num: '3×', label_ar: 'ارتفاع الطلاق بين المسلمين في العقدين الأخيرين', icon: '📈' },
];

const COLLAPSE_CAUSES = [
  { icon: '⚖️', ar: 'قوانين وضعية تُساوي في الولاية والطلاق بين الرجل والمرأة' },
  { icon: '📱', ar: 'تطبيقات المواعدة حوّلت الزواج إلى سوق رقمي بلا قيم ولا أخلاق' },
  { icon: '🎭', ar: 'فلسفة "التحرر" ألغت الأدوار الفطرية وأربكت هوية الرجل والمرأة' },
  { icon: '💼', ar: 'ضغوط العمل والمادة أزاحت حقوق الزوجة والأبناء إلى الهامش' },
  { icon: '🌐', ar: 'العولمة الثقافية فرضت نموذجاً أسرياً غريباً تماماً عن الفطرة البشرية' },
  { icon: '📜', ar: 'غياب العقد الشرعي الموثَّق يُهدر حقوق المرأة ويُفقدها الحماية القانونية' },
];

const SHEIKH_STORY = [
  'في زمن لم يكن فيه للإنترنت وجود، ولا للهاتف صوت...',
  'كان الزواج يُبنى على الفطرة — الولي، الشاهدان، المهر، والتقوى.',
  'ثم جاء العالَم الرقمي بسرعة مذهلة لم تُدرك أثرها الحضارات...',
  'وتفككت الأسرة. وضاعت الأدوار. واختلّ الميزان.',
  'لكن الشيخ لا يزال يكتب. والمصحف لا يزال مفتوحاً.',
  '﴿فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا﴾ — الروم: ٣٠',
];

const TICKER_TEXT =
  'DIVORCE +63%  ·  SINGLE PARENTS 40M  ·  DATING APPS $8B  ·  FAMILY COLLAPSE ×3  ·  MARRIAGE AGE +7Y  ·  BIRTH RATE −42%  ·  CUSTODY WARS +180%  ·  ISLAMIC DIVORCE +300%  ·  ';

// ─── STABLE PARTICLES ────────────────────────────────────────────────────────
// Pre-generate so they don't re-randomise on every render
const PARTICLE_DATA = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 11) % 97) + 1,
  y: ((i * 53 + 7)  % 93) + 3,
  size: 1 + (i % 5) * 0.5,
  dur:  4 + (i % 9),
  del:  (i % 7) * 0.9,
  dx:   ((i * 13) % 21) - 10,
  color: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#C19A6B' : '#7EC8A4',
  opacity: 0.12 + (i % 6) * 0.07,
}));

function Particles({ night = false }: { night?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLE_DATA.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  p.size,
            height: p.size,
            background: night
              ? (p.id % 4 === 0 ? '#e879f9' : p.id % 4 === 1 ? '#818cf8' : p.id % 4 === 2 ? '#38bdf8' : '#fff')
              : p.color,
            opacity: p.opacity,
            animation: `fsp_${p.id % 8} ${p.dur}s ${p.del}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── CITY SKYLINE (SVG) ───────────────────────────────────────────────────────
function CitySkyline() {
  const BUILDINGS = [
    [0,310,55,90],[30,265,28,135],[60,280,50,120],[120,215,42,185],
    [172,248,33,152],[215,200,60,200],[280,258,38,142],[328,188,75,212],
    [415,235,48,165],[473,170,68,230],[552,248,42,152],[605,210,52,190],
    [668,178,88,222],[768,240,43,160],[822,198,58,202],[892,218,47,182],
    [952,180,72,220],[1038,248,38,152],[1090,208,62,192],[1165,226,53,174],
    [1230,192,76,208],[1320,258,80,142],[1412,295,40,105],
  ];
  // antenna on tallest buildings
  const ANTENNAS = [505, 705, 990, 355];

  return (
    <svg viewBox="0 0 1440 400" className="absolute bottom-0 left-0 right-0 w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(8,6,20,0)" />
          <stop offset="100%" stopColor="rgba(14,11,7,1)" />
        </linearGradient>
      </defs>

      {/* Building silhouettes */}
      {BUILDINGS.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h}
          fill={`rgba(${8 + (i%4)*3},${6+(i%3)*2},${2+(i%5)},${0.88+i%3*0.03})`} />
      ))}

      {/* Antennas */}
      {ANTENNAS.map((ax, i) => (
        <line key={i} x1={ax + 35} y1={BUILDINGS.find(b => b[0] === ax)?.[1] ?? 200}
          x2={ax + 35} y2={(BUILDINGS.find(b => b[0] === ax)?.[1] ?? 200) - 28}
          stroke="rgba(200,160,80,0.55)" strokeWidth="1.5" />
      ))}

      {/* Neon billboard glows */}
      <rect x="360" y="182" width="60" height="8" rx="2" fill="rgba(236,72,153,0.55)" />
      <rect x="710" y="172" width="75" height="8" rx="2" fill="rgba(99,102,241,0.55)" />
      <rect x="995" y="174" width="65" height="8" rx="2" fill="rgba(6,182,212,0.55)" />

      {/* Windows — layered glows */}
      {Array.from({ length: 120 }, (_, i) => {
        const gx = 22 + (i * 11) % 1400;
        const gy = 190 + (i * 9)  % 180;
        const warm = i % 7 === 0;
        const off  = i % 11 === 0;
        return (
          <rect key={i} x={gx} y={gy} width={2 + i % 3} height={3 + i % 2}
            fill={off ? 'transparent'
              : warm ? `rgba(212,175,55,${0.5 + (i%4)*0.12})`
              :        `rgba(220,180,100,${0.25 + (i%5)*0.08})`}
            rx="0.4" />
        );
      })}

      {/* Ground fade */}
      <rect x="0" y="360" width="1440" height="40" fill="url(#skyGrad)" />
      <rect x="0" y="395" width="1440" height="5"  fill="rgba(14,11,7,1)" />
    </svg>
  );
}

// ─── ANIMATED STAT CARD ───────────────────────────────────────────────────────
function StatCard({ stat, delay }: { stat: typeof CRISIS_STATS[0]; delay: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className="glass-panel-light p-4 rounded-2xl text-center"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.94)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        border: '1px solid rgba(212,175,55,0.22)',
      }}
    >
      <div className="text-2xl mb-1">{stat.icon}</div>
      <div
        className="font-mono text-3xl sm:text-4xl font-black mb-1"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#C19A6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >{stat.num}</div>
      <p className="font-arabic text-[#F5ECD7]/75 text-[11px] leading-relaxed">{stat.label_ar}</p>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
type Scene = 'city' | 'collapse' | 'sheikh' | 'exit';

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [scene,        setScene]        = useState<Scene>('city');
  const [fading,       setFading]       = useState(false);
  const [storyLine,    setStoryLine]    = useState(0);
  const [statsVis,     setStatsVis]     = useState(false);
  const [causesVis,    setCausesVis]    = useState(false);
  const [skipped,      setSkipped]      = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goto = useCallback((next: Scene) => {
    setFading(true);
    setTimeout(() => { setFading(false); setScene(next); }, 650);
  }, []);

  // City → Collapse (auto 3.5 s)
  useEffect(() => {
    if (scene !== 'city') return;
    autoRef.current = setTimeout(() => goto('collapse'), 3500);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [scene, goto]);

  // Collapse: reveal stats + causes
  useEffect(() => {
    if (scene !== 'collapse') return;
    const t1 = setTimeout(() => setStatsVis(true), 250);
    const t2 = setTimeout(() => setCausesVis(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [scene]);

  // Sheikh story auto-advance (faster pace)
  useEffect(() => {
    if (scene !== 'sheikh') return;
    if (storyLine < SHEIKH_STORY.length - 1) {
      autoRef.current = setTimeout(() => setStoryLine(l => l + 1), 1800);
    } else {
      autoRef.current = setTimeout(() => goto('exit'), 2000);
    }
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [scene, storyLine, goto]);

  // Exit — call onComplete
  useEffect(() => {
    if (scene !== 'exit') return;
    const t = setTimeout(onComplete, 800);
    return () => clearTimeout(t);
  }, [scene, onComplete]);

  const skip = () => {
    if (autoRef.current) clearTimeout(autoRef.current);
    setSkipped(true);
    setFading(true);
    setTimeout(onComplete, 400);
  };

  if (skipped) return null;

  // EXIT SCENE
  if (scene === 'exit') {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center"
        style={{ background: '#0E0B07', animation: 'is_fadeOut 1s ease forwards' }}>
        <div className="text-center">
          <div className="font-arabic text-[#D4AF37]/60 text-5xl mb-3">✦</div>
          <p className="font-arabic text-[#D4AF37] text-2xl" style={{ animation: 'is_fadeInUp 0.8s ease' }}>
            بسم الله الرحمن الرحيم
          </p>
        </div>
        <Styles />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9998] overflow-hidden select-none"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.65s ease' }}>

      {/* Skip */}
      <button onClick={skip}
        className="absolute top-4 right-4 z-50 px-4 py-1.5 rounded-full text-xs border border-[#D4AF37]/25 text-[#C19A6B]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
        style={{ background: 'rgba(14,11,7,0.75)', backdropFilter: 'blur(8px)' }}>
        {scene === 'city' ? 'تخطي المقدمة ←' : 'تخطي ←'}
      </button>

      {/* ═══════════════════ SCENE 1 — CITY ═══════════════════ */}
      {scene === 'city' && (
        <div className="absolute inset-0 overflow-hidden">

          {/* Sky */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg,#020115 0%,#07052a 28%,#0e0525 55%,#0E0B07 100%)' }} />

          {/* Neon aurora bands */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 140% 45% at 50% -5%, rgba(99,102,241,0.22) 0%, transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 35% at 15% 45%, rgba(236,72,153,0.13) 0%, transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 35% at 85% 35%, rgba(6,182,212,0.13) 0%, transparent 55%)' }} />
          {/* Moon */}
          <div className="absolute rounded-full"
            style={{ width: 56, height: 56, top: '7%', right: '12%', background: 'radial-gradient(circle at 40% 40%, #fffde7, #f5e090)', boxShadow: '0 0 40px 12px rgba(255,240,100,0.25)' }} />

          <Particles night />
          <CitySkyline />

          {/* Central text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-center max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.45em] uppercase mb-5"
                style={{ color: 'rgba(129,140,248,0.80)', animation: 'is_fadeInUp 0.9s ease' }}>
                الحضارة الرقمية · ٢٠٢٥
              </p>
              <h1 className="font-arabic text-5xl sm:text-7xl font-black mb-5 leading-tight"
                style={{
                  background: 'linear-gradient(135deg,#e879f9 0%,#818cf8 40%,#38bdf8 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(129,140,248,0.7))',
                  animation: 'is_fadeInUp 1.1s ease',
                }}>
                عالم يتغير
              </h1>
              <p className="font-arabic text-[#F5ECD7]/65 text-lg sm:text-xl leading-relaxed mb-8"
                style={{ animation: 'is_fadeInUp 1.4s ease' }}>
                بسرعة لم تدركها الحضارات، ولم تستطع الأسر مجاراتها
              </p>

              {/* Neon ticker */}
              <div className="overflow-hidden rounded-xl"
                style={{ background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.22)', animation: 'is_fadeInUp 1.7s ease' }}>
                <div className="py-2.5 px-0 flex">
                  {/* duplicate ticker content for seamless loop */}
                  <span className="font-mono text-[11px] whitespace-nowrap shrink-0 px-4"
                    style={{ color: 'rgba(129,140,248,0.70)', animation: 'is_ticker 18s linear infinite' }}>
                    {TICKER_TEXT}{TICKER_TEXT}
                  </span>
                </div>
              </div>

              <p className="font-arabic text-[#C19A6B]/50 text-xs mt-6"
                style={{ animation: 'is_fadeInUp 2s ease' }}>
                سيتحول المشهد تلقائياً ←
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ SCENE 2 — COLLAPSE ═══════════════════ */}
      {scene === 'collapse' && (
        <div className="absolute inset-0 overflow-y-auto">
          {/* BG */}
          <div className="fixed inset-0" style={{ background: 'linear-gradient(160deg,#0E0B07 0%,#1c0606 50%,#0E0B07 100%)' }} />
          <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse 110% 55% at 50% 0%, rgba(185,28,28,0.14) 0%, transparent 58%)' }} />
          <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse 80% 40% at 100% 100%, rgba(46,90,68,0.08) 0%, transparent 50%)' }} />
          <Particles />

          <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="text-center mb-8" style={{ opacity: statsVis ? 1 : 0, transform: statsVis ? 'none' : 'translateY(-18px)', transition: 'all 0.8s ease' }}>
              <span className="inline-block text-xs font-mono tracking-widest text-red-400/60 mb-3 uppercase">
                ⚠ أزمة الزواج العصري — الأرقام الحقيقية
              </span>
              <h2 className="font-arabic text-4xl sm:text-5xl font-black text-[#F5ECD7] mb-3">
                الأرقام لا تكذب
              </h2>
              <p className="font-arabic text-[#C19A6B] text-sm max-w-xl mx-auto leading-relaxed">
                ماذا يحدث حين تُطبَّق القوانين الوضعية على الزواج، وتُقلَب الأدوار الفطرية رأساً على عقب
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="ornament-line w-24" />
                <span className="w-2 h-2 rounded-full bg-red-500/50 block" />
                <div className="ornament-line w-24" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
              {CRISIS_STATS.map((s, i) => (
                <StatCard key={i} stat={s} delay={statsVis ? 100 + i * 130 : 999999} />
              ))}
            </div>

            {/* Causes */}
            <div className="mb-8" style={{ opacity: causesVis ? 1 : 0, transition: 'opacity 0.8s 0.3s ease' }}>
              <h3 className="font-arabic text-[#D4AF37] text-xl text-center mb-5">
                جذور الانهيار الأسري المعاصر
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLLAPSE_CAUSES.map((c, i) => (
                  <div key={i}
                    className="glass-panel-light p-4 rounded-xl flex items-start gap-3"
                    style={{
                      opacity: causesVis ? 1 : 0,
                      transform: causesVis ? 'translateY(0)' : 'translateY(16px)',
                      transition: `all 0.5s ease ${0.15 + i * 0.1}s`,
                      borderColor: 'rgba(185,28,28,0.18)',
                    }}>
                    <span className="text-xl shrink-0 mt-0.5">{c.icon}</span>
                    <p className="font-arabic text-[#F5ECD7]/80 text-xs leading-relaxed">{c.ar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pb-8" style={{ opacity: causesVis ? 1 : 0, transition: 'opacity 0.8s 1.6s ease' }}>
              <button
                onClick={() => goto('sheikh')}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-arabic text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.30)]"
                style={{
                  background: 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(46,90,68,0.22))',
                  border: '1px solid rgba(212,175,55,0.50)',
                  color: '#D4AF37',
                }}>
                <span>لكن الجواب موجود منذ ١٤٠٠ سنة</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ SCENE 3 — SHEIKH ═══════════════════ */}
      {scene === 'sheikh' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">

          {/* BG: cinematic image */}
          <div className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-cinematic.jpg')", backgroundPosition: 'center 30%', filter: 'brightness(0.32) saturate(0.75)' }}
            aria-hidden />
          {/* Warm vignette */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(10,7,3,0.94) 100%)' }}
            aria-hidden />
          {/* Gold ray from top */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 60%)' }}
            aria-hidden />

          <Particles />

          {/* Story */}
          <div className="relative z-10 text-center px-6 max-w-2xl w-full">

            {/* Progress bar */}
            <div className="flex justify-center gap-1.5 mb-10">
              {SHEIKH_STORY.map((_, i) => (
                <button key={i} onClick={() => setStoryLine(i)}
                  className="h-0.5 rounded-full transition-all duration-600"
                  style={{ width: i === storyLine ? 32 : 8, background: i <= storyLine ? '#D4AF37' : 'rgba(212,175,55,0.18)' }} />
              ))}
            </div>

            {/* Big quote mark */}
            <div className="font-arabic text-[#D4AF37]/15 leading-none mb-2 select-none pointer-events-none"
              style={{ fontSize: 120 }} aria-hidden>"</div>

            {/* Story line */}
            <p key={storyLine}
              className={`font-arabic leading-loose font-semibold ${storyLine === SHEIKH_STORY.length - 1 ? 'text-[#D4AF37] text-2xl sm:text-3xl' : 'text-[#F5ECD7] text-2xl sm:text-3xl'}`}
              style={{ animation: 'is_fadeInUp 0.75s ease' }}>
              {SHEIKH_STORY[storyLine]}
            </p>

            {/* Final verse source */}
            {storyLine === SHEIKH_STORY.length - 1 && (
              <div className="mt-6 flex items-center justify-center gap-3"
                style={{ animation: 'is_fadeInUp 1s ease 0.4s both' }}>
                <div className="ornament-line w-20" />
                <span className="font-arabic text-[#D4AF37]/60 text-xs tracking-wider">سورة الروم</span>
                <div className="ornament-line w-20" />
              </div>
            )}

            {/* Manual advance */}
            {storyLine < SHEIKH_STORY.length - 1 && (
              <button onClick={() => setStoryLine(l => l + 1)}
                className="mt-10 font-arabic text-sm text-[#D4AF37]/45 hover:text-[#D4AF37] transition-colors">
                التالي ←
              </button>
            )}
          </div>

          {/* Platform reveal — last 2 lines */}
          {storyLine >= SHEIKH_STORY.length - 2 && (
            <div className="absolute bottom-10 left-0 right-0 text-center"
              style={{ animation: 'is_fadeInUp 1s ease' }}>
              <p className="font-arabic text-[#C19A6B]/60 text-sm mb-2">وهذا ما بُنيت عليه —</p>
              <p className="font-arabic text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg,#D4AF37,#C19A6B)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.45))',
                }}>
                فطرة وسكينة
              </p>
            </div>
          )}
        </div>
      )}

      <Styles />
    </div>
  );
}

// ─── KEYFRAMES (injected once) ────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @keyframes is_fadeInUp  { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
      @keyframes is_fadeOut   { from { opacity:1 } to { opacity:0 } }
      @keyframes is_ticker    { 0% { transform:translateX(0) } 100% { transform:translateX(-50%) } }

      /* 8 unique float variants so particles don't all move identically */
      @keyframes fsp_0 { 0%{transform:translate(0,0)} 100%{transform:translate(8px,-12px)} }
      @keyframes fsp_1 { 0%{transform:translate(0,0)} 100%{transform:translate(-6px,-16px)} }
      @keyframes fsp_2 { 0%{transform:translate(0,0)} 100%{transform:translate(10px,-8px)} }
      @keyframes fsp_3 { 0%{transform:translate(0,0)} 100%{transform:translate(-10px,-14px)} }
      @keyframes fsp_4 { 0%{transform:translate(0,0)} 100%{transform:translate(5px,-18px)} }
      @keyframes fsp_5 { 0%{transform:translate(0,0)} 100%{transform:translate(-8px,-10px)} }
      @keyframes fsp_6 { 0%{transform:translate(0,0)} 100%{transform:translate(12px,-6px)} }
      @keyframes fsp_7 { 0%{transform:translate(0,0)} 100%{transform:translate(-4px,-20px)} }
    `}</style>
  );
}
