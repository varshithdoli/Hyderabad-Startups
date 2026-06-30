<<<<<<< HEAD
'use client';
import { motion } from 'framer-motion';
import { neighbourhoods, breweries, restaurants } from '@/data/startups';
import { MapPin, Home, Coffee, Beer, UtensilsCrossed, Star, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/footer';
import { useState } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function CityGuidePage() {
  const [activeTab, setActiveTab] = useState<'neighbourhoods' | 'food' | 'breweries'>('neighbourhoods');

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3"><span className="text-gradient">City</span> Guide</h1>
            <p className="text-white/40 text-sm max-w-xl">The ultimate guide to living, eating, and working in Hyderabad — compiled from real data, Reddit threads, and local knowledge</p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex gap-2 mb-8">
            {[
              { key: 'neighbourhoods' as const, label: 'Neighbourhoods', icon: <Home className="w-4 h-4" /> },
              { key: 'food' as const, label: 'Food & Dining', icon: <UtensilsCrossed className="w-4 h-4" /> },
              { key: 'breweries' as const, label: 'Breweries', icon: <Beer className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20' : 'glass-card text-white/50 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Neighbourhoods */}
          {activeTab === 'neighbourhoods' && (
            <motion.div initial="hidden" animate="show" variants={stagger} className="grid md:grid-cols-2 gap-5">
              {neighbourhoods.map(n => (
                <motion.div key={n.id} variants={fadeUp} className="glass-card rounded-2xl p-6 group hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl mb-2">{n.vibe}</div>
                      <h3 className="text-lg font-bold text-white">{n.name}</h3>
                      <p className="text-xs text-violet-400 font-medium">{n.personality}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mb-4"><span className="text-white/70 font-medium">Best for:</span> {n.bestFor}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">1 BHK Rent</div>
                      <div className="text-sm font-bold text-white">{n.rent1BHK}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">2 BHK Rent</div>
                      <div className="text-sm font-bold text-white">{n.rent2BHK}</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-xl p-3 border border-violet-500/10">
                    <div className="text-[10px] text-violet-400 font-medium uppercase tracking-wider mb-1">💡 Insider Tip</div>
                    <p className="text-xs text-white/60 leading-relaxed">{n.insiderTip}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Food */}
          {activeTab === 'food' && (
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-1">🍗 The Biryani Rankings</h3>
                <p className="text-xs text-white/40 mb-4">Settle the debate: the best biryani in Hyderabad, ranked by locals</p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {restaurants.map((r, i) => (
                  <motion.div key={i} variants={fadeUp} className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/50">{r.cuisine}</span>
                      <span className="text-[10px] text-amber-400 font-medium">{r.rating}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{r.name}</h4>
                    <p className="text-[10px] text-white/40 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{r.area}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{r.notes}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Breweries */}
          {activeTab === 'breweries' && (
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-1">🍺 Craft Beer Scene</h3>
                <p className="text-xs text-white/40">Reddit ranking: Broadway &gt; Zythum &gt; Forge &gt; Zero40 &gt; Prost</p>
              </motion.div>
              <div className="grid md:grid-cols-2 gap-4">
                {breweries.map((b, i) => (
                  <motion.div key={i} variants={fadeUp} className="glass-card rounded-2xl p-5 group hover:scale-[1.01] transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-base font-bold text-white">{b.name}</h4>
                      <span className="text-[10px] text-white/30 flex items-center gap-1"><MapPin className="w-3 h-3" />{b.area}</span>
                    </div>
                    <div className="mb-3">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Signature Beers</div>
                      <p className="text-xs text-white/60">{b.signature}</p>
                    </div>
                    <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                      <p className="text-xs text-amber-300/70">{b.mustKnow}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:e155ca0811c8da0ce5df27b2559c56e222d8f06cb68f943c7e6d012fc5461664
size 7483
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
