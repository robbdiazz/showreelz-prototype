"use client";

import { useState, useEffect } from "react";
import reels from "@/data/reels.json";

const ALL_TAGS = ["2D", "3D", "Motion", "Branding", "UX/UI", "Typography", "Character"];

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = activeFilters.length === 0
    ? reels
    : reels.filter((r) => r.specialties.some((s) => activeFilters.includes(s)));

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Showreelz</h1>
          <p className="text-neutral-400 text-sm">Enter password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
          />
          {error && <p className="text-red-400 text-sm">Wrong password</p>}
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-3">Showreelz</h1>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  activeFilters.includes(tag)
                    ? "bg-white text-black border-white"
                    : "border-neutral-600 text-neutral-400 hover:border-neutral-400"
                }`}
              >
                {tag}
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="px-3 py-1 text-sm text-neutral-500 hover:text-white transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-neutral-500 text-sm mb-4">{filtered.length} reels</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((reel) => (
            <div key={reel.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://player.vimeo.com/video/${reel.vimeoId}?badge=0&autopause=0&player_id=0`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-white font-semibold">{reel.name}</h2>
                {reel.location && (
                  <p className="text-neutral-500 text-sm mt-0.5">{reel.location}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {reel.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
