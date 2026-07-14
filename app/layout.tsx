import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Resume Builder — 62 templates, AI ATS scoring",
  description:
    "Free resume builder with 62 ATS-friendly templates, AI-powered ATS analysis, and live preview. No signup required.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#fafafa] font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
