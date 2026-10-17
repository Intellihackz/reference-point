import { listRefs } from "@/lib/refs";
import { Footer, Nav } from "./components/Chrome";
import { Tile } from "./components/Tile";

export const dynamic = "force-dynamic";

export default async function Home() {
  const refs = await listRefs({ limit: 24 });
  const hero = refs.slice(0, 3);

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
      </main>
      <Footer />
    </>
  );
}
