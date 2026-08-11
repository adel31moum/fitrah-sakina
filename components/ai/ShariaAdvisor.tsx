'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Category = 'nikah' | 'mahr' | 'wali' | 'talaq' | 'nafaqa' | 'khitba' | 'general';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  category: Category;
  sources: string[];
  time: string;
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────
const KB: Array<{ keywords: string[]; category: Category; sources: string[]; answer: string }> = [
  {
    keywords: ['نكاح','زواج','شروط','أركان','صح','عقد','ارتباط'],
    category: 'nikah',
    sources: ['صحيح أبي داود ٢٠٨٥','الترمذي ١١٠١','النساء: ٤','مجموع الفتاوى لابن تيمية'],
    answer:
`**أركان النكاح وشروطه الصحيحة:**

**١. الولي:** لا نكاح إلا بولي.
قال ﷺ: «لا نكاح إلا بولي» — رواه أبو داود وصحّحه الألباني.

**٢. الشاهدان:** شاهدان مسلمان عدلان.
«لا نكاح إلا بولي وشاهدَي عدل» — صحيح الجامع.

**٣. الإيجاب والقبول:** لفظ صريح من الولي وقبول الزوج في المجلس.

**٤. المهر:** واجب لا يسقط — ﴿وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً﴾ النساء: ٤.

**٥. خلوّ الزوجة من الموانع:** كالعدة والمحرمية.

⚠️ هذه معلومات توجيهية — للفتوى الرسمية تواصل مع عالم معتمد.`,
  },
  {
    keywords: ['مهر','صداق','حق','مقدار','كم المهر','صدقة'],
    category: 'mahr',
    sources: ['النساء: ٤','صحيح البخاري ٥١٤٩','المغني لابن قدامة ٧/١٧٧','الشرح الممتع لابن عثيمين'],
    answer:
`**المهر في الفقه الإسلامي:**

**حكمه:** واجب بالكتاب والسنة والإجماع.
﴿وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً﴾ — النساء: ٤.

**أنواعه:**
• **المهر المسمى** — المتفق عليه في العقد.
• **مهر المثل** — يُقدَّر عند عدم التسمية.

**أفضله:** قال ﷺ: «التمس ولو خاتماً من حديد» — وأفضل النساء أيسرهن مهراً.

**تأجيله:** يجوز تأجيل بعضه بتراضي الطرفين.

⚠️ للتطبيق في بلدك استشر عالماً معتمداً.`,
  },
  {
    keywords: ['ولي','ولاية','محرم','ترتيب','عضل','أولياء'],
    category: 'wali',
    sources: ['صحيح أبي داود ٢٠٨٣','الترمذي ١١٠٢','فقه السنة للسيد سابق','فتاوى ابن باز ج١٨'],
    answer:
`**الولاية في النكاح:**

**حكمها:** شرط صحة عند جمهور أهل العلم.
قال ﷺ: «أيّما امرأة نكحت بغير إذن وليّها فنكاحها باطل» — صحيح رواه أبو داود.

**ترتيب الأولياء:**
١. الأب
٢. الجد (أب الأب)
٣. الإخوة الأشقاء ثم لأب
٤. الأعمام وأبناؤهم

**العضل:** إن منع الولي بغير حق شرعي — انتقلت الولاية للأبعد أو للقاضي الشرعي.

⚠️ حالات النزاع تستلزم رفع الأمر للقضاء الشرعي.`,
  },
  {
    keywords: ['طلاق','فراق','رجعة','رجعي','بائن','خلع','عدد الطلقات','طلاق ثلاث'],
    category: 'talaq',
    sources: ['البقرة: ٢٢٨','صحيح أبي داود ٢١٧٦','زاد المعاد لابن القيم ٥/٢١٢','فتاوى اللجنة الدائمة'],
    answer:
`**الطلاق في الشريعة الإسلامية:**

**حكمه:** «أبغض الحلال إلى الله الطلاق» — مباح لضرورة، مكروه بلا حاجة.

**أنواعه:**
• **الطلاق السني:** على طهر لم يُجامَع فيها — وهو المشروع.
• **الطلاق البدعي:** في الحيض — محرم وإن وقع.
• **الثلاث دفعة:** الراجح أنه يقع واحدة.

**الرجعة:** في الطلقة الأولى والثانية — يملكها الزوج في العدة بلا عقد.

**الثلاث المتفرقة:** لا تحل إلا بنكاح صحيح من غيره.

⚠️ **تحذير:** الطلاق من أدق المسائل — لا تُقدم قبل استفتاء عالم ثقة شخصياً.`,
  },
  {
    keywords: ['نفقة','رزق','مسكن','كسوة','واجبات الزوج','حق الزوجة','يعول'],
    category: 'nafaqa',
    sources: ['البقرة: ٢٣٦','الطلاق: ٧','صحيح مسلم ١٢١٨','المغني لابن قدامة ٨/١٧٢'],
    answer:
`**النفقة الزوجية:**

**حكمها:** واجبة بالكتاب والسنة والإجماع.
﴿لِيُنفِق ذُو سَعَةٍ مِّن سَعَتِهِ﴾ — الطلاق: ٧.

**ما تشمله:** الغذاء والكسوة والمسكن اللائق والرعاية الصحية.

**مقدارها:** ﴿عَلَى الْمُوسِعِ قَدَرُهُ وَعَلَى الْمُقْتِرِ قَدَرُهُ﴾ — يتبع حال الزوج.

**سقوطها:** تسقط بالنشوز عند الجمهور.

**نفقة الأبناء:** واجبة على الأب حتى البلوغ للذكر، واليُسر للأنثى.`,
  },
  {
    keywords: ['خطبة','خطب','خطوبة','تقدم','رؤية','النظر للمخطوبة','خاطب'],
    category: 'khitba',
    sources: ['الترمذي ١٠٨٧','ابن ماجه ١٨٦٥','فقه السنة للسيد سابق','شرح بلوغ المرام'],
    answer:
`**أحكام الخطبة:**

**تعريفها:** مجرد وعد بالزواج — ليست عقداً ملزماً.

**الاستئذان:** يجب إعلام الولي واستئذانه.

**رؤية المخطوبة:** مشروعة.
قال ﷺ: «انظر إليها فإنه أحرى أن يؤدم بينكما» — صحيح.
• نظرة واحدة مقصودة.
• بحضور المحارم لا خلوة.

**الخلوة:** محرمة قطعاً قبل العقد.

**التواصل:** الأحوط حصره في مسائل الزواج بإذن الولي وبحضوره.

⚠️ المنصة لا تتيح تواصلاً مباشراً — كل التفاعل عبر استمارات موثقة.`,
  },
  {
    keywords: ['عدة','عدة الطلاق','عدة الوفاة','انتهاء العدة','عدة المطلقة'],
    category: 'talaq',
    sources: ['البقرة: ٢٢٨','الطلاق: ١-٤','المغني لابن قدامة'],
    answer:
`**العدة في الشريعة الإسلامية:**

**عدة المطلقة التي تحيض:** ثلاثة قروء (حيضات).

**عدة الحامل:** حتى الوضع.

**عدة الآيسة:** ثلاثة أشهر.

**عدة الوفاة:** أربعة أشهر وعشرة أيام — وإن كانت حاملاً فحتى الوضع.

**أحكام العدة:**
• تبقى في بيت الزوجية.
• لا يحل لها الزواج أثناءها.
• النفقة واجبة في الرجعية، لا في البائن.

⚠️ تفاصيل العدة تختلف بحسب الحالة — استشر عالماً.`,
  },
  {
    keywords: ['كفاءة','كفء','تكافؤ','نسب','الكفاءة في الزواج'],
    category: 'nikah',
    sources: ['فتاوى ابن باز','المغني لابن قدامة','فقه السنة'],
    answer:
`**الكفاءة في الزواج:**

**معيارها الأصل:** التقوى والدين.
﴿إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ﴾ — الحجرات: ١٣.

**موقف الفقهاء:** اختلفوا في اعتبار النسب والحرفة — والراجح أن الكفاءة في الدين هي الأساس.

**حكم النكاح دونها:** صحيح إذا رضي الأولياء.

**الدليل:** زوّج النبي ﷺ زينب بنت عمته من زيد مولاه — دلالة واضحة أن الدين هو المعيار.`,
  },
];

// ─── FATWA GUARD ──────────────────────────────────────────────────────────────
const FATWA_WORDS = ['أفتِني','أفتني','أعطني فتوى','فتوى في','فتوى بخصوص','أريد فتوى','افتني'];

// ─── PLATFORM USAGE TRIGGERS ──────────────────────────────────────────────────
const PLATFORM_WORDS = [
  'كيف','استعمل','استخدم','تشغيل','شرح','وضح','اشرح','ابدأ','بداية',
  'هاته المنصة','هذه المنصة','الموقع','المنصة','ما هي','ما هو','ماذا','ماذا تفعل',
  'مساعدة','دليل','تعليمات','help','how','guide','طريقة','ارشد','أرشدني',
];

// ─── RESPONSE ENGINE ──────────────────────────────────────────────────────────
function getResponse(text: string): { answer: string; category: Category; sources: string[] } {
  const t = text.trim();

  // fatwa guard
  if (FATWA_WORDS.some(w => t.includes(w))) {
    return {
      answer: `⚠️ **لا يمكنني إصدار فتاوى شرعية رسمية.**\n\nالفتوى تستلزم عالماً ذا أهلية شرعية وإحاطة كاملة بالواقعة.\n\n**للفتوى الرسمية:**\n• islamweb.net — إسلام ويب\n• binbaz.org.sa — ابن باز\n• alifta.gov.sa — هيئة كبار العلماء\n\nيمكنني الإجابة عن المعلومات الفقهية العامة — ما الذي تريد معرفته؟`,
      category: 'general',
      sources: [],
    };
  }

  // greeting
  if (/السلام|مرحب|أهلا|هلا|مساء|صباح/.test(t)) {
    return {
      answer: `وعليكم السلام ورحمة الله وبركاته 🌙\n\nأنا **المساعد الشرعي** لمنصة فطرة وسكينة — متخصص في مسائل الزواج والأسرة وفق منهج أهل السنة والجماعة.\n\n**اضغط أحد الأزرار** للإجابة الفورية، أو اكتب سؤالك مباشرة.`,
      category: 'general',
      sources: [],
    };
  }

  // platform usage guide
  if (PLATFORM_WORDS.some(w => t.includes(w))) {
    return {
      answer: `**دليل استخدام منصة فطرة وسكينة:**\n\n**الخطوات الأساسية:**\n١. **حدد دورك** — عريس أو عروس أو ولي — من أزرار الاختيار في المجلس.\n٢. **استشر المساعد الشرعي** — اضغط أحد الأزرار أدناه أو اكتب سؤالك مباشرة.\n٣. **عقد الزواج** — استعمل قسم "عقد الزواج" لتوثيق شروطك.\n٤. **نافذة الحوار** — أسئلة منضبطة بدون تواصل مباشر.\n\n**الأقسام الرئيسية:**\n🤖 المجلس — المساعد الذكي وأدوات الزواج.\n🛡 الولي — بوابة الولي الشرعي.\n📜 الميثاق — المبادئ والالتزامات.\n📖 الدعوة — نشر القيم الإسلامية.\n\n**قواعد المنصة:**\n• لا تواصل مباشر بين الطرفين أبداً.\n• كل التفاعل موثق ومراقَب شرعياً.\n• لا صور، لا أسماء — الخصوصية مطلقة.\n\n**ابدأ الآن** باضغط أحد الأزرار أدناه ⬇️`,
      category: 'general',
      sources: [],
    };
  }

  // score match against knowledge base
  let best: typeof KB[0] | null = null;
  let topScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (t.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > topScore) {
      topScore = score;
      best = entry;
    }
  }

  if (best && topScore > 0) {
    return { answer: best.answer, category: best.category, sources: best.sources };
  }

  // soft match — partial word overlap (3+ chars)
  const words = t.split(/[\s،,؟?!]+/).filter(w => w.length >= 3);
  let softBest: typeof KB[0] | null = null;
  let softScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      for (const w of words) {
        if (kw.includes(w) || w.includes(kw)) score += 2;
        else if (kw.startsWith(w.slice(0, 3))) score += 1;
      }
    }
    if (score > softScore) { softScore = score; softBest = entry; }
  }
  if (softBest && softScore >= 2) {
    return { answer: softBest.answer, category: softBest.category, sources: softBest.sources };
  }

  return {
    answer: `جزاك الله خيراً.\n\nلم أتمكن من فهم سؤالك — جرّب إعادة الصياغة مثل:\n• «ما شروط النكاح؟»\n• «ما حكم المهر؟»\n• «كيف أستخدم المنصة؟»\n\nأو **اضغط أحد الأزرار** أدناه للإجابة الفورية ⬇️`,
    category: 'general',
    sources: [],
  };
}

// ─── CHIP QUESTIONS ───────────────────────────────────────────────────────────
const CHIPS = [
  { label: '📋 شروط النكاح', q: 'ما شروط النكاح الصحيح وأركانه' },
  { label: '💍 المهر',        q: 'ما حكم المهر ومقداره' },
  { label: '🛡 الولاية',      q: 'ما الولاية في النكاح وترتيب الأولياء' },
  { label: '💰 النفقة',       q: 'ما النفقة الواجبة على الزوج' },
  { label: '👀 الخطبة',       q: 'ما أحكام الخطبة قبل الزواج' },
  { label: '📑 الطلاق',       q: 'ما أحكام الطلاق الشرعي وأنواعه' },
  { label: '⏳ العدة',        q: 'ما أحكام عدة الطلاق والوفاة' },
  { label: '⚖️ الكفاءة',     q: 'ما الكفاءة في الزواج وحكمها' },
];

const CAT_BG: Record<Category, string> = {
  nikah:   'rgba(212,175,55,0.12)',
  mahr:    'rgba(193,154,107,0.12)',
  wali:    'rgba(46,90,68,0.14)',
  talaq:   'rgba(180,28,28,0.10)',
  nafaqa:  'rgba(99,102,241,0.10)',
  khitba:  'rgba(46,160,100,0.10)',
  general: 'rgba(212,175,55,0.06)',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function ShariaAdvisor() {
  const { locale } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isRtl = dir === 'rtl';

  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [draft, setDraft]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [openSrc, setOpenSrc]   = useState<string | null>(null);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const didGreet                = useRef(false);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  // greeting on mount
  useEffect(() => {
    if (didGreet.current) return;
    didGreet.current = true;
    const r = getResponse('السلام');
    const now = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setMsgs([{ id: 'g0', role: 'assistant', text: r.answer, category: r.category, sources: r.sources, time: now }]);
  }, []);

  function dispatch(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setDraft('');
    const now = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    const uid = 'u' + Date.now();
    setMsgs(prev => [...prev, { id: uid, role: 'user', text: q, category: 'general', sources: [], time: now }]);
    setBusy(true);
    window.setTimeout(() => {
      const r = getResponse(q);
      const aid = 'a' + Date.now();
      const t2 = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      setMsgs(prev => [...prev, { id: aid, role: 'assistant', text: r.answer, category: r.category, sources: r.sources, time: t2 }]);
      setBusy(false);
    }, 700 + Math.min(q.length * 12, 1200));
  }

  function renderMD(text: string) {
    return text.split('\n').map((line, i, a) => {
      const html = line
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#D4AF37">$1</strong>');
      return (
        <React.Fragment key={i}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          {i < a.length - 1 && <br />}
        </React.Fragment>
      );
    });
  }

  return (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 540 }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:12, borderBottom:'1px solid rgba(212,175,55,0.14)', marginBottom:16, flexShrink:0 }}>
        <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(212,175,55,0.22),rgba(46,90,68,0.28))', border:'1px solid rgba(212,175,55,0.32)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, boxShadow:'0 0 20px rgba(212,175,55,0.16)' }}>
          🤖
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="font-arabic" style={{ color:'#D4AF37', fontWeight:700, fontSize:14 }}>
            {isRtl ? 'المساعد الشرعي الذكي' : 'AI Sharia Advisor'}
          </div>
          <div className="font-arabic" style={{ color:'#7EC8A4', fontSize:10, marginTop:2 }}>
            {isRtl ? 'منهج السلف الصالح · أهل السنة والجماعة' : 'Salafi Methodology · Ahl Al-Sunnah'}
          </div>
        </div>
        <div className="font-arabic" style={{ fontSize:9, padding:'3px 8px', borderRadius:999, background:'rgba(180,28,28,0.14)', border:'1px solid rgba(180,28,28,0.28)', color:'rgba(255,130,130,0.85)', flexShrink:0 }}>
          {isRtl ? '⛔ لا فتاوى رسمية' : '⛔ No Fatwas'}
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:12, minHeight:0, paddingInlineEnd:4 }}>
        {msgs.map(msg => (
          <div key={msg.id} style={{ display:'flex', gap:8, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width:28, height:28, borderRadius:10, background:'linear-gradient(135deg,rgba(212,175,55,0.18),rgba(46,90,68,0.20))', border:'1px solid rgba(212,175,55,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0, marginTop:2 }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth:'87%',
              borderRadius: msg.role === 'assistant' ? '0 16px 16px 16px' : '16px 0 16px 16px',
              padding:'12px 14px',
              background: msg.role === 'assistant' ? `linear-gradient(145deg,rgba(16,12,6,0.95),${CAT_BG[msg.category]})` : 'rgba(46,36,18,0.70)',
              border:`1px solid ${msg.role === 'assistant' ? 'rgba(212,175,55,0.14)' : 'rgba(193,154,107,0.18)'}`,
            }}>
              <p className="font-arabic" style={{ color:'rgba(245,236,215,0.92)', fontSize:13, lineHeight:2.1, whiteSpace:'pre-line', margin:0 }}>
                {renderMD(msg.text)}
              </p>
              {msg.sources.length > 0 && (
                <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(212,175,55,0.10)' }}>
                  <button onClick={() => setOpenSrc(openSrc === msg.id ? null : msg.id)}
                    className="font-arabic"
                    style={{ color:'rgba(212,175,55,0.55)', fontSize:10, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, padding:0 }}>
                    📚 {isRtl ? 'المصادر' : 'Sources'} ({msg.sources.length}) {openSrc === msg.id ? '▴' : '▾'}
                  </button>
                  {openSrc === msg.id && (
                    <div style={{ marginTop:6, display:'flex', flexWrap:'wrap', gap:4 }}>
                      {msg.sources.map((s, i) => (
                        <span key={i} className="font-arabic" style={{ fontSize:9, padding:'2px 7px', borderRadius:999, background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.16)', color:'rgba(212,175,55,0.70)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{ color:'rgba(193,154,107,0.28)', fontSize:9, marginTop:4 }}>{msg.time}</div>
            </div>
            {msg.role === 'user' && (
              <div style={{ width:28, height:28, borderRadius:10, background:'rgba(193,154,107,0.16)', border:'1px solid rgba(193,154,107,0.20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0, marginTop:2 }}>
                👤
              </div>
            )}
          </div>
        ))}

        {/* typing indicator */}
        {busy && (
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:10, background:'linear-gradient(135deg,rgba(212,175,55,0.18),rgba(46,90,68,0.20))', border:'1px solid rgba(212,175,55,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🤖</div>
            <div style={{ padding:'10px 14px', borderRadius:'0 16px 16px 16px', background:'rgba(16,12,6,0.90)', border:'1px solid rgba(212,175,55,0.12)', display:'flex', alignItems:'center', gap:5 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#D4AF37', display:'inline-block', animation:`aiBounce 1.1s ease-in-out ${i*0.18}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Chips ── */}
      <div style={{ flexShrink:0, display:'flex', flexWrap:'wrap', gap:6, marginTop:12, marginBottom:8 }}>
        {CHIPS.map((c, i) => (
          <button key={i} onClick={() => dispatch(c.q)} disabled={busy}
            className="font-arabic"
            style={{
              fontSize:11, padding:'5px 11px', borderRadius:10,
              background:'rgba(212,175,55,0.07)', border:'1px solid rgba(212,175,55,0.22)',
              color:'rgba(212,175,55,0.82)', cursor:'pointer',
              opacity: busy ? 0.35 : 1,
              transition:'transform 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <form onSubmit={e => { e.preventDefault(); dispatch(draft); }}
        style={{ flexShrink:0, display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:16, background:'rgba(10,8,4,0.75)', border:'1px solid rgba(212,175,55,0.18)' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          disabled={busy}
          placeholder={isRtl ? 'اكتب سؤالك عن الزواج والأسرة...' : 'Ask about marriage & family fiqh...'}
          dir={dir}
          className="font-arabic"
          style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#F5ECD7', fontSize:13, minWidth:0 }}
        />
        <button type="submit" disabled={!draft.trim() || busy}
          style={{
            width:36, height:36, borderRadius:10, border:'none', cursor: draft.trim() && !busy ? 'pointer' : 'default',
            background: draft.trim() && !busy ? 'linear-gradient(135deg,#D4AF37,#C19A6B)' : 'rgba(212,175,55,0.10)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            transition:'transform 0.1s',
          }}
          onMouseEnter={e => { if (draft.trim() && !busy) e.currentTarget.style.transform='scale(1.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 13V2M2 7l5.5-5.5L13 7" stroke={draft.trim() && !busy ? '#0E0B07' : '#D4AF37'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>

      <p className="font-arabic" style={{ color:'rgba(193,154,107,0.28)', fontSize:9, textAlign:'center', marginTop:6, flexShrink:0 }}>
        {isRtl ? '⚠️ معلومات توجيهية — الفتاوى من اختصاص العلماء المعتمدين' : '⚠️ Informational only — Fatwas require qualified scholars'}
      </p>

      <style>{`
        @keyframes aiBounce {
          0%,80%,100% { transform:translateY(0); opacity:0.45 }
          40% { transform:translateY(-5px); opacity:1 }
        }
      `}</style>
    </div>
  );
}
