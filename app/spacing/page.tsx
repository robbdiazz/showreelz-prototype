"use client";

import { useState } from "react";

const options = [
  { label: "Option A: Tight (-0.03em)", value: "-0.03em" },
  { label: "Option B: Moderate (-0.015em)", value: "-0.015em" },
  { label: "Option C: Default (0em)", value: "0em" },
];

const sampleText = [
  { tag: "h1", text: "Showreelz", size: "text-3xl font-bold" },
  { tag: "h2", text: "Curated Motion Design Reels", size: "text-xl font-bold" },
  { tag: "p", text: "A directory of the best motion design showreels from studios and freelancers around the world.", size: "text-base" },
  { tag: "p", text: "Submit your reel to be featured in the directory.", size: "text-sm" },
  { tag: "span", text: "Motion  |  2D  |  3D  |  Branding  |  UX/UI  |  Typography  |  Character", size: "text-sm" },
];

export default function SpacingPage() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-2xl font-bold">Letter Spacing Comparison</h1>
        <p style={{ color: "var(--fg-muted)" }}>Click each option to apply it live. Pick your favorite and tell Kaz.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="p-4 rounded-xl border text-left transition"
              style={{
                borderColor: selected === i ? "var(--accent)" : "var(--border)",
                background: selected === i ? "var(--bg-secondary)" : "transparent",
              }}
            >
              <p className="font-bold text-sm">{opt.label}</p>
              <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>{opt.value}</p>
            </button>
          ))}
        </div>

        <div className="space-y-6 p-6 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)", letterSpacing: options[selected].value }}>
          <p className="text-xs font-bold uppercase" style={{ color: "var(--fg-muted)" }}>Preview with {options[selected].label}</p>
          {sampleText.map((s, i) => (
            <div key={i} className={s.size}>
              {s.text}
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 text-sm rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>Motion</span>
            <span className="px-3 py-1 text-sm rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>3D</span>
            <span className="px-3 py-1 text-sm rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>Branding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
