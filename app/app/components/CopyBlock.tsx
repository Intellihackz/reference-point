"use client";

import { useState } from "react";

export default function CopyBlock({ text, label, variant = "light" }: { text: string; label: string; variant?: "light" | "glass" }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  }
  return (
    <div className={`codeblock${variant === "glass" ? " glass-code" : ""}`}>
      <pre>
        <code>{text}</code>
      </pre>
      <button type="button" onClick={copy} aria-label={label}>
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
