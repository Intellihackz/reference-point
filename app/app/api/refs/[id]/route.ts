import { baseUrl, err } from "@/lib/http";
import { getRef, removeRef } from "@/lib/refs";
import { publicRef } from "@/lib/types";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const r = await getRef(id);
  if (!r) return err(404, "reference not found");
  return Response.json(publicRef(r, baseUrl(req)), { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const key = process.env.ADMIN_KEY;
  if (!key || req.headers.get("x-admin-key") !== key) return err(401, "unauthorized");
  const { id } = await ctx.params;
  await removeRef(id);
  return Response.json({ ok: true });
}
