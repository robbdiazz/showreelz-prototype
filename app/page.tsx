"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import reels from "@/data/reels.json";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const ALL_TAGS = ["2D", "3D", "Motion", "Branding", "UX/UI"];
const PAGE_SIZE = 12;

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

  const approved = reels.filter((r: any) => r.status === "approved");
  const filtered = activeFilters.length === 0
    ? approved
    : approved.filter((r: any) => r.specialties.some((s: string) => activeFilters.includes(s)));

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
      <Navbar onSubmit={() => setShowModal(true)} />

      {/* Filter tags - below nav, horizontal scroll on mobile */}
      <div className="px-6 pt-4 pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto flex-nowrap scrollbar-hide">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className="px-3 py-1 text-sm rounded-lg border transition whitespace-nowrap shrink-0"
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
            <button onClick={() => { setActiveFilters([]); setVisibleCount(PAGE_SIZE); }} className="px-3 py-1 text-sm transition hover:opacity-70 whitespace-nowrap shrink-0" style={{ color: "var(--fg-muted)" }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid - 2 columns */}
      <main className="max-w-5xl mx-auto px-6 py-6 flex-1 w-full">
        <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>{filtered.length} reels</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
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

      <Newsletter />
      <Footer />
      <SubmitModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
