export function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="/">
        <span className="brand-mark" aria-hidden="true" />
        Reference Point
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="/#library">Library</a>
        <a href="/#receipts">Receipts</a>
        <a className="btn btn-sm" href="/publish">
          <span className="long-label">Publish your work</span>
          <span className="short-label">Publish</span>
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>Reference Point</span>
      <span className="footer-note">Built for the MoonPay and PayBox hackathon. Payments are USDC on Base.</span>
      <a href="/publish">Publish</a>
    </footer>
  );
}
