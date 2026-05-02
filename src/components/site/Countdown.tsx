import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function getRemaining(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export function Countdown() {
  const s = useSiteSettings();
  const target = s.countdown_target_date ? new Date(s.countdown_target_date).getTime() : 0;
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number; done: boolean } | null>(
    null
  );

  useEffect(() => {
    if (!target) return;
    setT(getRemaining(target));
    const id = setInterval(() => setT(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (s.countdown_active !== "true") return null;
  if (!target) return null;

  return (
    <section id="drop" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gold blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-card/50 mb-6">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 pulse-ring" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-soft">
            Dropping: {s.countdown_release_title}
          </span>
        </div>

        <h2 className="font-display font-black text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-tighter mb-4">
          Next Drop <span className="text-gradient-gold italic">Loading.</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
          The wait ends soon. Mark the time. Be first to hear it when the clock hits zero.
        </p>

        {t && !t.done ? (
          <div className="mt-14 grid grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto">
            <TimeBlock value={t.d} label="Days" />
            <TimeBlock value={t.h} label="Hours" />
            <TimeBlock value={t.m} label="Minutes" />
            <TimeBlock value={t.s} label="Seconds" pulse />
          </div>
        ) : t && t.done ? (
          <div className="mt-14 max-w-2xl mx-auto p-10 rounded-2xl border border-gold bg-card glow-gold">
            <div className="font-display text-4xl font-bold mb-4">Out Now — Stream It.</div>
            <p className="text-muted-foreground mb-6">
              "{s.countdown_release_title}" is live on every platform.
            </p>
            <a href="#music" className="inline-flex px-6 py-3 rounded-full bg-gradient-gold text-ink font-semibold">
              Stream Now
            </a>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto">
            <TimeBlock value={0} label="Days" />
            <TimeBlock value={0} label="Hours" />
            <TimeBlock value={0} label="Minutes" />
            <TimeBlock value={0} label="Seconds" pulse />
          </div>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
          <span>Title:</span>
          <span className="text-gold">"{s.countdown_release_title}"</span>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
      <div className="relative aspect-square md:aspect-[4/5] rounded-2xl border border-border bg-card/80 backdrop-blur flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        <div
          className={`font-display font-black text-4xl md:text-7xl tabular-nums leading-none ${
            pulse ? "text-gold" : "text-foreground"
          }`}
        >
          {String(value).padStart(2, "0")}
        </div>
        <div className="mt-2 md:mt-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
