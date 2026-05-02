export function Marquee() {
  const items = [
    "New Single Out Now",
    "Kauna",
    "From the North to the World",
    "Afro-Rap",
    "Enjoyment",
    "Lagos · Kano · Global",
    "North Star EP — Coming Soon",
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative border-y border-border bg-card/50 overflow-hidden py-6">
      <div className="flex marquee-track gap-12 whitespace-nowrap">
        {loop.map((it, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight">
              {it}
            </span>
            <span className="text-gold text-2xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
