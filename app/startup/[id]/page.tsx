<<<<<<< HEAD
'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { startups as staticStartups, jobs as staticJobs } from '@/data/startups';
import { getStartups, getJobs, getJobsByStartup } from '@/lib/firestore-service';
import type { Startup, Job } from '@/data/startups';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, Briefcase, TrendingUp, Users, Calendar, Building2, ExternalLink, Sparkles, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import VerificationBadge from '@/components/verification-badge';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function StartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, savedStartups, toggleSaveStartup } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(staticStartups.find(s => s.id === id) || null);
  const [allStartups, setAllStartups] = useState<Startup[]>(staticStartups);
  const [companyJobs, setCompanyJobs] = useState<Job[]>(staticJobs.filter(j => j.companyId === id));
  const [loading, setLoading] = useState(!staticStartups.find(s => s.id === id)); // only loading if not in static

  useEffect(() => {
    Promise.all([
      getStartups().then(s => {
        if (s.length > 0) {
          setAllStartups(s);
          const found = s.find(st => st.id === id);
          if (found) setStartup(found);
        }
      }),
      getJobsByStartup(id).then(j => { if (j.length > 0) setCompanyJobs(j); }),
    ]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!startup) return notFound();

  const tags = startup.tags || [];
  const investors = startup.investors || [];
  const related = allStartups.filter(s => s.id !== id && (s.sector === startup.sector || (s.tags || []).some(t => tags.includes(t)))).slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-violet-600/20 via-cyan-600/10 to-pink-600/10" />
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent to-background" />

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Link href="/explore" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to explore
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-start gap-6 mb-10">
            <div className="text-6xl">{startup.logo}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{startup.name}</h1>
                    <VerificationBadge verified={startup.verified} level={startup.verificationLevel} size="md" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{startup.sector}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Founded {startup.founded}</span>
                    <Badge variant="outline" className="bg-white/5 text-white/60 border-white/10">{startup.stage}</Badge>
                    {startup.founder && <span className="text-white/40">by {startup.founder}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user && (
                    <button onClick={() => toggleSaveStartup(startup.id)} className={`p-2.5 rounded-xl transition-all ${savedStartups.includes(startup.id) ? 'bg-violet-500/15 text-violet-400' : 'glass-card text-white/30 hover:text-white'}`}>
                      <Sparkles className="w-5 h-5" />
                    </button>
                  )}
                  {startup.linkedin && (
                    <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl glass-card text-white/30 hover:text-blue-400 transition-all">
                      <Link2 className="w-5 h-5" />
                    </a>
                  )}
                  <a href={startup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/20 transition-all">
                    <Globe className="w-4 h-4" /> Visit Website
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-3">About</h2>
                <p className="text-sm text-white/60 leading-relaxed">{startup.longDescription}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map(t => <Badge key={t} variant="secondary" className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-[10px]">{t}</Badge>)}
                </div>
              </motion.div>

              {/* Key Metrics */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Key Metrics</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Funding', value: startup.funding, icon: <TrendingUp className="w-4 h-4" /> },
                    { label: 'Stage', value: startup.stage, icon: <Building2 className="w-4 h-4" /> },
                    { label: 'Team Size', value: startup.employees, icon: <Users className="w-4 h-4" /> },
                    { label: 'Founded', value: startup.founded.toString(), icon: <Calendar className="w-4 h-4" /> },
                  ].map(m => (
                    <div key={m.label} className="bg-white/[0.03] rounded-xl p-4">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1 flex items-center gap-1">{m.icon}{m.label}</div>
                      <div className="text-lg font-bold text-white">{m.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Investors */}
              {investors.length > 0 && (
                <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Investors</h2>
                  <div className="flex flex-wrap gap-2">
                    {investors.map(inv => (
                      <span key={inv} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/60">{inv}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Verification Info */}
              {startup.verified && (
                <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2">Verification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Status</span>
                      <VerificationBadge verified={startup.verified} level={startup.verificationLevel} size="md" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Source</span>
                      <span className="text-xs text-white/60 capitalize">{startup.source === 'user_submission' ? 'Community' : 'Platform'}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Jobs */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-violet-400" />Open Positions ({companyJobs.length})</h3>
                {companyJobs.length > 0 ? (
                  <div className="space-y-2">
                    {companyJobs.map(j => (
                      <div key={j.id} className="block p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                        <div className="text-sm font-medium text-white">{j.title}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{j.experience} · {j.type}</div>
                        {j.salary && <div className="text-[10px] text-emerald-400/70 mt-0.5">{j.salary}</div>}
                        {j.skills && j.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {j.skills.slice(0, 3).map(sk => <span key={sk} className="px-1.5 py-0.5 text-[8px] rounded bg-white/5 text-white/30">{sk}</span>)}
                          </div>
                        )}
                        <div className="mt-2">
                          {j.applyLink ? (
                            <a href={j.applyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-medium">
                              Apply on company site <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link href="/jobs" className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-medium">
                              View & Apply <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/30">No open positions listed</p>
                )}
              </motion.div>

              {/* Related */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                <h3 className="text-base font-bold mb-3">Related Startups</h3>
                <div className="space-y-2">
                  {related.map(r => (
                    <Link key={r.id} href={`/startup/${r.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                      <span className="text-xl">{r.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <div className="text-sm font-medium text-white truncate">{r.name}</div>
                          <VerificationBadge verified={r.verified} level={r.verificationLevel} showLabel={false} />
                        </div>
                        <div className="text-[10px] text-white/40">{r.sector}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/20" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:8ddd75bb1d20ed411831152c7fccb7e497a075c9be3a3efd2ec03489cfb83036
size 12388
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
