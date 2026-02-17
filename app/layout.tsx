import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Showreelz - Motion Design Directory",
  description: "Curated motion design reels from top designers and studios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
