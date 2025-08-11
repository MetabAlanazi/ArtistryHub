import { NextRequest, NextResponse } from 'next/server';
import { setEnabled, isEnabled, readWindow } from '@artistry-hub/utils';
import type { AppName } from '@artistry-hub/utils';
import { getCurrentUser } from '@artistry-hub/auth';

const APPS: AppName[] = ['store', 'admin', 'artist', 'operator', 'social-worker'].filter(Boolean) as AppName[];

async function isAdmin(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  
  const rows = await Promise.all(APPS.map(async (name) => {
    const enabled = await isEnabled(name);
    const w = await readWindow(name, 5);
    const avg = (w.ok + w.err) ? Math.round(w.sumMs / (w.ok + w.err)) : 0;
    return { name, enabled, ok: w.ok, err: w.err, avgMs: avg, windowMin: w.minutes };
  }));
  
  return NextResponse.json({ services: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  
  const secret = req.headers.get('x-ops-action') ?? '';
  if (secret !== process.env.OPS_ACTION_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  
  const { name, enabled } = await req.json() as { name: AppName, enabled: boolean };
  if (!['store', 'admin', 'artist', 'operator', 'social-worker'].includes(name)) {
    return NextResponse.json({ error: 'invalid app' }, { status: 400 });
  }
  
  await setEnabled(name as AppName, enabled);
  return NextResponse.json({ ok: true });
}
