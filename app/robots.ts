<<<<<<< HEAD
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/my-applications/'],
    },
    sitemap: 'https://startuphyd.com/sitemap.xml',
  };
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:8b2f578b532aa28a9162f52b5773880e6ebcbeef4ad4cbdd7dc593117cd088ea
size 284
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
