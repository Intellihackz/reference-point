const FACILITATOR = process.env.FACILITATOR_URL ?? "https://facilitator.payai.network";
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export type Requirements = {
  scheme: "exact";
  network: "base";
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: { name: string; version: string };
};

export function requirements(input: { amount: string; payTo: string; resource: string; description: string }): Requirements {
  return {
    scheme: "exact",
    network: "base",
    maxAmountRequired: input.amount,
    resource: input.resource,
    description: input.description,
    mimeType: "application/json",
    payTo: input.payTo,
    maxTimeoutSeconds: 60,
    asset: USDC_BASE,
    extra: { name: "USD Coin", version: "2" },
  };
}

export function paymentRequired(reqs: Requirements, error: string): Response {
  return Response.json({ x402Version: 1, error, accepts: [reqs] }, { status: 402 });
}

async function facilitator(path: "verify" | "settle", body: unknown) {
  const res = await fetch(`${FACILITATOR}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: `facilitator ${res.status}` } as Record<string, unknown>;
  }
}

export type Settled = { ok: true; transaction: string; payer: string } | { ok: false; error: string };

export async function verifyAndSettle(header: string, reqs: Requirements): Promise<Settled> {
  let paymentPayload: unknown;
  try {
    paymentPayload = JSON.parse(Buffer.from(header, "base64").toString("utf8"));
  } catch {
    return { ok: false, error: "invalid X-PAYMENT header" };
  }
  const body = { x402Version: 1, paymentPayload, paymentRequirements: reqs };
  const v = await facilitator("verify", body);
  if (v.isValid !== true) return { ok: false, error: String(v.invalidReason ?? v.error ?? "payment invalid") };
  const s = await facilitator("settle", body);
  if (s.success !== true) return { ok: false, error: String(s.errorReason ?? s.error ?? "settlement failed") };
  return { ok: true, transaction: String(s.transaction ?? ""), payer: String(s.payer ?? v.payer ?? "") };
}
