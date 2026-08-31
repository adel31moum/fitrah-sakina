'use client';

/**
 * StoryDetail — صفحة تفاصيل القصة الكاملة
 * تظهر فوق الـ MainApp كـ overlay page عند فتح قصة من SalafiChannel
 */

import React, { useEffect, useRef, useState } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { LOCALES } from '@/lib/i18n';

// ── مشاركة نفس قاعدة البيانات عبر export ─────────────────────────
export type Story = {
  id: string;
  type: 'story' | 'hadith' | 'principle';
  icon: string;
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  sourceAr: string;
  sourceEn: string;
  lesson: { ar: string; en: string };
  // Extended fields for detail page
  extendedAr?: string;
  extendedEn?: string;
  reflectionAr?: string[];
  reflectionEn?: string[];
  relatedIds?: string[];
};

export const STORIES: Story[] = [
  {
    id: 's1',
    type: 'story',
    icon: '⭐',
    tagAr: 'من هدي الصحابة',
    tagEn: "Companions' Guidance",
    titleAr: 'زواج عليّ بفاطمة رضي الله عنهما',
    titleEn: 'The Marriage of Ali and Fatimah (RA)',
    bodyAr:
      'لما أراد علي بن أبي طالب رضي الله عنه الزواج من فاطمة رضي الله عنها، لم يكن يملك سوى درعه — فباعها وجعلها مهراً. قال النبي ﷺ لعلي: «اذهب فابيع درعك». فباعه بـ٤٨٠ درهماً، وهكذا يُعلّمنا السلف أن المهر لا يشترط أن يكون كثيراً — بل صادقاً مُيسَّراً.\n\nقال ﷺ: «خيرُ الصَّداقِ أيسَرُه».',
    bodyEn:
      'When Ali ibn Abi Talib (RA) sought to marry Fatimah (RA), he owned nothing but his shield — so he sold it and made its price the Mahr. The Prophet ﷺ said to him: "Go and sell your shield." He sold it for 480 dirhams.\n\nThus the Salaf teach us that Mahr need not be large — but sincere and affordable. The Prophet ﷺ said: "The best Mahr is the easiest."',
    extendedAr:
      'كان علي رضي الله عنه من أكثر الصحابة قُرباً من رسول الله ﷺ، وكانت فاطمة رضي الله عنها أحبّ بناته إليه. ومع ذلك لم يتكلّف النبيُّ ﷺ في زواج ابنته عُشرَ معشارِ ما يُكلَّف به اليوم في كثير من بلاد المسلمين.\n\nوقد أعدَّ النبي ﷺ لبيتهما بساطاً ووسادةً وإناءَ ماء — ليس قصراً ولا مجلساً فخماً. وفي اليوم الأول، دعا لهما بالبركة والمودة.\n\nوقال ﷺ لفاطمة حين رأها تبكي من شدة الفقر: «ألا أدلُّكِ على ما هو خيرٌ لكِ من الخادم؟ سبِّحي الله ثلاثاً وثلاثين، واحمديه ثلاثاً وثلاثين، وكبِّريه أربعاً وثلاثين — فذلك خيرٌ لكِ من خادم».\n\nهذا هو البيت النبوي: يُسر في المعيشة، وغنى في الروح.',
    extendedEn:
      'Ali (RA) was among the closest Companions to the Prophet ﷺ, and Fatimah (RA) was his most beloved daughter. Yet the Prophet ﷺ did not burden her wedding with even a fraction of what is demanded in many Muslim communities today.\n\nThe Prophet ﷺ furnished their home with a mat, a pillow, and a water vessel — no palace, no lavish reception hall. On the first day, he simply supplicated for them with blessings and affection.\n\nWhen Fatimah came to him in tears over their poverty, he said: "Shall I not guide you to something better than a servant? Say Subhan Allah thirty-three times, Alhamdulillah thirty-three times, and Allahu Akbar thirty-four times — that is better for you than a servant."\n\nThis is the prophetic household: simple in material life, rich in spirit.',
    reflectionAr: [
      'المهر الغالي لم يكن يوماً من سنة النبي ﷺ — بل هو عادة اجتماعية مُخترَعة',
      'القصر والمجلس الفخم لا يصنع السعادة — البركة تصنعها',
      'الفقر المادي لم يمنع أشرف زواج في تاريخ البشرية',
    ],
    reflectionEn: [
      'A large Mahr was never part of the prophetic Sunnah — it is a social invention',
      'An expensive hall does not make happiness — baraka (blessing) does',
      'Material poverty did not prevent the most honourable marriage in human history',
    ],
    sourceAr: '— أحمد والنسائي، وصحيح البخاري باب الوليمة',
    sourceEn: '— Ahmad, Al-Nasai, and Sahih Bukhari (Book of Weddings)',
    lesson: { ar: 'يُسْر المهر من سنة النبي ﷺ', en: 'Affordable Mahr is Prophetic Sunnah' },
    relatedIds: ['s2', 's6'],
  },
  {
    id: 's2',
    type: 'hadith',
    icon: '📿',
    tagAr: 'حديث شريف',
    tagEn: 'Prophetic Hadith',
    titleAr: 'من أحق الناس بحسن الزواج؟',
    titleEn: 'Who is most deserving of a good marriage?',
    bodyAr:
      'قال رسول الله ﷺ: «إِذَا جَاءَكُمْ مَنْ تَرْضَوْنَ دِينَهُ وَخُلُقَهُ فَزَوِّجُوهُ، إِلَّا تَفْعَلُوا تَكُنْ فِتْنَةٌ فِي الأَرْضِ وَفَسَادٌ كَبِيرٌ».\n\nهذا هو معيار اختيار الزوج في منهج السلف: الدين والخلق — لا المال والمنصب وحدهما.',
    bodyEn:
      'The Messenger of Allah ﷺ said: "If someone comes to you whose religion and character you are pleased with, then marry [your daughter/ward] to him. If you do not do so, there will be tribulation in the land and great corruption."\n\nThis is the Salafi criterion: religion and character — not wealth or status alone.',
    extendedAr:
      'جمع علماء الإسلام بين هذا الحديث وحديث: «تُنكح المرأة لأربع: لمالها، ولحسبها، ولجمالها، ولدينها — فاظفر بذات الدين تَرِبَتْ يداك» — فكلاهما يُؤكد أن الدين هو الأساس.\n\nوقد قال الإمام ابن القيم رحمه الله: "لا شيء أنفع للعبد في دنياه وآخرته من الزوجة الصالحة". فمن تزوج لصلاح الدين أصلح الله له كل شيء.\n\nوأما الفتنة المذكورة في الحديث فهي الزنا والسفاح الذي يُفسد الأنساب ويُهدم المجتمع — فحين يُعرقل أهل المرأة الخاطبَ الصالح طمعاً في الغنيّ أو الجاه، يدفعون الشباب إلى الحرام.',
    extendedEn:
      'Muslim scholars combine this hadith with: "A woman is married for four things: her wealth, her lineage, her beauty, and her religion — so choose the one with religion, may you prosper." Both confirm that religion is the foundation.\n\nIbn al-Qayyim (may Allah have mercy on him) said: "Nothing is more beneficial to a person in this life and the hereafter than a righteous wife." Whoever marries for righteousness, Allah rectifies everything for him.\n\nThe "tribulation" (fitna) mentioned in the hadith refers to fornication and corruption of lineage that destroys society — for when a woman\'s family blocks a righteous suitor out of greed for wealth or status, they push the youth toward what is forbidden.',
    reflectionAr: [
      'رفض الخاطب الصالح بسبب الفقر من أسباب الفساد في الأرض',
      'الدين والخلق لا يُشتران بالمال — وهما أدوم من كل ثروة',
      'المسؤولية على الولي عظيمة: قراره يصنع أو يهدم',
    ],
    reflectionEn: [
      'Rejecting a righteous suitor due to poverty is among the causes of corruption in the land',
      'Religion and character cannot be bought — and they outlast every fortune',
      'The guardian\'s responsibility is enormous: his decision builds or destroys',
    ],
    sourceAr: '— الترمذي وابن ماجه | حسن صحيح',
    sourceEn: '— Al-Tirmidhi & Ibn Majah | Hasan Sahih',
    lesson: { ar: 'الدين والخلق معيار الاختيار', en: 'Religion and character are the criteria' },
    relatedIds: ['s3', 's4'],
  },
  {
    id: 's3',
    type: 'story',
    icon: '🌙',
    tagAr: 'من التاريخ الإسلامي',
    tagEn: 'Islamic History',
    titleAr: 'كيف نصح ابن عمر أبناءه في الزواج',
    titleEn: "How Ibn Umar advised his sons about marriage",
    bodyAr:
      'كان عبدالله بن عمر رضي الله عنهما يقول لأبنائه: «لا تتزوجوا امرأةً لمالها، فإن المال يُفنيها. ولا لجمالها، فإن الجمال يُبليها. ولكن تزوّجوها على دينها».\n\nوهذا هو نهج السلف الصالح في بناء الأسرة: الدين أولاً، لأن الأسرة المؤسَّسة على الدين تُنجب الجيل الصالح الذي يُعلي كلمة الله.',
    bodyEn:
      "Abdullah ibn Umar (RA) used to tell his sons: \"Do not marry a woman for her wealth — wealth diminishes. Do not marry for her beauty alone — beauty fades. But marry her for her religion.\"\n\nThis is the way of the righteous Salaf in building a family: religion first, because the family founded on religion produces the righteous generation that elevates the word of Allah.",
    extendedAr:
      'عبدالله بن عمر رضي الله عنه من أشد الصحابة اتباعاً لسنة النبي ﷺ، حتى كان يُقال عنه: إنه يتتبع آثار النبي ﷺ حجراً حجراً. ومن أبرز سماته الفقهية أنه كان شديد الحذر من البدعة والتكلّف.\n\nوكان يُحذّر أبناءه من الخداع الذي يقع فيه كثير من الشباب: يرون الجمال فيظنون أنه سيدوم، ويرون المال فيظنون أنه يصنع السعادة — وكلاهما وهم.\n\nفالجمال يزول مع السنين والمرض والإرهاق، والمال يتقلب ويذهب. أما الدين فإنه يزداد مع السنين، ويبني الأسرة على أرضية صلبة لا تهتز.\n\nقال تعالى: ﴿وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا﴾ — الكهف: ٤٦',
    extendedEn:
      "Abdullah ibn Umar (RA) was among the most meticulous Companions in following the Sunnah of the Prophet ﷺ — it was said of him that he would trace the Prophet's footsteps stone by stone. He was famously cautious against innovation and unnecessary burdens.\n\nHe would warn his sons against the deception many young men fall into: they see beauty and think it will last, they see wealth and think it brings happiness — both are illusions.\n\nBeauty fades with years, illness, and exhaustion; wealth fluctuates and disappears. But religion deepens with time and builds the family on unshakeable ground.\n\nAllah says: \"But the enduring good deeds are better in the sight of your Lord for reward and better for hope.\" (Al-Kahf 18:46)",
    reflectionAr: [
      'الجمال وحده لا يضمن سعادة — الدين هو الضمان الحقيقي',
      'الأسرة الدينية تُنجب أجيالاً تُعلي كلمة الله في الأرض',
      'الصحابة كانوا أحرص الناس على حماية أبنائهم من خطأ الاختيار',
    ],
    reflectionEn: [
      'Beauty alone guarantees nothing — religion is the true guarantee',
      'The religious family produces generations that raise the word of Allah on earth',
      'The Companions were the most careful in protecting their children from wrong choices',
    ],
    sourceAr: '— ابن أبي شيبة في مصنفه، وابن حزم في المحلى',
    sourceEn: '— Ibn Abi Shaybah in his Musannaf, Ibn Hazm in Al-Muhalla',
    lesson: { ar: 'الدين أولاً في بناء الأسرة', en: 'Religion first in family building' },
    relatedIds: ['s2', 's5'],
  },
  {
    id: 's4',
    type: 'hadith',
    icon: '📿',
    tagAr: 'حديث شريف',
    tagEn: 'Prophetic Hadith',
    titleAr: 'حق الزوجة على زوجها',
    titleEn: "The wife's rights upon her husband",
    bodyAr:
      'قال ﷺ: «اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا، فَإِنَّ الْمَرْأَةَ خُلِقَتْ مِنْ ضِلَعٍ، وَإِنَّ أَعْوَجَ شَيْءٍ فِي الضِّلَعِ أَعْلاهُ، فَإِنْ ذَهَبْتَ تُقِيمُهُ كَسَرْتَهُ، وَإِنْ تَرَكْتَهُ لَمْ يَزَلْ أَعْوَجَ».\n\nأعظم وصية في التعامل مع الزوجة: الرفق والرحمة — لا القسوة ولا الإهمال.',
    bodyEn:
      "The Prophet ﷺ said: \"Take good care of women, for woman was created from a rib, and the most curved part of a rib is its top. If you try to straighten it, you will break it; if you leave it, it will remain curved.\"\n\nThe greatest advice in dealing with a wife: gentleness and mercy — neither harshness nor neglect.",
    extendedAr:
      'هذا الحديث من أجمع ما قاله النبي ﷺ في فلسفة العلاقة الزوجية. والضِّلَع المائل تمثيل دقيق: المرأة لها طبيعتها المختلفة عن الرجل — ليست نقصاً بل تكاملاً.\n\nفالرجل الحكيم لا يُقاوم طبيعة زوجته ولا يُهملها — بل يتعامل معها بحكمة: يأخذ منها ما هو حسن ويتجاوز عن ما فيه اعوجاج، فيجمعهما الله على السكينة والمودة.\n\nوقد قال ﷺ في نفس الحديث: «فاستوصوا بالنساء خيراً» — وكرّر هذه الجملة مرات. وفي حجة الوداع كان آخر وصاياه ﷺ: «اتقوا الله في النساء».\n\nوقال ﷺ: «خيرُكم خيرُكم لأهله، وأنا خيرُكم لأهلي» — متفق عليه.',
    extendedEn:
      "This hadith contains one of the most comprehensive teachings of the Prophet ﷺ on the philosophy of the marital relationship. The curved rib is a precise metaphor: a woman has a nature different from a man's — not a deficiency, but a complementarity.\n\nThe wise man neither forces his wife's nature nor neglects it — he deals with it wisely: taking what is good and overlooking the imperfection, and thus Allah unites them in tranquillity and affection.\n\nThe Prophet ﷺ said in the same hadith: 'Take good care of women' — repeating it multiple times. In his Farewell Sermon, among his last commands was: 'Fear Allah regarding women.'\n\nHe also said: 'The best of you is the best to his family, and I am the best of you to my family.' — Agreed upon.",
    reflectionAr: [
      'الرفق مع الزوجة ليس ضعفاً — هو سنة أشجع رجل في التاريخ',
      'الزوج الذي يُقسو يكسر — والذي يُهمل يُضيّع',
      'ميزان الرجولة عند النبي ﷺ: حسن معاملة الأهل',
    ],
    reflectionEn: [
      "Gentleness with one's wife is not weakness — it is the Sunnah of the bravest man in history",
      'The husband who is harsh breaks; the one who neglects loses',
      "The Prophet's ﷺ measure of manhood: excellent treatment of one's family",
    ],
    sourceAr: '— متفق عليه (البخاري ومسلم)',
    sourceEn: '— Agreed upon (Bukhari & Muslim)',
    lesson: { ar: 'الرفق والرحمة في المعاشرة', en: 'Gentleness and mercy in marital life' },
    relatedIds: ['s2', 's3'],
  },
  {
    id: 's5',
    type: 'principle',
    icon: '🛡',
    tagAr: 'منهج السلف الصالح',
    tagEn: 'The Way of the Righteous Salaf',
    titleAr: 'لماذا المنهج السلفي هو الحل لأزمة الأسرة؟',
    titleEn: 'Why the Salafi Methodology is the solution to the family crisis',
    bodyAr:
      'في عصر تتفكك فيه الأسر وتتصاعد معدلات الطلاق إلى 50% في الغرب — يُقدّم المنهج السلفي حلاً ربانياً مُجرَّباً:\n\n✦ الزواج على الدين والخُلق — لا الجمال والمال فحسب\n✦ الولاية الشرعية — حماية لا تقييد\n✦ المهر المُيسَّر — لا الغالي المُثقِّل\n✦ التواصل المحتشم تحت الإشراف — لا الخلوة المحرَّمة\n✦ العقد الموثَّق — حقوق مكفولة من اليوم الأول',
    bodyEn:
      'In an era where families collapse and divorce rates soar to 50% in the West — the Salafi methodology offers a divine, tested solution:\n\n✦ Marriage based on religion and character — not beauty and wealth alone\n✦ Guardianship (Wali) — protection, not restriction\n✦ Affordable Mahr — not burdensome\n✦ Modest communication under supervision — not forbidden seclusion\n✦ Documented contract — guaranteed rights from day one',
    extendedAr:
      'تشير دراسات علم الاجتماع الحديثة — ومنها أبحاث جامعة هارفرد وجامعة ييل — إلى أن المتزوجين دينياً بأي ديانة أقل عرضة للطلاق، وأكثر سعادة وصحة نفسية من غيرهم.\n\nوعلى وجه الخصوص، أثبتت الدراسات أن:\n• الاتفاق على القيم قبل الزواج يُقلل احتمال الطلاق بنسبة 70%\n• وجود طرف ثالث محايد (كالولي) يُقلل النزاعات المبكرة\n• الالتزام الديني المشترك يزيد الرضا الزوجي بشكل قياسي\n\nوهذه بالضبط ما يوفره المنهج السلفي من آليات: الاتفاق على الدين والخلق، الولاية الحكيمة، والعقد الموثَّق الذي يُحدد الحقوق من اليوم الأول.\n\nليس المنهج السلفي انعزالاً — بل هو الحل الذي يتوصّل إليه علماء الاجتماع الغربيون اليوم بعد قرن من التجارب الفاشلة.',
    extendedEn:
      "Studies in modern sociology — including research from Harvard and Yale — indicate that religiously married couples, regardless of faith, are less likely to divorce and report higher happiness and psychological wellbeing.\n\nSpecifically, studies have shown:\n• Agreement on shared values before marriage reduces the probability of divorce by 70%\n• The presence of a neutral third party (like a guardian/Wali) reduces early conflicts significantly\n• Shared religious commitment measurably increases marital satisfaction\n\nThese are precisely the mechanisms the Salafi methodology provides: agreement on religion and character, wise guardianship, and a documented contract that defines rights from day one.\n\nThe Salafi methodology is not isolation — it is the solution that Western sociologists are arriving at today after a century of failed experiments.",
    reflectionAr: [
      'العلم الحديث يُقرّ اليوم ما أمر به الإسلام منذ ١٤ قرناً',
      'الولي ليس قيداً — هو حامي الحقوق وضامن القرار السليم',
      'المنهج السلفي حلٌّ عالمي يصلح لكل إنسان في أي ثقافة',
    ],
    reflectionEn: [
      'Modern science is now confirming what Islam commanded 14 centuries ago',
      'The guardian is not a restriction — he is a rights protector and sound-decision guarantor',
      'The Salafi methodology is a universal solution that works for every person in any culture',
    ],
    sourceAr: '— الفرقة الناجية وأبحاث جامعة هارفرد وييل',
    sourceEn: '— The Saved Group; Harvard & Yale sociological research',
    lesson: { ar: 'المنهج السلفي = الحل الرباني الكامل', en: 'Salafi methodology = the complete divine solution' },
    relatedIds: ['s1', 's3'],
  },
  {
    id: 's6',
    type: 'story',
    icon: '⭐',
    tagAr: 'قصة عبرة',
    tagEn: 'Lesson Story',
    titleAr: 'عبد الرحمن بن عوف والزواج في المدينة',
    titleEn: 'Abdur-Rahman ibn Awf and marriage in Madinah',
    bodyAr:
      'لما هاجر عبد الرحمن بن عوف رضي الله عنه إلى المدينة، آخى النبيُّ ﷺ بينه وبين سعد بن الربيع. فعرض عليه سعد أن يقاسمه ماله وزوجته — فقال عبد الرحمن: «بارك الله لك في مالك وأهلك، دُلَّني على السوق».\n\nفذهب إلى السوق وعمل وتزوج بعد أن بنى نفسه بنفسه. قال له النبي ﷺ: «تزوَّجتَ؟» قال: نعم. قال: «أَوْلِمْ ولو بشاةٍ».',
    bodyEn:
      "When Abdur-Rahman ibn Awf (RA) emigrated to Madinah, the Prophet ﷺ paired him with Sa'd ibn Ar-Rabi'. Sa'd offered to share his wealth and give him one of his wives in marriage — Abdur-Rahman replied: 'May Allah bless your wealth and family — just show me the marketplace.'\n\nHe went to the market, worked, and then married having built himself. The Prophet ﷺ asked: 'Did you get married?' He said yes. He said: 'Give a feast, even with one sheep.'",
    extendedAr:
      'كان عبد الرحمن بن عوف رضي الله عنه من أثرى الصحابة — لكنه بنى ثروته بنفسه من الصفر. ودرسه في الزواج بليغ: لم يقبل الصدقة حتى في أصعب لحظاته، وآثر أن يعمل ويكسب ثم يتزوج بعزة وكرامة.\n\nوهذه هي القيمة السلفية الكبرى: العفة والاستقلالية. الشاب الذي يعجز عن الزواج لا يطلب المهر من أهل الفتاة، ولا يطلب الصدقة بلا مسوّغ — بل يعمل ويدّخر ويتوكل على الله.\n\nوفي الوقت نفسه، منصة فطرة وسكينة تُتيح لمن يملك أن يُيسِّر على من لا يملك — عبر ركن زكاة الزواج — فتجتمع العفة والكرم في آن واحد.\n\nقال ﷺ: «يا معشر الشباب، من استطاع منكم الباءة فليتزوج، ومن لم يستطع فعليه بالصوم فإنه له وجاء» — متفق عليه.',
    extendedEn:
      "Abdur-Rahman ibn Awf (RA) became one of the wealthiest Companions — but he built his fortune himself from nothing. His lesson in marriage is eloquent: he refused charity even in his most difficult moments, preferring to work and earn, then marry with dignity.\n\nThis is the great Salafi value: chastity and self-reliance. The young man who cannot afford marriage does not demand the Mahr from the girl's family, nor seek charity without cause — he works, saves, and trusts Allah.\n\nAt the same time, the Fitrah & Sakina platform enables those who have means to ease the way for those who don't — through the Marriage Zakat corner — combining chastity and generosity at once.\n\nThe Prophet ﷺ said: 'O youth! Whoever among you can afford marriage, let him marry; and whoever cannot, let him fast — for it is a shield for him.' — Agreed upon.",
    reflectionAr: [
      'العزة الحقيقية: أن تبني نفسك قبل أن تبني بيتك',
      'زكاة الزواج واجب الأغنياء تجاه إخوانهم المعسرين',
      'التوكل على الله لا ينافي السعي والعمل — بل يُكمله',
    ],
    reflectionEn: [
      'True dignity: build yourself before you build your home',
      'Marriage Zakat is the duty of the wealthy toward their struggling brothers',
      'Trusting Allah does not contradict striving and working — it completes it',
    ],
    sourceAr: '— متفق عليه (البخاري ومسلم)',
    sourceEn: '— Agreed upon (Bukhari & Muslim)',
    lesson: { ar: 'العفة والاستقلالية في طريق الزواج', en: 'Chastity and self-reliance on the path to marriage' },
    relatedIds: ['s1', 's5'],
  },
];

// ── ألوان الأنواع ──────────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  story: '#D4AF37',
  hadith: '#7EC8A4',
  principle: '#C19A6B',
};

// ── مشاركة بالنسخ ─────────────────────────────────────────────────
function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(text).catch(() => {});
}

export function StoryDetail() {
  const { locale, activeStoryId, closeStory, openStory, setActiveModule } = useFitrahStore();
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'rtl';
  const isAr = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const story = STORIES.find(s => s.id === activeStoryId);

  // Scroll to top on each story change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStoryId]);

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeStory(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeStory]);

  if (!story) return null;

  const color = TYPE_COLORS[story.type] ?? '#D4AF37';
  const related = story.relatedIds?.map(id => STORIES.find(s => s.id === id)).filter(Boolean) as Story[];
  const storyIdx = STORIES.findIndex(s => s.id === activeStoryId);

  function goNext() {
    const next = STORIES[(storyIdx + 1) % STORIES.length];
    if (next) openStory(next.id);
  }
  function goPrev() {
    const prev = STORIES[(storyIdx - 1 + STORIES.length) % STORIES.length];
    if (prev) openStory(prev.id);
  }

  function handleShare() {
    const title = isAr ? story!.titleAr : story!.titleEn;
    const body = isAr ? story!.bodyAr : story!.bodyEn;
    copyToClipboard(`${title}\n\n${body}\n\n— منصة فطرة وسكينة`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const reflections = isAr ? story.reflectionAr : story.reflectionEn;

  return (
    /* Full-screen overlay */
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      dir={dir}
      style={{ background: 'rgba(6,4,2,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* ── TOP BAR ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0 border-b"
        style={{ borderColor: `${color}20`, background: 'rgba(12,9,4,0.90)' }}
      >
        {/* Back */}
        <button
          onClick={closeStory}
          className="flex items-center gap-2 text-[#C19A6B] hover:text-[#F5ECD7] transition-colors group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            {isAr ? '→' : '←'}
          </span>
          <span className="font-arabic text-sm">{isAr ? 'العودة للقناة' : 'Back to Channel'}</span>
        </button>

        {/* Type tag */}
        <span
          className="text-xs px-2.5 py-1 rounded-full font-arabic"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
        >
          {isAr ? story.tagAr : story.tagEn}
        </span>

        {/* Share + counter */}
        <div className="flex items-center gap-3">
          <span className="text-[#C19A6B]/40 text-xs font-mono hidden sm:block">
            {storyIdx + 1} / {STORIES.length}
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-arabic"
            style={{
              background: copied ? `${color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied ? color : 'rgba(212,175,55,0.15)'}`,
              color: copied ? color : '#C19A6B',
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? (isAr ? 'نُسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* ── SCROLL AREA ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Ambient glow */}
          <div className="pointer-events-none fixed top-0 left-0 right-0 h-48"
            style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${color}12 0%, transparent 70%)` }} />

          {/* ── Icon + Title ── */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{story.icon}</div>
            <h1
              className="font-arabic font-bold leading-snug mb-3"
              style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', color: '#F5ECD7' }}
            >
              {isAr ? story.titleAr : story.titleEn}
            </h1>
            {/* Gold divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16" style={{ background: `linear-gradient(90deg,transparent,${color})` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <div className="h-px w-16" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
            </div>
          </div>

          {/* ── Main body ── */}
          <div
            className="glass-panel rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
            style={{ borderColor: `${color}30` }}
          >
            {/* Top edge line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />
            <p className="font-arabic text-[#F5ECD7] text-base sm:text-lg leading-[2.2] whitespace-pre-line">
              {isAr ? story.bodyAr : story.bodyEn}
            </p>
          </div>

          {/* ── Extended detail ── */}
          {(isAr ? story.extendedAr : story.extendedEn) && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ background: `${color}20` }} />
                <span className="font-arabic text-xs" style={{ color: `${color}70` }}>
                  {isAr ? 'الشرح والسياق' : 'Context & Commentary'}
                </span>
                <div className="h-px flex-1" style={{ background: `${color}20` }} />
              </div>
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${color}18`,
                }}
              >
                <p className="font-arabic text-[#C19A6B] text-sm sm:text-base leading-[2.2] whitespace-pre-line">
                  {isAr ? story.extendedAr : story.extendedEn}
                </p>
              </div>
            </div>
          )}

          {/* ── Lessons ── */}
          {reflections && reflections.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💡</span>
                <span className="font-arabic text-sm font-semibold" style={{ color }}>
                  {isAr ? 'دروس واستنباطات' : 'Lessons & Takeaways'}
                </span>
              </div>
              <div className="space-y-2">
                {reflections.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: `${color}08`, border: `1px solid ${color}18` }}
                  >
                    <span className="font-mono text-[10px] mt-1 shrink-0 font-bold" style={{ color: `${color}80` }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-arabic text-[#C19A6B] text-sm leading-relaxed">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Lesson badge + Source ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: `${color}12`, border: `1px solid ${color}30` }}
            >
              <span className="text-base">✦</span>
              <span className="font-arabic text-sm font-bold" style={{ color }}>
                {isAr ? story.lesson.ar : story.lesson.en}
              </span>
            </div>
            <span className="font-arabic text-[#C19A6B]/40 text-xs">
              {isAr ? story.sourceAr : story.sourceEn}
            </span>
          </div>

          {/* ── CTA: Open AI Advisor ── */}
          <div
            className="rounded-2xl p-5 text-center mb-8"
            style={{
              background: 'rgba(46,90,68,0.10)',
              border: '1px solid rgba(46,90,68,0.30)',
            }}
          >
            <p className="font-arabic text-[#7EC8A4] text-sm font-semibold mb-1">
              {isAr ? '🤖 هل لديك سؤال شرعي حول هذا الموضوع؟' : '🤖 Have a Sharia question on this topic?'}
            </p>
            <p className="font-arabic text-[#C19A6B]/60 text-xs mb-3">
              {isAr
                ? 'المساعد الذكي الشرعي جاهز للإجابة — مباشرة وفق الكتاب والسنة'
                : 'The AI Sharia Advisor is ready — answers directly from Quran & Sunnah'}
            </p>
            <button
              onClick={() => { closeStory(); setActiveModule('council'); }}
              className="btn-primary px-5 py-2.5 rounded-xl font-arabic text-sm"
            >
              {isAr ? 'افتح المساعد الشرعي' : 'Open the AI Advisor'}
            </button>
          </div>

          {/* ── Related stories ── */}
          {related.length > 0 && (
            <div className="mb-8">
              <p className="font-arabic text-[#C19A6B]/50 text-xs mb-3 tracking-widest uppercase">
                {isAr ? 'قصص ذات صلة' : 'Related Stories'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map(r => {
                  const rc = TYPE_COLORS[r.type] ?? '#D4AF37';
                  return (
                    <button
                      key={r.id}
                      onClick={() => openStory(r.id)}
                      className="text-start rounded-xl p-4 transition-all hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${rc}20`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{r.icon}</span>
                        <span className="font-arabic text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${rc}15`, color: rc }}>
                          {isAr ? r.tagAr : r.tagEn}
                        </span>
                      </div>
                      <p className="font-arabic text-[#F5ECD7] text-sm font-medium leading-snug">
                        {isAr ? r.titleAr : r.titleEn}
                      </p>
                      <p className="font-arabic text-[#C19A6B]/50 text-xs mt-1 line-clamp-2">
                        {isAr ? r.lesson.ar : r.lesson.en}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Prev / Next navigation ── */}
          <div className="flex items-center justify-between pb-8">
            <button onClick={goPrev}
              className="flex items-center gap-2 btn-ghost px-4 py-2.5 rounded-xl font-arabic text-sm">
              <span>{isAr ? '→' : '←'}</span>
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {STORIES.map((s, i) => (
                <button key={s.id} onClick={() => openStory(s.id)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === storyIdx ? 18 : 8,
                    height: 8,
                    background: i === storyIdx ? color : `${color}28`,
                  }} />
              ))}
            </div>

            <button onClick={goNext}
              className="flex items-center gap-2 btn-ghost px-4 py-2.5 rounded-xl font-arabic text-sm">
              <span>{isAr ? 'التالي' : 'Next'}</span>
              <span>{isAr ? '←' : '→'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
