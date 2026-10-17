"use client";

import { useEffect, useRef, useState } from "react";

async function resize(file: File, max: number, quality: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", quality);
}

const PRICES = ["0.02", "0.05", "0.10", "0.25"];
const WALLET_OK = /^0x[0-9a-fA-F]{40}$/;

export default function PublishApp() {
  const [kind, setKind] = useState<"text" | "image">("text");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [creator, setCreator] = useState("");
  const [wallet, setWallet] = useState("");
  const [walletTouched, setWalletTouched] = useState(false);
  const [price, setPrice] = useState("0.05");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setWallet(localStorage.getItem("rp.wallet") ?? "");
      setCreator(localStorage.getItem("rp.creator") ?? "");
    } catch {}
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    try {
      let q = 0.8;
      let data = await resize(f, 1400, q);
      while (data.length > 850_000 && q > 0.4) {
        q -= 0.1;
        data = await resize(f, 1400, q);
      }
      setImage(data);
      setThumb(await resize(f, 240, 0.6));
    } catch {
      setError("Could not read that image.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (kind === "image" && !image) return setError("Choose an image first.");
    if (!WALLET_OK.test(wallet.trim())) {
      setWalletTouched(true);
      return setError("Enter a valid Base wallet address (0x followed by 40 characters).");
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/refs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          preview,
          text: kind === "text" ? text : undefined,
          image: kind === "image" ? image : undefined,
          thumb: kind === "image" ? thumb : undefined,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          creator,
          wallet: wallet.trim(),
          priceUsdc: Number(price),
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.error ?? "Something went wrong.");
      try {
        localStorage.setItem("rp.wallet", wallet.trim());
        localStorage.setItem("rp.creator", creator);
      } catch {}
      setLink(data.pageUrl);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const priceNum = Number(price);
  const priceLabel = Number.isFinite(priceNum) && priceNum > 0 ? priceNum.toFixed(2) : "0.00";
  const walletBad = walletTouched && wallet.trim() !== "" && !WALLET_OK.test(wallet.trim());

  return (
    <div className="pub">
      <aside className="pub-side">
        <a className="brand" href="/">
          Reference Point
        </a>

        <div className="pub-intro">
          <h1>Publish your work</h1>
          <p>Set a price once. Every time an agent pays to use it as a reference, the USDC goes straight to your wallet.</p>
        </div>

        <div className="glass pub-preview" aria-live="polite">
          <span className="glass-label">How agents see it</span>
          {kind === "image" && thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pub-thumb" src={thumb} alt="" />
          )}
          <strong>{title.trim() || "Your title appears here"}</strong>
          <span className="pub-preview-text">{preview.trim() || "A short public preview. The full piece unlocks after payment."}</span>
          <span className="glass-meta">
            {kind === "text" ? "Article" : "Image"}, ${priceLabel} per use{creator.trim() ? `, by ${creator.trim()}` : ""}
          </span>
        </div>
      </aside>

      <section className="pub-main">
        {link ? (
          <div className="pub-done">
            <h2>Published</h2>
            <p>
              Agents can now find it and pay you <strong>${priceLabel} USDC</strong> per use.
            </p>
            <a className="pub-link" href={link}>
              {link}
            </a>
            <div className="pub-actions">
              <a className="go" href={link}>
                View your page
              </a>
              <a className="go go-quiet" href="/publish">
                Publish another
              </a>
            </div>
          </div>
        ) : (
          <form className="pub-form" onSubmit={submit}>
            <fieldset>
              <legend>About the work</legend>

              <div className="seg" role="tablist" aria-label="Type of work">
                <button type="button" className={kind === "text" ? "on" : ""} onClick={() => setKind("text")}>
                  Article or text
                </button>
                <button type="button" className={kind === "image" ? "on" : ""} onClick={() => setKind("image")}>
                  Image
                </button>
              </div>

              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
              </label>

              <label>
                <span className="label-row">
                  Public preview
                  <span className="count">{preview.length}/300</span>
                </span>
                <textarea value={preview} onChange={(e) => setPreview(e.target.value)} maxLength={300} rows={2} required />
                <span className="hint">Shown to agents for free, so they can decide whether to pay.</span>
              </label>

              {kind === "text" ? (
                <label>
                  <span className="label-row">
                    Full text
                    <span className="count">{text.length}/12000</span>
                  </span>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} rows={10} required />
                  <span className="hint">Revealed only after an agent pays.</span>
                </label>
              ) : (
                <div className="field">
                  <span className="field-label">Image file</span>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden />
                  <button type="button" className={`drop${image ? " has" : ""}`} onClick={() => fileRef.current?.click()}>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb ?? image} alt="Selected" />
                    ) : (
                      <span>Choose an image</span>
                    )}
                    <span className="drop-note">{image ? "Click to replace" : "JPEG, PNG or WebP"}</span>
                  </button>
                  <span className="hint">The full image is revealed only after an agent pays. Agents see a small thumbnail for free.</span>
                </div>
              )}

              <label>
                Tags
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tokyo, street, rain" />
                <span className="hint">Comma separated. Helps agents find it.</span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Price and payout</legend>

              <div className="field">
                <span className="field-label">Price per use (USDC)</span>
                <div className="chips" role="group" aria-label="Quick prices">
                  {PRICES.map((p) => (
                    <button key={p} type="button" className={price === p ? "on" : ""} onClick={() => setPrice(p)}>
                      ${p}
                    </button>
                  ))}
                  <input
                    aria-label="Custom price in USDC"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputMode="decimal"
                    className="chip-input"
                    required
                  />
                </div>
                <span className="hint">Between $0.01 and $25. Cheaper prices get chosen more often.</span>
              </div>

              <label>
                Your name
                <input value={creator} onChange={(e) => setCreator(e.target.value)} maxLength={60} required />
                <span className="hint">Shown as the creator and on every receipt.</span>
              </label>

              <label>
                Base wallet address
                <input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onBlur={() => setWalletTouched(true)}
                  placeholder="0x..."
                  spellCheck={false}
                  autoComplete="off"
                  aria-invalid={walletBad}
                  required
                />
                <span className={`hint${walletBad ? " bad" : ""}`}>
                  {walletBad ? "That is not a valid address. It should start with 0x and have 40 more characters." : "USDC on Base is sent here. Double check it, payments cannot be reversed."}
                </span>
              </label>
            </fieldset>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="go go-block" disabled={busy}>
              {busy ? "Publishing..." : "Publish"}
            </button>
            <p className="fine">
              Only publish work you own or have the right to license. Default terms: agents may use it as a reference with attribution, with no resale of the
              original.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
