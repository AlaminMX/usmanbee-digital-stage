import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import fallback from "@/assets/track-kauna.jpg";

type Track = {
  id: string;
  title: string;
  subtitle: string | null;
  duration: string | null;
  plays: string | null;
  spotify_embed_url: string | null;
  audiomack_embed_url: string | null;
  cover_image_url: string | null;
};

export function Music() {
  const s = useSiteSettings();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    supabase
      .from("tracks")
      .select("id,title,subtitle,duration,plays,spotify_embed_url,audiomack_embed_url,cover_image_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length) {
          setTracks(data as Track[]);
          setActiveId(data[0].id);
        }
      });
  }, []);

  const current = tracks.find((t) => t.id === activeId) ?? null;

  const platforms = [
    { name: "Audiomack", color: "from-orange-500 to-amber-500", primary: true, href: s.audiomack_url },
    { name: "Spotify", color: "from-green-500 to-emerald-600", href: s.spotify_url },
    { name: "Apple Music", color: "from-pink-500 to-red-500", href: "#" },
    { name: "YouTube Music", color: "from-red-500 to-red-700", href: s.youtube_channel_url },
  ];

  return (
    <section id="music" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
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

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border">
              {showEmbed && current?.spotify_embed_url ? (
                <iframe
                  src={current.spotify_embed_url}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={current.title}
                />
              ) : (
                <>
                  <img
                    src={current?.cover_image_url || fallback}
                    alt={current ? `${current.title} cover art` : "cover art"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                  <button
                    onClick={() => setShowEmbed(true)}
                    className="absolute inset-0 grid place-items-center group/play"
                    aria-label="Play"
                  >
                    <span className="w-20 h-20 rounded-full bg-gradient-gold grid place-items-center shadow-gold transform group-hover/play:scale-110 transition-transform">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-ink ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-gold-soft mb-2">
                      Now Playing
                    </div>
                    <div className="font-display text-3xl font-bold">{current?.title ?? "—"}</div>
                    <div className="text-sm text-muted-foreground">{current?.subtitle ?? ""}</div>
                  </div>
                </>
              )}
            </div>

            {current?.audiomack_embed_url && (
              <a
                href={current.audiomack_embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-gold-soft hover:text-gold transition-colors"
              >
                Also on Audiomack →
              </a>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
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

          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center gap-4 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground border-b border-border">
              <span className="w-8">#</span>
              <span className="flex-1">Title</span>
              <span className="hidden sm:block w-20 text-right">Plays</span>
              <span className="w-12 text-right">Time</span>
            </div>
            {tracks.map((t, i) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id);
                    setShowEmbed(true);
                  }}
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
                      <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-card">
                    {t.cover_image_url && (
                      <img src={t.cover_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${isActive ? "text-gold" : ""}`}>{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.subtitle}</div>
                  </div>
                  <div className="hidden sm:block w-20 text-right text-sm font-mono text-muted-foreground">
                    {t.plays}
                  </div>
                  <div className="w-12 text-right text-sm font-mono text-muted-foreground">{t.duration}</div>
                </button>
              );
            })}
            {!tracks.length && (
              <div className="px-4 py-8 text-sm text-muted-foreground text-center">
                Tracks will appear here once added from the admin panel.
              </div>
            )}
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
