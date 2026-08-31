import { NextRequest, NextResponse } from 'next/server';

// ── In-memory store (replaces DB in demo — swap with real DB in production) ──
// Exported so the GET route can read it
export const REGISTRATIONS: Registration[] = [];

export interface Registration {
  id: string;
  role: 'youth' | 'wali';
  name: string;
  age: number;
  country: string;
  whatsapp: string;
  plan: 'free' | 'premium';
  registeredAt: string;
  sessionId: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// Phone/URL sanitiser — strip raw numbers, social handles, URLs
function sanitise(str: string): string {
  return str
    .replace(/\b\d[\d\s\-\+\(\)]{8,}\d\b/g, '[***]') // phone numbers
    .replace(/[@#][A-Za-z0-9_]{2,}/g, '[***]')        // social handles
    .replace(/https?:\/\/[^\s]+/gi, '[***]')           // URLs
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, age, country, whatsapp, plan, sessionId } = body;

    // Validation
    if (!role || !name || !age || !country || !whatsapp) {
      return NextResponse.json({ error: 'all_required' }, { status: 400 });
    }
    if (!['youth', 'wali'].includes(role)) {
      return NextResponse.json({ error: 'invalid_role' }, { status: 400 });
    }
    if (age < 18 || age > 70) {
      return NextResponse.json({ error: 'invalid_age' }, { status: 400 });
    }

    // Build record
    const record: Registration = {
      id: generateId(),
      role,
      name: sanitise(name),
      age: Number(age),
      country: sanitise(country),
      whatsapp: sanitise(whatsapp),
      plan: plan === 'premium' ? 'premium' : 'free',
      registeredAt: new Date().toISOString(),
      sessionId: sessionId ?? 'anonymous',
    };

    // Store (in-memory; in production: INSERT INTO registrations)
    REGISTRATIONS.push(record);

    // ── Email notification (mock — production: use Resend / Nodemailer) ──
    // In production: send to platform@fitrah-sakina.com
    const emailPayload = {
      to: 'fitrah.sakina.platform@gmail.com',
      subject: `[فطرة وسكينة] تسجيل جديد — ${record.name} (${record.id})`,
      text: `
تسجيل جديد على منصة فطرة وسكينة
━━━━━━━━━━━━━━━━━━━━━━━
المعرف:     ${record.id}
الصفة:      ${record.role === 'youth' ? 'شاب / عريس' : 'ولي أمر'}
الاسم:      ${record.name}
العمر:      ${record.age}
البلد:      ${record.country}
الواتساب:  ${record.whatsapp}
الخطة:     ${record.plan === 'premium' ? 'بريميوم' : 'تجريبية مجانية (أسبوع)'}
الوقت:     ${new Date(record.registeredAt).toLocaleString('ar-SA')}
━━━━━━━━━━━━━━━━━━━━━━━
بارك الله في الجميع
      `.trim(),
    };
    // Mock: log to console (replace with real email in production)
    console.log('[REGISTER] New registration:', emailPayload);

    return NextResponse.json({
      success: true,
      id: record.id,
      plan: record.plan,
      message: record.plan === 'premium'
        ? 'تم التسجيل — انتظر التواصل خلال ٢٤ ساعة بإذن الله'
        : 'تم تفعيل التجربة المجانية لمدة أسبوع — بارك الله فيك',
    });

  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

// GET — admin listing (protected by PIN in real production)
export async function GET() {
  return NextResponse.json({
    success: true,
    count: REGISTRATIONS.length,
    data: REGISTRATIONS.map(r => ({ ...r, whatsapp: r.whatsapp.slice(0,4) + '****' })),
  });
}
