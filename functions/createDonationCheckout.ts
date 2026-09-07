// Smart donation checkout — creates a Stripe Checkout Session and returns the URL.
// Called from https://fitrah-sakina.vercel.app (CORS-limited, anonymous).
import Stripe from 'npm:stripe@17.7.0';

const ORIGIN = 'https://fitrah-sakina.vercel.app';

Deno.serve(async (req) => {
  const cors: Record<string, string> = {
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'POST only' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) {
    return new Response(JSON.stringify({ ok: false, error: 'stripe_not_configured' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const euros = Math.round(Number(body.amount));
    if (!Number.isFinite(euros) || euros < 1 || euros > 5000) {
      return new Response(JSON.stringify({ ok: false, error: 'bad_amount' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const stripe = new Stripe(key, { apiVersion: '2025-08-27.basil' });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: euros * 100,
            product_data: {
              name: 'مساهمة — إعانة المسلمين على الزواج (فطرة وسكينة)',
              description: 'Contribution — Fitra wa Sakina marriage fund',
            },
          },
        },
      ],
      success_url: ORIGIN + '/?donation=success',
      cancel_url: ORIGIN + '/?donation=cancel',
      billing_address_collection: 'auto',
    });
    return new Response(JSON.stringify({ ok: true, url: session.url }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
