<<<<<<< HEAD
import { db } from './firebase';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  setDoc, query, where, serverTimestamp, orderBy
} from 'firebase/firestore';
import { startups as staticStartups, jobs as staticJobs } from '@/data/startups';
import type { Startup, Job } from '@/data/startups';

// ─── STARTUPS ───────────────────────────────────────────────
export async function getStartups(): Promise<Startup[]> {
  try {
    const snap = await getDocs(collection(db, 'startups'));
    if (snap.empty) return staticStartups;
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || 'Unnamed',
        logo: data.logo || '🚀',
        sector: data.sector || 'Tech',
        description: data.description || '',
        longDescription: data.longDescription || data.description || '',
        founded: data.founded || 2024,
        funding: data.funding || 'Undisclosed',
        fundingNum: data.fundingNum || 0,
        stage: data.stage || 'Seed',
        employees: data.employees || '10+',
        employeesNum: data.employeesNum || 0,
        website: data.website || '',
        tags: data.tags || [],
        investors: data.investors || [],
        isUnicorn: data.isUnicorn || false,
        isSoonicorn: data.isSoonicorn || false,
        verified: data.verified,
        verificationLevel: data.verificationLevel,
        source: data.source,
        linkedin: data.linkedin,
        founder: data.founder,
      } as Startup;
    });
  } catch (e) {
    console.warn('getStartups fallback to static:', e);
    return staticStartups;
  }
}

export async function getStartupById(id: string): Promise<Startup | null> {
  try {
    const d = await getDoc(doc(db, 'startups', id));
    if (d.exists()) return { ...d.data(), id: d.id } as Startup;
    return staticStartups.find(s => s.id === id) || null;
  } catch {
    return staticStartups.find(s => s.id === id) || null;
  }
}

export async function addStartup(startup: Omit<Startup, 'id'> & { id?: string }): Promise<string> {
  const id = startup.id || startup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  await setDoc(doc(db, 'startups', id), {
    ...startup, id,
    verified: startup.verified ?? true,
    verificationLevel: startup.verificationLevel || 'high',
    source: startup.source || 'admin',
    createdAt: serverTimestamp()
  });
  return id;
}

export async function updateStartup(id: string, data: Partial<Startup>): Promise<void> {
  await updateDoc(doc(db, 'startups', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteStartup(id: string): Promise<void> {
  await deleteDoc(doc(db, 'startups', id));
}

// ─── JOBS ───────────────────────────────────────────────────
export async function getJobs(): Promise<Job[]> {
  try {
    const snap = await getDocs(collection(db, 'jobs'));
    if (snap.empty) return staticJobs;
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Job));
  } catch (e) {
    console.warn('getJobs fallback to static:', e);
    return staticJobs;
  }
}

export async function getJobsByStartup(startupId: string): Promise<Job[]> {
  try {
    const q = query(collection(db, 'jobs'), where('companyId', '==', startupId));
    const snap = await getDocs(q);
    if (snap.empty) return staticJobs.filter(j => j.companyId === startupId);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Job));
  } catch {
    return staticJobs.filter(j => j.companyId === startupId);
  }
}

export async function addJob(job: Omit<Job, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'jobs'), {
    ...job,
    startupId: job.startupId || job.companyId,
    source: job.source || 'manual',
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateJob(id: string, data: Partial<Job>): Promise<void> {
  await updateDoc(doc(db, 'jobs', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, 'jobs', id));
}

// ─── STARTUP SUBMISSIONS (Enhanced with verification) ───────
export interface StartupSubmission {
  id?: string;
  name: string;
  website: string;
  linkedin: string;
  founder: string;
  email: string;
  sector: string;
  description: string;
  longDescription: string;
  founded: number;
  funding: string;
  employees: string;
  tags: string[];
  proofFiles: string[];
  verificationInputs: {
    hasWebsite: boolean;
    hasLinkedIn: boolean;
    hasDocuments: boolean;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedByEmail: string;
  submittedByName: string;
  createdAt?: any;
  reviewedAt?: any;
  reviewedBy?: string | null;
  reviewNote?: string;
  cin?: string;
}

export async function submitStartup(submission: Omit<StartupSubmission, 'id' | 'status' | 'createdAt' | 'reviewedAt' | 'reviewedBy'>): Promise<string> {
  const ref = await addDoc(collection(db, 'startup_submissions'), {
    ...submission,
    status: 'pending',
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getSubmissions(statusFilter?: string): Promise<StartupSubmission[]> {
  try {
    let q;
    if (statusFilter) {
      q = query(collection(db, 'startup_submissions'), where('status', '==', statusFilter));
    } else {
      q = collection(db, 'startup_submissions');
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as StartupSubmission));
  } catch {
    return [];
  }
}

function computeVerificationLevel(submission: StartupSubmission): 'basic' | 'medium' | 'high' {
  if (submission.verificationInputs?.hasDocuments && submission.proofFiles?.length > 0) {
    return 'high';
  }
  if (submission.verificationInputs?.hasLinkedIn && submission.linkedin) {
    return 'medium';
  }
  return 'basic';
}

export async function approveSubmission(submissionId: string, reviewerEmail: string): Promise<void> {
  const subDoc = await getDoc(doc(db, 'startup_submissions', submissionId));
  if (!subDoc.exists()) throw new Error('Submission not found');

  const data = subDoc.data() as StartupSubmission;
  const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const verificationLevel = computeVerificationLevel(data);

  // Create startup in startups collection
  await setDoc(doc(db, 'startups', id), {
    id,
    name: data.name,
    logo: '🚀',
    sector: data.sector,
    description: data.description,
    longDescription: data.longDescription || data.description,
    founded: data.founded || 2024,
    funding: data.funding || 'Undisclosed',
    fundingNum: 0,
    stage: 'Seed',
    employees: data.employees || '10+',
    employeesNum: 10,
    website: data.website || '',
    linkedin: data.linkedin || '',
    founder: data.founder || '',
    tags: data.tags || [data.sector],
    investors: [],
    // Verification fields
    verified: true,
    verificationLevel,
    source: 'user_submission',
    submittedBy: data.submittedBy,
    createdAt: serverTimestamp(),
  });

  // Update submission status
  await updateDoc(doc(db, 'startup_submissions', submissionId), {
    status: 'approved',
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerEmail,
  });
}

export async function rejectSubmission(submissionId: string, reviewerEmail: string, note?: string): Promise<void> {
  await updateDoc(doc(db, 'startup_submissions', submissionId), {
    status: 'rejected',
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerEmail,
    reviewNote: note || '',
  });
}

// ─── JOB APPLICATIONS ──────────────────────────────────────
export interface JobApplication {
  id?: string;
  jobId: string;
  startupId?: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  applicantUid?: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'applied' | 'sent' | 'viewed' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

export async function applyToJob(application: Omit<JobApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'job_applications'), {
    ...application,
    status: 'applied',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getApplications(): Promise<JobApplication[]> {
  try {
    const snap = await getDocs(collection(db, 'job_applications'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as JobApplication));
  } catch {
    return [];
  }
}

export async function getApplicationsByUser(uid: string): Promise<JobApplication[]> {
  try {
    const q = query(collection(db, 'job_applications'), where('applicantUid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as JobApplication));
  } catch {
    return [];
  }
}

export async function updateApplicationStatus(id: string, status: JobApplication['status']): Promise<void> {
  await updateDoc(doc(db, 'job_applications', id), { status, updatedAt: serverTimestamp() });
}

// Send application email via mailto (client-side fallback — no server needed)
export function buildApplicationEmail(app: JobApplication): string {
  const subject = encodeURIComponent(`New Job Application – ${app.jobTitle}`);
  const body = encodeURIComponent(
    `New application received via StartupHyd platform.\n\n` +
    `Position: ${app.jobTitle}\n` +
    `Applicant: ${app.applicantName}\n` +
    `Email: ${app.applicantEmail}\n` +
    `Cover Letter:\n${app.coverLetter || 'N/A'}\n\n` +
    `Resume: ${app.resumeUrl}\n`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

// ─── USERS ──────────────────────────────────────────────────
export interface UserRecord {
  uid: string;
  name: string;
  email: string;
  savedStartups: string[];
  role?: string;
  createdAt?: any;
}

export async function getUsers(): Promise<UserRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserRecord);
  } catch {
    return [];
  }
}

// ─── SEED DATABASE ──────────────────────────────────────────
export async function seedDatabase(): Promise<{ startups: number; jobs: number }> {
  // Step 1: Delete ALL existing startups and jobs (cleans up old auto-generated IDs)
  const existingStartups = await getDocs(collection(db, 'startups'));
  for (const d of existingStartups.docs) {
    await deleteDoc(doc(db, 'startups', d.id));
  }
  const existingJobs = await getDocs(collection(db, 'jobs'));
  for (const d of existingJobs.docs) {
    await deleteDoc(doc(db, 'jobs', d.id));
  }

  // Step 2: Seed fresh data with correct IDs
  let startupCount = 0;
  let jobCount = 0;

  for (const s of staticStartups) {
    await setDoc(doc(db, 'startups', s.id), {
      ...s,
      verified: true,
      verificationLevel: 'high',
      source: 'admin',
      createdAt: serverTimestamp()
    });
    startupCount++;
  }

  for (const j of staticJobs) {
    await setDoc(doc(db, 'jobs', j.id), {
      ...j,
      startupId: j.companyId,
      source: 'manual',
      createdAt: serverTimestamp()
    });
    jobCount++;
  }

  return { startups: startupCount, jobs: jobCount };
}

// ─── ADMIN STATS ────────────────────────────────────────────
export async function getAdminStats() {
  try {
    const [startupsSnap, jobsSnap, subsSnap, appsSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'startups')),
      getDocs(collection(db, 'jobs')),
      getDocs(collection(db, 'startup_submissions')),
      getDocs(collection(db, 'job_applications')),
      getDocs(collection(db, 'users')),
    ]);

    const submissions = subsSnap.docs.map(d => d.data());
    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    return {
      totalStartups: startupsSnap.size || staticStartups.length,
      totalJobs: jobsSnap.size || staticJobs.length,
      totalSubmissions: subsSnap.size,
      pendingSubmissions: pendingCount,
      totalApplications: appsSnap.size,
      totalUsers: usersSnap.size,
    };
  } catch {
    return {
      totalStartups: staticStartups.length,
      totalJobs: staticJobs.length,
      totalSubmissions: 0,
      pendingSubmissions: 0,
      totalApplications: 0,
      totalUsers: 0,
    };
  }
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:b1c8bfc86f8a00dc3eb34ff71649bc1834c2845d7f1887d839398212b6f3313a
size 13026
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
