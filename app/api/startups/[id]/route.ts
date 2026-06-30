import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { startups as staticStartups } from '@/data/startups';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/startups/[id]'>) {
  const { id } = await ctx.params;
  try {
    const firestore = db;
    if (!firestore) throw new Error('Firestore not configured');

    const d = await getDoc(doc(firestore, 'startups', id));
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
    const firestore = db;
    if (!firestore) throw new Error('Firestore not configured');

    await updateDoc(doc(firestore, 'startups', id), {
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
    const firestore = db;
    if (!firestore) throw new Error('Firestore not configured');

    await deleteDoc(doc(firestore, 'startups', id));
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('DELETE /api/startups/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 });
  }
}
