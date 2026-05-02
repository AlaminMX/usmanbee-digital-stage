import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Booking() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.from("bookings").insert(form);
    setBusy(false);
    if (err) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  };

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-4">
              ◆ Bookings & Collabs
            </div>
            <h2 className="font-display font-black text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tighter mb-6">
              Let's <span className="text-gradient-gold italic">build.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-md">
              Shows. Features. Brand partnerships. Press. If it makes the music louder, we want to hear about it.
            </p>

            <div className="space-y-4 max-w-md">
              <ContactRow label="Bookings" value="bookings@usmanbee.com" />
              <ContactRow label="Press & Media" value="press@usmanbee.com" />
              <ContactRow label="Management" value="+234 800 000 0000" />
            </div>
          </div>

          <div>
            {sent ? (
              <div className="p-10 rounded-2xl border border-gold bg-card glow-gold text-center h-full grid place-items-center">
                <div>
                  <div className="text-4xl mb-3">✓</div>
                  <div className="font-display text-2xl font-bold mb-2">Message received.</div>
                  <p className="text-muted-foreground">Team will respond within 48 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 p-6 md:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur">
                <Input label="Name" placeholder="Your name" value={form.name} onChange={upd("name")} />
                <Input label="Email" type="email" placeholder="you@brand.com" value={form.email} onChange={upd("email")} />
                <Input label="Subject" placeholder="Show booking · Feature · Brand deal" value={form.subject} onChange={upd("subject")} />
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={upd("message")}
                    placeholder="Tell us about the opportunity..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                </div>
                {error && <div className="text-sm text-red-400">{error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-gold text-ink font-bold shadow-gold hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({
  label, type = "text", placeholder, value, onChange,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none transition-colors"
      />
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-gold transition-colors group">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</div>
        <div className="font-medium group-hover:text-gold transition-colors">{value}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover:text-gold transition-colors">
        <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
