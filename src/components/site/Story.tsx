import stage from "@/assets/usman-stage.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Story() {
  const s = useSiteSettings();
  const paragraphs = (s.artist_bio || "").split(/\n\n+/).filter(Boolean);

  return (
    <section id="story" className="relative py-24 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-6 bg-gradient-gold opacity-15 blur-3xl" />
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
              <img
                src={stage}
                alt="Usman Bee on stage, gold spotlight"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-soft mb-1">
                  Live · Lagos · 2025
                </div>
                <div className="font-display text-2xl font-bold">"This is just the beginning."</div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-6 -bottom-6 max-w-[220px] p-5 rounded-2xl bg-card border border-gold/30 shadow-gold-sm">
              <div className="text-3xl font-display text-gold leading-none mb-2">"</div>
              <p className="text-sm text-muted-foreground italic">
                One of the most exciting voices coming out of Northern Nigeria right now.
              </p>
              <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-gold">
                — The Native Mag
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-4">
              ◆ The Story
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tighter mb-8">
              Born in the North. <br />
              <span className="text-gradient-gold italic">Forged for Greatness.</span>
            </h2>

            <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {paragraphs.length ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{s.artist_bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
      </div>
      <div className="font-display font-bold text-base md:text-xl text-gold-soft">{value}</div>
    </div>
  );
}
