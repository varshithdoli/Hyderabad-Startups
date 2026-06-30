<<<<<<< HEAD
'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import {
  ArrowLeft, TrendingUp, Building2, Globe, ExternalLink,
  Search, Filter, DollarSign, Target
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Investor {
  name: string;
  type: string;
  focus: string[];
  portfolio: string[];
  aum: string;
  stage: string[];
  website: string;
  hq: string;
  description: string;
}

const investors: Investor[] = [
  {
    name: 'Endiya Partners',
    type: 'VC',
    focus: ['DeepTech', 'SaaS', 'Enterprise'],
    portfolio: ['Darwinbox', 'Yubi', 'Mygate', 'Atomicwork'],
    aum: '$200M+',
    stage: ['Seed', 'Series A'],
    website: 'https://endiya.com',
    hq: 'Hyderabad',
    description: 'Early-stage VC focused on product-led, technology-first startups from India with global aspirations.',
  },
  {
    name: 'Picus Capital',
    type: 'VC',
    focus: ['FinTech', 'HealthTech', 'Enterprise SaaS'],
    portfolio: ['Darwinbox', 'Open', 'Zomentum'],
    aum: '$600M+',
    stage: ['Seed', 'Series A', 'Series B'],
    website: 'https://picuscap.com',
    hq: 'Munich / Hyderabad',
    description: 'Global early-stage tech investor with a strong India thesis and portfolio of 30+ companies.',
  },
  {
    name: 'Lightspeed India',
    type: 'VC',
    focus: ['Consumer', 'SaaS', 'FinTech'],
    portfolio: ['Darwinbox', 'Byju\'s', 'Hevo Data'],
    aum: '$1B+',
    stage: ['Series A', 'Series B', 'Growth'],
    website: 'https://lsvp.com',
    hq: 'Bangalore / Global',
    description: 'Global venture capital firm investing in enterprise and consumer technology companies.',
  },
  {
    name: 'T-Hub',
    type: 'Incubator',
    focus: ['All Sectors', 'DeepTech', 'Social Impact'],
    portfolio: ['100+ startups incubated'],
    aum: 'Gov Funded',
    stage: ['Pre-Seed', 'Seed'],
    website: 'https://t-hub.co',
    hq: 'Hyderabad',
    description: 'India\'s largest innovation hub — supports startups with mentorship, funding access, and corporate partnerships.',
  },
  {
    name: 'Speciale Invest',
    type: 'VC',
    focus: ['DeepTech', 'Space', 'Robotics', 'AI'],
    portfolio: ['Skyroot', 'AgNext', 'Niral Networks'],
    aum: '$50M+',
    stage: ['Pre-Seed', 'Seed'],
    website: 'https://speciale.in',
    hq: 'Hyderabad',
    description: 'Pre-seed and seed stage deep tech VC backing founders solving hard problems with technology.',
  },
  {
    name: 'WE Hub',
    type: 'Incubator',
    focus: ['Women Entrepreneurs', 'Social Enterprise'],
    portfolio: ['200+ women-led startups'],
    aum: 'Gov Funded',
    stage: ['Pre-Seed', 'Seed'],
    website: 'https://wehub.telangana.gov.in',
    hq: 'Hyderabad',
    description: 'India\'s first state-led incubator exclusively for women entrepreneurs across all sectors.',
  },
  {
    name: 'Hyderabad Angels',
    type: 'Angel Network',
    focus: ['Tech', 'Consumer', 'HealthTech'],
    portfolio: ['20+ investments'],
    aum: 'Angel Fund',
    stage: ['Pre-Seed', 'Seed'],
    website: 'https://hyderabadangels.in',
    hq: 'Hyderabad',
    description: 'Leading angel investor network in Telangana connecting startup founders with experienced investors.',
  },
  {
    name: 'Venture Catalysts',
    type: 'Accelerator',
    focus: ['Consumer', 'FinTech', 'EdTech'],
    portfolio: ['BharatPe', 'Sugar Cosmetics', 'Country Delight'],
    aum: '$100M+',
    stage: ['Pre-Seed', 'Seed'],
    website: 'https://venturecatalysts.in',
    hq: 'Mumbai / Hyderabad',
    description: 'India\'s largest integrated incubator and accelerator, nurturing early-stage startups.',
  },
];

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...Array.from(new Set(investors.map(i => i.type)))];

  const filtered = useMemo(() => {
    return investors.filter(inv => {
      const matchesType = typeFilter === 'All' || inv.type === typeFilter;
      const matchesSearch = !searchQuery ||
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inv.hq.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchQuery, typeFilter]);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-medium mb-3">Ecosystem</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Investors</span> & Incubators
            </h1>
            <p className="text-white/40 text-sm max-w-lg mx-auto">
              VCs, angel networks, accelerators, and incubators powering Hyderabad&apos;s startup ecosystem
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === t
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white'
                      : 'glass-card text-white/40 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Investor Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((inv, i) => (
              <motion.div key={inv.name} variants={fadeUp}>
                <div className="glass-card rounded-2xl p-6 group hover:scale-[1.01] hover:border-violet-500/20 transition-all duration-500 h-full flex flex-col border border-transparent">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">{inv.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          inv.type === 'VC' ? 'bg-violet-500/15 text-violet-300' :
                          inv.type === 'Incubator' ? 'bg-cyan-500/15 text-cyan-300' :
                          inv.type === 'Angel Network' ? 'bg-amber-500/15 text-amber-300' :
                          'bg-pink-500/15 text-pink-300'
                        }`}>{inv.type}</span>
                      </div>
                      <p className="text-[10px] text-white/30">{inv.hq}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gradient">{inv.aum}</div>
                      <div className="text-[10px] text-white/20">AUM</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">{inv.description}</p>

                  {/* Focus Areas */}
                  <div className="mb-3">
                    <div className="text-[9px] uppercase text-white/20 mb-1.5 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Focus
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {inv.focus.map(f => (
                        <span key={f} className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Stages */}
                  <div className="mb-4">
                    <div className="text-[9px] uppercase text-white/20 mb-1.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Stages
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {inv.stage.map(s => (
                        <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/10 text-violet-300/60 border border-violet-500/10">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="mb-4">
                    <div className="text-[9px] uppercase text-white/20 mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Portfolio Highlights
                    </div>
                    <p className="text-xs text-white/30">{inv.portfolio.join(' · ')}</p>
                  </div>

                  {/* Website */}
                  <a
                    href={inv.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-auto"
                  >
                    <Globe className="w-3 h-3" />
                    {inv.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Filter className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40">No investors match your criteria</p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:dc5ed3dc84be3ed1379d49c8a668472904bfbd4157ecaa9a0ea585d07cf01812
size 11021
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
