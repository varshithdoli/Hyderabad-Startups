import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative text-center max-w-md">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter">
            <span className="text-gradient">4</span>
            <span className="text-white/10">0</span>
            <span className="text-gradient">4</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Maybe try exploring our startup directory instead?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <Home className="w-4 h-4" /> Go home
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-sm text-white/60 hover:text-white transition-all"
          >
            <Search className="w-4 h-4" /> Explore startups
          </Link>
        </div>
      </div>
    </div>
  );
}
