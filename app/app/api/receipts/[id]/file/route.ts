import { err } from "@/lib/http";
import { getContent, getReceipt } from "@/lib/refs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const r = await getReceipt(id);
  if (!r) return err(404, "receipt not found");
  const c = await getContent(r.refId);
  const m = c?.image ? /^data:(image\/[a-z]+);base64,(.+)$/.exec(c.image) : null;
  if (!m) return err(404, "no file");
  return new Response(Buffer.from(m[2], "base64"), { headers: { "Content-Type": m[1], "Cache-Control": "private, max-age=3600" } });
}
