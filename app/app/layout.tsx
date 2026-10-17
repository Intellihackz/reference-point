import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

const description = "Creators publish work and get paid in USDC each time an AI agent uses it as a reference.";

export const metadata: Metadata = {
  metadataBase: new URL("https://point-reference.vercel.app"),
  title: "Reference Point | Get paid when AI uses your work",
  description,
  applicationName: "Reference Point",
  openGraph: { title: "Reference Point", description: "Get paid when AI uses your work.", siteName: "Reference Point", type: "website" },
  twitter: { card: "summary_large_image", title: "Reference Point", description: "Get paid when AI uses your work." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#060b18" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
