'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { startups as staticStartups, sectors, stages } from '@/data/startups';
import { getStartups } from '@/lib/firestore-service';
import type { Startup } from '@/data/startups';
import { Search, SlidersHorizontal, X, TrendingUp, Building2, Sparkles, Plus } from 'lucide-react';
import { Footer } from '@/components/footer';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';
import VerificationBadge from '@/components/verification-badge';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

function normalizeStartup(st: Startup): Startup {
  return {
    ...st,
    id: st.id || '',
    name: st.name || 'Unnamed',
    logo: st.logo || '🚀',
    sector: st.sector || 'Tech',
    description: st.description || '',
    longDescription: st.longDescription || st.description || '',
    funding: st.funding || 'Undisclosed',
    stage: st.stage || 'Seed',
    employees: st.employees || '10+',
    tags: Array.isArray(st.tags) ? st.tags : [],
    investors: Array.isArray(st.investors) ? st.investors : [],
  };
}

export default function ExplorePage() {
  const { user, savedStartups, toggleSaveStartup } = useAuth();
  const [startups, setStartups] = useState<Startup[]>(staticStartups.map(normalizeStartup));
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getStartups()
      .then(s => {
        const valid = s.filter(st => st && st.id);
        if (valid.length > 0) {
          setStartups(valid.map(normalizeStartup));
        }
      })
      .catch(() => {/* keep static */})
      .finally(() => setLoading(false));
  }, []);

  const allSectors = useMemo(() => {
    const set = new Set(sectors);
    startups.forEach(st => {
      if (st.sector) set.add(st.sector);
      st.tags.forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [startups]);

  const filtered = useMemo(() => {
    return startups.filter(s => {
      const q = query.toLowerCase();
      const matchQ = !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q));
      const matchSector = selectedSectors.length === 0 ||
        selectedSectors.some(sec =>
          s.sector.toLowerCase().includes(sec.toLowerCase()) ||
          s.tags.some(t => t.toLowerCase().includes(sec.toLowerCase()))
        );
      const matchStage = selectedStages.length === 0 || selectedStages.includes(s.stage);
      return matchQ && matchSector && matchStage;
    });
  }, [query, selectedSectors, selectedStages, startups]);

  const toggleSector = (s: string) => setSelectedSectors(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleStage = (s: string) => setSelectedStages(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const clearAll = () => { setSelectedSectors([]); setSelectedStages([]); setQuery(''); };
  const hasFilters = selectedSectors.length > 0 || selectedStages.length > 0 || !!query;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Explore</span> Startups
            </h1>
            <p className="text-white/40 text-sm">
              Discover {startups.length} of Hyderabad&apos;s most innovative companies
            </p>
          </div>
          {user && (
            <Link href="/submit-startup" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 border border-emerald-500/15 transition-all">
              <Plus className="w-4 h-4" /> Submit Startup
            </Link>
          )}
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="glass-card rounded-2xl p-2 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search startups, sectors, tags..."
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none py-3"
            />
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button onClick={clearAll} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Active Filters */}
        {hasFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-2 mb-4">
            {selectedSectors.map(s => (
              <Badge key={s} variant="secondary" className="cursor-pointer bg-violet-500/10 text-violet-300 border-violet-500/20 hover:bg-violet-500/20" onClick={() => toggleSector(s)}>
                {s} ×
              </Badge>
            ))}
            {selectedStages.map(s => (
              <Badge key={s} variant="secondary" className="cursor-pointer bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20" onClick={() => toggleStage(s)}>
                {s} ×
              </Badge>
            ))}
          </motion.div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: showFilters ? 260 : 0, opacity: showFilters ? 1 : 0 }}
            className="hidden md:block overflow-hidden shrink-0"
          >
            <div className="glass-card rounded-2xl p-5 sticky top-24 w-[260px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Sector</h3>
              <div className="space-y-1.5 mb-6">
                {sectors.map(s => (
                  <button key={s} onClick={() => toggleSector(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedSectors.includes(s)
                        ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Stage</h3>
              <div className="space-y-1.5">
                {stages.map(s => (
                  <button key={s} onClick={() => toggleStage(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedStages.includes(s)
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/30 mb-4">
              Showing <span className="text-white font-medium">{filtered.length}</span> of {startups.length} startups {hasFilters ? '(filtered)' : ''}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-white/5 mb-3" />
                    <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-white/5 rounded mb-3 w-full" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Startup grid */}
            {!loading && (
              <>
                <motion.div initial="hidden" animate="show" variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(s => (
                    <motion.div key={s.id} variants={fadeUp}>
                      <Link href={`/startup/${s.id}`} className="block glass-card rounded-2xl p-5 group hover:scale-[1.01] transition-all duration-300 h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-cyan-500/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-3xl">{s.logo}</span>
                            <div className="flex items-center gap-1">
                              {s.isUnicorn && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-violet-500/15 text-violet-300">🦄</span>
                              )}
                              {s.isSoonicorn && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-amber-500/15 text-amber-300">⚡</span>
                              )}
                              {user && (
                                <button
                                  onClick={e => { e.preventDefault(); toggleSaveStartup(s.id); }}
                                  className={`p-1.5 rounded-lg transition-all ${savedStartups.includes(s.id) ? 'text-violet-400 bg-violet-500/10' : 'text-white/20 hover:text-white/40'}`}
                                >
                                  <Sparkles className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="text-sm font-bold text-white">{s.name}</h3>
                            <VerificationBadge verified={s.verified} level={s.verificationLevel} showLabel={false} />
                          </div>
                          <p className="text-xs text-white/40 mb-3 line-clamp-2">{s.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-white/30">
                            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.funding}</span>
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{s.stage}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {s.tags.slice(0, 3).map(t => (
                              <span key={t} className="px-1.5 py-0.5 text-[9px] rounded-full bg-white/5 text-white/40">{t}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {filtered.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-bold text-white mb-2">No startups found</h3>
                    <p className="text-sm text-white/40">Try adjusting your search or filters</p>
                    <button onClick={clearAll} className="mt-4 px-4 py-2 rounded-lg text-sm text-violet-400 hover:bg-violet-500/10 transition-all">
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
