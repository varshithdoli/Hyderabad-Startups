'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Animated logo */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 animate-pulse-glow" />
          <div className="absolute inset-[2px] rounded-[14px] bg-background flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-400 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/60">Loading</p>
          <p className="text-xs text-white/30 mt-1">Fetching ecosystem data...</p>
        </div>
        {/* Shimmer bar */}
        <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '50%' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
