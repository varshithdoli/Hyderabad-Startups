<<<<<<< HEAD
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

    const snap = await getDocs(collection(db, 'jobs'));
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

    const ref = await addDoc(collection(db, 'jobs'), {
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
=======
version https://git-lfs.github.com/spec/v1
oid sha256:2b42a31611ec9e81a7e09dc72c4b9c4374430aa93532d7e903ed9aebd33681a6
size 1784
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
