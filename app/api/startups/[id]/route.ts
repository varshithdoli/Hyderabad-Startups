<<<<<<< HEAD
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { startups as staticStartups } from '@/data/startups';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/startups/[id]'>) {
  const { id } = await ctx.params;
  try {
    const d = await getDoc(doc(db, 'startups', id));
    if (d.exists()) {
      return NextResponse.json({ ...d.data(), id: d.id });
    }
    // Fallback to static
    const found = staticStartups.find(s => s.id === id);
    if (found) return NextResponse.json(found);

    return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
  } catch {
    const found = staticStartups.find(s => s.id === id);
    if (found) return NextResponse.json(found);
    return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/startups/[id]'>) {
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    await updateDoc(doc(db, 'startups', id), {
      ...body,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('PATCH /api/startups/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/startups/[id]'>) {
  const { id } = await ctx.params;
  try {
    await deleteDoc(doc(db, 'startups', id));
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('DELETE /api/startups/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 });
  }
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:2d101d2ee3cd4e53ff220fafa65f0740a929f6226da8f90e3c98d6b2198189cc
size 1873
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
