"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import reels from "@/data/reels.json";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function ReelPage() {
  const params = useParams();
  const slug = params.slug as string;
  const reel = reels.find((r) => r.slug === slug && r.status === "approved");

  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("motionreelz_auth") === "1") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "showreelz2026") {
      setAuthed(true);
      sessionStorage.setItem("motionreelz_auth", "1");
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>MotionReelz</h1>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Enter password to continue</p>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} placeholder="Password" className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg)" }} />
          {error && <p className="text-red-400 text-sm">Wrong password</p>}
          <button type="submit" className="w-full py-3 font-bold rounded-lg text-sm transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>Enter</button>
        </form>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Reel not found</h1>
            <Link href="/" className="text-sm underline" style={{ color: "var(--fg-muted)" }}>Back to directory</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video - 2 cols */}
          <div className="lg:col-span-2">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://player.vimeo.com/video/${reel.vimeoId}?badge=0&autopause=0&player_id=0`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Details - 1 col */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>{reel.name}</h1>
              {reel.location && (
                <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>{reel.location}</p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {reel.specialties.map((s: string) => (
                <span key={s} className="px-3 py-1 text-sm rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="space-y-2">
              {reel.website && (
                <a href={`https://${reel.website}?ref=motionreelz`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg)" }}>
                  {reel.website}
                </a>
              )}
              <a href={`https://vimeo.com/${reel.vimeoId}?ref=motionreelz`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
                Vimeo
              </a>
              {reel.linkedin && (
                <a href={`https://linkedin.com/in/${reel.linkedin}?ref=motionreelz`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
                  LinkedIn
                </a>
              )}
              {reel.twitter && (
                <a href={`https://x.com/${reel.twitter}?ref=motionreelz`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
                  X / Twitter
                </a>
              )}
              {reel.instagram && (
                <a href={`https://instagram.com/${reel.instagram}?ref=motionreelz`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
                  Instagram
                </a>
              )}
            </div>

            <Link href="/" className="inline-block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
              ← Back to directory
            </Link>
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
