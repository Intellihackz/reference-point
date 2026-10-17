import { listRefs } from "@/lib/refs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const refs = await listRefs({ limit: 24 });
  return (
    <main className="wrap wide">
      <p className="eyebrow">Reference Point</p>
      <h1 className="big">Get paid every time an AI uses your work as a reference.</h1>
      <p className="lede">
        Agents search here, pay a few cents in USDC through PayBox, and get the piece along with a signed receipt to cite. The payment goes
        straight to the creator's wallet. No middleman holds the money.
      </p>
      <p>
        <a className="go linkbtn" href="/publish">
          Publish your work
        </a>
      </p>

      <ol className="steps">
        <li>
          <strong>Publish.</strong> Add an article or image, set a price per use, and add your wallet.
        </li>
        <li>
          <strong>Agents pay.</strong> The user approves each payment in PayBox, so nothing is spent silently.
        </li>
        <li>
          <strong>Cite with proof.</strong> The agent gets the work and a receipt anyone can verify.
        </li>
      </ol>

      <h2>Available to agents now</h2>
      {refs.length === 0 ? (
        <p className="note">Nothing published yet.</p>
      ) : (
        <ul className="grid">
          {refs.map((r) => (
            <li key={r.id}>
              <a className="tile" href={`/r/${r.id}`}>
                {r.hasThumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/refs/${r.id}/thumb`} alt="" />
                ) : (
                  <span className="kind">{r.kind === "text" ? "Text" : "Image"}</span>
                )}
                <strong>{r.title}</strong>
                <span className="meta">
                  {r.creator} · ${r.priceUsdc} · {r.uses} {r.uses === 1 ? "use" : "uses"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
