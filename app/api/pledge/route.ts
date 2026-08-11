import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { oath1, oath2, oath3, sessionId } = body;

    if (!oath1 || !oath2 || !oath3) {
      return NextResponse.json({ error: 'All oaths required' }, { status: 400 });
    }

    // In production: store pledge record in DB with timestamp and session
    // Audit log: sessionId, timestamp, IP hash (not raw IP)
    const record = {
      sessionId,
      acceptedAt: new Date().toISOString(),
      oath1: true,
      oath2: true,
      oath3: true,
      platform: 'fitrah-sakina',
    };

    // Mock notification dispatch (would trigger SMS/email to Wali in production)
    console.log('[PLEDGE] Covenant accepted:', record);

    return NextResponse.json({
      success: true,
      message: 'Pledge recorded — JazakAllah Khayr',
      record,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
