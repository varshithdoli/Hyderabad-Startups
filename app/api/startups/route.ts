<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { startups as staticStartups } from '@/data/startups';
import type { Startup } from '@/data/startups';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const stage = searchParams.get('stage');
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Fetch from Firestore
    const snap = await getDocs(collection(db, 'startups'));
    let startups: Startup[];

    if (snap.empty) {
      startups = staticStartups;
    } else {
      startups = snap.docs.map(d => {
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
    }

    // Apply filters
    if (sector) {
      startups = startups.filter(s =>
        s.sector.toLowerCase().includes(sector.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(sector.toLowerCase()))
      );
    }
    if (stage) {
      startups = startups.filter(s => s.stage === stage);
    }
    if (q) {
      const query = q.toLowerCase();
      startups = startups.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.sector.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Pagination
    const total = startups.length;
    const start = (page - 1) * limit;
    const paginated = startups.slice(start, start + limit);

    return NextResponse.json({
      startups: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/startups error:', error);
    // Fallback to static data on error
    return NextResponse.json({
      startups: staticStartups,
      total: staticStartups.length,
      page: 1,
      limit: 50,
      totalPages: 1,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.sector) {
      return NextResponse.json({ error: 'Name and sector are required' }, { status: 400 });
    }

    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await setDoc(doc(db, 'startups', id), {
      ...body,
      id,
      verified: body.verified ?? true,
      verificationLevel: body.verificationLevel || 'high',
      source: body.source || 'admin',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id, success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/startups error:', error);
    return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 });
  }
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:5423973d3c99802c9ac12d935517e3f30bbcc8e7bf23ed313b041dd8e282c254
size 3881
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
