import { listRefs } from "@/lib/refs";
import { Nav } from "./components/Chrome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latest] = await listRefs({ limit: 1 });

  return (
    <main className="hero">
      <Nav onDark />
      <div className="hero-body">
        <div className="hero-copy">
          <h1>
            Get paid when AI <br className="br-lg" />
            uses your work.
          </h1>
          <p className="hero-sub">Agents pay a few cents in USDC to use your work as a reference. The money goes straight to your wallet.</p>
          <div className="cta-row">
            <a className="cta" href="/publish">
              Publish your work
            </a>
            <a className="cta cta-quiet" href="/agents">
              Use it with your agent
            </a>
          </div>
        </div>

        {latest && (
          <a className="glass" href={`/r/${latest.id}`}>
            <span className="glass-label">Latest published</span>
            <strong>{latest.title}</strong>
            <span className="glass-meta">
              by {latest.creator}, ${latest.priceUsdc} per use
            </span>
          </a>
        )}
      </div>
    </main>
  );
}
