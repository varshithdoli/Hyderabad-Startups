'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { startups as staticStartups } from '@/data/startups';
import { getStartups } from '@/lib/firestore-service';
import type { Startup } from '@/data/startups';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { User, LogOut, Sparkles, TrendingUp, Building2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout, savedStartups } = useAuth();
  const [startups, setStartups] = useState<Startup[]>(staticStartups);

  useEffect(() => {
    getStartups().then(s => { if (s.length > 0) setStartups(s); });
  }, []);

  if (!loading && !user) redirect('/login');
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  const saved = startups.filter(s => savedStartups.includes(s.id));

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.displayName || 'User'}</h1>
                <p className="text-sm text-white/40">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-400" />Saved Startups ({saved.length})</h2>
            {saved.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-sm text-white/40">No saved startups yet</p>
                <Link href="/explore" className="inline-block mt-4 px-4 py-2 rounded-lg text-sm text-violet-400 hover:bg-violet-500/10 transition-all">Explore startups</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {saved.map(s => (
                  <Link key={s.id} href={`/startup/${s.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <span className="text-2xl">{s.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{s.name}</div>
                      <div className="text-[10px] text-white/40">{s.sector}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-white">{s.funding}</div>
                      <div className="text-[10px] text-white/30">{s.stage}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
