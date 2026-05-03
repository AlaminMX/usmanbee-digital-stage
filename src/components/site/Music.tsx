import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const prevActiveId = useRef<string | null>(null);

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

  // When switching tracks while already playing, keep playing (embed src updates)
  const handleTrackClick = (id: string) => {
    if (id === activeId) return;
    prevActiveId.current = activeId;
    setActiveId(id);
    // If already playing, keep playing the new track
    // If paused, just update display — don't auto-play
  };

  const handlePlayPause = () => {
    if (!current?.spotify_embed_url) return;
    setIsPlaying((v) => !v);
  };

  const platforms = [
    { name: "Audiomack", color: "from-orange-500 to-amber-500", primary: true, href: s.audiomack_url },
    { name: "Spotify", color: "from-green-500 to-emerald-600", href: s.spotify_url },
    { name: "Apple Music", color: "from-pink-500 to-red-500", href: s.apple_music_url || null },
    { name: "YouTube Music", color: "from-red-500 to-red-700", href: s.youtube_channel_url },
  ].filter((p) => p.href && p.href !== "#");

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
          {/* Featured panel */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />

            {/* Cover art — always visible */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border">
              {current?.cover_image_url ? (
                <img
                  src={current.cover_image_url}
                  alt={`${current.title} cover art`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <MusicNoteIcon />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />

              {/* Play / Pause button */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 grid place-items-center group/play"
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={!current?.spotify_embed_url}
              >
                <span className="w-20 h-20 rounded-full bg-gradient-gold grid place-items-center shadow-gold transform group-hover/play:scale-110 transition-transform">
                  {isPlaying ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )}
                </span>
              </button>

              {/* Track info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-gold-soft mb-2">
                  {isPlaying ? "Now Playing" : "Up Next"}
                </div>
                <div className="font-display text-3xl font-bold">{current?.title ?? "—"}</div>
                <div className="text-sm text-muted-foreground">{current?.subtitle ?? ""}</div>
              </div>
            </div>

            {/* Spotify embed — rendered below artwork, shown only when playing */}
            <div
              className="overflow-hidden transition-all duration-500 rounded-xl mt-3"
              style={{ height: isPlaying && current?.spotify_embed_url ? "152px" : "0px", opacity: isPlaying && current?.spotify_embed_url ? 1 : 0 }}
            >
              {current?.spotify_embed_url && (
                <iframe
                  key={current.id}
                  src={`${current.spotify_embed_url}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={current.title}
                  className="rounded-xl border-0"
                />
              )}
            </div>

            {/* Audiomack link */}
            {current?.audiomack_embed_url && s.audiomack_url && s.audiomack_url !== "#" && (
              <a
                href={s.audiomack_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-gold-soft hover:text-gold transition-colors"
              >
                Also on Audiomack →
              </a>
            )}

            {/* Streaming platforms */}
            {platforms.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.href!}
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
            )}
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
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTrackClick(t.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all group/row ${
                    isActive
                      ? "bg-card border border-gold/30 shadow-gold-sm"
                      : "hover:bg-card border border-transparent"
                  }`}
                >
                  <div className="w-8 text-sm font-mono">
                    {isActive && isPlaying ? (
                      <span className="flex gap-0.5 items-end h-4">
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "60%" }} />
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                        <span className="w-0.5 bg-gold animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                      </span>
                    ) : isActive ? (
                      <span className="flex gap-0.5 items-end h-4">
                        <span className="w-0.5 bg-gold/50" style={{ height: "60%" }} />
                        <span className="w-0.5 bg-gold/50" style={{ height: "100%" }} />
                        <span className="w-0.5 bg-gold/50" style={{ height: "40%" }} />
                      </span>
                    ) : (
                      <>
                        <span className="text-muted-foreground group-hover/row:hidden">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="hidden group-hover/row:block text-gold">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-card">
                    {t.cover_image_url ? (
                      <img src={t.cover_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MusicNoteIcon small />
                      </div>
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

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-ink ml-1">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function ArrowExtIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover/p:text-gold transition-colors">
      <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MusicNoteIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/40">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
    }
      
