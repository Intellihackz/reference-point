import { err } from "@/lib/http";
import { getThumb } from "@/lib/refs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const t = /^[A-Za-z0-9_-]{8,40}$/.test(id) ? await getThumb(id) : null;
  const m = t ? /^data:(image\/jpeg);base64,(.+)$/.exec(t) : null;
  if (!m) return err(404, "no thumbnail");
  return new Response(Buffer.from(m[2], "base64"), { headers: { "Content-Type": m[1], "Cache-Control": "public, max-age=86400" } });
}
