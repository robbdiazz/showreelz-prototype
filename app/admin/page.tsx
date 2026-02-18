"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import allReels from "@/data/reels.json";
import rejectedReels from "@/data/rejected.json";

const ALL_TAGS = ["2D", "3D", "Motion", "Branding", "UX/UI", "Typography", "Character", "Illustration", "Direction"];

type Reel = {
  id: number;
  name: string;
  slug: string;
  vimeoId: string;
  specialties: string[];
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  status: string;
  submittedAt: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [rejected, setRejected] = useState<Reel[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("approved");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("motionreelz_admin") === "1") {
      setAuthed(true);
    }
    // Load from localStorage if available, otherwise use JSON files
    const savedReels = typeof window !== "undefined" ? localStorage.getItem("motionreelz_reels") : null;
    const savedRejected = typeof window !== "undefined" ? localStorage.getItem("motionreelz_rejected") : null;
    setReels(savedReels ? JSON.parse(savedReels) : allReels as Reel[]);
    setRejected(savedRejected ? JSON.parse(savedRejected) : rejectedReels as Reel[]);
  }, []);

  // Auto-save to localStorage on every change
  useEffect(() => {
    if (reels.length > 0) {
      localStorage.setItem("motionreelz_reels", JSON.stringify(reels));
    }
  }, [reels]);

  useEffect(() => {
    if (rejected.length > 0 || localStorage.getItem("motionreelz_rejected")) {
      localStorage.setItem("motionreelz_rejected", JSON.stringify(rejected));
    }
  }, [rejected]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "adminreelz2000") {
      setAuthed(true);
      sessionStorage.setItem("motionreelz_admin", "1");
    } else {
      setError(true);
    }
  };

  const handleApprove = (id: number) => {
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleReject = (id: number) => {
    const reel = reels.find((r) => r.id === id);
    if (!reel) return;
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
    setRejected((prev) => [...prev, { ...reel, status: "rejected" }]);
  };

  const handleUnapprove = (id: number) => {
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, status: "pending" } : r));
  };

  const handleRestore = (id: number) => {
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, status: "pending" } : r));
    setRejected((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleTag = (id: number, tag: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const has = r.specialties.includes(tag);
        return { ...r, specialties: has ? r.specialties.filter((t) => t !== tag) : [...r.specialties, tag] };
      })
    );
  };

  const getFiltered = () => {
    if (tab === "rejected") return reels.filter((r) => r.status === "rejected").concat(rejected.filter((r) => !reels.find((a) => a.id === r.id)));
    return reels.filter((r) => r.status === tab);
  };

  const filtered = getFiltered();
  const pendingCount = reels.filter((r) => r.status === "pending").length;
  const approvedCount = reels.filter((r) => r.status === "approved").length;
  const rejectedCount = reels.filter((r) => r.status === "rejected").length + rejected.filter((r) => !reels.find((a) => a.id === r.id)).length;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Admin</h1>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Enter admin password</p>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} placeholder="Password" className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg)" }} />
          {error && <p className="text-red-400 text-sm">Wrong password</p>}
          <button type="submit" className="w-full py-3 font-bold rounded-lg text-sm transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>
          {pendingCount > 0 ? `${pendingCount} reels to review` : "Reel Admin"}
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
          Changes auto-save to your browser. Export JSON to back up permanently.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          {([
            ["pending", `Pending (${pendingCount})`],
            ["approved", `Approved (${approvedCount})`],
            ["rejected", `Rejected (${rejectedCount})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="pb-3 text-sm font-bold transition"
              style={{
                color: tab === key ? "var(--fg)" : "var(--fg-muted)",
                borderBottom: tab === key ? "2px solid var(--fg)" : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Export + Reset */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              const approved = reels.filter((r) => r.status === "approved");
              const blob = new Blob([JSON.stringify(approved, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "reels-approved.json"; a.click();
            }}
            className="px-4 py-2 rounded-lg text-sm border transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            Export approved JSON
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all changes? This clears your saved reviews.")) {
                localStorage.removeItem("motionreelz_reels");
                localStorage.removeItem("motionreelz_rejected");
                setReels(allReels as Reel[]);
                setRejected(rejectedReels as Reel[]);
              }
            }}
            className="px-4 py-2 rounded-lg text-sm border transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
          >
            Reset
          </button>
        </div>

        {/* Reel list */}
        {filtered.length === 0 ? (
          <p className="text-sm py-12 text-center" style={{ color: "var(--fg-muted)" }}>No reels in this tab.</p>
        ) : (
          <div className="space-y-8">
            {filtered.map((reel) => (
              <div key={reel.id} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Video */}
                  <div className="lg:col-span-2">
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
                  </div>

                  {/* Details + Actions */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: "var(--fg)" }}>{reel.name}</h2>
                      {reel.location && <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>{reel.location}</p>}
                      <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Submitted: {reel.submittedAt}</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {reel.website && <a href={`https://${reel.website}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--fg-muted)" }}>Website</a>}
                      <a href={`https://vimeo.com/${reel.vimeoId}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--fg-muted)" }}>Vimeo</a>
                    </div>

                    {/* Tag editor */}
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: "var(--fg-muted)" }}>Tags:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(reel.id, tag)}
                            className="px-2 py-0.5 text-xs rounded-lg border transition"
                            style={{
                              background: reel.specialties.includes(tag) ? "var(--accent)" : "transparent",
                              color: reel.specialties.includes(tag) ? "var(--accent-fg)" : "var(--fg-muted)",
                              borderColor: reel.specialties.includes(tag) ? "var(--accent)" : "var(--border)",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {reel.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(reel.id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                          style={{ background: "#22c55e", color: "#fff" }}
                        >
                          Approve
                        </button>
                      )}
                      {reel.status === "approved" && (
                        <button
                          onClick={() => handleUnapprove(reel.id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                          style={{ background: "#f59e0b", color: "#fff" }}
                        >
                          Unapprove
                        </button>
                      )}
                      {reel.status !== "rejected" && (
                        <button
                          onClick={() => handleReject(reel.id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                          style={{ background: "#ef4444", color: "#fff" }}
                        >
                          Reject
                        </button>
                      )}
                      {reel.status === "rejected" && (
                        <button
                          onClick={() => handleRestore(reel.id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                          style={{ background: "#3b82f6", color: "#fff" }}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
