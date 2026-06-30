'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import {
  Calendar, ExternalLink, TrendingUp, Newspaper,
  MapPin, Clock, Flame, ChevronRight, Filter
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface NewsItem {
  title: string;
  source: string;
  date: string;
  category: 'Funding' | 'Launch' | 'Policy' | 'Event' | 'Feature';
  description: string;
  url: string;
  hot?: boolean;
}

interface EventItem {
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  url: string;
}

const news: NewsItem[] = [
  {
    title: 'Telangana Launches ₹1,000 Crore AI Fund for Startups',
    source: 'Economic Times',
    date: '2026-06-28',
    category: 'Policy',
    description: 'The Telangana government has announced a dedicated ₹1,000 crore fund to boost AI startups in Hyderabad, targeting 50 AI unicorns by 2030.',
    url: '#',
    hot: true,
  },
  {
    title: 'Darwinbox Raises $72M Series D at $1.2B Valuation',
    source: 'TechCrunch',
    date: '2026-06-25',
    category: 'Funding',
    description: 'Hyderabad-based HR tech unicorn Darwinbox secures $72M in Series D funding, expanding into Southeast Asia and Middle East markets.',
    url: '#',
    hot: true,
  },
  {
    title: 'T-Hub Phase 2 Incubates 50 New DeepTech Startups',
    source: 'YourStory',
    date: '2026-06-22',
    category: 'Launch',
    description: 'T-Hub\'s expanded facility in Raidurg welcomes 50 new deep tech startups across AI, robotics, and clean energy sectors.',
    url: '#',
  },
  {
    title: 'Hyderabad Named Best City for Startup Ecosystem 2026',
    source: 'India Today',
    date: '2026-06-20',
    category: 'Feature',
    description: 'Hyderabad surpasses Bangalore in startup-friendliness rankings, citing lower costs, better infrastructure, and government support.',
    url: '#',
  },
  {
    title: 'Google for Startups Hub Graduates 25 Cohort 3 Startups',
    source: 'Mint',
    date: '2026-06-18',
    category: 'Event',
    description: 'The Google for Startups Hub in Hyderabad celebrates its third cohort graduation with 25 startups raising cumulative $45M.',
    url: '#',
  },
  {
    title: 'Skyroot Aerospace Completes Third Rocket Test from Sriharikota',
    source: 'NDTV',
    date: '2026-06-15',
    category: 'Launch',
    description: 'Hyderabad-based Skyroot Aerospace successfully tests its Vikram-II launch vehicle, bringing India closer to commercial space launches.',
    url: '#',
  },
  {
    title: 'Telangana IT Exports Cross $40B Mark',
    source: 'Business Standard',
    date: '2026-06-12',
    category: 'Feature',
    description: 'Telangana\'s IT exports hit a historic $40 billion, with Hyderabad contributing 95% through its 1,500+ IT companies and GCCs.',
    url: '#',
  },
  {
    title: 'Zenoti Expands to 100 Countries, Opens New Hyd Office',
    source: 'Forbes India',
    date: '2026-06-10',
    category: 'Funding',
    description: 'Beauty and wellness SaaS unicorn Zenoti announces global expansion to 100+ countries and a new 500-seat office in HITEC City.',
    url: '#',
  },
];

const events: EventItem[] = [
  {
    title: 'BioAsia 2026',
    date: '2026-07-15',
    location: 'HICC, Hyderabad',
    type: 'Conference',
    description: 'Asia\'s largest life sciences and health innovation forum',
    url: '#',
  },
  {
    title: 'T-Hub Demo Day - Cohort 12',
    date: '2026-07-22',
    location: 'T-Hub, Raidurg',
    type: 'Demo Day',
    description: '30+ startups pitching to 100+ investors and corporate partners',
    url: '#',
  },
  {
    title: 'Hyderabad Startup Week',
    date: '2026-08-05',
    location: 'Multiple Venues',
    type: 'Festival',
    description: 'Week-long celebration of Hyderabad\'s startup ecosystem with workshops, panels, and networking',
    url: '#',
  },
  {
    title: 'Google Cloud Summit Hyderabad',
    date: '2026-08-18',
    location: 'HICC, Hyderabad',
    type: 'Conference',
    description: 'Cloud technology, AI/ML, and developer tools summit for the Hyderabad tech community',
    url: '#',
  },
];

const categoryColors: Record<string, string> = {
  Funding: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  Launch: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  Policy: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  Event: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  Feature: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
};

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(news.map(n => n.category)))];
  const filteredNews = categoryFilter === 'All' ? news : news.filter(n => n.category === categoryFilter);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-medium mb-3">Stay Updated</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">News</span> & Events
            </h1>
            <p className="text-white/40 text-sm">Latest from Hyderabad&apos;s startup ecosystem</p>
          </motion.div>

          {/* Tab Toggle */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-8">
            {[
              { key: 'news' as const, label: 'News', icon: Newspaper },
              { key: 'events' as const, label: 'Events', icon: Calendar },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/15'
                    : 'glass-card text-white/40 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </motion.div>

          {/* NEWS TAB */}
          {activeTab === 'news' && (
            <>
              {/* Category filter */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      categoryFilter === c
                        ? 'bg-white/10 text-white'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </motion.div>

              {/* News cards */}
              <div className="space-y-4">
                {filteredNews.map((item, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block glass-card rounded-2xl p-5 group hover:scale-[1.005] hover:border-violet-500/15 transition-all duration-300 border border-transparent"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${categoryColors[item.category]}`}>
                              {item.category}
                            </span>
                            {item.hot && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/15 text-red-300 border border-red-500/20">
                                <Flame className="w-3 h-3" /> Hot
                              </span>
                            )}
                            <span className="text-[10px] text-white/20">{item.source}</span>
                          </div>
                          <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">{item.title}</h3>
                          <p className="text-xs text-white/35 line-clamp-2 mb-3">{item.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-white/20">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
                            <span className="flex items-center gap-1 text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
                              Read more <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.map((event, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-card rounded-2xl p-5 group hover:scale-[1.005] hover:border-violet-500/15 transition-all duration-300 border border-transparent"
                  >
                    <div className="flex items-start gap-5">
                      {/* Date badge */}
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 flex flex-col items-center justify-center border border-violet-500/10">
                        <span className="text-lg font-black text-gradient leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-[9px] text-white/30 uppercase">
                          {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                            {event.type}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-1 group-hover:text-violet-200 transition-colors">{event.title}</h3>
                        <p className="text-xs text-white/35 mb-2">{event.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-white/20">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-violet-400 transition-colors shrink-0" />
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
