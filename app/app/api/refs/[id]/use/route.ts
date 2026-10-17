import { baseUrl, err } from "@/lib/http";
import { getContent, getRef, newId, putRef, saveReceipt } from "@/lib/refs";
import type { Receipt } from "@/lib/types";
import { paymentRequired, requirements, verifyAndSettle } from "@/lib/x402";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ref = await getRef(id);
  if (!ref) return err(404, "reference not found");

  const base = baseUrl(req);
  const reqs = requirements({
    amount: ref.priceAtomic,
    payTo: ref.wallet,
    resource: `${base}/api/refs/${ref.id}/use`,
    description: `Use "${ref.title}" by ${ref.creator} as a reference. Pays the creator $${ref.priceUsdc} USDC directly.`,
  });

  const header = req.headers.get("x-payment");
  if (!header) return paymentRequired(reqs, "payment required");

  const content = await getContent(ref.id);
  if (!content) return err(500, "content missing");

  const settled = await verifyAndSettle(header, reqs);
  if (!settled.ok) return paymentRequired(reqs, settled.error);

  const receipt: Receipt = {
    id: newId(),
    refId: ref.id,
    title: ref.title,
    creator: ref.creator,
    wallet: ref.wallet,
    payer: settled.payer,
    transaction: settled.transaction,
    amountUsdc: ref.priceUsdc,
    license: ref.license,
    paidAt: new Date().toISOString(),
  };
  await saveReceipt(receipt);
  ref.uses += 1;
  await putRef(ref);

  const header64 = Buffer.from(
    JSON.stringify({ success: true, transaction: settled.transaction, network: "base", payer: settled.payer }),
  ).toString("base64");
  return Response.json(
    {
      receiptId: receipt.id,
      title: ref.title,
      creator: ref.creator,
      license: ref.license,
      kind: ref.kind,
      text: content.text ?? null,
      imageUrl: content.image ? `${base}/api/receipts/${receipt.id}/file` : null,
      transaction: settled.transaction,
      paidAt: receipt.paidAt,
    },
    { headers: { "X-PAYMENT-RESPONSE": header64 } },
  );
}
