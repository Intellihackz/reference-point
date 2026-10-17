import { ImageResponse } from "next/og";

export const alt = "Reference Point: get paid when AI uses your work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          background: "radial-gradient(circle at 78% 18%, #17315f 0%, #0b1220 48%, #060b18 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="10.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="51.72 12 2.25 0" strokeLinecap="round" />
            <circle cx="23.42" cy="8.58" r="4.2" fill="#9cc9ff" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>Reference Point</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 980 }}>Get paid when AI uses your work.</div>
          <div style={{ display: "flex", fontSize: 32, color: "#b8c4dc", maxWidth: 900 }}>
            Creators set a price per use. Agents pay in USDC through PayBox, and you approve every payment.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#9cc9ff" }}>point-reference.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
