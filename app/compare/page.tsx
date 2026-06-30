<<<<<<< HEAD
'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getStartups } from '@/lib/firestore-service';
import { startups as staticStartups } from '@/data/startups';
import { Footer } from '@/components/footer';
import type { Startup } from '@/data/startups';
import {
  ArrowLeft, Plus, X, Search, TrendingUp, Building2, Users,
  Calendar, Globe, DollarSign, BarChart3, Scale
} from 'lucide-react';
import VerificationBadge from '@/components/verification-badge';

export default function ComparePage() {
  const [allStartups, setAllStartups] = useState<Startup[]>(staticStartups);
  const [selected, setSelected] = useState<Startup[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getStartups().then(s => { if (s.length > 0) setAllStartups(s); });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return allStartups.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return allStartups
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [searchQuery, allStartups]);

  const addStartup = (s: Startup) => {
    if (selected.length >= 4) return;
    if (selected.find(x => x.id === s.id)) return;
    setSelected(prev => [...prev, s]);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const removeStartup = (id: string) => {
    setSelected(prev => prev.filter(s => s.id !== id));
  };

  const stageOrder: Record<string, number> = { 'Seed': 1, 'Pre-Series A': 2, 'Series A': 3, 'Series B': 4, 'Series C': 5, 'Growth': 6, 'Unicorn': 7 };

  const comparisonMetrics = selected.length >= 2 ? [
    { label: 'Founded', icon: Calendar, values: selected.map(s => String(s.founded || '—')) },
    { label: 'Stage', icon: BarChart3, values: selected.map(s => s.stage || '—') },
    { label: 'Funding', icon: DollarSign, values: selected.map(s => s.funding || '—') },
    { label: 'Employees', icon: Users, values: selected.map(s => s.employees || '—') },
    { label: 'Sector', icon: Building2, values: selected.map(s => s.sector || '—') },
    { label: 'Tags', icon: TrendingUp, values: selected.map(s => (s.tags || []).join(', ') || '—') },
    { label: 'Investors', icon: Scale, values: selected.map(s => (s.investors || []).join(', ') || '—') },
  ] : [];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <Link href="/explore" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to explore
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Compare <span className="text-gradient">Startups</span></h1>
              <p className="text-xs text-white/40">Select up to 4 startups to compare side by side</p>
            </div>
          </div>
        </motion.div>

        {/* Selected startups strip */}
        <div className="flex flex-wrap items-center gap-3 mt-8 mb-8">
          {selected.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-violet-500/20"
            >
              <span className="text-lg">{s.logo}</span>
              <span className="text-sm font-medium text-white">{s.name}</span>
              <button onClick={() => removeStartup(s.id)} className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {selected.length < 4 && (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-white/10 text-white/30 text-sm hover:border-violet-500/30 hover:text-violet-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add startup {selected.length === 0 ? '' : `(${selected.length}/4)`}
            </button>
          )}
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card rounded-2xl p-4 mb-8 border border-violet-500/20 max-w-md"
            >
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1 text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {searchResults.map(s => (
                  <button
                    key={s.id}
                    onClick={() => addStartup(s)}
                    disabled={selected.some(x => x.id === s.id)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg">{s.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-white/30">{s.sector} · {s.stage}</div>
                    </div>
                    {s.isUnicorn && <span className="text-xs">🦄</span>}
                    {selected.some(x => x.id === s.id) && <span className="text-[10px] text-violet-400">Added</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {selected.length < 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-12 text-center">
            <Scale className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white/60 mb-2">Select startups to compare</h3>
            <p className="text-xs text-white/30 max-w-sm mx-auto">
              Add at least 2 startups using the button above to see a side-by-side comparison of their metrics, funding, and team size.
            </p>
          </motion.div>
        )}

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header row with startup cards */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div /> {/* Empty header cell */}
              {selected.map(s => (
                <div key={s.id} className="glass-card rounded-2xl p-5 text-center group hover:scale-[1.02] transition-all">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.logo}</div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="text-sm font-bold text-white">{s.name}</h3>
                    <VerificationBadge verified={s.verified} level={s.verificationLevel} showLabel={false} />
                  </div>
                  <p className="text-[10px] text-white/30 line-clamp-2">{s.description}</p>
                  {s.isUnicorn && <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] bg-violet-500/15 text-violet-300">🦄 Unicorn</span>}
                  {s.isSoonicorn && <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] bg-amber-500/15 text-amber-300">⚡ Soonicorn</span>}
                  <Link href={`/startup/${s.id}`} className="block mt-3 text-[10px] text-violet-400 hover:text-violet-300 transition-colors">
                    View profile →
                  </Link>
                </div>
              ))}
            </div>

            {/* Metric rows */}
            <div className="glass-card rounded-2xl overflow-hidden">
              {comparisonMetrics.map((metric, i) => (
                <div
                  key={metric.label}
                  className={`grid items-center gap-4 px-5 py-4 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''} ${i < comparisonMetrics.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                  style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}
                >
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <metric.icon className="w-4 h-4 text-violet-400/50" />
                    <span className="font-medium">{metric.label}</span>
                  </div>
                  {metric.values.map((val, j) => (
                    <div key={j} className="text-sm text-white/70 font-medium">
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Website links */}
            <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Globe className="w-4 h-4 text-violet-400/50" />
                <span className="font-medium">Website</span>
              </div>
              {selected.map(s => (
                <div key={s.id}>
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors truncate block">
                      {s.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-xs text-white/20">—</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:247c16ac47779fadfd0786954eca4ff24f4f44d6d7340ebe716dd9fd86e32a71
size 11421
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
