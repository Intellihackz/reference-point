const TTL_SECONDS = 60 * 60 * 24 * 90;
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

type Mem = { kv: Map<string, string>; lists: Map<string, string[]> };
const mem: Mem = ((globalThis as { __rpMem?: Mem }).__rpMem ??= { kv: new Map(), lists: new Map() });

async function redis(cmd: (string | number)[]): Promise<unknown> {
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store error ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export const usingRedis = Boolean(url && token);

export async function getJson<T>(key: string): Promise<T | null> {
  const raw = usingRedis ? ((await redis(["GET", key])) as string | null) : (mem.kv.get(key) ?? null);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function setJson(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  if (usingRedis) await redis(["SET", key, raw, "EX", TTL_SECONDS]);
  else mem.kv.set(key, raw);
}

export async function del(key: string): Promise<void> {
  if (usingRedis) await redis(["DEL", key]);
  else mem.kv.delete(key);
}

export async function pushList(key: string, value: string): Promise<void> {
  if (usingRedis) await redis(["LPUSH", key, value]);
  else mem.lists.set(key, [value, ...(mem.lists.get(key) ?? [])]);
}

export async function readList(key: string, max: number): Promise<string[]> {
  if (usingRedis) return ((await redis(["LRANGE", key, 0, max - 1])) as string[] | null) ?? [];
  return (mem.lists.get(key) ?? []).slice(0, max);
}

export async function removeFromList(key: string, value: string): Promise<void> {
  if (usingRedis) await redis(["LREM", key, 0, value]);
  else mem.lists.set(key, (mem.lists.get(key) ?? []).filter((v) => v !== value));
}

export async function mget<T>(keys: string[]): Promise<(T | null)[]> {
  if (!keys.length) return [];
  if (usingRedis) {
    const rows = (await redis(["MGET", ...keys])) as (string | null)[];
    return rows.map((r) => (r ? (JSON.parse(r) as T) : null));
  }
  return keys.map((k) => {
    const r = mem.kv.get(k);
    return r ? (JSON.parse(r) as T) : null;
  });
}
