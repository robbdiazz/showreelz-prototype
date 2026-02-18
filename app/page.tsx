"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import reels from "@/data/reels.json";

const ALL_TAGS = ["2D", "3D", "Motion", "Branding", "UX/UI", "Typography", "Character"];
const PAGE_SIZE = 12;

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("showreelz_theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("showreelz_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("showreelz_theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full transition-colors duration-300"
      style={{ background: dark ? "#333" : "#ccc" }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs"
        style={{
          left: dark ? "2px" : "calc(100% - 26px)",
          background: dark ? "#0a0a0a" : "#F4F4F4",
        }}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

function SubmitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", website: "", social: "", reelLink: "" });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); setForm({ name: "", email: "", website: "", social: "", reelLink: "" }); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-xl p-6 space-y-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Submit Your Reel</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: "var(--fg-muted)" }}>&times;</button>
        </div>
        {submitted ? (
          <p className="py-8 text-center" style={{ color: "var(--fg-muted)" }}>Thanks! We'll review your submission.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            <input placeholder="Website (optional)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            <input placeholder="LinkedIn / IG / X (optional)" value={form.social} onChange={(e) => setForm({ ...form, social: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            <input required placeholder="Reel link (Vimeo or YouTube) *" value={form.reelLink} onChange={(e) => setForm({ ...form, reelLink: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = activeFilters.length === 0
    ? reels
    : reels.filter((r) => r.specialties.some((s: string) => activeFilters.includes(s)));

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Showreelz</h1>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Enter password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg text-sm"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg)" }}
          />
          {error && <p className="text-red-400 text-sm">Wrong password</p>}
          <button type="submit" className="w-full py-3 font-bold rounded-lg text-sm transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav - logo + submit only */}
      <header className="sticky top-0 z-10 backdrop-blur-md border-b px-4 py-4" style={{ background: "color-mix(in srgb, var(--bg) 90%, transparent)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: "var(--fg)" }}>Showreelz</Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg font-bold text-sm transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* Filter tags - below nav */}
      <div className="px-4 pt-4 pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className="px-3 py-1 text-sm rounded-lg border transition"
              style={{
                background: activeFilters.includes(tag) ? "var(--accent)" : "transparent",
                color: activeFilters.includes(tag) ? "var(--accent-fg)" : "var(--fg-muted)",
                borderColor: activeFilters.includes(tag) ? "var(--accent)" : "var(--border)",
              }}
            >
              {tag}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button onClick={() => { setActiveFilters([]); setVisibleCount(PAGE_SIZE); }} className="px-3 py-1 text-sm transition hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1">
        <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>{filtered.length} reels</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map((reel) => (
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
                {reel.location && (
                  <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{reel.location}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {reel.specialties.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="px-6 py-3 rounded-lg font-bold text-sm border transition-opacity hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Load more
            </button>
          </div>
        )}
      </main>

      {/* Footer - 3 columns */}
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

      <SubmitModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
