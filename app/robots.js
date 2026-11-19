import { site } from '../lib/seo';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
