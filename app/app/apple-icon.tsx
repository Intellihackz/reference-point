import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1220" }}>
        <svg width="124" height="124" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="17" fill="none" stroke="#ffffff" strokeWidth="5" strokeDasharray="83.5 20 3.31 0" strokeLinecap="round" />
          <circle cx="44" cy="20" r="7" fill="#9cc9ff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
