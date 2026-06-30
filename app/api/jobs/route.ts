import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { jobs as staticJobs } from '@/data/startups';
import type { Job } from '@/data/startups';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const companyId = searchParams.get('companyId');

    const firestore = db;
    if (!firestore) throw new Error('Firestore not configured');

    const snap = await getDocs(collection(firestore, 'jobs'));
    let jobs: Job[];

    if (snap.empty) {
      jobs = staticJobs;
    } else {
      jobs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Job));
    }

    // Filter
    if (category && category !== 'All') {
      jobs = jobs.filter(j => j.category === category);
    }
    if (companyId) {
      jobs = jobs.filter(j => j.companyId === companyId);
    }

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ jobs: staticJobs, total: staticJobs.length });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.company) {
      return NextResponse.json({ error: 'Title and company are required' }, { status: 400 });
    }

    const firestore = db;
    if (!firestore) throw new Error('Firestore not configured');

    const ref = await addDoc(collection(firestore, 'jobs'), {
      ...body,
      startupId: body.startupId || body.companyId,
      source: body.source || 'manual',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id, success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
