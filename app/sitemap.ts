<<<<<<< HEAD
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
=======
version https://git-lfs.github.com/spec/v1
oid sha256:6c38657b0fa2b86d230b7d13d482c0caa26df10dd290051c124227d0b64442a8
size 554
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
