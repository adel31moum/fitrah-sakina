'use client';

import React, { useState, useEffect } from 'react';
import { useFitrahStore } from '@/store/fitrahStore';
import { toast } from 'sonner';

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id:'u1', name:'أبو عمر السلفي', role:'groom', country:'🇩🇿 الجزائر', status:'active', pledge:true, wali:'verified', joined:'2026-08-01', subscription:'premium' },
  { id:'u2', name:'أم صالح', role:'bride', country:'🇫🇷 فرنسا', status:'active', pledge:true, wali:'assigned', joined:'2026-08-02', subscription:'free' },
  { id:'u3', name:'عبدالرحمن الولي', role:'wali', country:'🇬🇧 بريطانيا', status:'active', pledge:true, wali:'none', joined:'2026-08-03', subscription:'free' },
  { id:'u4', name:'Abdullahi Yusuf', role:'groom', country:'🇸🇴 الصومال', status:'suspended', pledge:true, wali:'none', joined:'2026-08-04', subscription:'premium' },
  { id:'u5', name:'Fatima An-Noor', role:'bride', country:'🇩🇪 ألمانيا', status:'pending', pledge:false, wali:'none', joined:'2026-08-05', subscription:'free' },
  { id:'u6', name:'أبو بكر الأثري', role:'groom', country:'🇸🇦 السعودية', status:'active', pledge:true, wali:'verified', joined:'2026-08-05', subscription:'premium' },
  { id:'u7', name:'أم عبدالله', role:'bride', country:'🇲🇦 المغرب', status:'active', pledge:true, wali:'pending_assignment', joined:'2026-08-06', subscription:'free' },
];

const MOCK_WALI_REQUESTS = [
  { id:'w1', applicant:'أم صالح', country:'🇫🇷 فرنسا', requestedAt:'2026-08-02 14:30', centre:'Islamic Sharia Council – London', status:'pending', notes:'تطلب وليّاً بديلاً بعد وفاة الأب' },
  { id:'w2', applicant:'Fatima An-Noor', country:'🇩🇪 ألمانيا', requestedAt:'2026-08-05 09:15', centre:'ZMD – Berlin', status:'review', notes:'تحتاج تحقق من الهوية' },
  { id:'w3', applicant:'أم عبدالله', country:'🇲🇦 المغرب', requestedAt:'2026-08-06 11:00', centre:'UICM – Casablanca', status:'approved', notes:'تم التحقق والتعيين' },
];

const MOCK_MATCHES = [
  { id:'m1', groom:'أبو عمر السلفي', bride:'أم عبدالله', score:94, country:'🌍 عابر حدود', hijrah:true, status:'pending_wali', createdAt:'2026-08-07' },
  { id:'m2', groom:'أبو بكر الأثري', bride:'أم صالح', score:88, country:'🌍 عابر حدود', hijrah:false, status:'under_review', createdAt:'2026-08-07' },
];

const MOCK_FUND = [
  { id:'f1', beneficiary:'سعد الجزائري', goal:600, raised:480, daysLeft:5, status:'active', donors:18 },
  { id:'f2', beneficiary:'Bilal Lyon', goal:900, raised:900, daysLeft:0, status:'funded', donors:24 },
  { id:'f3', beneficiary:'Omar Hamburg', goal:750, raised:210, daysLeft:12, status:'active', donors:7 },
];

const MOCK_AUDIT = [
  { id:'a1', time:'2026-08-07 23:55', admin:'مشرف-1', action:'تعليق حساب', target:'Abdullahi Yusuf', reason:'مخالفة ضوابط المنهج' },
  { id:'a2', time:'2026-08-07 22:10', admin:'مشرف-2', action:'تعيين ولي', target:'أم صالح', reason:'طلب موثق من ISC London' },
  { id:'a3', time:'2026-08-07 21:30', admin:'مشرف-1', action:'الموافقة على تطابق', target:'م1', reason:'التحقق من المعايير يدويًا' },
  { id:'a4', time:'2026-08-07 20:00', admin:'نظام آلي', action:'تطابق آلي', target:'م2', reason:'خوارزمية: score=88' },
  { id:'a5', time:'2026-08-07 18:40', admin:'مشرف-2', action:'صرف دعم', target:'Bilal Lyon', reason:'اكتمل تمويل القضية f2' },
  { id:'a6', time:'2026-08-07 17:20', admin:'مشرف-1', action:'مراجعة طلب ولي', target:'Fatima An-Noor', reason:'التحقق من الوثائق' },
];

type Tab = 'overview' | 'users' | 'wali' | 'matches' | 'fund' | 'audit';

const STAT_CARDS = [
  { label:'إجمالي المستخدمين', value:'7', icon:'👥', color:'#D4AF37' },
  { label:'طلبات الولي المعلقة', value:'2', icon:'🛡', color:'#C19A6B' },
  { label:'التطابقات النشطة', value:'2', icon:'💍', color:'#7EC8A4' },
  { label:'صندوق المعسرين ($)', value:'$2,250', icon:'💰', color:'#D4AF37' },
];

export function AdminDashboard() {
  const { locale } = useFitrahStore();
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState(MOCK_USERS);
  const [auditLog, setAuditLog] = useState(MOCK_AUDIT);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  // Admin key guard (demo: pin = 786)
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');

  function addAudit(action: string, target: string, reason: string) {
    setAuditLog(prev => [{
      id: 'a' + Date.now(),
      time: new Date().toLocaleString('ar-SA'),
      admin: 'مشرف-1',
      action,
      target,
      reason,
    }, ...prev]);
  }

  function handleSuspend(uid: string) {
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u));
    const user = users.find(u => u.id === uid);
    addAudit(user?.status === 'suspended' ? 'رفع التعليق' : 'تعليق حساب', user?.name ?? uid, 'قرار إداري');
    toast.success(isAr ? 'تم تحديث حالة الحساب' : 'Account status updated');
  }

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    if (searchQ && !u.name.toLowerCase().includes(searchQ.toLowerCase()) && !u.country.includes(searchQ)) return false;
    return true;
  });

  if (!unlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="font-arabic text-[#D4AF37] text-2xl mb-1">لوحة المسؤولين</h2>
          <p className="font-arabic text-[#C19A6B]/70 text-sm">أدخل رمز الوصول الإداري</p>
        </div>
        <div className="glass-panel p-6 w-full max-w-xs">
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pin === '786' ? setUnlocked(true) : toast.error('رمز خاطئ'))}
            placeholder="رمز الوصول"
            maxLength={6}
            className="w-full bg-transparent border border-[#D4AF37]/30 text-[#F5ECD7] text-center text-xl tracking-widest rounded-lg py-3 outline-none focus:border-[#D4AF37] mb-4"
          />
          <button
            onClick={() => pin === '786' ? setUnlocked(true) : toast.error('رمز خاطئ — استخدم: 786')}
            className="w-full btn-gold py-2.5 rounded-xl font-arabic font-bold"
          >
            دخول
          </button>
          <p className="font-arabic text-[#C19A6B]/40 text-[10px] text-center mt-3">رمز العرض التجريبي: 786</p>
        </div>
      </div>
    );
  }

  const TABS: { key: Tab; icon: string; label: string }[] = [
    { key:'overview', icon:'📊', label: isAr ? 'نظرة عامة' : 'Overview' },
    { key:'users',    icon:'👥', label: isAr ? 'المستخدمون' : 'Users' },
    { key:'wali',     icon:'🛡', label: isAr ? 'طلبات الولي' : 'Wali' },
    { key:'matches',  icon:'💍', label: isAr ? 'التطابقات' : 'Matches' },
    { key:'fund',     icon:'💰', label: isAr ? 'صندوق المعسرين' : 'Fund' },
    { key:'audit',    icon:'📋', label: isAr ? 'سجل التدقيق' : 'Audit Log' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </div>
            <h1 className="font-arabic text-[#D4AF37] text-2xl font-bold">لوحة المسؤولين</h1>
          </div>
          <p className="font-arabic text-[#C19A6B]/60 text-xs">
            فطرة وسكينة — إدارة كاملة للمنصة • مسؤول-1
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-sharia">مباشر</span>
          <button
            onClick={() => setUnlocked(false)}
            className="px-3 py-1.5 rounded-lg text-xs border border-red-800/40 text-red-400/70 hover:text-red-400 hover:border-red-800 transition-all font-arabic"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1.5 pb-3 mb-6 scrollbar-none">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all font-arabic ${
              tab === t.key
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35'
                : 'text-[#C19A6B] border border-[#D4AF37]/12 hover:border-[#D4AF37]/30 hover:text-[#F5ECD7]'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((s, i) => (
              <div key={i} className="glass-panel p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-arabic font-black text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="font-arabic text-[#C19A6B]/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="glass-panel p-5">
            <h3 className="font-arabic text-[#D4AF37] font-bold mb-4 flex items-center gap-2">
              <span>📋</span> آخر الأنشطة
            </h3>
            <div className="space-y-2">
              {auditLog.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-start gap-3 py-2 border-b border-[#D4AF37]/08">
                  <span className="font-mono text-[#C19A6B]/40 text-[10px] whitespace-nowrap mt-0.5">{a.time}</span>
                  <span className="badge-sharia shrink-0">{a.admin}</span>
                  <span className="font-arabic text-[#F5ECD7]/80 text-xs flex-1">{a.action} — <span className="text-[#C19A6B]">{a.target}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats charts */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="glass-panel p-5">
              <h4 className="font-arabic text-[#D4AF37] text-sm font-bold mb-4">توزيع الأدوار</h4>
              {[{label:'العرسان 🤵', val:3, pct:43},  {label:'العرائس 🌸', val:3, pct:43}, {label:'الأولياء 🛡', val:1, pct:14}].map(r => (
                <div key={r.label} className="mb-3">
                  <div className="flex justify-between font-arabic text-xs mb-1">
                    <span className="text-[#F5ECD7]/80">{r.label}</span>
                    <span className="text-[#D4AF37]">{r.val} ({r.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#D4AF37]/10">
                    <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-panel p-5">
              <h4 className="font-arabic text-[#D4AF37] text-sm font-bold mb-4">حالة الاشتراكات</h4>
              {[{label:'مجاني', val:4, pct:57, color:'#C19A6B'}, {label:'بريميوم', val:3, pct:43, color:'#D4AF37'}].map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between font-arabic text-xs mb-1">
                    <span className="text-[#F5ECD7]/80">{s.label}</span>
                    <span style={{ color: s.color }}>{s.val} ({s.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#D4AF37]/10">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ USERS ═══ */}
      {tab === 'users' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={isAr ? 'بحث باسم أو دولة…' : 'Search…'}
              className="bg-transparent border border-[#D4AF37]/25 text-[#F5ECD7] text-xs rounded-lg px-3 py-2 font-arabic placeholder-[#C19A6B]/50 outline-none focus:border-[#D4AF37] flex-1 min-w-[160px]"
            />
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
              className="bg-[#1A1410] border border-[#D4AF37]/25 text-[#C19A6B] text-xs rounded-lg px-3 py-2 font-arabic outline-none">
              <option value="all">الكل</option>
              <option value="groom">عريس</option>
              <option value="bride">عروس</option>
              <option value="wali">ولي</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-[#1A1410] border border-[#D4AF37]/25 text-[#C19A6B] text-xs rounded-lg px-3 py-2 font-arabic outline-none">
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">موقوف</option>
              <option value="pending">معلق</option>
            </select>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-arabic">
                <thead>
                  <tr className="border-b border-[#D4AF37]/15">
                    {['الاسم','الدور','الدولة','العهد','الولي','الاشتراك','الحالة','إجراء'].map(h => (
                      <th key={h} className="text-right text-[#D4AF37]/70 font-semibold py-3 px-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-[#D4AF37]/06 hover:bg-[#D4AF37]/04 transition-colors">
                      <td className="py-3 px-4 text-[#F5ECD7]/90 font-medium whitespace-nowrap">{u.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          u.role==='groom' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' :
                          u.role==='bride' ? 'bg-pink-900/30 text-pink-300' :
                          'bg-[#2E5A44]/30 text-[#7EC8A4]'
                        }`}>
                          {u.role==='groom'?'عريس':u.role==='bride'?'عروس':'ولي'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#C19A6B] whitespace-nowrap">{u.country}</td>
                      <td className="py-3 px-4">{u.pledge ? '✅' : '❌'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] ${
                          u.wali==='verified'?'text-[#7EC8A4]':
                          u.wali==='assigned'?'text-[#D4AF37]':
                          u.wali==='pending_assignment'?'text-yellow-400':
                          'text-[#C19A6B]/50'
                        }`}>
                          {u.wali==='verified'?'موثق':u.wali==='assigned'?'معين':u.wali==='pending_assignment'?'انتظار':'لا'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] ${u.subscription==='premium'?'text-[#D4AF37]':'text-[#C19A6B]/60'}`}>
                          {u.subscription==='premium'?'⭐ بريميوم':'مجاني'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          u.status==='active'?'bg-green-900/30 text-green-400':
                          u.status==='suspended'?'bg-red-900/30 text-red-400':
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {u.status==='active'?'نشط':u.status==='suspended'?'موقوف':'معلق'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleSuspend(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${
                            u.status==='suspended'
                              ? 'border-green-800/50 text-green-400/70 hover:text-green-400 hover:border-green-800'
                              : 'border-red-800/40 text-red-400/70 hover:text-red-400 hover:border-red-800'
                          }`}>
                          {u.status==='suspended'?'رفع التعليق':'إيقاف'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-[#D4AF37]/10 font-arabic text-[#C19A6B]/50 text-[10px]">
              {filteredUsers.length} مستخدم من أصل {users.length}
            </div>
          </div>
        </div>
      )}

      {/* ═══ WALI REQUESTS ═══ */}
      {tab === 'wali' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#C19A6B]/15 border border-[#C19A6B]/30 flex items-center justify-center">
              <span>🛡</span>
            </div>
            <div>
              <h3 className="font-arabic text-[#D4AF37] font-bold text-sm">طلبات تعيين الولي</h3>
              <p className="font-arabic text-[#C19A6B]/60 text-[10px]">للأخوات اللواتي لا ولي لهن — تنسيق مع المراكز الإسلامية</p>
            </div>
          </div>
          {MOCK_WALI_REQUESTS.map(w => (
            <div key={w.id} className="glass-panel p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-arabic text-[#F5ECD7] font-semibold">{w.applicant}</span>
                    <span className="text-xs">{w.country}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      w.status==='approved'?'bg-green-900/30 text-green-400':
                      w.status==='review'?'bg-yellow-900/30 text-yellow-400':
                      'bg-[#D4AF37]/15 text-[#D4AF37]'
                    }`}>
                      {w.status==='approved'?'موافق':w.status==='review'?'قيد المراجعة':'جديد'}
                    </span>
                  </div>
                  <p className="font-arabic text-[#C19A6B]/80 text-xs mb-1">📍 {w.centre}</p>
                  <p className="font-arabic text-[#C19A6B]/60 text-[10px]">{w.notes}</p>
                  <p className="font-arabic text-[#C19A6B]/40 text-[10px] mt-1">🕐 {w.requestedAt}</p>
                </div>
                {w.status !== 'approved' && (
                  <div className="flex gap-2">
                    <button onClick={() => {
                      addAudit('موافقة على طلب ولي', w.applicant, 'مراجعة إدارية');
                      toast.success('تم الموافقة على الطلب');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] bg-green-900/30 text-green-400 border border-green-800/40 hover:bg-green-900/50 transition-all font-arabic">
                      موافقة
                    </button>
                    <button onClick={() => {
                      addAudit('رفض طلب ولي', w.applicant, 'عدم استيفاء الشروط');
                      toast.error('تم رفض الطلب');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] bg-red-900/30 text-red-400 border border-red-800/40 hover:bg-red-900/50 transition-all font-arabic">
                      رفض
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ MATCHES ═══ */}
      {tab === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#7EC8A4]/15 border border-[#7EC8A4]/30 flex items-center justify-center">
              <span>💍</span>
            </div>
            <div>
              <h3 className="font-arabic text-[#D4AF37] font-bold text-sm">التطابقات النشطة</h3>
              <p className="font-arabic text-[#C19A6B]/60 text-[10px]">نتائج الخوارزمية الفورية — تحتاج موافقة إدارية</p>
            </div>
          </div>
          {MOCK_MATCHES.map(m => (
            <div key={m.id} className="glass-panel p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg">🤵</div>
                    <div className="font-arabic text-[#F5ECD7]/90 text-xs font-medium">{m.groom}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-arabic text-[#D4AF37] text-2xl font-black">{m.score}%</div>
                    <div className="font-arabic text-[#C19A6B]/60 text-[10px]">تطابق</div>
                    <div className="h-1 w-16 rounded-full bg-[#D4AF37]/20 mt-1">
                      <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">🌸</div>
                    <div className="font-arabic text-[#F5ECD7]/90 text-xs font-medium">{m.bride}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {m.hijrah && <span className="badge-sharia text-[9px]">هجرة</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-arabic ${
                      m.status==='pending_wali'?'bg-[#D4AF37]/15 text-[#D4AF37]':'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {m.status==='pending_wali'?'انتظار الولي':'قيد المراجعة'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      addAudit('الموافقة على تطابق', `${m.groom} × ${m.bride}`, `score=${m.score}`);
                      toast.success('بارك الله لهما');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 transition-all font-arabic">
                      موافقة
                    </button>
                    <button onClick={() => {
                      addAudit('إيقاف تطابق', `${m.groom} × ${m.bride}`, 'مراجعة إدارية');
                      toast.error('تم إيقاف التطابق');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] bg-red-900/20 text-red-400/70 border border-red-800/30 hover:bg-red-900/40 transition-all font-arabic">
                      إيقاف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ FUND ═══ */}
      {tab === 'fund' && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <span>💰</span>
            </div>
            <div>
              <h3 className="font-arabic text-[#D4AF37] font-bold text-sm">صندوق دعم المعسرين</h3>
              <p className="font-arabic text-[#C19A6B]/60 text-[10px]">إدارة القضايا النشطة والمكتملة</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { label:'إجمالي المجموع', val:'$2,250', color:'#D4AF37', icon:'💵' },
              { label:'قضايا نشطة', val:'2', color:'#7EC8A4', icon:'⏳' },
              { label:'قضايا ممولة', val:'1', color:'#C19A6B', icon:'✅' },
            ].map(s => (
              <div key={s.label} className="glass-panel-light p-4 text-center rounded-xl">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-arabic font-black text-xl mb-0.5" style={{ color: s.color }}>{s.val}</div>
                <div className="font-arabic text-[#C19A6B]/60 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {MOCK_FUND.map(f => (
              <div key={f.id} className="glass-panel p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <span className="font-arabic text-[#F5ECD7] font-semibold">{f.beneficiary}</span>
                    <span className={`mr-2 px-2 py-0.5 rounded-full text-[10px] ${
                      f.status==='funded'?'bg-green-900/30 text-green-400':'bg-[#D4AF37]/15 text-[#D4AF37]'
                    } font-arabic`}>
                      {f.status==='funded'?'ممول':'نشط'}
                    </span>
                  </div>
                  <div className="font-arabic text-[#C19A6B]/60 text-xs">
                    {f.donors} متبرع · {f.daysLeft > 0 ? `${f.daysLeft} يوم` : 'انتهت المدة'}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-[#D4AF37]/12">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C19A6B]"
                      style={{ width: `${Math.min(100,(f.raised/f.goal)*100)}%` }} />
                  </div>
                  <span className="font-arabic text-[#D4AF37] text-xs font-bold whitespace-nowrap">
                    ${f.raised} / ${f.goal}
                  </span>
                </div>
                {f.status === 'active' && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => {
                      addAudit('صرف دعم', f.beneficiary, 'اكتمال التمويل');
                      toast.success('تم صرف الدعم بنجاح');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] btn-gold font-arabic">
                      صرف الدعم
                    </button>
                    <button onClick={() => {
                      addAudit('إغلاق قضية', f.beneficiary, 'قرار إداري');
                      toast.info('تم إغلاق القضية');
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] btn-ghost font-arabic">
                      إغلاق
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ AUDIT LOG ═══ */}
      {tab === 'audit' && (
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C19A6B]/15 border border-[#C19A6B]/30 flex items-center justify-center">
                <span>📋</span>
              </div>
              <div>
                <h3 className="font-arabic text-[#D4AF37] font-bold text-sm">سجل التدقيق</h3>
                <p className="font-arabic text-[#C19A6B]/60 text-[10px]">كل الإجراءات الإدارية — غير قابل للتعديل</p>
              </div>
            </div>
            <span className="badge-sharia font-arabic text-[10px]">{auditLog.length} سجل</span>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-arabic">
                <thead>
                  <tr className="border-b border-[#D4AF37]/15">
                    {['الوقت','المسؤول','الإجراء','الهدف','السبب'].map(h => (
                      <th key={h} className="text-right text-[#D4AF37]/70 font-semibold py-3 px-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map(a => (
                    <tr key={a.id} className="border-b border-[#D4AF37]/06 hover:bg-[#D4AF37]/03 transition-colors">
                      <td className="py-3 px-4 text-[#C19A6B]/50 whitespace-nowrap font-mono text-[10px]">{a.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          a.admin==='نظام آلي'?'bg-[#7EC8A4]/15 text-[#7EC8A4]':'bg-[#D4AF37]/12 text-[#D4AF37]'
                        }`}>{a.admin}</span>
                      </td>
                      <td className="py-3 px-4 text-[#F5ECD7]/80 whitespace-nowrap">{a.action}</td>
                      <td className="py-3 px-4 text-[#C19A6B]">{a.target}</td>
                      <td className="py-3 px-4 text-[#C19A6B]/60">{a.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
