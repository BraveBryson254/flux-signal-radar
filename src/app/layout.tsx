import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ParticleField from "@/components/ParticleField";
import SmoothScroll from "@/components/SmoothScroll";
import ReferralCapture from "@/components/ReferralCapture";
import { AuthProvider } from "@/lib/mockAuth";
import { CurrencyProvider } from "@/lib/currency";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Flux Signal Radar — Live Confluence Signal Scanner",
  description:
    "A live multi-strategy trade setup scanner. SMC, ICT, Wyckoff, and SNR confluence scoring across forex, metals, and indices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ParticleField />
        <ReferralCapture />
        <AuthProvider>
          <CurrencyProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
