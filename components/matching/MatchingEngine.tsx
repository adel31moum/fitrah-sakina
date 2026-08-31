'use client';

import React, { useState, useEffect } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { toast } from 'sonner';

// ── Mock profiles ─────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: 'p1', gender: 'groom', name: 'أبو عمر', age: 29, country: 'DZ', countryLabel: '🇩🇿 الجزائر',
    manhaj: 'salafi', hijrahReady: true, hijrahTarget: 'السعودية',
    quran: 15, languages: ['ar','fr'], education: 'مهندس', mahr: 600,
    conditions: ['سكن مستقل','إذن عمل'], bio: 'طالب علم يحفظ ١٥ جزءاً، يعمل مهندساً، يبحث عن الزواج الشرعي الصحيح',
    verified: true, premium: true,
  },
  {
    id: 'p2', gender: 'bride', name: 'أم صالح', age: 25, country: 'FR', countryLabel: '🇫🇷 فرنسا',
    manhaj: 'salafi', hijrahReady: true, hijrahTarget: 'السعودية أو مصر',
    quran: 10, languages: ['ar','fr'], education: 'ممرضة', mahr: 500,
    conditions: ['سكن مستقل'], bio: 'متخصصة في الطب، تحفظ ١٠ أجزاء، مستعدة للهجرة',
    verified: true, premium: false,
  },
  {
    id: 'p3', gender: 'bride', name: 'فاطمة النور', age: 23, country: 'DE', countryLabel: '🇩🇪 ألمانيا',
    manhaj: 'salafi', hijrahReady: false, hijrahTarget: '',
    quran: 5, languages: ['ar','de'], education: 'طالبة', mahr: 400,
    conditions: ['استمرار التعليم'], bio: 'طالبة جامعية في برلين، ملتزمة بالمنهج',
    verified: false, premium: false,
  },
  {
    id: 'p4', gender: 'groom', name: 'عبدالله الأثري', age: 32, country: 'SA', countryLabel: '🇸🇦 السعودية',
    manhaj: 'salafi', hijrahReady: true, hijrahTarget: 'المدينة المنورة',
    quran: 30, languages: ['ar'], education: 'معلم شريعة', mahr: 1500,
    conditions: ['لا ثاني'], bio: 'حافظ للقرآن كاملاً، معلم في مدرسة شرعية، يبحث عن ربة بيت',
    verified: true, premium: true,
  },
  {
    id: 'p5', gender: 'bride', name: 'Aisha Yusuf', age: 27, country: 'GB', countryLabel: '🇬🇧 بريطانيا',
    manhaj: 'salafi', hijrahReady: true, hijrahTarget: 'السعودية',
    quran: 20, languages: ['ar','en'], education: 'طبيبة', mahr: 800,
    conditions: ['سكن مستقل','استمرار العمل'], bio: 'طبيبة ومعلمة قرآن، تحفظ ٢٠ جزءاً، مستعدة للهجرة',
    verified: true, premium: true,
  },
];

function calcScore(a: typeof PROFILES[0], b: typeof PROFILES[0]): number {
  let score = 0;
  if (a.manhaj === b.manhaj) score += 30;
  if (a.hijrahReady && b.hijrahReady) score += 20;
  if (Math.abs(a.age - b.age) <= 7) score += 15;
  const sharedLangs = a.languages.filter(l => b.languages.includes(l));
  score += Math.min(sharedLangs.length * 8, 15);
  if (b.mahr <= a.mahr) score += 10;
  if (a.quran >= 10 && b.quran >= 5) score += 10;
  return Math.min(score, 100);
}

type MatchStep = 'form' | 'results' | 'conditions' | 'wali_confirm' | 'vision' | 'appointment';

interface Profile { id:string; gender:string; name:string; age:number; country:string; countryLabel:string; manhaj:string; hijrahReady:boolean; hijrahTarget:string; quran:number; languages:string[]; education:string; mahr:number; conditions:string[]; bio:string; verified:boolean; premium:boolean; }

interface MatchResult { profile: Profile; score: number; }

export function MatchingEngine() {
  const { locale, role } = useFitrahStore();
  const isAr = locale === 'ar';

  const [step, setStep] = useState<MatchStep>('form');
  const [form, setForm] = useState({
    country: '', ageMin: 20, ageMax: 35,
    hijrahReady: false, manhaj: 'salafi', quranMin: 0,
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCond, setNewCond] = useState('');
  const [visionCountdown, setVisionCountdown] = useState(4);
  const [visionActive, setVisionActive] = useState(false);
  const [visionDone, setVisionDone] = useState(false);
  const [appointment, setAppointment] = useState({ date:'', time:'', medium:'video' });

  // Vision countdown — auto-closes at 0 and advances to appointment
  useEffect(() => {
    if (!visionActive) return;
    if (visionCountdown <= 0) {
      setVisionActive(false);
      setVisionDone(true);
      // auto-advance after 800ms
      const t = setTimeout(() => setStep('appointment'), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisionCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [visionActive, visionCountdown]);

  const myGender = role === 'groom' ? 'groom' : 'bride';
  const targetGender = myGender === 'groom' ? 'bride' : 'groom';

  function runMatching() {
    const me = PROFILES.find(p => p.gender === myGender) ?? PROFILES[0];
    const candidates = PROFILES
      .filter(p => p.gender === targetGender)
      .filter(p => {
        if (form.country && p.country !== form.country) return false;
        if (p.age < form.ageMin || p.age > form.ageMax) return false;
        if (form.hijrahReady && !p.hijrahReady) return false;
        if (p.quran < form.quranMin) return false;
        return true;
      })
      .map(p => ({ profile: p, score: calcScore(me, p) }))
      .sort((a, b) => b.score - a.score);
    setMatches(candidates);
    setCurrentIdx(0);
    setRejectedIds([]);
    setStep('results');
  }

  function selectCandidate(p: Profile) {
    setSelected(p);
    setConditions(p.conditions);
    setStep('conditions');
  }

  function rejectCandidate(id: string) {
    const newRejected = [...rejectedIds, id];
    setRejectedIds(newRejected);
    const remaining = matches.filter(m => !newRejected.includes(m.profile.id));
    if (remaining.length === 0) {
      toast(isAr ? 'لا مزيد من المرشحين — وسّع معايير البحث' : 'No more candidates — widen your criteria', { icon: '🔍' });
      setStep('form');
    } else {
      const nextIdx = Math.min(currentIdx, remaining.length - 1);
      setCurrentIdx(nextIdx);
      toast(isAr ? `تم تخطي المرشح — المقترح التالي ظاهر` : 'Candidate skipped — next candidate shown', { icon: '↩️' });
    }
  }

  function startVision() {
    setVisionCountdown(4);
    setVisionActive(true);
    setVisionDone(false);
    setStep('vision');
  }

  const stepLabels = {
    form: isAr ? '١ · معايير البحث' : '1 · Criteria',
    results: isAr ? '٢ · نتائج التوافق' : '2 · Results',
    conditions: isAr ? '٣ · الشروط الشرعية' : '3 · Conditions',
    wali_confirm: isAr ? '٤ · موافقة الولي' : '4 · Wali',
    vision: isAr ? '٥ · الرؤية الشرعية' : '5 · Vision',
    appointment: isAr ? '٦ · موعد الخطبة' : '6 · Appointment',
  };

  const stepOrder: MatchStep[] = ['form','results','conditions','wali_confirm','vision','appointment'];
  const stepIdx = stepOrder.indexOf(step);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="ornament-line w-16" />
          <span className="text-[#D4AF37]/50">✦</span>
          <div className="ornament-line w-16" />
        </div>
        <h2 className="font-arabic text-[#D4AF37] text-2xl font-bold mb-2 animate-shimmer">
          {isAr ? 'التوافق الآلي الفوري' : 'Instant Smart Matching'}
        </h2>
        <p className="font-arabic text-[#C19A6B]/70 text-sm">
          {isAr ? 'خوارزمية تطابق منهج السلف — الكفاءة + المنهج + الهجرة' : 'Salafi methodology algorithm — Kafaah, Manhaj, Hijrah'}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-8 flex-wrap">
        {stepOrder.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold transition-all ${
              i < stepIdx ? 'bg-[#D4AF37] text-[#0E0B07]' :
              i === stepIdx ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]' :
              'bg-[#D4AF37]/08 text-[#C19A6B]/40 border border-[#D4AF37]/12'
            }`}>{i+1}</div>
            {i < stepOrder.length - 1 && <div className={`w-4 sm:w-6 h-px ${i < stepIdx ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/15'}`} />}
          </div>
        ))}
      </div>

      {/* ═══ STEP 1: FORM ═══ */}
      {step === 'form' && (
        <div className="glass-panel p-6 sm:p-8">
          <h3 className="font-arabic text-[#D4AF37] font-bold mb-6 text-lg">
            {isAr ? 'معايير البحث عن المناسب' : 'Search Criteria'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'الدولة (اختياري)' : 'Country (optional)'}
              </label>
              <select value={form.country} onChange={e => setForm(f=>({...f,country:e.target.value}))}
                className="w-full bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 font-arabic outline-none focus:border-[#D4AF37]">
                <option value="">الكل</option>
                <option value="DZ">🇩🇿 الجزائر</option>
                <option value="FR">🇫🇷 فرنسا</option>
                <option value="DE">🇩🇪 ألمانيا</option>
                <option value="GB">🇬🇧 بريطانيا</option>
                <option value="SA">🇸🇦 السعودية</option>
              </select>
            </div>
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? `نطاق العمر (${form.ageMin}–${form.ageMax})` : `Age range (${form.ageMin}–${form.ageMax})`}
              </label>
              <div className="flex gap-3">
                <input type="number" min={18} max={60} value={form.ageMin}
                  onChange={e => setForm(f=>({...f,ageMin:+e.target.value}))}
                  className="w-1/2 bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#D4AF37]" />
                <input type="number" min={18} max={60} value={form.ageMax}
                  onChange={e => setForm(f=>({...f,ageMax:+e.target.value}))}
                  className="w-1/2 bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'الحد الأدنى لحفظ القرآن (جزء)' : 'Min Quran memorization (Juz)'}
              </label>
              <input type="range" min={0} max={30} value={form.quranMin}
                onChange={e => setForm(f=>({...f,quranMin:+e.target.value}))}
                className="w-full accent-[#D4AF37]" />
              <div className="font-arabic text-[#D4AF37] text-sm text-center">{form.quranMin} جزء</div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.hijrahReady}
                  onChange={e => setForm(f=>({...f,hijrahReady:e.target.checked}))}
                  className="accent-[#D4AF37] w-4 h-4" />
                <span className="font-arabic text-[#F5ECD7]/80 text-sm">{isAr ? 'مستعد للهجرة فقط' : 'Hijrah-ready only'}</span>
              </label>
            </div>
          </div>
          <button onClick={runMatching} className="w-full btn-gold py-3 rounded-xl font-arabic font-bold mt-8 text-base">
            {isAr ? '⚡ بدء التوافق الفوري' : '⚡ Start Instant Matching'}
          </button>
        </div>
      )}

      {/* ═══ STEP 2: RESULTS ═══ */}
      {step === 'results' && (() => {
        const visible = matches.filter(m => !rejectedIds.includes(m.profile.id));
        const featured = visible[currentIdx] ?? visible[0];
        const queueCount = visible.length;
        return (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h3 className="font-arabic text-[#D4AF37] font-bold text-lg">
                {isAr ? `${queueCount} مرشح متاح` : `${queueCount} candidates available`}
              </h3>
              <button onClick={() => setStep('form')} className="btn-ghost px-3 py-1.5 text-xs rounded-lg font-arabic">
                {isAr ? '← تعديل المعايير' : '← Edit criteria'}
              </button>
            </div>

            {queueCount === 0 && (
              <div className="glass-panel p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-arabic text-[#C19A6B] text-sm">
                  {isAr ? 'لم نجد مرشحين بهذه المعايير — وسّع نطاق البحث' : 'No matches found — try wider criteria'}
                </p>
              </div>
            )}

            {/* Featured card — single active candidate */}
            {featured && (
              <div className="glass-panel p-6 border-[#D4AF37]/30 mb-4">
                {/* Position indicator */}
                <div className="flex items-center gap-2 mb-4">
                  {visible.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      i === (visible.indexOf(featured)) ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/15'
                    }`} />
                  ))}
                </div>

                <div className="flex items-start gap-4 flex-wrap">
                  {/* Score ring */}
                  <div className="flex-shrink-0 text-center">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 64 64" className="w-20 h-20 -rotate-90">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="4" />
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#D4AF37" strokeWidth="4"
                          strokeDasharray={`${(featured.score/100)*163.4} 163.4`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-arabic font-black text-[#D4AF37] text-base">{featured.score}%</span>
                      </div>
                    </div>
                    <div className="font-arabic text-[#C19A6B]/60 text-[9px] mt-1">{isAr?'تطابق':'match'}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-arabic text-[#F5ECD7] font-bold text-base">{featured.profile.name}</span>
                      <span className="font-arabic text-[#C19A6B]/70 text-xs">{featured.profile.age} {isAr?'سنة':'y.o.'}</span>
                      <span className="text-sm">{featured.profile.countryLabel}</span>
                      {featured.profile.verified && <span className="badge-sharia text-[9px]">✓ موثق</span>}
                      {featured.profile.premium && <span className="font-arabic text-[9px] text-[#D4AF37] bg-[#D4AF37]/12 px-1.5 py-0.5 rounded-full">⭐</span>}
                    </div>
                    <p className="font-arabic text-[#C19A6B]/80 text-xs mb-3 leading-relaxed">{featured.profile.bio}</p>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="bg-[#2E5A44]/25 text-[#7EC8A4] px-2 py-0.5 rounded-full font-arabic">
                        📖 {featured.profile.quran} {isAr?'جزء':'Juz'}
                      </span>
                      {featured.profile.hijrahReady && (
                        <span className="bg-[#D4AF37]/12 text-[#D4AF37] px-2 py-0.5 rounded-full font-arabic">
                          ✈️ {isAr?'هجرة':'Hijrah'}
                        </span>
                      )}
                      <span className="bg-[#C19A6B]/12 text-[#C19A6B] px-2 py-0.5 rounded-full font-arabic">
                        {featured.profile.education}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => rejectCandidate(featured.profile.id)}
                    className="flex-1 py-3 rounded-xl font-arabic text-sm font-medium border border-red-500/25 text-red-400/70 hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    {isAr ? '✕ تخطي — التالي تلقائياً' : '✕ Skip — auto next'}
                  </button>
                  <button
                    onClick={() => selectCandidate(featured.profile)}
                    className="flex-1 btn-gold py-3 rounded-xl font-arabic font-bold text-sm"
                  >
                    {isAr ? '✔ اختيار — التفاصيل ←' : '✔ Select — Details →'}
                  </button>
                </div>

                {/* Queue hint */}
                {queueCount > 1 && (
                  <p className="font-arabic text-[#C19A6B]/40 text-[10px] text-center mt-3">
                    {isAr ? `${queueCount - 1} مرشح آخر في الطابور` : `${queueCount - 1} more candidate(s) in queue`}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══ STEP 3: CONDITIONS ═══ */}
      {step === 'conditions' && selected && (
        <div className="glass-panel p-6 sm:p-8">
          <h3 className="font-arabic text-[#D4AF37] font-bold text-lg mb-2">
            {isAr ? 'الشروط الشرعية' : 'Sharia Conditions'}
          </h3>
          <p className="font-arabic text-[#C19A6B]/70 text-sm mb-6">
            {isAr ? `سجّل شروطك مع ${selected.name} كتابياً قبل الانتقال` : `Document your conditions with ${selected.name} before proceeding`}
          </p>
          <div className="space-y-2 mb-5">
            {conditions.map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#D4AF37]/06 rounded-lg px-4 py-2.5">
                <span className="text-[#D4AF37] text-sm">📌</span>
                <span className="font-arabic text-[#F5ECD7]/90 text-sm flex-1">{c}</span>
                <button onClick={() => setConditions(cs => cs.filter((_,j)=>j!==i))}
                  className="text-red-400/50 hover:text-red-400 text-xs transition-colors">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-6">
            <input
              value={newCond}
              onChange={e => setNewCond(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter' && newCond.trim()) { setConditions(cs=>[...cs,newCond.trim()]); setNewCond(''); }}}
              placeholder={isAr ? 'أضف شرطاً…' : 'Add condition…'}
              className="flex-1 bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 font-arabic outline-none focus:border-[#D4AF37]"
            />
            <button onClick={() => { if(newCond.trim()) { setConditions(cs=>[...cs,newCond.trim()]); setNewCond(''); }}}
              className="btn-gold px-4 py-2 rounded-lg text-xs font-arabic">
              {isAr ? 'إضافة' : 'Add'}
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setStep('wali_confirm')} disabled={conditions.length === 0}
              className="flex-1 btn-gold py-3 rounded-xl font-arabic font-bold disabled:opacity-40">
              {isAr ? 'التالي: موافقة الولي →' : 'Next: Wali approval →'}
            </button>
            <button onClick={() => setStep('results')} className="btn-ghost px-4 py-3 rounded-xl font-arabic text-sm">
              {isAr ? '← رجوع' : '← Back'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 4: WALI ═══ */}
      {step === 'wali_confirm' && selected && (
        <div className="glass-panel p-6 sm:p-8 text-center">
          <div className="text-5xl mb-4">🛡</div>
          <h3 className="font-arabic text-[#D4AF37] font-bold text-xl mb-3">
            {isAr ? 'موافقة الولي المبدئية' : 'Wali Initial Approval'}
          </h3>
          <p className="font-arabic text-[#C19A6B]/80 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            {isAr
              ? `تم إرسال طلب الموافقة المبدئية على التوافق مع ${selected.name} إلى وليّك. عند الموافقة ستتمكن من الانتقال للرؤية الشرعية.`
              : `A preliminary approval request for the match with ${selected.name} has been sent to your Wali. Upon approval you may proceed to the Sharia vision.`}
          </p>
          <div className="bg-[#2E5A44]/20 border border-[#2E5A44]/40 rounded-xl p-4 mb-8 text-right">
            <p className="font-arabic text-[#7EC8A4] text-sm font-bold mb-1">✅ محاكاة: الولي وافق</p>
            <p className="font-arabic text-[#C19A6B]/70 text-xs">في التطبيق الحقيقي: إشعار فوري للولي + رمز التحقق</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={startVision} className="btn-gold py-3 px-8 rounded-xl font-arabic font-bold text-base">
              {isAr ? 'انتقال للرؤية الشرعية →' : 'Proceed to Sharia Vision →'}
            </button>
            <button onClick={() => setStep('conditions')} className="btn-ghost py-3 px-6 rounded-xl font-arabic text-sm">
              {isAr ? '← رجوع' : '← Back'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 5: VISION ═══ */}
      {step === 'vision' && selected && (
        <div className="glass-panel p-6 sm:p-8 text-center">
          <h3 className="font-arabic text-[#D4AF37] font-bold text-xl mb-2">
            {isAr ? 'الرؤية الشرعية' : 'Sharia Vision'}
          </h3>
          <p className="font-arabic text-[#C19A6B]/70 text-sm mb-5">
            {isAr
              ? 'ظهور الظل فقط — الكاميرا تعمل ٤ ثوانٍ ثم تُغلق وتُمحى تلقائياً'
              : 'Silhouette only — camera runs 4 sec then auto-closes & clears'}
          </p>

          {/* Privacy shield bar */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="text-[#2E5A44] text-xs">🔐</span>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#2E5A44]/40 to-transparent" />
            <span className="font-arabic text-[#7EC8A4] text-[10px]">
              {isAr ? 'مشفّر · غير مُخزَّن · للطرفين فقط' : 'Encrypted · Not stored · Parties only'}
            </span>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#2E5A44]/40 to-transparent" />
            <span className="text-[#2E5A44] text-xs">🔐</span>
          </div>

          {/* Camera viewport */}
          <div className="relative mx-auto w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden mb-6"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04), rgba(14,11,7,0.98))',
              boxShadow: visionActive
                ? '0 0 40px rgba(212,175,55,0.25), inset 0 0 30px rgba(212,175,55,0.08)'
                : visionDone
                  ? '0 0 20px rgba(46,90,68,0.4)'
                  : '0 0 0px rgba(0,0,0,0)',
              border: visionActive ? '3px solid rgba(212,175,55,0.6)' : '3px solid rgba(212,175,55,0.2)',
              transition: 'all 0.5s ease',
            }}>
            {/* Silhouette — no face rendered */}
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              <circle cx="100" cy="200" r="90" fill="rgba(212,175,55,0.04)" />
              <ellipse cx="100" cy="82" rx="28" ry="30" fill="rgba(30,22,10,0.92)" />
              <path d="M55 185 Q55 128 100 128 Q145 128 145 185" fill="rgba(30,22,10,0.88)" />
              <ellipse cx="100" cy="72" rx="36" ry="42" fill="rgba(20,14,6,0.94)" />
              <ellipse cx="100" cy="90" rx="20" ry="16" fill="rgba(212,175,55,0.03)" />
            </svg>

            {/* Live countdown overlay */}
            {visionActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[1px]">
                <div className="relative w-16 h-16 mb-2">
                  <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="3" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#D4AF37" strokeWidth="3"
                      strokeDasharray={`${(visionCountdown/4)*163.4} 163.4`} strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s linear' }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-arabic text-[#D4AF37] font-black text-2xl">{visionCountdown}</span>
                  </div>
                </div>
                <div className="font-arabic text-[#C19A6B]/80 text-[10px]">{isAr ? 'ثانية' : 'sec'}</div>
              </div>
            )}
            {/* Done state */}
            {visionDone && !visionActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <div className="text-3xl mb-1">✅</div>
                <div className="font-arabic text-[#7EC8A4] text-xs">{isAr ? 'تمّت' : 'Done'}</div>
              </div>
            )}
            {/* Idle lock */}
            {!visionActive && !visionDone && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                <div className="text-4xl">🔒</div>
              </div>
            )}
          </div>

          {/* Status text */}
          {visionActive && (
            <p className="font-arabic text-[#7EC8A4] text-sm animate-pulse mb-4">
              {isAr ? '🔴 الكاميرا تعمل… ستُغلق وتُمسح تلقائياً' : '🔴 Camera running… auto-closes & clears'}
            </p>
          )}
          {visionDone && !visionActive && (
            <div className="mb-4">
              <p className="font-arabic text-[#7EC8A4] text-sm font-semibold mb-1">
                {isAr ? '✅ انتهت الرؤية — الكاميرا مغلقة ومُشفَّرة' : '✅ Vision done — camera closed & encrypted'}
              </p>
              <p className="font-arabic text-[#C19A6B]/50 text-[10px]">
                {isAr ? 'جارٍ الانتقال لجدولة الموعد…' : 'Proceeding to appointment scheduling…'}
              </p>
            </div>
          )}
          {!visionActive && !visionDone && (
            <div className="mb-4">
              <p className="font-arabic text-[#C19A6B]/60 text-xs mb-4">
                {isAr
                  ? 'اضغط لتفعيل الرؤية — ٤ ثوانٍ ثم تُغلق تلقائياً'
                  : 'Press to activate vision — 4 sec then auto-closes'}
              </p>
              <button onClick={startVision} className="btn-gold py-3 px-8 rounded-xl font-arabic font-bold">
                {isAr ? '▶ بدء الرؤية الشرعية' : '▶ Start Sharia Vision'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ STEP 6: APPOINTMENT ═══ */}
      {step === 'appointment' && selected && (
        <div className="glass-panel p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-arabic text-[#D4AF37] font-bold text-xl mb-2">
              {isAr ? 'موعد الزيارة الميدانية' : 'Field Visit Appointment'}
            </h3>
            <p className="font-arabic text-[#C19A6B]/70 text-sm">
              {isAr ? `تحديد موعد لزيارة أهل ${selected.name} — بحضور الولي` : `Schedule a visit to ${selected.name}'s family — with Wali present`}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'التاريخ' : 'Date'}
              </label>
              <input type="date" value={appointment.date}
                onChange={e => setAppointment(a=>({...a,date:e.target.value}))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'الوقت' : 'Time'}
              </label>
              <input type="time" value={appointment.time}
                onChange={e => setAppointment(a=>({...a,time:e.target.value}))}
                className="w-full bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#D4AF37]" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-arabic text-[#C19A6B] text-xs block mb-2">
                {isAr ? 'وسيلة التواصل' : 'Medium'}
              </label>
              <div className="flex gap-3">
                {[{v:'video',l:isAr?'مكالمة مرئية':'Video call'},{v:'inperson',l:isAr?'زيارة ميدانية':'In person'},{v:'phone',l:isAr?'هاتف':'Phone'}].map(m => (
                  <button key={m.v} onClick={() => setAppointment(a=>({...a,medium:m.v}))}
                    className={`flex-1 py-2 rounded-lg text-xs font-arabic border transition-all ${
                      appointment.medium===m.v
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/50'
                        : 'border-[#D4AF37]/20 text-[#C19A6B] hover:border-[#D4AF37]/40'
                    }`}>{m.l}</button>
                ))}
              </div>
            </div>
          </div>
          <button
            disabled={!appointment.date || !appointment.time}
            onClick={() => {
              toast.success(isAr ? '🎉 تم تأكيد الموعد — بارك الله لكم' : '🎉 Appointment confirmed — BaarakAllahu Lakum');
              setTimeout(() => { setStep('form'); setSelected(null); setMatches([]); }, 2000);
            }}
            className="w-full btn-gold py-3 rounded-xl font-arabic font-bold text-base disabled:opacity-40">
            {isAr ? '✅ تأكيد الموعد وإرسال الإشعارات' : '✅ Confirm Appointment & Notify'}
          </button>
        </div>
      )}
    </div>
  );
}
