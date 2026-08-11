import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { AgentationGuard } from '@/components/AgentationGuard';
import { HappySeedsWatermark } from '@/components/HappySeedsWatermark';
import { Toaster } from 'sonner';
import './globals.css';

const SITE_URL = 'https://fitrah-sakina.happyseeds.ai';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'فطرة وسكينة — منصة الزواج الشرعي على المنهج',
  description:
    'بدون تواصل مباشر · بدون صور · تحت إشراف الولي · وفق منهج السلف الصالح — منصة إسلامية عالمية للزواج الشرعي الحقيقي',
  keywords: [
    'زواج إسلامي', 'نكاح', 'فطرة وسكينة', 'منهج سلفي', 'ولي', 'مهر',
    'Islamic marriage', 'nikah', 'Wali', 'Salafi', 'Fitrah Sakina',
    'زواج على السنة', 'زواج سلفي', 'تعارف إسلامي',
  ],
  authors: [{ name: 'البحار الغريب', url: SITE_URL }],
  creator: 'فطرة وسكينة',
  publisher: 'فطرة وسكينة',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },

  // ── Open Graph ──────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'فطرة وسكينة',
    locale: 'ar_AR',
    alternateLocale: ['en_US', 'fr_FR', 'de_DE', 'tr_TR', 'id_ID', 'ru_RU', 'ur_PK', 'es_ES'],
    title: 'فطرة وسكينة — منصة الزواج الشرعي على المنهج',
    description:
      'بدون تواصل مباشر · بدون صور · تحت إشراف الولي · وفق منهج السلف الصالح',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'فطرة وسكينة — منصة الزواج الشرعي على المنهج السلفي',
        type: 'image/jpeg',
      },
    ],
  },

  // ── Twitter / X Card ───────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@FitrahSakina',
    creator: '@FitrahSakina',
    title: 'فطرة وسكينة — منصة الزواج الشرعي على المنهج',
    description: 'بدون تواصل مباشر · بدون صور · تحت إشراف الولي',
    images: [OG_IMAGE],
  },

  // ── Icons ──────────────────────────────────────────────────────────
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // ── Verification placeholders ──────────────────────────────────────
  verification: {
    google: 'fitrah-sakina-google-verify',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Preconnect fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Extra OG / Facebook Meta ── */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={SITE_URL} />
        <meta property="og:title"       content="فطرة وسكينة — منصة الزواج الشرعي على المنهج" />
        <meta property="og:description" content="بدون تواصل مباشر · بدون صور · تحت إشراف الولي · وفق منهج السلف الصالح" />
        <meta property="og:image"       content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height"content="630" />
        <meta property="og:locale"      content="ar_AR" />
        <meta property="og:site_name"   content="فطرة وسكينة" />

        {/* Facebook App ID placeholder */}
        <meta property="fb:app_id"      content="YOUR_FB_APP_ID" />

        {/* WhatsApp & Telegram preview */}
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:image"      content={OG_IMAGE} />
        <meta name="theme-color"        content="#D4AF37" />

        {/* Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            async
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body className="antialiased bg-desert min-h-dvh">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(20,16,8,0.92)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: '#F5ECD7',
            },
          }}
        />
        <HappySeedsWatermark />
        <AgentationGuard />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
