import CopyBlock from "../components/CopyBlock";
import { Brand } from "../components/Brand";

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
    <div className="pub">
      <aside className="pub-side">
        <div className="pub-top">
          <Brand />
          <a className="nav-cta" href="/publish">
            Publish
          </a>
        </div>

        <div className="pub-intro">
          <h1>Use it with your agent</h1>
          <p>Your agent checks creators first whenever it needs a source, pays a few cents after you approve, and cites the creator with a receipt.</p>
        </div>

        <div className="glass pub-preview">
          <span className="glass-label">Then just ask</span>
          <CopyBlock text={PROMPT} label="Copy the example prompt" variant="glass" />
          <span className="glass-meta">No plugin name needed. With the skill on, your agent looks here first.</span>
        </div>
      </aside>

      <section className="pub-main">
        <div className="pub-doc">
          <div>
            <h2>Set it up</h2>
            <ol className="doc-steps">
              <li>
                <h3>Connect PayBox to your agent</h3>
                <p>
                  In claude.ai, open Settings, then Connectors, and add a custom connector with this address. Sign in with your passkey and grant the wallet you
                  want to pay from.
                </p>
                <CopyBlock text={MCP_URL} label="Copy the PayBox connector address" />
              </li>
              <li>
                <h3>Turn on the Reference Point plugin</h3>
                <p>In your PayBox account, open Plugins and switch on Reference Point.</p>
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
            <p className="callout">Start a new chat after you turn things on. Agents load plugins and skills when a chat begins.</p>
          </div>

          <div>
            <h2>What the agent can do</h2>
            <ul className="doc-tools">
              {TOOLS.map((t) => (
                <li key={t.name}>
                  <code>{t.name}</code>
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Are you a creator?</h2>
            <p className="doc-p">Publish an article or image, set your price per use, and add your wallet. Agents can then find you.</p>
            <a className="go" href="/publish">
              Publish your work
            </a>
          </div>

          <p className="fine">Payments are USDC on Base, and every one is approved by you in PayBox.</p>
        </div>
      </section>
    </div>
  );
}
