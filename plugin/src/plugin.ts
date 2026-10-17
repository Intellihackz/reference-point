import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { proposeX402, x402OutputSchema } from "./paybox.js";

const PROTOCOL_VERSION = "2026-07-28";
const API = (process.env.REFERENCE_API ?? "https://point-reference.vercel.app").replace(/\/$/, "");

const refId = z.string().regex(/^[A-Za-z0-9_-]{8,40}$/).describe("Reference id from search_references");
const receiptId = z.string().regex(/^[A-Za-z0-9_-]{8,40}$/).describe("Receipt id from the paid use_reference response");

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(6000) });
  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Reference Point service error (${res.status})`);
  }
  if (!res.ok) throw new Error(String((body as { error?: string }).error ?? `Reference Point service error (${res.status})`));
  return body as T;
}

type Ref = {
  id: string;
  kind: "text" | "image";
  title: string;
  preview: string;
  tags: string[];
  creator: string;
  priceUsdc: string;
  priceAtomic: string;
  license: string;
  uses: number;
  pageUrl: string;
  thumbnailUrl: string | null;
};

type ReceiptBody = {
  receiptId: string;
  referenceId?: string;
  title: string;
  creator: string;
  payer?: string;
  transaction: string;
  amountUsdc?: string;
  license: string;
  paidAt: string;
  kind: "text" | "image" | null;
  text: string | null;
  imageUrl: string | null;
};

const receiptShape = {
  receipt_id: z.string(),
  title: z.string(),
  creator: z.string(),
  amount_usdc: z.string(),
  payer: z.string(),
  transaction: z.string(),
  paid_at: z.string(),
  license: z.string(),
  basescan_url: z.string(),
};

function receiptOut(r: ReceiptBody) {
  return {
    receipt_id: r.receiptId,
    title: r.title,
    creator: r.creator,
    amount_usdc: r.amountUsdc ?? "",
    payer: r.payer ?? "",
    transaction: r.transaction,
    paid_at: r.paidAt,
    license: r.license,
    basescan_url: `https://basescan.org/tx/${r.transaction}`,
  };
}

function createServer() {
  const server = new McpServer({ name: "reference-point", version: "0.1.0" }, { supportedProtocolVersions: [PROTOCOL_VERSION] });

  server.registerTool(
    "cite_reference",
    {
      title: "Format a citation",
      description:
        "Builds the attribution line to include when you use a paid reference in an answer or document. Pass the details returned by get_reference.",
      inputSchema: z
        .object({
          title: z.string().min(1).max(200),
          creator: z.string().min(1).max(100),
          receipt_id: z.string().min(1).max(60),
          url: z.string().max(500).optional(),
        })
        .strict(),
      outputSchema: z.object({ citation: z.string() }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ title, creator, receipt_id, url }) => {
      const citation = `"${title}" by ${creator}${url ? ` (${url})` : ""}. Used under license via Reference Point, receipt ${receipt_id}.`;
      return { content: [{ type: "text", text: citation }], structuredContent: { citation } };
    },
  );

  server.registerTool(
    "search_references",
    {
      title: "Search paid references",
      description:
        "Free search of creator-published articles and images that an agent may pay to use as a reference. Returns titles, a public preview, the price in USDC and the creator. The full content stays locked until use_reference is paid.",
      inputSchema: z
        .object({
          query: z.string().max(200).optional().describe("Keywords, for example 'rainy tokyo street'"),
          kind: z.enum(["text", "image"]).optional(),
          max_price_usdc: z.number().min(0.01).max(25).optional().describe("Skip anything pricier than this"),
          limit: z.number().int().min(1).max(25).optional().describe("Default 10"),
        })
        .strict(),
      outputSchema: z
        .object({
          results: z.array(
            z
              .object({
                reference_id: z.string(),
                kind: z.enum(["text", "image"]),
                title: z.string(),
                preview: z.string(),
                tags: z.array(z.string()),
                creator: z.string(),
                price_usdc: z.string(),
                times_used: z.number(),
                license: z.string(),
                page_url: z.string(),
                thumbnail_url: z.string().nullable(),
              })
              .strict(),
          ),
          next_step: z.string(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (a) => {
      const q = new URLSearchParams();
      if (a.query) q.set("q", a.query);
      if (a.kind) q.set("kind", a.kind);
      if (a.max_price_usdc !== undefined) q.set("max_price", String(a.max_price_usdc));
      q.set("limit", String(a.limit ?? 10));
      const { results } = await api<{ results: Ref[] }>(`/api/refs?${q}`);
      const out = {
        results: results.map((r) => ({
          reference_id: r.id,
          kind: r.kind,
          title: r.title,
          preview: r.preview,
          tags: r.tags,
          creator: r.creator,
          price_usdc: r.priceUsdc,
          times_used: r.uses,
          license: r.license,
          page_url: r.pageUrl,
          thumbnail_url: r.thumbnailUrl,
        })),
        next_step: results.length
          ? "To use one, call use_reference with its reference_id. The user approves the USDC payment in PayBox, then call get_reference with the receipt id."
          : "No matches. Try broader keywords or remove filters.",
      };
      const lines = out.results.map((r) => `${r.reference_id} | ${r.title} by ${r.creator} | $${r.price_usdc} | ${r.kind}`);
      return { content: [{ type: "text", text: lines.length ? lines.join("\n") : "No matches." }], structuredContent: out };
    },
  );

  server.registerTool(
    "use_reference",
    {
      title: "Pay to use a reference",
      description:
        "Proposes an x402 USDC payment on Base that goes directly to the creator's wallet and unlocks the full piece plus a receipt. PayBox asks the user to approve it. After approval, poll the PayBox request: the paid response contains the receipt id. Do not call this again to check on the payment.",
      inputSchema: z.object({ reference_id: refId }).strict(),
      outputSchema: x402OutputSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ reference_id }) => {
      const r = await api<Ref>(`/api/refs/${reference_id}`);
      return proposeX402({
        chain: "eip155:8453",
        url: `${API}/api/refs/${reference_id}/use`,
        method: "GET",
        maxAmount: r.priceAtomic,
      });
    },
  );

  server.registerTool(
    "get_reference",
    {
      title: "Get a paid reference",
      description:
        "Free. After use_reference was paid, fetch the full text or image link, the license, and the receipt using the receipt id from the paid response.",
      inputSchema: z.object({ receipt_id: receiptId }).strict(),
      outputSchema: z
        .object({
          ...receiptShape,
          kind: z.enum(["text", "image"]).nullable(),
          text: z.string().nullable(),
          image_url: z.string().nullable(),
          cite_as: z.string(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ receipt_id }) => {
      const r = await api<ReceiptBody>(`/api/receipts/${receipt_id}?content=1`);
      const out = {
        ...receiptOut(r),
        kind: r.kind,
        text: r.text,
        image_url: r.imageUrl,
        cite_as: `"${r.title}" by ${r.creator}. Used under license via Reference Point, receipt ${r.receiptId}.`,
      };
      return {
        content: [{ type: "text", text: `${r.title} by ${r.creator}\n\n${r.text ?? `Image: ${r.imageUrl}`}\n\nCite as: ${out.cite_as}` }],
        structuredContent: out,
      };
    },
  );

  server.registerTool(
    "verify_receipt",
    {
      title: "Verify a usage receipt",
      description:
        "Free. Confirms that a receipt is genuine: which work, which creator, who paid, how much, and the onchain transaction. Use it to check someone else's citation.",
      inputSchema: z.object({ receipt_id: receiptId }).strict(),
      outputSchema: z.object({ valid: z.boolean(), ...receiptShape }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ receipt_id }) => {
      const r = await api<ReceiptBody>(`/api/receipts/${receipt_id}`);
      const out = { valid: true, ...receiptOut(r) };
      return {
        content: [{ type: "text", text: `Valid. ${r.creator} was paid $${out.amount_usdc} USDC for "${r.title}" (tx ${r.transaction}).` }],
        structuredContent: out,
      };
    },
  );

  return server;
}

serveStdio(createServer, { legacy: "reject" });
