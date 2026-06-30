'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getAdminStats, getStartups, addStartup, deleteStartup,
  getJobs, addJob, deleteJob, getSubmissions, approveSubmission, rejectSubmission,
  getApplications, getUsers, seedDatabase, updateStartup, updateJob,
  updateApplicationStatus, buildApplicationEmail
} from '@/lib/firestore-service';
import type { Startup, Job } from '@/data/startups';
import type { StartupSubmission, JobApplication, UserRecord } from '@/lib/firestore-service';
import {
  LayoutDashboard, Rocket, Briefcase, FileText, Users, Database,
  Plus, Trash2, Check, X, Eye, ChevronRight, RefreshCw, Shield,
  TrendingUp, AlertCircle, Mail, Clock, Edit2, Save, ArrowLeft, Search,
  Globe, Link2, Download, ExternalLink, ShieldCheck
} from 'lucide-react';
import VerificationBadge from '@/components/verification-badge';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

type Tab = 'overview' | 'startups' | 'jobs' | 'submissions' | 'applications' | 'users';

const emptyStartup: Omit<Startup, 'id'> & { id?: string } = {
  name: '', logo: '🚀', sector: '', description: '', longDescription: '',
  founded: 2024, funding: '', fundingNum: 0, stage: 'Seed', employees: '',
  employeesNum: 10, website: '', tags: [], investors: [],
};

const emptyJob: Omit<Job, 'id'> = {
  title: '', company: '', companyId: '', location: 'Hyderabad',
  type: 'Full-time', experience: '', category: 'Engineering', description: '', salary: '',
  applyType: 'redirect', applyLink: '', companyEmail: '', skills: [], source: 'manual',
};

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [submissions, setSubmissions] = useState<StartupSubmission[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingStartup, setEditingStartup] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [startupForm, setStartupForm] = useState(emptyStartup);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [tagsInput, setTagsInput] = useState('');
  const [investorsInput, setInvestorsInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<StartupSubmission | null>(null);
  const [skillsInput, setSkillsInput] = useState('');

  if (!loading && !user) redirect('/login');
  if (!loading && !isAdmin) redirect('/');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [s, st, j, sub, app, u] = await Promise.all([
        getAdminStats(), getStartups(), getJobs(), getSubmissions(), getApplications(), getUsers()
      ]);
      setStats(s); setStartups(st); setJobs(j); setSubmissions(sub); setApplications(app); setUsers(u);
    } catch (e) { console.error(e); }
    setRefreshing(false);
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const r = await seedDatabase();
      setSeedResult(`Seeded ${r.startups} startups and ${r.jobs} jobs!`);
      showToast(`Database seeded successfully!`);
      await loadData();
    } catch (e: any) { setSeedResult('Error: ' + e.message); }
    setSeeding(false);
  };

  const handleAddStartup = async () => {
    try {
      const data = { ...startupForm, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean), investors: investorsInput.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingStartup) {
        await updateStartup(editingStartup.id, data);
        showToast('Startup updated!');
      } else {
        await addStartup(data);
        showToast('Startup added!');
      }
      setShowStartupForm(false); setEditingStartup(null); setStartupForm(emptyStartup); setTagsInput(''); setInvestorsInput('');
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  const handleDeleteStartup = async (id: string) => {
    if (!confirm('Delete this startup?')) return;
    await deleteStartup(id); showToast('Startup deleted'); await loadData();
  };

  const handleEditStartup = (s: Startup) => {
    setEditingStartup(s); setStartupForm(s); setTagsInput((s.tags || []).join(', ')); setInvestorsInput((s.investors || []).join(', ')); setShowStartupForm(true);
  };

  const handleAddJob = async () => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobForm);
        showToast('Job updated!');
      } else {
        await addJob(jobForm);
        showToast('Job added!');
      }
      setShowJobForm(false); setEditingJob(null); setJobForm(emptyJob);
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await deleteJob(id); showToast('Job deleted'); await loadData();
  };

  const handleEditJob = (j: Job) => {
    setEditingJob(j); setJobForm(j); setSkillsInput((j.skills || []).join(', ')); setShowJobForm(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveSubmission(id, user?.email || 'admin');
      showToast('Submission approved & added to startups!');
      setSelectedSubmission(null);
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Rejection note (optional):') || '';
    try {
      await rejectSubmission(id, user?.email || 'admin', note);
      showToast('Submission rejected');
      setSelectedSubmission(null);
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  const handleSendToCompany = async (app: JobApplication) => {
    if (!app.id) return;
    try {
      // Open mailto with application details
      const mailtoUrl = buildApplicationEmail(app);
      window.open(mailtoUrl, '_blank');
      await updateApplicationStatus(app.id, 'sent');
      showToast('Marked as sent to company');
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  const handleRejectApplication = async (id: string) => {
    if (!confirm('Reject this application?')) return;
    try {
      await updateApplicationStatus(id, 'rejected');
      showToast('Application rejected');
      await loadData();
    } catch (e: any) { showToast('Error: ' + e.message); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tabs: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'startups', label: 'Startups', icon: Rocket, badge: startups.length },
    { key: 'jobs', label: 'Jobs', icon: Briefcase, badge: jobs.length },
    { key: 'submissions', label: 'Submissions', icon: FileText, badge: submissions.filter(s => s.status === 'pending').length },
    { key: 'applications', label: 'Applications', icon: Mail, badge: applications.length },
    { key: 'users', label: 'Users', icon: Users, badge: users.length },
  ];

  const filteredStartups = startups.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.sector.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredJobs = jobs.filter(j => !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm backdrop-blur-xl shadow-xl">
          <Check className="w-4 h-4 inline mr-2" />{toast}
        </motion.div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <span className="text-xs uppercase tracking-widest text-violet-400 font-medium">Admin Panel</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold"><span className="text-gradient">Control</span> Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs text-white/60 hover:text-white transition-all disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="glass-card rounded-2xl p-3 sticky top-24 space-y-1">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/10 text-white border border-violet-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}>
                  <tab.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tab.key === 'submissions' && tab.badge > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/50'
                    }`}>{tab.badge}</span>
                  )}
                </button>
              ))}
              <div className="border-t border-white/5 pt-2 mt-2">
                <button onClick={handleSeed} disabled={seeding}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/5 transition-all disabled:opacity-50">
                  <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Seed Database'}
                </button>
                {seedResult && <p className="text-[10px] text-emerald-400 px-4 mt-1">{seedResult}</p>}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === tab.key ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white' : 'glass-card text-white/50'
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/20">{tab.badge}</span>}
                </button>
              ))}
            </div>



            {/* ─── OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Startups', value: stats?.totalStartups ?? 20, icon: Rocket, color: 'violet' },
                    { label: 'Total Jobs', value: stats?.totalJobs ?? 15, icon: Briefcase, color: 'cyan' },
                    { label: 'Pending Reviews', value: stats?.pendingSubmissions ?? 0, icon: FileText, color: 'amber' },
                    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: Mail, color: 'pink' },
                    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'emerald' },
                    { label: 'Submissions', value: stats?.totalSubmissions ?? 0, icon: TrendingUp, color: 'violet' },
                  ].map((kpi, i) => (
                    <motion.div key={i} variants={fadeUp} className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all">
                      <kpi.icon className={`w-5 h-5 text-${kpi.color}-400 mb-3`} />
                      <div className="text-2xl font-bold text-white">{kpi.value}</div>
                      <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Add Startup', action: () => { setActiveTab('startups'); setShowStartupForm(true); }, icon: Plus, color: 'violet' },
                      { label: 'Add Job', action: () => { setActiveTab('jobs'); setShowJobForm(true); }, icon: Plus, color: 'cyan' },
                      { label: 'Review Submissions', action: () => setActiveTab('submissions'), icon: FileText, color: 'amber' },
                      { label: 'Seed Database', action: handleSeed, icon: Database, color: 'emerald' },
                    ].map((a, i) => (
                      <button key={i} onClick={a.action}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-${a.color}-500/10 text-${a.color}-300 text-sm font-medium hover:bg-${a.color}-500/20 transition-all border border-${a.color}-500/10`}>
                        <a.icon className="w-4 h-4" /> {a.label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Submissions */}
                {submissions.filter(s => s.status === 'pending').length > 0 && (
                  <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" /> Pending Submissions ({submissions.filter(s => s.status === 'pending').length})
                    </h3>
                    <div className="space-y-2">
                      {submissions.filter(s => s.status === 'pending').slice(0, 5).map(s => (
                        <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white">{s.name}</div>
                            <div className="text-[10px] text-white/40">{s.sector} · by {s.submittedByName}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(s.id!)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"><Check className="w-4 h-4" /></button>
                            <button onClick={() => handleReject(s.id!)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─── STARTUPS ─── */}
            {activeTab === 'startups' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 flex-1 max-w-xs">
                      <Search className="w-4 h-4 text-white/30" />
                      <input type="text" placeholder="Search startups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full" />
                    </div>
                  </div>
                  <button onClick={() => { setShowStartupForm(true); setEditingStartup(null); setStartupForm(emptyStartup); setTagsInput(''); setInvestorsInput(''); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" /> Add Startup
                  </button>
                </div>

                {/* Startup Form Modal */}
                {showStartupForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6 border border-violet-500/20">
                    <h3 className="text-lg font-bold mb-4">{editingStartup ? 'Edit' : 'Add'} Startup</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Name *</label>
                        <input type="text" value={startupForm.name} onChange={e => setStartupForm({...startupForm, name: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Logo Emoji</label>
                        <input type="text" value={startupForm.logo} onChange={e => setStartupForm({...startupForm, logo: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Sector *</label>
                        <input type="text" value={startupForm.sector} onChange={e => setStartupForm({...startupForm, sector: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Stage</label>
                        <select value={startupForm.stage} onChange={e => setStartupForm({...startupForm, stage: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50">
                          {['Seed','Pre-Series A','Series A','Series B','Series C','Growth','Unicorn'].map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Founded Year</label>
                        <input type="number" value={startupForm.founded} onChange={e => setStartupForm({...startupForm, founded: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Funding</label>
                        <input type="text" value={startupForm.funding} onChange={e => setStartupForm({...startupForm, funding: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" placeholder="$10M" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Employees</label>
                        <input type="text" value={startupForm.employees} onChange={e => setStartupForm({...startupForm, employees: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" placeholder="100+" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Website</label>
                        <input type="url" value={startupForm.website} onChange={e => setStartupForm({...startupForm, website: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-white/50 mb-1 block">Short Description *</label>
                        <input type="text" value={startupForm.description} onChange={e => setStartupForm({...startupForm, description: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-white/50 mb-1 block">Long Description</label>
                        <textarea rows={3} value={startupForm.longDescription} onChange={e => setStartupForm({...startupForm, longDescription: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50 resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Tags (comma-separated)</label>
                        <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" placeholder="SaaS, AI, Enterprise" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Investors (comma-separated)</label>
                        <input type="text" value={investorsInput} onChange={e => setInvestorsInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50" placeholder="Tiger Global, Sequoia" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="isUnicorn" checked={startupForm.isUnicorn || false} onChange={e => setStartupForm({...startupForm, isUnicorn: e.target.checked})} className="rounded" />
                        <label htmlFor="isUnicorn" className="text-xs text-white/60">🦄 Unicorn</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="isSoonicorn" checked={startupForm.isSoonicorn || false} onChange={e => setStartupForm({...startupForm, isSoonicorn: e.target.checked})} className="rounded" />
                        <label htmlFor="isSoonicorn" className="text-xs text-white/60">⚡ Soonicorn</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => { setShowStartupForm(false); setEditingStartup(null); }} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-all">Cancel</button>
                      <button onClick={handleAddStartup} disabled={!startupForm.name || !startupForm.sector}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                        <Save className="w-4 h-4" /> {editingStartup ? 'Update' : 'Add'} Startup
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Startup List */}
                <div className="space-y-2">
                  {filteredStartups.map(s => (
                    <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
                      <span className="text-2xl">{s.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{s.name}</span>
                          {s.isUnicorn && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300">🦄 Unicorn</span>}
                          {s.isSoonicorn && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300">⚡ Soonicorn</span>}
                        </div>
                        <div className="text-[10px] text-white/40">{s.sector} · {s.stage} · {s.funding}</div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditStartup(s)} className="p-2 rounded-lg text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteStartup(s.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── JOBS ─── */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 flex-1 max-w-xs">
                    <Search className="w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full" />
                  </div>
                  <button onClick={() => { setShowJobForm(true); setEditingJob(null); setJobForm(emptyJob); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" /> Add Job
                  </button>
                </div>

                {showJobForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6 border border-cyan-500/20">
                    <h3 className="text-lg font-bold mb-4">{editingJob ? 'Edit' : 'Add'} Job</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="text-xs text-white/50 mb-1 block">Title *</label>
                        <input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Company *</label>
                        <input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Company/Startup ID</label>
                        <select value={jobForm.companyId} onChange={e => setJobForm({...jobForm, companyId: e.target.value, startupId: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none">
                          <option value="" className="bg-gray-900">Select startup...</option>
                          {startups.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
                        </select></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Location</label>
                        <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Type</label>
                        <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"><option className="bg-gray-900">Full-time</option><option className="bg-gray-900">Part-time</option><option className="bg-gray-900">Contract</option><option className="bg-gray-900">Internship</option></select></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Experience</label>
                        <input type="text" value={jobForm.experience} onChange={e => setJobForm({...jobForm, experience: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" placeholder="3-5 years" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Category</label>
                        <input type="text" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Salary</label>
                        <input type="text" value={jobForm.salary || ''} onChange={e => setJobForm({...jobForm, salary: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" placeholder="₹20-35 LPA" /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Apply Type</label>
                        <select value={jobForm.applyType || 'redirect'} onChange={e => setJobForm({...jobForm, applyType: e.target.value as 'redirect' | 'internal'})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none">
                          <option value="redirect" className="bg-gray-900">Redirect (external link)</option>
                          <option value="internal" className="bg-gray-900">Internal (platform apply)</option>
                        </select></div>
                      <div><label className="text-xs text-white/50 mb-1 block flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Apply Link {jobForm.applyType !== 'internal' ? '*' : ''}</label>
                        <input type="url" value={jobForm.applyLink || ''} onChange={e => setJobForm({...jobForm, applyLink: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" placeholder="https://careers.company.com/job/123" disabled={jobForm.applyType === 'internal'} /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Company Email {jobForm.applyType === 'internal' ? '*' : ''}</label>
                        <input type="email" value={jobForm.companyEmail || ''} onChange={e => setJobForm({...jobForm, companyEmail: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" placeholder="careers@company.com" disabled={jobForm.applyType !== 'internal'} /></div>
                      <div><label className="text-xs text-white/50 mb-1 block">Skills (comma-separated)</label>
                        <input type="text" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50" placeholder="React, TypeScript, Node.js" /></div>
                      <div className="md:col-span-2"><label className="text-xs text-white/50 mb-1 block">Description</label>
                        <textarea rows={2} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-cyan-500/50 resize-none" /></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => { setShowJobForm(false); setEditingJob(null); setSkillsInput(''); }} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-all">Cancel</button>
                      <button onClick={() => { const j = { ...jobForm, skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean), startupId: jobForm.companyId }; setJobForm(j); handleAddJob(); }} disabled={!jobForm.title || !jobForm.company}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium disabled:opacity-50">
                        <Save className="w-4 h-4" /> {editingJob ? 'Update' : 'Add'} Job
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  {filteredJobs.map(j => (
                    <div key={j.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
                      <Briefcase className="w-5 h-5 text-cyan-400/50" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{j.title}</div>
                        <div className="text-[10px] text-white/40">{j.company} · {j.type} · {j.experience} {j.salary && `· ${j.salary}`}</div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditJob(j)} className="p-2 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteJob(j.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SUBMISSIONS ─── */}
            {activeTab === 'submissions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Startup Submissions</h2>
                  <div className="flex gap-2 text-[10px]">
                    <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">{submissions.filter(s => s.status === 'pending').length} pending</span>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">{submissions.filter(s => s.status === 'approved').length} approved</span>
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300">{submissions.filter(s => s.status === 'rejected').length} rejected</span>
                  </div>
                </div>

                {/* Detail View Modal */}
                {selectedSubmission && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6 border border-violet-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{selectedSubmission.name}</h3>
                        <p className="text-xs text-white/40">by {selectedSubmission.founder} · {selectedSubmission.email}</p>
                      </div>
                      <button onClick={() => setSelectedSubmission(null)} className="p-2 rounded-lg text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase text-white/30 font-medium">Details</div>
                        <p className="text-xs text-white/60"><strong className="text-white/40">Sector:</strong> {selectedSubmission.sector}</p>
                        <p className="text-xs text-white/60"><strong className="text-white/40">Founded:</strong> {selectedSubmission.founded}</p>
                        <p className="text-xs text-white/60"><strong className="text-white/40">Funding:</strong> {selectedSubmission.funding || 'N/A'}</p>
                        <p className="text-xs text-white/60"><strong className="text-white/40">Team:</strong> {selectedSubmission.employees || 'N/A'}</p>
                        {selectedSubmission.cin && <p className="text-xs text-white/60"><strong className="text-white/40">CIN:</strong> {selectedSubmission.cin}</p>}
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase text-white/30 font-medium">Links & Verification</div>
                        {selectedSubmission.website && <a href={selectedSubmission.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"><Globe className="w-3 h-3" /> {selectedSubmission.website}</a>}
                        {selectedSubmission.linkedin && <a href={selectedSubmission.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"><Link2 className="w-3 h-3" /> LinkedIn Profile</a>}
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs"><span className={selectedSubmission.verificationInputs?.hasWebsite ? 'text-emerald-400' : 'text-white/20'}>{selectedSubmission.verificationInputs?.hasWebsite ? '✓' : '○'}</span> Website</div>
                          <div className="flex items-center gap-2 text-xs"><span className={selectedSubmission.verificationInputs?.hasLinkedIn ? 'text-emerald-400' : 'text-white/20'}>{selectedSubmission.verificationInputs?.hasLinkedIn ? '✓' : '○'}</span> LinkedIn</div>
                          <div className="flex items-center gap-2 text-xs"><span className={selectedSubmission.verificationInputs?.hasDocuments ? 'text-emerald-400' : 'text-white/20'}>{selectedSubmission.verificationInputs?.hasDocuments ? '✓' : '○'}</span> Documents ({selectedSubmission.proofFiles?.length || 0})</div>
                        </div>
                        <div className="mt-2"><span className="text-[10px] text-white/30">Expected Level: </span><VerificationBadge verified={true} level={selectedSubmission.verificationInputs?.hasDocuments ? 'high' : selectedSubmission.verificationInputs?.hasLinkedIn ? 'medium' : 'basic'} size="sm" /></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] uppercase text-white/30 font-medium mb-1">Description</div>
                      <p className="text-xs text-white/50">{selectedSubmission.description}</p>
                      {selectedSubmission.longDescription && <p className="text-xs text-white/30 mt-1">{selectedSubmission.longDescription}</p>}
                    </div>

                    {/* Proof Documents */}
                    {selectedSubmission.proofFiles && selectedSubmission.proofFiles.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[10px] uppercase text-white/30 font-medium mb-2">Proof Documents</div>
                        <div className="space-y-1">
                          {selectedSubmission.proofFiles.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-xs text-cyan-400 hover:text-cyan-300 transition-all">
                              <Download className="w-3 h-3" /> Document {i + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedSubmission.status === 'pending' && (
                      <div className="flex gap-3 pt-3 border-t border-white/5">
                        <button onClick={() => handleApprove(selectedSubmission.id!)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all border border-emerald-500/20"><ShieldCheck className="w-4 h-4" /> Approve & Publish</button>
                        <button onClick={() => handleReject(selectedSubmission.id!)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all border border-red-500/20"><X className="w-4 h-4" /> Reject</button>
                      </div>
                    )}
                    {selectedSubmission.reviewNote && <p className="text-xs text-red-400/60 mt-3">Rejection note: {selectedSubmission.reviewNote}</p>}
                  </motion.div>
                )}

                {submissions.length === 0 ? (
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions.map(s => (
                      <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all cursor-pointer" onClick={() => setSelectedSubmission(s)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-lg">🚀</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{s.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${s.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{s.status}</span>
                          </div>
                          <div className="text-[10px] text-white/40">{s.sector} · by {s.founder || s.submittedByName} · {s.submittedByEmail}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.verificationInputs?.hasDocuments && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">📄 Docs</span>}
                          {s.verificationInputs?.hasLinkedIn && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">in</span>}
                          <ChevronRight className="w-4 h-4 text-white/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── APPLICATIONS ─── */}
            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Job Applications ({applications.length})</h2>
                {applications.length === 0 ? (
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <Mail className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map(a => (
                      <div key={a.id} className="glass-card rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-bold text-white">{a.applicantName}</h3>
                            <p className="text-[10px] text-white/40">{a.applicantEmail}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'applied'   ? 'bg-blue-500/20 text-blue-300' :
                            a.status === 'sent'      ? 'bg-violet-500/20 text-violet-300' :
                            a.status === 'viewed'    ? 'bg-amber-500/20 text-amber-300' :
                            a.status === 'rejected'  ? 'bg-red-500/20 text-red-300' :
                            'bg-white/10 text-white/50'
                          }`}>{a.status}</span>
                        </div>
                        <div className="text-xs text-violet-400 mb-2">{a.jobTitle} at {a.company}</div>
                        {a.coverLetter && (
                          <p className="text-xs text-white/30 mb-2 line-clamp-2">{a.coverLetter}</p>
                        )}
                        {a.resumeUrl && (
                          <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mb-3">
                            <Download className="w-3 h-3" /> View Resume
                          </a>
                        )}
                        {a.status !== 'rejected' && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                            <button
                              onClick={() => handleSendToCompany(a)}
                              disabled={a.status === 'sent'}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-300 text-xs font-medium hover:bg-violet-500/20 transition-all border border-violet-500/15 disabled:opacity-40"
                            >
                              <Mail className="w-3.5 h-3.5" /> Send to Company
                            </button>
                            <button
                              onClick={() => handleRejectApplication(a.id!)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all border border-red-500/15"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── USERS ─── */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Registered Users ({users.length})</h2>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.uid} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{u.name || 'Unnamed'}</div>
                        <div className="text-[10px] text-white/40">{u.email}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/40'}`}>
                          {u.role || 'user'}
                        </span>
                        <div className="text-[9px] text-white/30 mt-1">{u.savedStartups?.length || 0} saved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
