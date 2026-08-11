'use client';

import React, { useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { t, LOCALES } from '@/lib/i18n';
import { toast } from 'sonner';

// Sanitize function — strip phone numbers, social handles, obfuscated contacts
function sanitizeInput(input: string): string {
  return input
    // Phone numbers
    .replace(/(\+?[\d\s\-().]{7,})/g, '[REDACTED]')
    // Social handles
    .replace(/@[\w.]+/g, '[REDACTED]')
    // URLs
    .replace(/https?:\/\/[^\s]+/g, '[REDACTED]')
    // Dot-separated potential handles
    .replace(/\b[\w]+\.[\w]+\.(com|net|org|io|me|tv)\b/gi, '[REDACTED]')
    // WhatsApp / Telegram mentions
    .replace(/\b(whatsapp|telegram|signal|facebook|instagram|tiktok|snapchat)\b/gi, '[REDACTED]')
    .trim();
}

const PREDEFINED_PROMPTS_AR = [
  { category: 'الدين', prompts: [
    'ما هو مستوى التزامك بصلاة الجماعة في المسجد؟',
    'هل تلتزم بقيام الليل؟ وما حفظك من القرآن الكريم؟',
    'ما منهجك العقدي تحديداً؟ وما مصادر تعلمك الديني؟',
    'هل تتعامل بالربا أو المصارف الربوية؟',
  ]},
  { category: 'الأسرة', prompts: [
    'ما أسلوبك في التعامل مع زوجتك عند الخلاف؟',
    'هل ستسمح للزوجة بالعمل أو التعليم؟ وما الضوابط؟',
    'كيف تتعامل مع والديك وأسرتك فيما يخص خصوصية الزوجة؟',
    'ما رأيك في تعدد الزوجات؟ وهل هو من نياتك؟',
  ]},
  { category: 'الحياة العملية', prompts: [
    'ما وضعك المادي الحالي وقدرتك على توفير السكن والنفقة؟',
    'ما طموحاتك المهنية والحياتية في السنوات الخمس القادمة؟',
    'هل أنت مستعد للانتقال جغرافياً أو الهجرة؟',
    'ما وضعك الصحي؟ وهل لديك أي حالات يجب الإفصاح عنها شرعاً؟',
  ]},
  { category: 'للعروس', prompts: [
    'ما أولوياتك في الزوج الصالح؟',
    'ما شروطك الجوهرية في عقد الزواج؟',
    'هل أنت مستعدة للانتقال أو الهجرة؟',
    'كيف تريدين توزيع الأدوار بين المنزل والتعليم؟',
  ]},
];

const PREDEFINED_PROMPTS_EN = [
  { category: 'Religion', prompts: [
    'What is your level of commitment to congregational prayer at the mosque?',
    'Do you observe Tahajjud (night prayer)? And what is your Qur\'an memorisation level?',
    'What is your specific creedal methodology? What are your sources of Islamic learning?',
    'Do you deal with usurious (riba-based) financial institutions?',
  ]},
  { category: 'Family', prompts: [
    'How do you handle disagreements with your spouse?',
    'Will you allow your wife to work or pursue education? What are the conditions?',
    'How do you balance your parents\' relationship with your wife\'s privacy and rights?',
    'What is your position on polygyny? Is it among your intentions?',
  ]},
  { category: 'Practical Life', prompts: [
    'What is your current financial capacity to provide housing and maintenance?',
    'What are your professional and life aspirations for the next five years?',
    'Are you prepared to relocate geographically or make Hijrah?',
    'What is your health status? Do you have any conditions requiring disclosure?',
  ]},
  { category: 'For the Bride', prompts: [
    'What are your top priorities in a righteous spouse?',
    'What are your core conditions in the marriage contract?',
    'Are you prepared to relocate or make Hijrah?',
    'How do you envision balancing the home and any educational pursuits?',
  ]},
];

export function DialogueModule() {
  const { locale, role, dialoguePrompts, addDialoguePrompt, answerDialoguePrompt } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState('');

  const prompts = dir === 'rtl' ? PREDEFINED_PROMPTS_AR : PREDEFINED_PROMPTS_EN;

  function sendPrompt(promptText: string) {
    if (role === 'visitor') {
      toast.error(locale === 'ar' ? 'يجب تحديد دورك أولاً' : 'Select your role first');
      return;
    }
    const clean = sanitizeInput(promptText);
    addDialoguePrompt({
      from: role as 'groom' | 'bride' | 'wali',
      promptKey: promptText.slice(0, 20),
      promptText: clean,
    });
    toast.success(locale === 'ar' ? 'تم إرسال السؤال' : 'Prompt sent');
  }

  function submitAnswer(id: string) {
    if (!answerInput.trim()) return;
    const clean = sanitizeInput(answerInput);
    if (clean.includes('[REDACTED]')) {
      toast.error(locale === 'ar' ? 'تم حذف معلومات الاتصال المباشر — لا يُسمح بمعلومات التواصل' : 'Contact information removed — direct contact not permitted');
    }
    answerDialoguePrompt(id, clean, role as 'groom' | 'bride' | 'wali');
    setAnsweringId(null);
    setAnswerInput('');
    toast.success(locale === 'ar' ? 'تم تسجيل الإجابة' : 'Answer recorded');
  }

  const roleColor: Record<string, string> = {
    groom: 'text-[#D4AF37]',
    bride: 'text-pink-300',
    wali: 'text-green-400',
    visitor: 'text-[#C19A6B]',
  };

  return (
    <div dir={dir} className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">💬</span>
        </div>
        <div>
          <h2 className="font-arabic text-[#D4AF37] font-bold text-lg">
            {t(locale, 'dialogue_title')}
          </h2>
          <p className="text-[#C19A6B] text-xs">{t(locale, 'dialogue_desc')}</p>
        </div>
      </div>

      {/* Zero-chat policy notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/15 border border-red-800/30 mb-4">
        <span className="text-red-400 text-sm">🔒</span>
        <p className="text-xs text-red-300/80">
          {t(locale, 'no_direct_contact')} — {t(locale, 'all_interactions_monitored')}
        </p>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
        {/* Prompt library */}
        <div className="w-1/2 flex flex-col min-h-0">
          <p className="text-xs text-[#C19A6B] mb-2 font-medium">
            {locale === 'ar' ? 'مكتبة الأسئلة' : 'Prompt Library'}
          </p>
          {/* Category tabs */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {prompts.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(i)}
                className={`px-2 py-1 rounded text-xs border transition-all ${
                  selectedCategory === i
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'border-[#D4AF37]/15 text-[#C19A6B]'
                } ${dir === 'rtl' ? 'font-arabic' : ''}`}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {prompts[selectedCategory]?.prompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendPrompt(p)}
                className={`w-full text-start px-3 py-2 rounded-lg text-xs border border-[#D4AF37]/15 text-[#C19A6B] hover:border-[#D4AF37]/40 hover:text-[#F5ECD7] transition-all leading-relaxed ${
                  dir === 'rtl' ? 'font-arabic' : ''
                }`}
              >
                {dir === 'rtl' ? '→' : '←'} {p}
              </button>
            ))}
          </div>
        </div>

        {/* Active dialogue */}
        <div className="w-1/2 flex flex-col min-h-0">
          <p className="text-xs text-[#C19A6B] mb-2 font-medium">
            {locale === 'ar' ? 'الحوار الجاري' : 'Active Dialogue'}
          </p>
          <div className="flex-1 overflow-y-auto space-y-3">
            {dialoguePrompts.length === 0 ? (
              <div className="text-center py-6 text-[#C19A6B]/50 text-xs">
                {locale === 'ar' ? 'لا توجد أسئلة بعد — ابدأ بإرسال سؤال من المكتبة' : 'No prompts yet — select from the library'}
              </div>
            ) : (
              dialoguePrompts.map((p) => (
                <div key={p.id} className="glass-panel-light p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${roleColor[p.from]}`}>
                      {p.from === 'groom' ? (locale === 'ar' ? 'العريس' : 'Groom') :
                       p.from === 'bride' ? (locale === 'ar' ? 'العروس' : 'Bride') :
                       (locale === 'ar' ? 'الولي' : 'Wali')}
                    </span>
                    <span className="text-[#C19A6B]/40 text-xs">
                      {new Date(p.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#F5ECD7] text-xs leading-relaxed mb-2`}>
                    {p.promptText}
                  </p>
                  {p.answered ? (
                    <div className="pt-2 border-t border-[#D4AF37]/10">
                      <span className={`text-xs font-bold ${roleColor[p.respondedBy ?? 'visitor']} mr-2`}>
                        ↳ {p.respondedBy === 'groom' ? (locale === 'ar' ? 'العريس' : 'Groom') :
                           p.respondedBy === 'bride' ? (locale === 'ar' ? 'العروس' : 'Bride') :
                           p.respondedBy === 'wali'  ? (locale === 'ar' ? 'الولي'  : 'Wali')  : ''}:
                      </span>
                      <span className={`${dir === 'rtl' ? 'font-arabic' : ''} text-[#C19A6B] text-xs`}>
                        {p.responseText}
                      </span>
                    </div>
                  ) : (
                    answeringId === p.id ? (
                      <div className="pt-2 border-t border-[#D4AF37]/10">
                        <textarea
                          value={answerInput}
                          onChange={e => setAnswerInput(e.target.value)}
                          className={`w-full bg-[#0E0B07] border border-[#D4AF37]/30 text-[#F5ECD7] text-xs rounded-lg px-2 py-2 resize-none focus:outline-none focus:border-[#D4AF37]/60 ${dir === 'rtl' ? 'font-arabic' : ''}`}
                          rows={2}
                          placeholder={locale === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                        />
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => submitAnswer(p.id)} className="btn-gold px-3 py-1 rounded text-xs">
                            {t(locale, 'confirm')}
                          </button>
                          <button onClick={() => setAnsweringId(null)} className="text-[#C19A6B] text-xs px-2">
                            {t(locale, 'cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAnsweringId(p.id)}
                        className="mt-1 text-xs text-[#D4AF37]/70 hover:text-[#D4AF37]"
                      >
                        {locale === 'ar' ? '↳ أجب' : '↳ Answer'}
                      </button>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
