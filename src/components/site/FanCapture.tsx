import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function FanCapture() {
  const s = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !whatsapp) return;
    setBusy(true);
    await supabase.from("fan_emails").insert({ email, whatsapp_number: whatsapp });
    if (s.whatsapp_invite_url && s.whatsapp_invite_url !== "#") {
      window.open(s.whatsapp_invite_url, "_blank", "noopener,noreferrer");
    }
    setSubmitted(true);
    setBusy(false);
  };

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1000px] h-[600px] bg-radial-gold blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-card/50 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-soft">
            ★ Inner Circle
          </span>
        </div>

        <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-tighter mb-5">
          Get early access to <br />
          <span className="text-gradient-gold italic">every drop.</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-base md:text-lg">
          Unreleased previews. First listens. Show invites. Direct from Usman to your inbox & WhatsApp —
          before anywhere else.
        </p>

        {submitted ? (
          <div className="max-w-lg mx-auto p-10 rounded-2xl border border-gold bg-card glow-gold">
            <div className="text-4xl mb-3">✦</div>
            <div className="font-display text-2xl font-bold mb-2">You're in.</div>
            <p className="text-muted-foreground">
              Welcome to the inner circle. The next drop hits your inbox first.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field icon={<MailIcon />} placeholder="your@email.com" type="email" value={email} onChange={setEmail} />
              <Field icon={<WhatsAppIcon />} placeholder="+234 WhatsApp" type="tel" value={whatsapp} onChange={setWhatsapp} />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full px-6 py-4 rounded-xl bg-gradient-gold text-ink font-bold text-base shadow-gold hover:shadow-gold transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              Join the Movement →
            </button>
            <p className="text-xs text-muted-foreground pt-2">
              No spam. Just the music. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  icon, placeholder, type, value, onChange,
}: {
  icon: React.ReactNode; placeholder: string; type: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-gold transition-colors">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-gold focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4 0-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  );
}
