export default function Footer() {
  return (
    <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-lg" style={{ color: "var(--fg)" }}>MotionReelz</p>
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
  );
}
