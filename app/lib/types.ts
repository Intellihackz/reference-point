export type Kind = "text" | "image";

export type RefMeta = {
  id: string;
  kind: Kind;
  title: string;
  preview: string;
  tags: string[];
  creator: string;
  wallet: string;
  priceAtomic: string;
  priceUsdc: string;
  license: string;
  createdAt: string;
  uses: number;
  hasThumb: boolean;
};

export type RefContent = { text?: string; image?: string };

export type Receipt = {
  id: string;
  refId: string;
  title: string;
  creator: string;
  wallet: string;
  payer: string;
  transaction: string;
  amountUsdc: string;
  license: string;
  paidAt: string;
};

export const DEFAULT_LICENSE =
  "Use as a reference or source by an AI agent and its user, with attribution to the creator. No resale or redistribution of the original.";

export function publicRef(r: RefMeta, base: string) {
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    preview: r.preview,
    tags: r.tags,
    creator: r.creator,
    priceUsdc: r.priceUsdc,
    priceAtomic: r.priceAtomic,
    license: r.license,
    uses: r.uses,
    createdAt: r.createdAt,
    pageUrl: `${base}/r/${r.id}`,
    thumbnailUrl: r.hasThumb ? `${base}/api/refs/${r.id}/thumb` : null,
  };
}
