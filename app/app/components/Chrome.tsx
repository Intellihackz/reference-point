export function Nav({ onDark = false }: { onDark?: boolean }) {
  return (
    <header className={`nav${onDark ? " nav-dark" : ""}`}>
      <a className="brand" href="/">
        Reference Point
      </a>
      <a className="nav-cta" href="/publish">
        Publish
      </a>
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
