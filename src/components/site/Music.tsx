import { useState } from "react";
import kauna from "@/assets/track-kauna.jpg";
import enjoyment from "@/assets/track-enjoyment.jpg";
import northstar from "@/assets/track-northstar.jpg";

const tracks = [
  { id: 1, title: "Kauna", subtitle: "Single · 2025", duration: "3:12", plays: "847K", art: kauna, featured: true },
  { id: 2, title: "Enjoyment", subtitle: "Feat. Lagos All-Stars", duration: "2:48", plays: "1.2M", art: enjoyment },
  { id: 3, title: "North Star", subtitle: "EP Title Track", duration: "3:41", plays: "412K", art: northstar },
  { id: 4, title: "Sabuwa", subtitle: "Single · 2024", duration: "2:55", plays: "298K", art: kauna },
];

const platforms = [
  { name: "Audiomack", color: "from-orange-500 to-amber-500", primary: true },
  { name: "Spotify", color: "from-green-500 to-emerald-600" },
  { name: "Apple Music", color: "from-pink-500 to-red-500" },
  { name: "YouTube Music", color: "from-red-500 to-red-700" },
];

export function Music() {
  const [active, setActive] = useState(1);
  const current = tracks.find((t) => t.id === active)!;

  return (
    <section id="music" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-3">
              ◆ The Catalogue
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-tighter">
              Press play. <br />
              <span className="text-gradient-gold italic">Feel the wave.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Stream on every major platform. Audiomack first — that's where the movement lives.
          </p>
        </div>

        {/* Featured player + tracklist */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Featured artwork */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border">
              <img
                src={current.art}
                alt={`${current.title} cover art`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />

              {/* Play overlay */}
              <button className="absolute inset-0 grid place-items-center group/play">
                <span className="w-20 h-20 rounded-full bg-gradient-gold grid place-items-center shadow-gold transform group-hover/play:scale-110 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-ink ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>

              {/* Track info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-gold-soft mb-2">
                  Now Playing
                </div>
                <div className="font-display text-3xl font-bold">{current.title}</div>
                <div className="text-sm text-muted-foreground">{current.subtitle}</div>
              </div>
            </div>

            {/* Streaming platforms */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href="#"
                  className={`group/p relative overflow-hidden rounded-xl border border-border p-3 hover:border-gold transition-colors ${
                    p.primary ? "col-span-2" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${p.color} opacity-0 group-hover/p:opacity-10 transition-opacity`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        Stream on
                      </div>
                      <div className="font-semibold">{p.name}</div>
                    </div>
                    <ArrowExtIcon />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tracklist */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center gap-4 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground border-b border-border">
              <span className="w-8">#</span>
              <span className="flex-1">Title</span>
              <span className="hidden sm:block w-20 text-right">Plays</span>
              <span className="w-12 text-right">Time</span>
            </div>
            {tracks.map((t, i) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all group/row ${
                    isActive
                      ? "bg-card border border-gold/30 shadow-gold-sm"
                      : "hover:bg-card border border-transparent"
                  }`}
                >
                  <div className="w-8 text-sm font-mono">
                    {isActive ? (
                      <span className="flex gap-0.5 items-end h-4">
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "60%" }} />
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground group-hover/row:hidden">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    {!isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="hidden group-hover/row:block text-gold">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={t.art} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${isActive ? "text-gold" : ""}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{t.subtitle}</div>
                  </div>
                  <div className="hidden sm:block w-20 text-right text-sm font-mono text-muted-foreground">
                    {t.plays}
                  </div>
                  <div className="w-12 text-right text-sm font-mono text-muted-foreground">
                    {t.duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowExtIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover/p:text-gold transition-colors">
      <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
