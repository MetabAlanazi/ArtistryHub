import Redis from 'ioredis';

const url = process.env.REDIS_URL!;
const redis = url ? new Redis(url, { lazyConnect: true }) : null;

export type AppName = 'store' | 'admin' | 'artist' | 'operator' | 'social-worker';

export async function isEnabled(app: AppName): Promise<boolean> {
  try {
    if (!redis) return true;
    if (!redis.status || redis.status === 'end') await redis.connect();
    const v = await redis.get(`mw:${app}:enabled`);
    return v == null ? true : v === '1';
  } catch {
    return true; // fail-open
  }
}

// lightweight counters (sliding window minute buckets)
export async function incr(app: AppName, ok: boolean, ms: number) {
  try {
    if (!redis) return;
    const now = Math.floor(Date.now() / 1000);
    const bucket = Math.floor(now / 60); // per-minute
    const k = `mw:${app}:m:${bucket}`;
    await redis.hincrby(k, ok ? 'ok' : 'err', 1);
    await redis.hincrby(k, 'sumMs', Math.max(0, Math.round(ms)));
    await redis.expire(k, 60 * 10); // keep 10 minutes
  } catch {}
}

export async function setEnabled(app: AppName, flag: boolean) {
  if (!redis) throw new Error('redis not configured');
  await redis.set(`mw:${app}:enabled`, flag ? '1' : '0');
}

export async function readWindow(app: AppName, minutes = 5) {
  const now = Math.floor(Date.now() / 1000);
  const out = { ok: 0, err: 0, sumMs: 0, minutes };
  if (!redis) return out;
  const buckets: number[] = [];
  for (let i = 0; i < minutes; i++) buckets.push(Math.floor((now - i * 60) / 60));
  for (const b of buckets) {
    const k = `mw:${app}:m:${b}`;
    const m = await redis.hgetall(k);
    out.ok += Number(m.ok ?? 0);
    out.err += Number(m.err ?? 0);
    out.sumMs += Number(m.sumMs ?? 0);
  }
  return out;
}
