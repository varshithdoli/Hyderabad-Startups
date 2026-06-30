'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { submitStartup } from '@/lib/firestore-service';
import { uploadProofFile } from '@/lib/storage-service';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Rocket, ArrowLeft, Send, Check, AlertCircle, Upload, X, FileText, Image, Globe, Link2, Shield } from 'lucide-react';

export default function SubmitStartupPage() {
  const { user, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', website: '', linkedin: '', founder: '', email: '',
    sector: '', description: '', longDescription: '',
    founded: 2024, funding: '', employees: '', tags: '', cin: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!loading && !user) redirect('/login');

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Startup Name is required';
    if (!form.website.trim()) return 'Website URL is required';
    try { new URL(form.website); } catch { return 'Website must be a valid URL (include https://)'; }
    if (!form.founder.trim()) return 'Founder Name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email must be valid';
    if (!form.sector.trim()) return 'Sector is required';
    if (!form.description.trim()) return 'Description is required';
    if (form.description.trim().length < 50) return 'Description must be at least 50 characters';
    if (!form.linkedin.trim() && files.length === 0) return 'Please provide LinkedIn URL OR upload proof documents';
    return null;
  };

  const handleFileAdd = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(f => {
      if (f.size > 5 * 1024 * 1024) { setError(`${f.name} exceeds 5MB limit`); return false; }
      if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type)) {
        setError(`${f.name} is not a supported file type`); return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitting(true);
    setError('');
    try {
      // Upload proof files
      let proofFileUrls: string[] = [];
      if (files.length > 0) {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const url = await uploadProofFile(files[i], user!.uid);
          proofFileUrls.push(url);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
        setUploading(false);
      }

      await submitStartup({
        name: form.name.trim(),
        website: form.website.trim(),
        linkedin: form.linkedin.trim(),
        founder: form.founder.trim(),
        email: form.email.trim(),
        sector: form.sector.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription.trim() || form.description.trim(),
        founded: form.founded,
        funding: form.funding.trim() || 'Undisclosed',
        employees: form.employees.trim() || '10+',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        proofFiles: proofFileUrls,
        verificationInputs: {
          hasWebsite: !!form.website.trim(),
          hasLinkedIn: !!form.linkedin.trim(),
          hasDocuments: proofFileUrls.length > 0,
        },
        submittedBy: user!.uid,
        submittedByEmail: user!.email || '',
        submittedByName: user!.displayName || 'Anonymous',
        cin: form.cin.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Startup Submitted!</h1>
          <p className="text-sm text-white/50 mb-2">
            Thank you for submitting <span className="text-white font-medium">{form.name}</span>.
          </p>
          <p className="text-xs text-white/30 mb-6">
            Our admin team will verify your submission and review proof documents. Once approved, your startup will appear on the platform with a verification badge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explore" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg transition-all">
              Explore Startups
            </Link>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', website: '', linkedin: '', founder: '', email: '', sector: '', description: '', longDescription: '', founded: 2024, funding: '', employees: '', tags: '', cin: '' }); setFiles([]); }}
              className="px-6 py-3 rounded-xl glass-card text-sm text-white/60 hover:text-white transition-all">
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all";

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/explore" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to explore
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Submit a Startup</h1>
              <p className="text-xs text-white/40">Share a Hyderabad startup with the community</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="glass-card rounded-2xl p-5 mt-4 mb-4 border border-violet-500/10 bg-violet-500/5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-violet-300/80 font-medium mb-1">Verification System</p>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Submissions are verified before publishing. Provide LinkedIn and/or documents for a higher trust badge.
                  <span className="inline-flex items-center gap-1 ml-1 text-white/30">Basic <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span></span>
                  <span className="inline-flex items-center gap-1 ml-1 text-blue-400">Verified <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span></span>
                  <span className="inline-flex items-center gap-1 ml-1 text-emerald-400">Fully Verified <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span></span>
                </p>
              </div>
            </div>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
            {/* Required Section */}
            <div className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Required Information</div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Startup Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. TechStartup" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1"><Globe className="w-3 h-3" /> Website URL *</label>
                <input type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})} required placeholder="https://example.com" className={inputClass} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Founder Name *</label>
                <input type="text" value={form.founder} onChange={e => setForm({...form, founder: e.target.value})} required placeholder="e.g. Rahul Sharma" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="founder@startup.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Sector *</label>
              <input type="text" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} required placeholder="e.g. FinTech, HealthTech, SaaS" className={inputClass} />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Description * <span className="text-white/20">(min 50 chars — {form.description.length}/50)</span></label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe what the startup does, its core product, and value proposition..."
                className={`${inputClass} resize-none`} />
            </div>

            {/* Verification Section */}
            <div className="border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">Verification (Provide at least one)</div>
              <p className="text-[10px] text-white/20 mb-4">LinkedIn and/or documents increase your verification level</p>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1"><Link2 className="w-3 h-3" /> LinkedIn URL</label>
              <input type="url" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/company/..." className={inputClass} />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1"><Upload className="w-3 h-3" /> Proof Documents</label>
              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-violet-500/30 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-violet-500/50'); }}
                onDragLeave={e => e.currentTarget.classList.remove('border-violet-500/50')}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-violet-500/50'); handleFileAdd(e.dataTransfer.files); }}
              >
                <Upload className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="text-xs text-white/30">Drag & drop or click to upload</p>
                <p className="text-[10px] text-white/15 mt-1">PDF, JPEG, PNG · Max 5MB per file</p>
              </div>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={e => handleFileAdd(e.target.files)} />

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      {f.type === 'application/pdf' ? <FileText className="w-4 h-4 text-red-400 shrink-0" /> : <Image className="w-4 h-4 text-blue-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 truncate">{f.name}</p>
                        <p className="text-[10px] text-white/20">{(f.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Details */}
            <div className="border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-4">Additional Details (Optional)</div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Detailed Description</label>
              <textarea rows={3} value={form.longDescription} onChange={e => setForm({...form, longDescription: e.target.value})} placeholder="Tell us more about the startup, its mission, products, and achievements..."
                className={`${inputClass} resize-none`} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Founded Year</label>
                <input type="number" value={form.founded} onChange={e => setForm({...form, founded: parseInt(e.target.value)})} min={1990} max={2026} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Funding</label>
                <input type="text" value={form.funding} onChange={e => setForm({...form, funding: e.target.value})} placeholder="$5M, ₹10 Cr" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Team Size</label>
                <input type="text" value={form.employees} onChange={e => setForm({...form, employees: e.target.value})} placeholder="50+" className={inputClass} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="AI, SaaS, Enterprise" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">CIN Number (optional)</label>
                <input type="text" value={form.cin} onChange={e => setForm({...form, cin: e.target.value})} placeholder="U72200TG..." className={inputClass} />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting || uploading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading files ({uploadProgress}%)...</>
              ) : submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit for Verification</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
