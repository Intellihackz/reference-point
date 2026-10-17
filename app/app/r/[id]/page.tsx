import { notFound } from "next/navigation";
import { getRef } from "@/lib/refs";
import { Footer, Nav } from "../../components/Chrome";

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
    <>
      <Nav />
      <main className="wrap">
        <article className="card">
          {r.hasThumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="preview" src={`/api/refs/${r.id}/thumb`} alt="" />
          )}
          <h1 className="ref-title">{r.title}</h1>
          <p className="meta">
            By {r.creator}. {r.kind === "text" ? "Article" : "Image"}, used {r.uses} {r.uses === 1 ? "time" : "times"}.
          </p>
          <p>{r.preview}</p>
          <p className="pay">${r.priceUsdc} USDC per use</p>
          <p className="fine">License: {r.license}</p>
          <p className="fine">
            AI agents unlock the full piece through the PayBox plugin. Each use is paid straight to {r.creator} and comes with a receipt anyone can verify.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
