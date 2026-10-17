import { Brand } from "./Brand";
export function Nav({ onDark = false }: { onDark?: boolean }) {
  return (
    <header className={`nav${onDark ? " nav-dark" : ""}`}>
      <Brand />
      <nav className="nav-links" aria-label="Main">
        <a className="nav-link" href="/agents">
          For agents
        </a>
        <a className="nav-cta" href="/publish">
          Publish
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>Reference Point</span>
      <span>Payments are USDC on Base, approved in PayBox.</span>
    </footer>
  );
}
