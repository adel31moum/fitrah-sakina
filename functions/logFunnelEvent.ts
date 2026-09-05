import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ALLOWED = ['start', 'skip', 'gateway', 'path_a', 'path_b', 'path_c', 'dawah_open', 'dawah_done', 'dawah_register', 'form_open', 'form_submit'];

Deno.serve(async (req) => {
  const cors: Record<string, string> = {
    'Access-Control-Allow-Origin': 'https://fitrah-sakina.vercel.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'POST only' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json();
    const eventType = String(body.eventType || '');
    if (!ALLOWED.includes(eventType)) {
      return new Response(JSON.stringify({ ok: false, error: 'bad eventType' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const data = {
      eventType,
      path: String(body.path || 'na').slice(0, 10),
      lang: ['ar', 'fr', 'en', 'es'].includes(body.lang) ? body.lang : 'ar',
      sessionId: String(body.sessionId || '').slice(0, 40),
    };
    const base44 = createClientFromRequest(req);
    await base44.entities.FunnelEvent.create(data);
    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
