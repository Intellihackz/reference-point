"use client";

import { useState } from "react";

export default function CopyBlock({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  }
  return (
    <div className="codeblock">
      <pre>
        <code>{text}</code>
      </pre>
      <button type="button" onClick={copy} aria-label={label}>
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
