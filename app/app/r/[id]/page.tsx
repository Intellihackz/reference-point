import { notFound } from "next/navigation";
import { getRef } from "@/lib/refs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getRef(id);
  return { title: r ? `${r.title} | Reference Point` : "Reference Point" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getRef(id);
  if (!r) notFound();
  return (
    <main className="wrap">
      <p className="eyebrow">
        <a href="/">Reference Point</a>
      </p>
      <article className="card">
        {r.hasThumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="preview" src={`/api/refs/${r.id}/thumb`} alt="" />
        )}
        <h1>{r.title}</h1>
        <p className="meta">
          by {r.creator} · {r.kind === "text" ? "Text" : "Image"} · {r.uses} {r.uses === 1 ? "use" : "uses"}
        </p>
        <p>{r.preview}</p>
        <p className="pay">${r.priceUsdc} USDC per use</p>
        <p className="fine">
          License: {r.license}
        </p>
        <p className="fine">
          AI agents unlock the full piece through the PayBox plugin. Each use is paid straight to {r.creator}'s wallet and comes with a verifiable
          receipt.
        </p>
      </article>
    </main>
  );
}
