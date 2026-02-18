"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("motionreelz_theme");
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
      localStorage.setItem("motionreelz_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("motionreelz_theme", "light");
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
        className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold"
        style={{
          left: dark ? "2px" : "calc(100% - 26px)",
          background: dark ? "#0a0a0a" : "#F4F4F4",
          color: dark ? "#fff" : "#000",
        }}
      >
        {dark ? "D" : "L"}
      </span>
    </button>
  );
}

export default function Navbar({ onSubmit }: { onSubmit?: () => void }) {
  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-md border-b px-6 py-4"
      style={{ background: "color-mix(in srgb, var(--bg) 90%, transparent)", borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" style={{ color: "var(--fg)" }}>
          MotionReelz
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg font-bold text-sm transition-opacity hover:opacity-80"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
