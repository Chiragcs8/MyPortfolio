import localFont from "next/font/local";
import { profile } from "../lib/data";
import { site } from "../lib/seo";
import { themeScript } from "../lib/theme";
import "./globals.css";

const manrope = localFont({
  src: "../public/fonts/manrope-latin.woff2",
  variable: "--font-sans",
  weight: "400 800",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  variable: "--font-code",
  weight: "400 600",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  icons: { icon: { url: "/favicon.ico?v=2", type: "image/x-icon" } },
};

// Reset reloads before hydration; preserve section links on ordinary navigation.
const preScript = `
${themeScript}
try {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    scrollTo({ top: 0, left: 0, behavior: 'instant' });
    addEventListener('pageshow', () => scrollTo({ top: 0, left: 0, behavior: 'instant' }), { once: true });
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('swarm');
    window.__swarmFallback = setTimeout(() => document.documentElement.classList.remove('swarm'), 8000);
  }
} catch {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#f4f6fb" />
        <script dangerouslySetInnerHTML={{ __html: preScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
