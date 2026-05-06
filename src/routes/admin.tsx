import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminLogin, adminLogout, isAdminAuthenticated } from "@/lib/admin-auth";
import { refreshSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · Usman Bee" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type Tab = "music" | "videos" | "bookings" | "settings";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("music");
  const [unread, setUnread] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
  }, []);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");
      setUnread(count ?? 0);
    };
    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
  }, [authed, tab]);

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setDrawerOpen(false);
  };

  const tabLabel: Record<Tab, string> = {
    music: "Music",
    videos: "Videos",
    bookings: "Bookings",
    settings: "Site Settings",
  };

  const SidebarContent = () => (
    <>
      <div className="font-display text-2xl font-black mb-10">
        USMAN <span className="text-gradient-gold italic">Bee.</span>
      </div>
      <nav className="space-y-1 flex-1">
        <NavBtn label="Music" active={tab === "music"} onClick={() => handleTabChange("music")} />
        <NavBtn label="Videos" active={tab === "videos"} onClick={() => handleTabChange("videos")} />
        <NavBtn label="Bookings" active={tab === "bookings"} onClick={() => handleTabChange("bookings")} badge={unread} />
        <NavBtn label="Site Settings" active={tab === "settings"} onClick={() => handleTabChange("settings")} />
      </nav>
      <button
        onClick={async () => {
          await adminLogout();
          setAuthed(false);
        }}
        className="mt-6 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-gold text-left"
      >
        Logout →
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border bg-ink/40 p-6 flex-col shrink-0 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-ink/40 sticky top-0 z-40">
        <div className="font-display text-xl font-black">
          USMAN <span className="text-gradient-gold italic">Bee.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{tabLabel[tab]}</span>
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 grid place-items-center rounded-xl border border-border"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-background border-r border-border p-6 flex flex-col h-full z-10">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-lg border border-border"
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-5 md:p-8 lg:p-12 overflow-x-hidden min-w-0">
        {tab === "music" && <MusicTab />}
        {tab === "videos" && <VideosTab />}
        {tab === "bookings" && <BookingsTab onChanged={() => setUnread((n) => n)} />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function NavBtn({
  label, active, onClick, badge,
}: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-sm transition-colors ${
        active ? "bg-card border border-gold/30 text-gold" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
      }`}
    >
      <span>{label}</span>
      {!!badge && badge > 0 && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-gold text-ink font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const ok = await adminLogin(u, p);
    setBusy(false);
    if (!ok) { setErr("Invalid credentials."); return; }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="font-display text-3xl font-black mb-2 text-center">
          USMAN <span className="text-gradient-gold italic">Bee.</span>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-soft text-center mb-8">
          Admin Access
        </div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">Username</label>
        <input
          autoFocus
          value={u}
          onChange={(e) => setU(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none"
        />
        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">Password</label>
        <input
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none"
        />
        {err && <div className="text-sm text-red-400 mb-4">{err}</div>}
        <button
          type="submit"
          disabled={busy}
          className="w-full px-6 py-3 rounded-xl bg-gradient-gold text-ink font-bold disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

/* ────────────────── Music Tab ────────────────── */

type Track = {
  id: string;
  title: string;
  subtitle: string | null;
  duration: string | null;
  plays: string | null;
  audio_url: string | null;
  cover_image_url: string | null;
  spotify_url: string | null;
  audiomack_url: string | null;
  display_order: number;
  is_active: boolean;
};

function MusicTab() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [editing, setEditing] = useState<Track | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .order("display_order", { ascending: true });
    setTracks((data as Track[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggleActive = async (t: Track) => {
    await supabase.from("tracks").update({ is_active: !t.is_active }).eq("id", t.id);
    load();
  };
  const move = async (t: Track, dir: -1 | 1) => {
    const idx = tracks.findIndex((x) => x.id === t.id);
    const swap = tracks[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("tracks").update({ display_order: swap.display_order }).eq("id", t.id),
      supabase.from("tracks").update({ display_order: t.display_order }).eq("id", swap.id),
    ]);
    load();
  };
  const del = async (t: Track) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await supabase.from("tracks").delete().eq("id", t.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-display text-3xl md:text-4xl font-black">Music</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-gold text-ink font-semibold text-sm whitespace-nowrap"
        >
          + Add Track
        </button>
      </div>

      {showForm && (
        <TrackForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
          existingMaxOrder={Math.max(0, ...tracks.map((t) => t.display_order))}
        />
      )}

      <div className="space-y-2">
        {tracks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-border bg-card/40">
            <div className="flex flex-col shrink-0">
              <button onClick={() => move(t, -1)} className="text-muted-foreground hover:text-gold py-0.5">▲</button>
              <button onClick={() => move(t, 1)} className="text-muted-foreground hover:text-gold py-0.5">▼</button>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-background shrink-0">
              {t.cover_image_url && <img src={t.cover_image_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate text-sm md:text-base">{t.title}</div>
              <div className="text-xs text-muted-foreground truncate">{t.subtitle}</div>
            </div>
            <div className="hidden lg:block text-xs font-mono text-muted-foreground shrink-0">
              {t.audio_url ? (
                <span className="text-green-400">✓ Audio</span>
              ) : (
                <span className="text-red-400">No audio</span>
              )}
            </div>
            <label className="flex items-center gap-1.5 text-xs shrink-0 cursor-pointer">
              <input type="checkbox" checked={t.is_active} onChange={() => toggleActive(t)} className="w-4 h-4" />
              <span className="hidden sm:inline">Active</span>
            </label>
            <button
              onClick={() => { setEditing(t); setShowForm(true); }}
              className="text-sm text-gold hover:underline shrink-0"
            >
              Edit
            </button>
            <button onClick={() => del(t)} className="text-sm text-red-400 hover:underline shrink-0">Del</button>
          </div>
        ))}
        {!tracks.length && <div className="text-sm text-muted-foreground py-4">No tracks yet.</div>}
      </div>
    </div>
  );
}

function TrackForm({
  initial, onClose, onSaved, existingMaxOrder,
}: {
  initial: Track | null;
  onClose: () => void;
  onSaved: () => void;
  existingMaxOrder: number;
}) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    duration: initial?.duration ?? "",
    plays: initial?.plays ?? "",
    spotify_url: initial?.spotify_url ?? "",
    audiomack_url: initial?.audiomack_url ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
    audio_url: initial?.audio_url ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  const uploadCover = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("track-covers").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("track-covers").getPublicUrl(path);
    setF((prev) => ({ ...prev, cover_image_url: data.publicUrl }));
    toast.success("Cover uploaded");
  };

  const uploadAudio = async (file: File) => {
    setAudioUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("track-audio").upload(path, file, { upsert: true });
    setAudioUploading(false);
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("track-audio").getPublicUrl(path);
    setF((prev) => ({ ...prev, audio_url: data.publicUrl }));
    toast.success("Audio uploaded");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (initial) {
      await supabase.from("tracks").update(f).eq("id", initial.id);
    } else {
      await supabase.from("tracks").insert({ ...f, display_order: existingMaxOrder + 1, is_active: true });
    }
    setBusy(false);
    toast.success("Saved");
    onSaved();
  };

  return (
    <form onSubmit={save} className="mb-6 p-5 rounded-2xl border border-gold/30 bg-card grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <FormField label="Subtitle (e.g. Single · 2025)" value={f.subtitle} onChange={(v) => setF({ ...f, subtitle: v })} />
      <FormField label="Duration (e.g. 3:12)" value={f.duration} onChange={(v) => setF({ ...f, duration: v })} />
      <FormField label="Plays count (e.g. 847K)" value={f.plays} onChange={(v) => setF({ ...f, plays: v })} />
      <FormField label="Spotify Artist Page URL (optional)" value={f.spotify_url} onChange={(v) => setF({ ...f, spotify_url: v })} />
      <FormField label="Audiomack URL (optional)" value={f.audiomack_url} onChange={(v) => setF({ ...f, audiomack_url: v })} />

      {/* Cover image */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Cover Image
        </label>
        <div className="space-y-2">
          {f.cover_image_url && (
            <img src={f.cover_image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
            className="text-sm w-full"
          />
        </div>
      </div>

      {/* Audio file */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Audio File (MP3 or M4A)
        </label>
        <div className="space-y-2">
          {f.audio_url && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400">✓ Audio uploaded</span>
              <audio controls src={f.audio_url} className="h-8 max-w-[180px]" />
            </div>
          )}
          <input
            type="file"
            accept="audio/mp3,audio/mpeg,audio/m4a,audio/mp4,audio/*"
            onChange={(e) => e.target.files?.[0] && uploadAudio(e.target.files[0])}
            className="text-sm w-full"
            disabled={audioUploading}
          />
          {audioUploading && (
            <p className="text-xs text-gold animate-pulse">Uploading audio… please wait</p>
          )}
        </div>
      </div>

      <div className="md:col-span-2 flex gap-3 flex-wrap">
        <button
          type="submit"
          disabled={busy || audioUploading}
          className="px-5 py-2.5 rounded-xl bg-gradient-gold text-ink font-semibold disabled:opacity-60"
        >
          {initial ? "Update" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ────────────────── Videos Tab ────────────────── */

type Video = {
  id: string;
  title: string;
  tag: string | null;
  youtube_video_id: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
};

function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editing, setEditing] = useState<Video | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("videos").select("*").order("display_order", { ascending: true });
    setVideos((data as Video[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (v: Video) => {
    await supabase.from("videos").update({ is_active: !v.is_active }).eq("id", v.id);
    load();
  };
  const move = async (v: Video, dir: -1 | 1) => {
    const idx = videos.findIndex((x) => x.id === v.id);
    const swap = videos[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("videos").update({ display_order: swap.display_order }).eq("id", v.id),
      supabase.from("videos").update({ display_order: v.display_order }).eq("id", swap.id),
    ]);
    load();
  };
  const del = async (v: Video) => {
    if (!confirm(`Delete "${v.title}"?`)) return;
    await supabase.from("videos").delete().eq("id", v.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-display text-3xl md:text-4xl font-black">Videos</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-gold text-ink font-semibold text-sm whitespace-nowrap"
        >
          + Add Video
        </button>
      </div>

      {showForm && (
        <VideoForm
          initial={editing}
          existingMaxOrder={Math.max(0, ...videos.map((v) => v.display_order))}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}

      <div className="space-y-2">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-border bg-card/40">
            <div className="flex flex-col shrink-0">
              <button onClick={() => move(v, -1)} className="text-muted-foreground hover:text-gold py-0.5">▲</button>
              <button onClick={() => move(v, 1)} className="text-muted-foreground hover:text-gold py-0.5">▼</button>
            </div>
            <img
              src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_video_id}/mqdefault.jpg`}
              alt=""
              className="w-20 md:w-24 aspect-video rounded-lg object-cover bg-background shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate text-sm md:text-base">{v.title}</div>
              <div className="text-xs text-muted-foreground truncate">{v.tag} · {v.youtube_video_id}</div>
            </div>
            <label className="flex items-center gap-1.5 text-xs shrink-0 cursor-pointer">
              <input type="checkbox" checked={v.is_active} onChange={() => toggle(v)} className="w-4 h-4" />
              <span className="hidden sm:inline">Active</span>
            </label>
            <button onClick={() => { setEditing(v); setShowForm(true); }} className="text-sm text-gold hover:underline shrink-0">Edit</button>
            <button onClick={() => del(v)} className="text-sm text-red-400 hover:underline shrink-0">Del</button>
          </div>
        ))}
        {!videos.length && <div className="text-sm text-muted-foreground py-4">No videos yet.</div>}
      </div>
    </div>
  );
}

function VideoForm({
  initial, existingMaxOrder, onClose, onSaved,
}: {
  initial: Video | null;
  existingMaxOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    tag: initial?.tag ?? "",
    youtube_video_id: initial?.youtube_video_id ?? "",
  });
  const [busy, setBusy] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      ...f,
      thumbnail_url: `https://img.youtube.com/vi/${f.youtube_video_id}/maxresdefault.jpg`,
    };
    if (initial) {
      await supabase.from("videos").update(payload).eq("id", initial.id);
    } else {
      await supabase.from("videos").insert({ ...payload, display_order: existingMaxOrder + 1, is_active: true });
    }
    setBusy(false);
    toast.success("Saved");
    onSaved();
  };

  return (
    <form onSubmit={save} className="mb-6 p-5 rounded-2xl border border-gold/30 bg-card grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <FormField label="Tag (e.g. Music Video)" value={f.tag ?? ""} onChange={(v) => setF({ ...f, tag: v })} />
      <div className="md:col-span-2">
        <FormField
          label="YouTube Video ID (e.g. dQw4w9WgXcQ — just the ID, not the full URL)"
          value={f.youtube_video_id}
          onChange={(v) => setF({ ...f, youtube_video_id: v })}
          required
        />
      </div>
      <div className="md:col-span-2 flex gap-3 flex-wrap">
        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-xl bg-gradient-gold text-ink font-semibold disabled:opacity-60">
          {initial ? "Update" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border">Cancel</button>
      </div>
    </form>
  );
}

/* ────────────────── Bookings Tab ────────────────── */

type Booking = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

function BookingsTab({ onChanged }: { onChanged: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings((data as Booking[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (b: Booking, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", b.id);
    load();
    onChanged();
  };
  const del = async (b: Booking) => {
    if (!confirm("Delete?")) return;
    await supabase.from("bookings").delete().eq("id", b.id);
    load();
    onChanged();
  };

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl font-black mb-6">Bookings</h1>
      <div className="space-y-2">
        {bookings.map((b) => {
          const open = openId === b.id;
          const color =
            b.status === "unread" ? "border-gold/40 bg-card" :
            b.status === "archived" ? "border-border bg-card/30 opacity-60" :
            "border-border bg-card/40";
          return (
            <div key={b.id} className={`p-4 rounded-xl border ${color}`}>
              <div className="flex items-start md:items-center gap-3 flex-wrap">
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded shrink-0 ${
                  b.status === "unread" ? "bg-gradient-gold text-ink" : "bg-background text-muted-foreground"
                }`}>
                  {b.status}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-sm">
                    {b.name} <span className="text-xs text-muted-foreground font-normal">· {b.email}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{b.subject}</div>
                </div>
                <div className="text-xs font-mono text-muted-foreground hidden lg:block shrink-0">
                  {new Date(b.created_at).toLocaleString()}
                </div>
                <button onClick={() => setOpenId(open ? null : b.id)} className="text-sm text-gold shrink-0">
                  {open ? "Hide" : "View"}
                </button>
              </div>
              {open && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm whitespace-pre-wrap mb-4">{b.message}</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setStatus(b, "read")} className="text-xs px-3 py-2 rounded-lg border border-border hover:border-gold min-h-[36px]">Mark as Read</button>
                    <button onClick={() => setStatus(b, "archived")} className="text-xs px-3 py-2 rounded-lg border border-border hover:border-gold min-h-[36px]">Archive</button>
                    <button onClick={() => del(b)} className="text-xs px-3 py-2 rounded-lg border border-red-400/40 text-red-400 min-h-[36px]">Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!bookings.length && <div className="text-sm text-muted-foreground py-4">No bookings yet.</div>}
      </div>
    </div>
  );
}

/* ────────────────── Settings Tab ────────────────── */

function SettingsTab() {
  const [s, setS] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("key,value");
    const obj: Record<string, string> = {};
    (data ?? []).forEach((r) => { obj[r.key] = r.value ?? ""; });
    setS(obj);
    setLoaded(true);
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setS((p) => ({ ...p, [k]: v }));

  const saveSection = async (keys: string[]) => {
    const rows = keys.map((k) => ({ key: k, value: s[k] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) toast.error(error.message);
    else { toast.success("Saved"); refreshSiteSettings(); }
  };

  const uploadHero = async (file: File) => {
    const path = `hero-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    set("hero_image_url", data.publicUrl);
  };

  if (!loaded) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-black">Site Settings</h1>

      <Section title="Hero" onSave={() => saveSection([
        "hero_image_url", "hero_tagline",
        "hero_stat1_label", "hero_stat1_value",
        "hero_stat2_label", "hero_stat2_value",
        "hero_stat3_label", "hero_stat3_value",
      ])}>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">Hero Background Image</label>
          <div className="flex items-center gap-4 flex-wrap">
            {s.hero_image_url && <img src={s.hero_image_url} alt="" className="w-24 h-16 object-cover rounded" />}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])} className="text-sm" />
          </div>
        </div>
        <FormField label="Tagline" value={s.hero_tagline ?? ""} onChange={(v) => set("hero_tagline", v)} multiline />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Stat 1 Label" value={s.hero_stat1_label ?? ""} onChange={(v) => set("hero_stat1_label", v)} />
          <FormField label="Stat 1 Value" value={s.hero_stat1_value ?? ""} onChange={(v) => set("hero_stat1_value", v)} />
          <FormField label="Stat 2 Label" value={s.hero_stat2_label ?? ""} onChange={(v) => set("hero_stat2_label", v)} />
          <FormField label="Stat 2 Value" value={s.hero_stat2_value ?? ""} onChange={(v) => set("hero_stat2_value", v)} />
          <FormField label="Stat 3 Label" value={s.hero_stat3_label ?? ""} onChange={(v) => set("hero_stat3_label", v)} />
          <FormField label="Stat 3 Value" value={s.hero_stat3_value ?? ""} onChange={(v) => set("hero_stat3_value", v)} />
        </div>
      </Section>

      <Section title="Music Player" onSave={() => saveSection(["autoplay_enabled"])}>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={s.autoplay_enabled === "true"}
            onChange={(e) => set("autoplay_enabled", e.target.checked ? "true" : "false")}
            className="w-4 h-4"
          />
          Auto-play top track when page loads
        </label>
        <p className="text-xs text-muted-foreground">
          When enabled, the first track starts playing automatically when a visitor opens the site. Browsers may block this on first visit — the user will need to interact with the page first.
        </p>
      </Section>

      <Section title="Countdown" onSave={() => saveSection(["countdown_active", "countdown_target_date", "countdown_release_title"])}>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={s.countdown_active === "true"}
            onChange={(e) => set("countdown_active", e.target.checked ? "true" : "false")}
            className="w-4 h-4"
          />
          Show countdown on site
        </label>
        <FormField
          label="Target Date & Time"
          value={s.countdown_target_date ? new Date(s.countdown_target_date).toISOString().slice(0, 16) : ""}
          onChange={(v) => set("countdown_target_date", v ? new Date(v).toISOString() : "")}
          type="datetime-local"
        />
        <FormField label="Release Title" value={s.countdown_release_title ?? ""} onChange={(v) => set("countdown_release_title", v)} />
      </Section>

      <Section title="Fan Capture" onSave={() => saveSection(["whatsapp_invite_url"])}>
        <FormField label="WhatsApp Invite Link" value={s.whatsapp_invite_url ?? ""} onChange={(v) => set("whatsapp_invite_url", v)} />
      </Section>

      <Section title="Social & Streaming Links" onSave={() => saveSection(["instagram_url", "audiomack_url", "spotify_url", "apple_music_url", "youtube_channel_url", "twitter_url"])}>
        <FormField label="Instagram URL" value={s.instagram_url ?? ""} onChange={(v) => set("instagram_url", v)} />
        <FormField label="Audiomack URL" value={s.audiomack_url ?? ""} onChange={(v) => set("audiomack_url", v)} />
        <FormField label="Spotify Artist URL" value={s.spotify_url ?? ""} onChange={(v) => set("spotify_url", v)} />
        <FormField label="Apple Music URL" value={s.apple_music_url ?? ""} onChange={(v) => set("apple_music_url", v)} />
        <FormField label="YouTube Channel URL" value={s.youtube_channel_url ?? ""} onChange={(v) => set("youtube_channel_url", v)} />
        <FormField label="Twitter / X URL" value={s.twitter_url ?? ""} onChange={(v) => set("twitter_url", v)} />
      </Section>

      <Section title="Story / Bio" onSave={() => saveSection(["artist_bio"])}>
        <FormField label="Artist Bio" value={s.artist_bio ?? ""} onChange={(v) => set("artist_bio", v)} multiline rows={6} />
      </Section>
    </div>
  );
}

function Section({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="p-5 md:p-6 rounded-2xl border border-border bg-card/40">
      <div className="flex items-center justify-between mb-5 gap-4">
        <h2 className="font-display text-lg md:text-xl font-bold">{title}</h2>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-gradient-gold text-ink font-semibold text-sm shrink-0">Save</button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label, value, onChange, required, multiline, rows, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; multiline?: boolean; rows?: number; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          required={required}
          value={value}
          rows={rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none resize-none"
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none"
        />
      )}
    </div>
  );
}
