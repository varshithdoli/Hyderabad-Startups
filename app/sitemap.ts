import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://startuphyd.com';

  // Static routes
  const staticRoutes = [
    '',
    '/explore',
    '/dashboard',
    '/jobs',
    '/city-guide',
    '/submit-startup',
    '/compare',
    '/investors',
    '/news',
    '/login',
    '/signup',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return staticRoutes;
}
