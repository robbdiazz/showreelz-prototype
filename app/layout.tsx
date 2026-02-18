import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotionReelz - Curated Motion Design Reels",
  description: "A directory of the best motion design showreels from studios and freelancers worldwide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
