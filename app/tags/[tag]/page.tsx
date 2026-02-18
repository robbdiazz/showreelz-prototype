"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import reels from "@/data/reels.json";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const TAG_MAP: Record<string, string> = {
  "2d": "2D",
  "3d": "3D",
  "motion": "Motion",
  "branding": "Branding",
  "ux-ui": "UX/UI",
  "typography": "Typography",
  "character": "Character",
  "illustration": "Illustration",
  "direction": "Direction",
};

const PAGE_SIZE = 12;

export default function TagPage() {
  const params = useParams();
  const tagSlug = params.tag as string;
  const tagName = TAG_MAP[tagSlug];

  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const approved = reels.filter((r: any) => r.status === "approved");
  const filtered = tagName ? approved.filter((r: any) => r.specialties.includes(tagName)) : [];
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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

  if (!tagName) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Tag not found</h1>
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

      <main className="max-w-5xl mx-auto px-6 py-6 flex-1 w-full">
        <div className="mb-6">
          <Link href="/" className="text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>← All reels</Link>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--fg)" }}>{tagName} Reels</h1>
        <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>{filtered.length} reels tagged with {tagName}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {visible.map((reel: any) => (
            <Link
              href={`/reel/${reel.slug}`}
              key={reel.id}
              className="group rounded-xl overflow-hidden border transition-colors"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img
                  src={`https://vumbnail.com/${reel.vimeoId}.jpg`}
                  alt={reel.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="font-bold" style={{ color: "var(--fg)" }}>{reel.name}</h2>
                {reel.location && <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{reel.location}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {reel.specialties.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="px-6 py-3 rounded-lg font-bold text-sm border transition-opacity hover:opacity-80" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>
              Load more
            </button>
          </div>
        )}
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
