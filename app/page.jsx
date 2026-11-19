import Portfolio from '../components/Portfolio';
import { portfolioSchema, site } from '../lib/seo';

export const metadata = {
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${site.url}/`,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: site.image, width: 1200, height: 630, alt: 'Chirag Chavda (Chiragcs) — Full Stack Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: [site.image],
  },
};

export default function Page() {
  return (
    <>
      <script
        id="portfolio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema).replace(/</g, '\\u003c') }}
      />
      <Portfolio />
    </>
  );
}
