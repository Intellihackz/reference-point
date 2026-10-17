import { randomBytes } from "node:crypto";
import { del, getJson, mget, pushList, readList, removeFromList, setJson } from "./store";
import type { Receipt, RefContent, RefMeta } from "./types";

const INDEX = "refs";

export const newId = () => randomBytes(9).toString("base64url");

export async function saveRef(meta: RefMeta, content: RefContent, thumb: string | null) {
  await setJson(`ref:${meta.id}`, meta);
  await setJson(`refc:${meta.id}`, content);
  if (thumb) await setJson(`reft:${meta.id}`, thumb);
  await pushList(INDEX, meta.id);
}

export async function removeRef(id: string) {
  await del(`ref:${id}`);
  await del(`refc:${id}`);
  await del(`reft:${id}`);
  await removeFromList(INDEX, id);
}

export const getRef = (id: string) => (/^[A-Za-z0-9_-]{8,40}$/.test(id) ? getJson<RefMeta>(`ref:${id}`) : Promise.resolve(null));
export const getContent = (id: string) => getJson<RefContent>(`refc:${id}`);
export const getThumb = (id: string) => getJson<string>(`reft:${id}`);
export const putRef = (meta: RefMeta) => setJson(`ref:${meta.id}`, meta);

export async function listRefs(opts: { q?: string; kind?: string; maxPrice?: number; limit?: number }): Promise<RefMeta[]> {
  const ids = await readList(INDEX, 300);
  const rows = (await mget<RefMeta>(ids.map((i) => `ref:${i}`))).filter((r): r is RefMeta => Boolean(r));
  const terms = (opts.q ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  const scored = rows
    .filter((r) => (!opts.kind || r.kind === opts.kind) && (opts.maxPrice === undefined || Number(r.priceUsdc) <= opts.maxPrice))
    .map((r) => {
      if (!terms.length) return { r, score: 1 };
      const title = r.title.toLowerCase();
      const tags = r.tags.join(" ").toLowerCase();
      const prev = r.preview.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += 3;
        if (tags.includes(t)) score += 2;
        if (prev.includes(t)) score += 1;
      }
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.r.uses - a.r.uses);
  return scored.slice(0, Math.min(opts.limit ?? 10, 25)).map((x) => x.r);
}

export const saveReceipt = (r: Receipt) => setJson(`rcpt:${r.id}`, r);
export const getReceipt = (id: string) => (/^[A-Za-z0-9_-]{8,40}$/.test(id) ? getJson<Receipt>(`rcpt:${id}`) : Promise.resolve(null));
