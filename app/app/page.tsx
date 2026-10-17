import { listRefs } from "@/lib/refs";
import { Footer, Nav } from "./components/Chrome";
import { Tile } from "./components/Tile";

export const dynamic = "force-dynamic";

const STEPS = [
  { verb: "Publish", text: "Add an article or image, set a price per use, and drop in your Base wallet." },
  { verb: "Get used", text: "An agent finds your work, and its owner approves the payment in PayBox." },
  { verb: "Get paid", text: "USDC lands in your wallet right away. No platform holds it for you." },
];

export default async function Home() {
  const refs = await listRefs({ limit: 24 });
  const hero = refs.slice(0, 3);
  const library = refs.slice(0, 9);

  return (
    <>
      <main>
        <div className="hero-wrap">
        <Nav onDark />
        <section className="hero">
          <div className="hero-copy">
            <h1>
              Get paid when <mark>AI</mark> uses your work.
            </h1>
            <p className="hero-sub">Agents pay a few cents in USDC to cite your articles and images. The money goes straight to your wallet.</p>
            <div className="hero-actions">
              <a className="btn" href="/publish">
                Publish your work
              </a>
              <a className="btn btn-ghost" href="#library">
                Browse the library
              </a>
            </div>
          </div>

          <div className="hero-stack" aria-label="Recently published work">
            {hero.length === 0 ? (
              <a className="tile tile-empty" href="/publish">
                <strong className="tile-title">Be the first to publish</strong>
                <span className="tile-meta">Your piece shows up here the moment it is live.</span>
              </a>
            ) : (
              hero.map((r, i) => <Tile key={r.id} r={r} className={`stack-${i + 1}`} />)
            )}
          </div>
        </section>
        </div>

        <section className="how" id="how">
          <h2>From upload to payout in minutes</h2>
          <ol className="how-list">
            {STEPS.map((s) => (
              <li key={s.verb}>
                <span className="how-verb">{s.verb}</span>
                <span className="how-text">{s.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="library" id="library">
          <h2>Fresh in the library</h2>
          {library.length === 0 ? (
            <p className="note">Nothing published yet. Yours could be the first.</p>
          ) : (
            <div className="library-grid">
              {library.map((r, i) => (
                <Tile key={r.id} r={r} big={i === 0} className={i === 0 ? "span-feature" : ""} />
              ))}
            </div>
          )}
        </section>

        <section className="receipts" id="receipts">
          <div className="receipts-copy">
            <h2>Every use comes with a receipt</h2>
            <p>The agent gets your work plus a receipt anyone can check. It names you, the amount and the onchain transaction.</p>
          </div>
          <div className="receipt" role="group" aria-label="Sample receipt">
            <p className="receipt-tag">Sample receipt</p>
            <dl>
              <div>
                <dt>Work</dt>
                <dd>A field guide to rainy street photography</dd>
              </div>
              <div>
                <dt>Creator</dt>
                <dd>zed</dd>
              </div>
              <div>
                <dt>Paid</dt>
                <dd>$0.02 USDC</dd>
              </div>
              <div>
                <dt>Network</dt>
                <dd>Base</dd>
              </div>
              <div>
                <dt>Transaction</dt>
                <dd className="mono">0x9f3a...c41e</dd>
              </div>
            </dl>
            <p className="receipt-foot">Verified by the verify_receipt tool</p>
          </div>
        </section>

        <section className="band">
          <h2>Your work is already being read.</h2>
          <p>Publish it once and get paid every time an agent cites it.</p>
          <a className="btn btn-inverse" href="/publish">
            Publish your work
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
