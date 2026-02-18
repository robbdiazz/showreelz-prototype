"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import reels from "@/data/reels.json";

export default function ReelPage() {
  const params = useParams();
  const slug = params.slug as string;
  const reel = reels.find((r) => r.slug === slug);

  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("showreelz_auth") === "1") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "showreelz2026") {
      setAuthed(true);
      sessionStorage.setItem("showreelz_auth", "1");
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Showreelz</h1>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Reel not found</h1>
          <Link href="/" className="text-sm underline" style={{ color: "var(--fg-muted)" }}>Back to directory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b px-4 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: "var(--fg)" }}>Showreelz</Link>
          <Link href="/" className="text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Back</Link>
        </div>
      </header>

      {/* Content - 2 col video, 1 col details */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
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
                <a href={`https://${reel.website}`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg)" }}>
                  {reel.website}
                </a>
              )}
              <a href={`https://vimeo.com/${reel.vimeoId}`} target="_blank" rel="noopener noreferrer" className="block text-sm underline transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
                View on Vimeo
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-8 mt-12" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-lg" style={{ color: "var(--fg)" }}>Showreelz</p>
            <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Curated motion design reels</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-sm" style={{ color: "var(--fg)" }}>Browse</p>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>All Reels</a>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Studios</a>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Freelancers</a>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-sm" style={{ color: "var(--fg)" }}>Connect</p>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Twitter/X</a>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Instagram</a>
            <a href="#" className="block text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
