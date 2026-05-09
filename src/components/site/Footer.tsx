import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const s = useSiteSettings();

  const socials = [
    { name: "Instagram", href: s.instagram_url },
    { name: "X / Twitter", href: s.twitter_url },
    { name: "YouTube", href: s.youtube_channel_url },
  ].filter((it) => it.href && it.href !== "#");

  const streaming = [
    { name: "Audiomack", href: s.audiomack_url },
    { name: "Spotify", href: s.spotify_url },
    { name: "Apple Music", href: s.apple_music_url },
  ].filter((it) => it.href && it.href !== "#");

  return (
    <footer className="relative border-t border-border bg-ink/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-4 gap-10 md:gap-6 mb-14">
          <div className="md:col-span-2">
            <div className="font-display text-3xl md:text-4xl font-black tracking-tighter mb-4">
              USMAN <span className="text-gradient-gold italic">Bee.</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm">
              From the North to the World. Independent Nigerian hip-hop, built for the global stage.
            </p>
          </div>

          {streaming.length > 0 && <FooterCol title="Streaming" items={streaming} />}
          {socials.length > 0 && <FooterCol title="Social" items={socials} />}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-xs font-mono text-muted-foreground">
          <div>© {new Date().getFullYear()} Usman Bee. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="uppercase tracking-[0.25em]">Lagos · Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { name: string; href: string }[] }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.name}>
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-2 group"
            >
              {it.name}
              <span className="w-0 group-hover:w-4 h-px bg-gold transition-all" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
