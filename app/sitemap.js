import { site } from '../lib/seo';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return [{ url: `${site.url}/` }];
}
