import { baseUrl, err } from "@/lib/http";
import { getContent, getReceipt, getRef } from "@/lib/refs";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const r = await getReceipt(id);
  if (!r) return err(404, "receipt not found");
  const full = new URL(req.url).searchParams.get("content") === "1";
  const ref = await getRef(r.refId);
  const content = full ? await getContent(r.refId) : null;
  const base = baseUrl(req);
  return Response.json(
    {
      valid: true,
      receiptId: r.id,
      referenceId: r.refId,
      title: r.title,
      creator: r.creator,
      payer: r.payer,
      transaction: r.transaction,
      amountUsdc: r.amountUsdc,
      license: r.license,
      paidAt: r.paidAt,
      kind: ref?.kind ?? null,
      text: content?.text ?? null,
      imageUrl: full && content?.image ? `${base}/api/receipts/${r.id}/file` : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
