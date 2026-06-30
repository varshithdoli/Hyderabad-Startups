'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getApplicationsByUser } from '@/lib/firestore-service';
import type { JobApplication } from '@/lib/firestore-service';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, ArrowLeft, Clock, CheckCircle, XCircle, Send, Eye } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  applied:  { label: 'Applied',  color: 'bg-blue-500/20 text-blue-300',    icon: Clock },
  sent:     { label: 'Sent',     color: 'bg-violet-500/20 text-violet-300', icon: Send },
  viewed:   { label: 'Viewed',   color: 'bg-amber-500/20 text-amber-300',   icon: Eye },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-300',       icon: XCircle },
};

export default function MyApplicationsPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [fetching, setFetching] = useState(true);

  if (!loading && !user) redirect('/login');

  useEffect(() => {
    if (!user) return;
    getApplicationsByUser(user.uid)
      .then(apps => setApplications(apps.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      })))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-3xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">My</span> Applications
            </h1>
            <p className="text-white/40 text-sm">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
          </motion.div>

          {applications.length === 0 ? (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-12 text-center">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No applications yet</h3>
              <p className="text-sm text-white/40 mb-6">Start applying to jobs at Hyderabad startups</p>
              <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                Browse Jobs
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                const Icon = cfg.icon;
                return (
                  <motion.div key={app.id} variants={fadeUp} className="glass-card rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white mb-0.5">{app.jobTitle}</h3>
                        <p className="text-xs text-violet-400 mb-3">{app.company}</p>
                        {app.coverLetter && (
                          <p className="text-xs text-white/30 line-clamp-2 mb-3">{app.coverLetter}</p>
                        )}
                        {app.resumeUrl && (
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">
                            📎 View Resume
                          </a>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                        {app.createdAt && (
                          <p className="text-[9px] text-white/20 mt-1.5">
                            {new Date(app.createdAt.toMillis?.() ?? app.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status progress */}
                    <div className="mt-4 flex items-center gap-1">
                      {(['applied', 'sent', 'viewed'] as const).map((step, i) => {
                        const steps = ['applied', 'sent', 'viewed', 'rejected'];
                        const currentIdx = steps.indexOf(app.status);
                        const stepIdx = steps.indexOf(step);
                        const isActive = stepIdx <= currentIdx && app.status !== 'rejected';
                        const isRejected = app.status === 'rejected';
                        return (
                          <div key={step} className="flex items-center gap-1 flex-1">
                            <div className={`h-1.5 flex-1 rounded-full transition-all ${
                              isRejected ? 'bg-red-500/30' :
                              isActive ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-white/10'
                            }`} />
                            {i < 2 && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isRejected ? 'bg-red-500/30' :
                              isActive ? 'bg-cyan-400' : 'bg-white/10'
                            }`} />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {['Applied', 'Sent', 'Viewed'].map(l => (
                        <span key={l} className="text-[8px] text-white/20">{l}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
