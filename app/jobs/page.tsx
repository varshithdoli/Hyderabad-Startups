<<<<<<< HEAD
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getJobs, applyToJob } from '@/lib/firestore-service';
import { uploadResume } from '@/lib/storage-service';
import { useAuth } from '@/lib/auth-context';
import { jobs as staticJobs } from '@/data/startups';
import type { Job } from '@/data/startups';
import {
  Briefcase, MapPin, Clock, DollarSign, ExternalLink, X, Send, Check,
  User, Mail, FileText, Upload, ChevronRight, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(staticJobs);
  const [activeCategory, setActiveCategory] = useState('All');
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [appForm, setAppForm] = useState({ name: '', email: '', coverLetter: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getJobs().then(j => { if (j.length > 0) setJobs(j); });
  }, []);

  useEffect(() => {
    if (user && applyingJob) {
      setAppForm(f => ({ ...f, name: user.displayName || f.name, email: user.email || f.email }));
    }
  }, [user, applyingJob]);

  const categories = ['All', ...Array.from(new Set(jobs.map(j => j.category)))];

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return jobs;
    return jobs.filter(j => j.category === activeCategory);
  }, [activeCategory, jobs]);

  const openApply = (job: Job) => {
    if (!user) { alert('Please log in to apply.'); return; }
    // redirect type: open external link
    if (job.applyType === 'redirect' && job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      return;
    }
    // legacy: if applyLink set and no applyType, treat as redirect
    if (!job.applyType && job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      return;
    }
    // internal apply
    setApplyingJob(job);
    setSubmitted(false);
    setError('');
    setResumeFile(null);
    setAppForm({ name: user.displayName || '', email: user.email || '', coverLetter: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.name || !appForm.email) { setError('Name and email are required.'); return; }
    if (!resumeFile) { setError('Please upload your resume (PDF or Word).'); return; }
    if (!user) { setError('You must be logged in.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const resumeUrl = await uploadResume(resumeFile, user.uid);
      await applyToJob({
        jobId: applyingJob!.id,
        startupId: applyingJob!.startupId || applyingJob!.companyId,
        jobTitle: applyingJob!.title,
        company: applyingJob!.company,
        applicantName: appForm.name,
        applicantEmail: appForm.email,
        applicantUid: user.uid,
        resumeUrl,
        coverLetter: appForm.coverLetter,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    }
    setSubmitting(false);
  };

  const isRedirect = (job: Job) =>
    job.applyType === 'redirect' || (!job.applyType && !!job.applyLink);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-medium mb-3">Careers</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Jobs</span> at Hyderabad Startups
            </h1>
            <p className="text-white/40 text-sm">Find your next opportunity at one of the city&apos;s most innovative companies</p>
            {user && (
              <Link href="/my-applications" className="inline-flex items-center gap-1.5 mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                View my applications <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </motion.div>

          {/* Category Filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === c
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/15'
                    : 'glass-card text-white/50 hover:text-white'
                }`}>
                {c} ({c === 'All' ? jobs.length : jobs.filter(j => j.category === c).length})
              </button>
            ))}
          </motion.div>

          {/* Job Listings */}
          <div className="space-y-3">
            {filtered.map(j => (
              <motion.div key={j.id} variants={fadeUp} className="glass-card rounded-2xl p-5 group hover:scale-[1.005] transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1">{j.title}</h3>
                    <Link href={`/startup/${j.companyId}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">{j.company}</Link>
                    <p className="text-xs text-white/40 mt-2 line-clamp-1">{j.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.experience}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{j.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40">{j.category}</span>
                      {j.salary && <span className="flex items-center gap-1 text-emerald-400/70"><DollarSign className="w-3 h-3" />{j.salary}</span>}
                      {isRedirect(j) && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400/70 text-[9px]">External</span>
                      )}
                    </div>
                    {j.skills && j.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {j.skills.slice(0, 4).map(sk => (
                          <span key={sk} className="px-1.5 py-0.5 text-[9px] rounded bg-white/5 text-white/30">{sk}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => openApply(j)}
                    className="shrink-0 ml-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-medium transition-all hover:shadow-lg hover:shadow-violet-500/20 flex items-center gap-1 opacity-70 group-hover:opacity-100"
                  >
                    {isRedirect(j) ? (
                      <><ExternalLink className="w-3 h-3" /> Apply</>
                    ) : (
                      <><Send className="w-3 h-3" /> Apply</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── INTERNAL APPLY MODAL ─── */}
      <AnimatePresence>
        {applyingJob && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => { if (!submitting) setApplyingJob(null); }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg glass-card rounded-3xl p-6 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-sm text-white/50 mb-1">
                    Your application for <span className="text-white font-medium">{applyingJob.title}</span>
                  </p>
                  <p className="text-sm text-white/50 mb-6">
                    at <span className="text-violet-400">{applyingJob.company}</span> has been received.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setApplyingJob(null)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                      Done
                    </button>
                    <Link href="/my-applications" onClick={() => setApplyingJob(null)}
                      className="px-6 py-3 rounded-xl glass-card text-white/60 text-sm font-medium hover:text-white transition-all">
                      My Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Apply for Position</h3>
                      <p className="text-sm text-violet-400">{applyingJob.title}</p>
                      <p className="text-xs text-white/40">{applyingJob.company} · {applyingJob.location}</p>
                      {applyingJob.salary && <p className="text-xs text-emerald-400/70 mt-1">{applyingJob.salary}</p>}
                    </div>
                    <button onClick={() => setApplyingJob(null)} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" value={appForm.name} onChange={e => setAppForm({ ...appForm, name: e.target.value })} required
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="email" value={appForm.email} onChange={e => setAppForm({ ...appForm, email: e.target.value })} required
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Resume * (PDF or Word, max 5MB)</label>
                      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                        onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
                          resumeFile
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-violet-500/30 hover:text-white/60'
                        }`}>
                        {resumeFile ? (
                          <><Check className="w-4 h-4 shrink-0" /><span className="truncate">{resumeFile.name}</span></>
                        ) : (
                          <><Upload className="w-4 h-4 shrink-0" /><span>Upload Resume</span></>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Cover Letter <span className="text-white/20">(optional)</span></label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                        <textarea rows={3} value={appForm.coverLetter} onChange={e => setAppForm({ ...appForm, coverLetter: e.target.value })}
                          placeholder="Why are you a great fit for this role?"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all resize-none" />
                      </div>
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Submit Application</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:ca9a5bdb8b81e592014c0d2e9be95f05fd95bf2499d131702f618ef14065b993
size 15936
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
