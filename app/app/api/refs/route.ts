import { baseUrl, err, toAtomic } from "@/lib/http";
import { listRefs, newId, saveRef } from "@/lib/refs";
import { DEFAULT_LICENSE, publicRef, type RefContent, type RefMeta } from "@/lib/types";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const max = u.searchParams.get("max_price");
  const rows = await listRefs({
    q: u.searchParams.get("q") ?? undefined,
    kind: u.searchParams.get("kind") ?? undefined,
    maxPrice: max === null ? undefined : Number(max),
    limit: Number(u.searchParams.get("limit") ?? 10) || 10,
  });
  const base = baseUrl(req);
  return Response.json({ results: rows.map((r) => publicRef(r, base)) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return err(400, "invalid JSON");
  }
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const kind = b.kind === "image" ? "image" : b.kind === "text" ? "text" : null;
  const title = str(b.title);
  const preview = str(b.preview);
  const creator = str(b.creator);
  const wallet = str(b.wallet);
  const price = Number(b.priceUsdc);
  const license = str(b.license) || DEFAULT_LICENSE;
  const tags = (Array.isArray(b.tags) ? b.tags : []).map(str).filter(Boolean).slice(0, 8).map((t) => t.slice(0, 24).toLowerCase());

  if (!kind) return err(400, "kind must be text or image");
  if (title.length < 3 || title.length > 120) return err(400, "title must be 3-120 characters");
  if (preview.length < 10 || preview.length > 300) return err(400, "preview must be 10-300 characters");
  if (creator.length < 2 || creator.length > 60) return err(400, "creator name must be 2-60 characters");
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) return err(400, "wallet must be a Base (EVM) address");
  if (!Number.isFinite(price) || price < 0.01 || price > 25) return err(400, "priceUsdc must be between 0.01 and 25");
  if (license.length > 400) return err(400, "license text too long");

  const content: RefContent = {};
  let thumb: string | null = null;
  if (kind === "text") {
    const text = str(b.text);
    if (text.length < 40 || text.length > 12000) return err(400, "text must be 40-12000 characters");
    content.text = text;
  } else {
    const image = typeof b.image === "string" ? b.image : "";
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > 900_000) return err(400, "image must be a JPEG/PNG/WebP under ~650 KB");
    content.image = image;
    const t = typeof b.thumb === "string" ? b.thumb : "";
    if (/^data:image\/jpeg;base64,/.test(t) && t.length < 40_000) thumb = t;
  }

  const meta: RefMeta = {
    id: newId(),
    kind,
    title,
    preview,
    tags,
    creator,
    wallet,
    priceAtomic: toAtomic(price),
    priceUsdc: price.toFixed(2),
    license,
    createdAt: new Date().toISOString(),
    uses: 0,
    hasThumb: Boolean(thumb),
  };
  await saveRef(meta, content, thumb);
  return Response.json(publicRef(meta, baseUrl(req)), { status: 201 });
}
