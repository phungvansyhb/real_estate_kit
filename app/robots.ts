import type { MetadataRoute } from 'next'

import { getBaseUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/vi/', '/en/'],
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
    host: getBaseUrl(),
  }
}
