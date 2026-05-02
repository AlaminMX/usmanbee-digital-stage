import v1 from "@/assets/video-1.jpg";
import v2 from "@/assets/video-2.jpg";
import v3 from "@/assets/video-3.jpg";

const videos = [
  { src: v1, title: "Kauna", tag: "Music Video", aspect: "aspect-video", span: "md:col-span-2 md:row-span-2" },
  { src: v2, title: "In the Lab", tag: "Behind the Scenes", aspect: "aspect-video", span: "" },
  { src: v3, title: "Lagos Nights", tag: "Vertical Cut", aspect: "aspect-[3/4]", span: "md:row-span-2" },
  { src: v1, title: "Enjoyment Live", tag: "Live Session", aspect: "aspect-video", span: "" },
];

export function Videos() {
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
          <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors">
            Full channel
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:auto-rows-[200px]">
          {videos.map((v, i) => (
            <button
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border ${v.span} ${!v.span ? v.aspect : ""}`}
            >
              <img
                src={v.src}
                alt={v.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

              {/* Play button */}
              <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-background/40 backdrop-blur grid place-items-center border border-white/10 group-hover:bg-gradient-gold group-hover:border-gold transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-foreground group-hover:text-ink ml-0.5 transition-colors">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-soft mb-1">
                  {v.tag}
                </div>
                <div className="font-display text-xl md:text-2xl font-bold">{v.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
