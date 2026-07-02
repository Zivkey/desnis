import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SoundEffects } from "@/components/SoundEffects";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desnis.com"),
  title: "DES/NIS — A hands-on web team",
  description:
    "We combine deep industry experience with AI to design, build, and launch digital experiences faster.",
  openGraph: {
    title: "DES/NIS — A hands-on web team",
    description:
      "We combine deep industry experience with AI to design, build, and launch digital experiences faster.",
    url: "https://desnis.com",
    siteName: "DES/NIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DES/NIS — A hands-on web team",
    description:
      "We combine deep industry experience with AI to design, build, and launch digital experiences faster.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
        {children}
        <SoundEffects />
        <Analytics />
      </body>
    </html>
  );
}
