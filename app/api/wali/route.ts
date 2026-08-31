import { NextRequest, NextResponse } from 'next/server';

// Mock Wali centre database (production: query actual registry)
const WALI_CENTRES = [
  { id: 'isc-uk', country: 'GB', centre: 'Islamic Sharia Council (ISC)', city: 'London', verified: true },
  { id: 'fcna-us', country: 'US', centre: 'Fiqh Council of North America', city: 'Washington', verified: true },
  { id: 'cfcm-fr', country: 'FR', centre: 'Conseil Français du Culte Musulman', city: 'Paris', verified: true },
  { id: 'zmd-de', country: 'DE', centre: 'Zentralrat der Muslime in Deutschland', city: 'Cologne', verified: true },
  { id: 'anic-au', country: 'AU', centre: 'Australian National Imams Council', city: 'Melbourne', verified: true },
  { id: 'mui-id', country: 'ID', centre: 'Majelis Ulama Indonesia (MUI)', city: 'Jakarta', verified: true },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country') || '';

  const results = country
    ? WALI_CENTRES.filter(c => c.country === country.toUpperCase())
    : WALI_CENTRES;

  return NextResponse.json({ centres: results });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { waliPhone, centreId, sessionId } = body;

    if (!waliPhone || !centreId) {
      return NextResponse.json({ error: 'Wali phone and centre ID required' }, { status: 400 });
    }

    // Mock OTP dispatch
    const mockOtp = '1234'; // Production: generate random 6-digit, send via SMS gateway
    console.log(`[WALI-OTP] Sending OTP ${mockOtp} to ${waliPhone} for session ${sessionId}`);

    // Mock audit log
    console.log('[WALI] Assignment request:', { centreId, sessionId, timestamp: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      message: 'OTP dispatched to Wali contact',
      // In production: do NOT return OTP in response
      demo_hint: 'Use 1234 for demo verification',
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
