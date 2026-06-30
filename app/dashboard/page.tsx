'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { startups as staticStartups, fundingSectors, hyderabadVsBangalore, cityStats } from '@/data/startups';
import { getStartups } from '@/lib/firestore-service';
import type { Startup } from '@/data/startups';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Building2, Users, DollarSign, BarChart3, ArrowUpRight } from 'lucide-react';
import { Footer } from '@/components/footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const COLORS = ['#7c5cff', '#00c8c8', '#ff64c8', '#ffa940', '#36d399', '#667eea', '#f093fb', '#4ecdc4'];

export default function DashboardPage() {
  const [startups, setStartups] = useState<Startup[]>(staticStartups);

  useEffect(() => {
    getStartups().then(s => { if (s.length > 0) setStartups(s); });
  }, []);

  const totalFunding = startups.reduce((a, s) => a + (s.fundingNum || 0), 0);
  const totalEmployees = startups.reduce((a, s) => a + (s.employeesNum || 0), 0);
  const fundedStartups = startups.filter(s => (s.fundingNum || 0) > 0);
  const avgFunding = fundedStartups.length > 0 ? Math.round(totalFunding / fundedStartups.length) : 0;

  const sectorDist = startups.reduce((acc, s) => {
    const sector = s.sector.split('/')[0].trim();
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(sectorDist).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const kpis = [
    { icon: <Building2 className="w-5 h-5" />, label: 'Total Startups', value: '9,000+', change: '+1,404 in 6 months', color: 'from-violet-500 to-violet-600' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Cumulative Funding', value: '$5.8B+', change: '+23% YoY peak', color: 'from-cyan-500 to-cyan-600' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Avg Funding', value: `₹${avgFunding} Cr`, change: 'Per startup in dataset', color: 'from-pink-500 to-pink-600' },
    { icon: <Users className="w-5 h-5" />, label: 'Total Employees', value: totalEmployees.toLocaleString(), change: 'Across featured startups', color: 'from-amber-500 to-amber-600' },
  ];

  const topFunded = startups.filter(s => s.fundingNum > 0).sort((a, b) => b.fundingNum - a.fundingNum).slice(0, 8);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3"><span className="text-gradient">Ecosystem</span> Dashboard</h1>
            <p className="text-white/40 text-sm">Real data from Hyderabad&apos;s startup ecosystem — compiled from 50+ sources</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} bg-opacity-20 flex items-center justify-center text-white mb-3`} style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-from) / 0.15, var(--tw-gradient-to) / 0.15)` }}>
                  {kpi.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">{kpi.value}</div>
                <div className="text-xs text-white/50">{kpi.label}</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{kpi.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            <motion.div variants={fadeUp} className="lg:col-span-3 glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold">Funding by Sector ($M, 2020-25)</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fundingSectors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sector" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {fundingSectors.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2 glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6">Sector Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-4">
                {pieData.slice(0, 8).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-[10px] text-white/50">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Funded + Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Top Funded Startups</h3>
              <div className="space-y-2">
                {topFunded.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <span className="text-xs text-white/30 w-4 font-mono">{i + 1}</span>
                    <span className="text-xl">{s.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-white/40">{s.sector}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{s.funding}</div>
                      <div className="text-[10px] text-white/30">{s.stage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Hyderabad vs Bangalore</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-2 text-[10px] text-white/30 uppercase tracking-wider px-3 pb-2">
                  <span>Metric</span><span>Hyderabad</span><span>Bangalore</span><span>Edge</span>
                </div>
                {hyderabadVsBangalore.map((r, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 text-xs px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <span className="text-white/60 truncate">{r.metric}</span>
                    <span className="text-white/80 font-medium">{r.hyderabad}</span>
                    <span className="text-white/80 font-medium">{r.bangalore}</span>
                    <span className={`font-medium ${r.edge === 'Hyderabad' ? 'text-emerald-400' : r.edge === 'Bangalore' ? 'text-orange-400' : 'text-white/40'}`}>{r.edge}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
