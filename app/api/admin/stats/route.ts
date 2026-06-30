import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { startups as staticStartups, jobs as staticJobs } from '@/data/startups';

export async function GET() {
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

    return NextResponse.json({
      totalStartups: startupsSnap.size || staticStartups.length,
      totalJobs: jobsSnap.size || staticJobs.length,
      totalSubmissions: subsSnap.size,
      pendingSubmissions: pendingCount,
      totalApplications: appsSnap.size,
      totalUsers: usersSnap.size,
    });
  } catch {
    return NextResponse.json({
      totalStartups: staticStartups.length,
      totalJobs: staticJobs.length,
      totalSubmissions: 0,
      pendingSubmissions: 0,
      totalApplications: 0,
      totalUsers: 0,
    });
  }
}
