"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="px-6 py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Stay in the loop</h2>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Get notified about new reels, highlighted designers, and curated collections. No spam, unsubscribe anytime.
        </p>
        {submitted ? (
          <p className="text-sm font-bold py-4" style={{ color: "var(--fg)" }}>You're in. We'll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mt-4">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-sm"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg)" }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-bold text-sm transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
