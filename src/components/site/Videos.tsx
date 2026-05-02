import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type Video = {
  id: string;
  title: string;
  tag: string | null;
  youtube_video_id: string;
  thumbnail_url: string | null;
};

const layout = [
  { aspect: "aspect-video", span: "md:col-span-2 md:row-span-2" },
  { aspect: "aspect-video", span: "" },
  { aspect: "aspect-[3/4]", span: "md:row-span-2" },
  { aspect: "aspect-video", span: "" },
];

export function Videos() {
  const s = useSiteSettings();
  const [videos, setVideos] = useState<Video[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("videos")
      .select("id,title,tag,youtube_video_id,thumbnail_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => data && setVideos(data as Video[]));
  }, []);

  const openVideo = videos.find((v) => v.id === openId);

  return (
    <section id="videos" className="relative py-24 md:py-36 bg-card/30">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-3">
              ◆ The Visuals
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-tighter">
              Watch the <br />
              <span className="text-gradient-gold italic">movement.</span>
            </h2>
          </div>
          <a
            href={s.youtube_channel_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors"
          >
            Full channel
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:auto-rows-[200px]">
          {videos.map((v, i) => {
            const l = layout[i % layout.length];
            const thumb =
              v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_video_id}/maxresdefault.jpg`;
            return (
              <button
                key={v.id}
                onClick={() => setOpenId(v.id)}
                className={`group relative overflow-hidden rounded-2xl border border-border ${l.span} ${!l.span ? l.aspect : ""}`}
              >
                <img
                  src={thumb}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-background/40 backdrop-blur grid place-items-center border border-white/10 group-hover:bg-gradient-gold group-hover:border-gold transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-foreground group-hover:text-ink ml-0.5 transition-colors">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-soft mb-1">
                    {v.tag}
                  </div>
                  <div className="font-display text-xl md:text-2xl font-bold">{v.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {openVideo && (
        <div
          className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setOpenId(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-card border border-border grid place-items-center hover:border-gold"
            onClick={() => setOpenId(null)}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div
            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${openVideo.youtube_video_id}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title={openVideo.title}
            />
          </div>
        </div>
      )}
    </section>
  );
}
