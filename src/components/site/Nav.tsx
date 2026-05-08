import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Nav() {
  const s = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const showCountdown = s.countdown_active === "true";

  const links = [
    { href: "#music", label: "Music" },
    ...(showCountdown ? [{ href: "#drop", label: "Next Drop" }] : []),
    { href: "#videos", label: "Visuals" },
    { href: "#story", label: "Story" },
    { href: "#contact", label: "Bookings" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/75 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
            USMAN <span className="text-gradient-gold">BEE</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-gold group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <a
          href="#music"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-ink text-sm font-semibold hover:shadow-gold-sm transition-all hover:-translate-y-0.5"
        >
          Listen
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-border"
          aria-label="Menu"
        >
          <span className="relative w-4 h-3 flex flex-col justify-between">
            <span className={`block h-px bg-foreground transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-px bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-foreground transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-background/95 backdrop-blur-xl ${
          open ? "max-h-96 border-b border-border" : "max-h-0"
        }`}
      >
        <nav className="px-5 py-6 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl py-2 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#music"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-gold text-ink font-semibold"
          >
            Listen Now
          </a>
        </nav>
      </div>
    </header>
  );
}
