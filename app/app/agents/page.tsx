import { Footer, Nav } from "../components/Chrome";
import CopyBlock from "../components/CopyBlock";

export const metadata = {
  title: "For agents | Reference Point",
  description: "Connect PayBox, enable Reference Point and add the skill so your agent checks creators first and pays them per use.",
};

const MCP_URL = "https://api.paybox.sh/mcp";
const PROMPT = "Write me a short caption about rainy city streets, and cite a source.";

const TOOLS = [
  { name: "search_references", text: "Find articles and images by keyword. Free." },
  { name: "use_reference", text: "Propose the USDC payment. You approve it in PayBox." },
  { name: "get_reference", text: "Read the full piece and its receipt after paying." },
  { name: "verify_receipt", text: "Check that a receipt is genuine." },
  { name: "cite_reference", text: "Format the citation with the creator and receipt id." },
];

export default function Page() {
  return (
    <>
      <Nav />
      <main className="doc">
        <h1 className="page-title">Use Reference Point with your agent</h1>
        <p className="lede">
          Your agent checks creators first whenever it needs a source. It pays a few cents in USDC through PayBox after you approve, then cites the
          creator with a receipt.
        </p>

        <section>
          <h2>Set it up</h2>
          <ol className="doc-steps">
            <li>
              <h3>Connect PayBox to your agent</h3>
              <p>
                In claude.ai, open Settings, then Connectors, and add a custom connector with this address. Sign in with your passkey and grant the wallet you want to
                pay from.
              </p>
              <CopyBlock text={MCP_URL} label="Copy the PayBox connector address" />
            </li>
            <li>
              <h3>Turn on the Reference Point plugin</h3>
              <p>In your PayBox account, open Plugins and switch on Reference Point. Start a new chat afterwards so the agent sees it.</p>
            </li>
            <li>
              <h3>Add the skill</h3>
              <p>
                The skill tells your agent to check Reference Point before the web, to tell you the price first, and to cite the creator. In claude.ai, open Settings,
                then Skills, and upload the file.
              </p>
              <div className="doc-actions">
                <a className="go" href="/reference-point-skill.zip" download>
                  Download the skill
                </a>
                <a className="go go-quiet" href="/SKILL.md">
                  Read SKILL.md
                </a>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2>Then ask for a source</h2>
          <p className="doc-p">You do not need to name the plugin. With the skill on, a normal request is enough.</p>
          <CopyBlock text={PROMPT} label="Copy the example prompt" />
          <p className="fine">The agent searches, tells you the piece and the price, and PayBox asks you to approve. Nothing is spent without that approval.</p>
        </section>

        <section>
          <h2>What the agent can do</h2>
          <ul className="doc-tools">
            {TOOLS.map((t) => (
              <li key={t.name}>
                <code>{t.name}</code>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Creators</h2>
          <p className="doc-p">Want to be found by agents? Publish an article or image, set your price per use, and add your wallet.</p>
          <a className="go" href="/publish">
            Publish your work
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
