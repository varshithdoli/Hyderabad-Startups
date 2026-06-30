<<<<<<< HEAD
'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-sm text-white/50 mb-2">
          An unexpected error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="text-xs text-white/20 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-sm text-white/60 hover:text-white transition-all"
          >
            <Home className="w-4 h-4" /> Go home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:18dd218283adf4fb5826f320b6f618b80ad5834e5f2821d7e5433ae8be112e8f
size 2006
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
