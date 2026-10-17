import type { RefMeta } from "@/lib/types";

const TINTS = ["tint-yellow", "tint-mint", "tint-sky", "tint-pink"] as const;

export function tintFor(id: string) {
  let n = 0;
  for (const c of id) n += c.charCodeAt(0);
  return TINTS[n % TINTS.length];
}

export function Tile({ r, big = false, className = "" }: { r: RefMeta; big?: boolean; className?: string }) {
  return (
    <a className={`tile ${tintFor(r.id)} ${big ? "tile-big" : ""} ${className}`} href={`/r/${r.id}`}>
      {r.hasThumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="tile-img" src={`/api/refs/${r.id}/thumb`} alt="" />
      )}
      <span className="tile-kind">{r.kind === "text" ? "Article" : "Image"}</span>
      <strong className="tile-title">{r.title}</strong>
      {big && <span className="tile-preview">{r.preview}</span>}
      <span className="tile-foot">
        <span className="chip">${r.priceUsdc}</span>
        <span className="tile-meta">
          by {r.creator}, used {r.uses} {r.uses === 1 ? "time" : "times"}
        </span>
      </span>
    </a>
  );
}
