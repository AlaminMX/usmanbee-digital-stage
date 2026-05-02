import heroImg from "@/assets/usman-hero.jpg";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden grain"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Usman Bee — Nigerian hip-hop artist portrait"
          className="w-full h-full object-cover object-[center_20%] md:object-center scale-105 reveal-fade"
          fetchPriority="high"
        />
        {/* layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent md:from-background/90 md:via-background/40" />
      </div>

      {/* Floating gold orb */}
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-radial-gold blur-3xl pointer-events-none float-slow" />

      {/* Vertical side label */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center gap-3 text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground z-10">
        <span className="block w-12 h-px bg-gold" />
        Lagos × Northern Nigeria
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 min-h-[100svh] flex flex-col justify-end pb-20 md:pb-28 pt-32">
        <div className="max-w-3xl">
          <div className="reveal-up flex items-center gap-3 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold-soft">
              Hip-Hop · Afro-Rap · Est. Lagos
            </span>
          </div>

          <h1 className="reveal-up delay-100 font-display font-black leading-[0.85] tracking-tighter text-[clamp(3.5rem,12vw,9rem)]">
            USMAN
            <br />
            <span className="text-gradient-gold italic font-bold">Bee.</span>
          </h1>

          <p className="reveal-up delay-200 mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            From the dust of the North to the lights of Lagos — and now,
            <span className="text-foreground"> to the world.</span> A new sound is rising.
          </p>

          <div className="reveal-up delay-300 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#music"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-gold text-ink font-semibold text-base shadow-gold hover:shadow-gold transition-all hover:-translate-y-0.5"
            >
              <PlayIcon />
              Listen Now
              <span className="text-ink/70 text-sm font-mono">— Latest Drop</span>
            </a>
            <a
              href="#drop"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-gold transition-colors"
            >
              Next drop incoming
              <ArrowIcon />
            </a>
          </div>

          {/* Stats strip */}
          <div className="reveal-up delay-500 mt-16 grid grid-cols-3 gap-6 md:gap-12 max-w-lg border-t border-border pt-8">
            <Stat value="2.4M+" label="Streams" />
            <Stat value="50K+" label="Followers" />
            <Stat value="12" label="Releases" />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 right-6 md:right-10 z-10 hidden md:flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
        <span>Scroll</span>
        <span className="block w-px h-12 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-4xl font-bold text-gradient-gold">
        {value}
      </div>
      <div className="mt-1 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
