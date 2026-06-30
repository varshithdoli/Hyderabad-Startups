<<<<<<< HEAD
'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Rocket, TrendingUp, Building2, Users, Star, Zap, Briefcase, MapPin, ChevronRight } from 'lucide-react';
import VerificationBadge from '@/components/verification-badge';
import { startups as staticStartups, cityStats } from '@/data/startups';
import { getStartups } from '@/lib/firestore-service';
import { Footer } from '@/components/footer';
import type { Startup } from '@/data/startups';

// Lazy load Three.js component — saves ~600KB from initial bundle
const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then(m => ({ default: m.DottedSurface })),
  { ssr: false }
);

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ─── LOGO TICKER (Infinite marquee of startup logos) ─── */
function LogoTicker({ startups }: { startups: Startup[] }) {
  const items = startups.slice(0, 20);
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex gap-8 animate-scroll">
        {[...items, ...items].map((s, i) => (
          <Link
            key={`${s.id}-${i}`}
            href={`/startup/${s.id}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 shrink-0 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{s.logo}</span>
            <span className="text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors whitespace-nowrap">{s.name}</span>
            {s.isUnicorn && <span className="text-[9px]">🦄</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ stat }: { stat: typeof cityStats[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative group rounded-2xl p-5 cursor-default overflow-hidden transition-all duration-500
        bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]
        hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(124,92,255,0.15)] hover:scale-[1.03]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-cyan-600/0 group-hover:from-violet-600/10 group-hover:to-cyan-600/5 transition-all duration-500 rounded-2xl" />
      <div className="relative">
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
        <div className="text-2xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors duration-300">{stat.value}</div>
        <div className="text-sm font-medium text-white/60 mt-1 group-hover:text-white/80 transition-colors">{stat.label}</div>
        <div className="text-xs text-white/30 mt-0.5 group-hover:text-violet-300/50 transition-colors">{stat.subtext}</div>
      </div>
    </motion.div>
  );
}

/* ─── STARTUP SHOWCASE CARD ─── */
function StartupShowcase({ s }: { s: Startup }) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/startup/${s.id}`} className="block relative group rounded-2xl p-6 overflow-hidden transition-all duration-500
        bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]
        hover:border-violet-500/30 hover:shadow-[0_8px_40px_rgba(124,92,255,0.12)] hover:scale-[1.02]
        hover:bg-gradient-to-br hover:from-violet-900/20 hover:to-cyan-900/10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/0 to-transparent group-hover:from-violet-500/20 transition-all duration-700 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/0 to-transparent group-hover:from-cyan-500/10 transition-all duration-700 rounded-tr-full" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{s.logo}</div>
            {s.isUnicorn && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/25 group-hover:bg-violet-500/25 group-hover:border-violet-400/40 group-hover:shadow-[0_0_12px_rgba(124,92,255,0.3)] transition-all duration-300">🦄 Unicorn</span>}
            {s.isSoonicorn && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25 group-hover:bg-amber-500/25 group-hover:border-amber-400/40 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300">⚡ Soonicorn</span>}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors duration-300">{s.name}</h3>
            <VerificationBadge verified={s.verified} level={s.verificationLevel} showLabel={false} />
          </div>
          <p className="text-sm text-white/40 mb-4 line-clamp-2 group-hover:text-white/55 transition-colors">{s.description}</p>
          <div className="flex items-center gap-4 text-xs text-white/30 group-hover:text-white/50 transition-colors">
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.funding}</span>
            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{s.stage}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.employees}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(s.tags || []).slice(0, 3).map(t => (
              <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.04] text-white/40 border border-white/[0.05] group-hover:bg-violet-500/10 group-hover:text-violet-300/60 group-hover:border-violet-500/20 transition-all duration-300">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: "Hyderabad's startup ecosystem is on par with Bangalore now. The infrastructure, talent pool, and government support are world-class.",
    author: "Rohit Chennamaneni",
    role: "Co-founder, Darwinbox",
    emoji: "🚀",
  },
  {
    quote: "T-Hub has been instrumental in nurturing startups. Hyderabad is the future of India's innovation landscape.",
    author: "Ravi Kumar S",
    role: "CEO, T-Hub",
    emoji: "⚡",
  },
  {
    quote: "We chose Hyderabad over Bangalore — better talent retention, 30% lower costs, and a quality of life that keeps our team motivated.",
    author: "Sudheer Koneru",
    role: "CEO, Zenoti",
    emoji: "🦄",
  },
];

/* ─── QUICK LINKS SECTION ─── */
const quickLinks = [
  {
    title: 'Explore Startups',
    desc: 'Browse 9,000+ startups by sector, stage, and funding',
    href: '/explore',
    icon: <Rocket className="w-5 h-5" />,
    gradient: 'from-violet-500/20 to-violet-600/5',
    border: 'hover:border-violet-500/40',
  },
  {
    title: 'Job Board',
    desc: 'Find your next role at a top Hyderabad startup',
    href: '/jobs',
    icon: <Briefcase className="w-5 h-5" />,
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    border: 'hover:border-cyan-500/40',
  },
  {
    title: 'City Guide',
    desc: 'Neighbourhoods, co-working spaces, and lifestyle',
    href: '/city-guide',
    icon: <MapPin className="w-5 h-5" />,
    gradient: 'from-pink-500/20 to-pink-600/5',
    border: 'hover:border-pink-500/40',
  },
  {
    title: 'Dashboard',
    desc: 'Analytics, trends, and ecosystem intelligence',
    href: '/dashboard',
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'hover:border-amber-500/40',
  },
];

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [startups, setStartups] = useState<Startup[]>(staticStartups);

  useEffect(() => {
    getStartups().then(s => {
      if (s.length > 0) {
        const cleaned = s.map(st => ({
          ...st,
          tags: st.tags || [],
          investors: st.investors || [],
          logo: st.logo || '🚀',
          description: st.description || '',
          funding: st.funding || 'Undisclosed',
          stage: st.stage || 'Seed',
          employees: st.employees || '10+',
          sector: st.sector || 'Tech',
        }));
        setStartups(cleaned);
      }
    });
  }, []);

  const unicorns = startups.filter(s => s.isUnicorn);
  const soonicorns = startups.filter(s => s.isSoonicorn);
  const featured = [...unicorns, ...soonicorns.slice(0, 3)];

  return (
    <div className="relative min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
        <DottedSurface />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,92,255,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,200,200,0.06)_0%,transparent_50%)]" />

        <div className="relative z-[2] max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-xs text-white/70 mb-8 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-500 cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              India&apos;s #1 Liveable City — 9,000+ Startups — $5.8B+ Funded
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
            <span className="text-white">The Future of</span><br />
            <span className="text-gradient">Hyderabad&apos;s</span><br />
            <span className="text-white">Startup Ecosystem</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore unicorns, soonicorns, and 9,000+ innovators building in India&apos;s fastest-growing tech hub. Real data. Real insights. Real ecosystem intelligence.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/explore" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-base shadow-[0_0_30px_rgba(124,92,255,0.3)] hover:shadow-[0_0_50px_rgba(124,92,255,0.5)] transition-all duration-500 hover:scale-[1.03]">
              <Rocket className="w-5 h-5" />
              Explore Startups
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white/70 font-medium text-base hover:bg-white/[0.08] hover:border-violet-500/30 hover:text-white hover:shadow-[0_0_20px_rgba(124,92,255,0.1)] transition-all duration-500 hover:scale-[1.03]">
              <TrendingUp className="w-5 h-5" />
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== LOGO TICKER MARQUEE ===== */}
      <section className="relative py-4 overflow-hidden border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <LogoTicker startups={startups} />
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[rgba(124,92,255,0.03)] to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,92,255,0.08)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-violet-600/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-cyan-600/4 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">
                <span className="text-gradient">Hyderabad</span> <span className="text-white">at a Glance</span>
              </h2>
              <p className="text-white/35 text-sm max-w-lg mx-auto">Real-time metrics from India&apos;s fastest-transforming tech city</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {cityStats.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED STARTUPS ===== */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(124,92,255,0.04)] via-background to-[rgba(0,200,200,0.03)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,92,255,0.06)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(0,200,200,0.04)_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-3">
                  <span className="text-gradient">Featured</span> <span className="text-white">Startups</span>
                </h2>
                <p className="text-white/35 text-sm">Unicorns & soonicorns from Hyderabad&apos;s ecosystem</p>
              </div>
              <Link href="/explore" className="hidden md:flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors group">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((s) => <StartupShowcase key={s.id} s={s} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== QUICK LINKS SECTION (NEW) ===== */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,92,255,0.04)_0%,transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-gradient">Explore</span> <span className="text-white">the Platform</span>
              </h2>
              <p className="text-white/35 text-sm">Everything you need to navigate Hyderabad&apos;s startup world</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickLinks.map((link, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Link href={link.href}
                    className={`block relative group rounded-2xl p-6 overflow-hidden transition-all duration-500 border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${link.border} hover:shadow-lg hover:scale-[1.02]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />
                    <div className="relative flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:text-white transition-all duration-300 shrink-0`}>
                        {link.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white mb-1 group-hover:text-white transition-colors flex items-center gap-1">
                          {link.title}
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                        </h3>
                        <p className="text-xs text-white/35 group-hover:text-white/55 transition-colors">{link.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS (NEW) ===== */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[rgba(124,92,255,0.02)] to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">
                <span className="text-gradient">Voices</span> <span className="text-white">from the Ecosystem</span>
              </h2>
              <p className="text-white/35 text-sm">What founders and leaders say about Hyderabad</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="relative group rounded-2xl p-6 overflow-hidden transition-all duration-500 border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(124,92,255,0.08)]"
                >
                  <div className="text-3xl mb-4 opacity-50 group-hover:opacity-80 transition-opacity">{t.emoji}</div>
                  <blockquote className="text-sm text-white/50 leading-relaxed mb-6 group-hover:text-white/65 transition-colors">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="border-t border-white/[0.05] pt-4">
                    <div className="text-sm font-semibold text-white/80">{t.author}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WHY HYDERABAD ===== */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,92,255,0.06)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">Why <span className="text-gradient">Hyderabad</span>?</h2>
              <p className="text-white/35 text-sm max-w-lg mx-auto">What makes Mana Hyderabad the best city to build in</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Building2 className="w-6 h-6" />, title: '355+ GCCs', desc: '20% of India\'s Global Capability Centres. Microsoft, Google, Amazon, JPMorgan all have their largest India bets here.', gradient: 'from-violet-500/20 to-violet-600/5', hoverBorder: 'hover:border-violet-500/40', hoverShadow: 'hover:shadow-[0_0_40px_rgba(124,92,255,0.15)]' },
                { icon: <Zap className="w-6 h-6" />, title: 'T-Hub + Google', desc: 'India\'s largest incubator + first-ever Google for Startups Hub. ₹1,000 Cr state startup fund targeting 100 unicorns by 2034.', gradient: 'from-cyan-500/20 to-cyan-600/5', hoverBorder: 'hover:border-cyan-500/40', hoverShadow: 'hover:shadow-[0_0_40px_rgba(0,200,200,0.15)]' },
                { icon: <Star className="w-6 h-6" />, title: '#1 Liveability', desc: 'Higher purchasing power than Bangalore. 32% lower rents. Better metro. 35-45 min to airport. Best biryani in the world.', gradient: 'from-pink-500/20 to-pink-600/5', hoverBorder: 'hover:border-pink-500/40', hoverShadow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-500 border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${item.hoverBorder} ${item.hoverShadow} hover:scale-[1.02]`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white/80 mb-5 group-hover:scale-110 group-hover:text-white transition-all duration-300`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(124,92,255,0.08)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-12 text-center relative overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/15 via-background to-cyan-900/10 shadow-[0_0_60px_rgba(124,92,255,0.1)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(124,92,255,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(at_70%_80%,rgba(0,200,200,0.08)_0%,transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to <span className="text-gradient">explore</span>?</h2>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-8">Dive into the complete Hyderabad startup directory, city guide, and ecosystem dashboard.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/explore" className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold shadow-[0_0_30px_rgba(124,92,255,0.3)] hover:shadow-[0_0_50px_rgba(124,92,255,0.5)] transition-all duration-500 hover:scale-[1.03]">Explore Now</Link>
                <Link href="/city-guide" className="px-8 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 font-medium hover:bg-white/[0.08] hover:border-violet-500/30 hover:text-white transition-all duration-500">City Guide →</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:503e50724f767579bf78e53a71f67e129d9c3ec26e0e31c1f2ec3715eb7c9998
size 26739
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
