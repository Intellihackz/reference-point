"use client";

import { useEffect, useState } from "react";

async function resize(file: File, max: number, quality: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", quality);
}

export default function PublishForm() {
  const [kind, setKind] = useState<"text" | "image">("text");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [creator, setCreator] = useState("");
  const [wallet, setWallet] = useState("");
  const [price, setPrice] = useState("0.05");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

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

  if (link) {
    return (
      <div className="card done">
        <h1>Published</h1>
        <p>
          Agents can now find it and pay you <strong>${Number(price).toFixed(2)} USDC</strong> per use.
        </p>
        <p>
          <a href={link}>{link}</a>
        </p>
        <a className="go linkbtn" href="/publish">
          Publish another
        </a>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={submit}>
      <div className="seg" role="tablist">
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
        Public preview (shown to agents for free, 10-300 chars)
        <textarea value={preview} onChange={(e) => setPreview(e.target.value)} maxLength={300} rows={2} required />
      </label>

      {kind === "text" ? (
        <label>
          Full text (revealed after payment)
          <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} rows={9} required />
        </label>
      ) : (
        <label>
          Image file (revealed after payment)
          <input type="file" accept="image/*" onChange={onFile} required={!image} />
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="preview" src={thumb ?? image} alt="Selected" />
          )}
        </label>
      )}

      <label>
        Tags (comma separated)
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tokyo, street, rain" />
      </label>
      <div className="row">
        <label>
          Your name
          <input value={creator} onChange={(e) => setCreator(e.target.value)} maxLength={60} required />
        </label>
        <label>
          Price per use (USDC)
          <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" required />
        </label>
      </div>
      <label>
        Base wallet address (you get paid here)
        <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." spellCheck={false} autoComplete="off" required />
      </label>

      {error && <p className="error">{error}</p>}
      <button className="go" disabled={busy}>
        {busy ? "Publishing..." : "Publish"}
      </button>
      <p className="fine">
        Only publish work you own or have the right to license. Default terms: agents may use it as a reference with attribution, with no resale of the
        original.
      </p>
    </form>
  );
}
