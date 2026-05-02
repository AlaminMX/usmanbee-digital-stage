# Usman Bee — Backend + Admin Dashboard

Adds a real backend (Lovable Cloud / Supabase) and a password-gated `/admin` dashboard. The public site's CSS, layout, fonts, animations, and component file names stay exactly as-is — only data sources, embeds, and form handlers change.

---

## 1. Enable Lovable Cloud

Lovable Cloud is not yet enabled (no `src/integrations/supabase`). Enabling it provisions Supabase, generates the typed client at `src/integrations/supabase/client.ts`, and exposes env vars automatically.

## 2. Database (migration)

Tables (all with RLS enabled):

- **tracks** — `id, title, subtitle, duration, plays, spotify_embed_url, audiomack_embed_url, cover_image_url, display_order int, is_active bool, created_at`
- **videos** — `id, title, tag, youtube_video_id, thumbnail_url, display_order int, is_active bool, created_at`
- **bookings** — `id, name, email, subject, message, status text default 'unread', created_at`
- **site_settings** — `key text unique, value text, updated_at`
- **fan_emails** — `id, email, whatsapp_number, created_at`
- **admin_users** — `user_id uuid` (references the one Supabase auth user used for admin writes)

RLS policies:

- `tracks`, `videos`, `site_settings` → public SELECT where `is_active` (or always for settings).
- `bookings`, `fan_emails` → public INSERT only.
- All write operations (UPDATE/DELETE/INSERT on tracks/videos/site_settings, SELECT/UPDATE/DELETE on bookings & fan_emails) gated by an `is_admin(auth.uid())` SECURITY DEFINER function checking `admin_users`.

Storage buckets (public read): `track-covers`, `site-images`.

Seed `site_settings` with current defaults (hero stats, tagline, bio, countdown date, social URLs as `#`, `whatsapp_invite_url`).

## 3. Admin authentication

Per spec, `/admin` uses a hardcoded credential gate (username `Usmanadmin`, password `U$M@N@DM!N`) stored in `sessionStorage.adminAuthenticated`. Because Supabase RLS needs a real auth user to allow writes, the gate also performs a silent `signInWithPassword` against a single pre-provisioned Supabase auth user (`admin@usmanbee.local`) whose `user_id` is inserted into `admin_users`. The login form only ever shows the hardcoded fields; the Supabase login is invisible.

- Login card centered, dark/gold theme, inline "Invalid credentials." error.
- Logout clears sessionStorage + `supabase.auth.signOut()`.
- No signup, no recovery.

## 4. Admin dashboard — `/admin`

New route `src/routes/admin.tsx` (and a small `src/components/admin/` folder). Sidebar layout with four tabs:

1. **Music** — list of tracks (cover, title, subtitle, duration, plays, active toggle, drag-handle reorder updating `display_order`, Edit, Delete). Add/Edit form with all fields incl. Spotify/Audiomack embed URLs and cover upload to `track-covers`. Public site shows top 4 active.
2. **Videos** — list (YT thumbnail, title, tag, toggle, reorder, edit, delete). Add form: title, tag, YouTube ID, display_order; thumbnail auto-derived `https://img.youtube.com/vi/{id}/maxresdefault.jpg`.
3. **Bookings** — newest first, expandable message, status badge (unread=gold, read=grey, archived=dim). Actions: Mark Read / Archive / Delete. Sidebar shows unread count badge.
4. **Site Settings** — sectioned form (Hero, Countdown, Fan Capture, Socials, Story). Each section has its own Save → upserts into `site_settings`. Hero image uploads to `site-images`. Countdown section includes the show/hide toggle, target datetime picker, release title.

Styling reuses existing dark + gold tokens from `src/styles.css` — no new design system.

## 5. Public site wiring (no visual changes)

A shared `src/hooks/useSiteSettings.ts` fetches `site_settings` once and exposes a typed object.

- **Hero.tsx** — replace hardcoded image/stats/tagline with values from settings (fallback to current defaults so first paint is identical).
- **Countdown.tsx** — if `countdown_active !== 'true'` return null; else read `countdown_target_date` and display "Dropping: {countdown_release_title}" above timer; show "Out Now — Stream It." at zero.
- **Music.tsx** — fetch active tracks (limit 4, ordered). On track select, swap the artwork area for a Spotify iframe using `spotify_embed_url`; small "Also on Audiomack" link below opens `audiomack_embed_url` in new tab. Streaming platform buttons read URLs from `site_settings`.
- **Videos.tsx** — fetch active videos. Click opens a YouTube lightbox modal (built with the existing `Dialog` UI) with autoplay iframe and close button. "Full channel" link uses `youtube_channel_url`.
- **Story.tsx** — read `artist_bio`.
- **Booking.tsx** — submit INSERTs into `bookings`; success → existing success state; error → "Something went wrong. Please try again."
- **FanCapture.tsx** — INSERT email + whatsapp into `fan_emails`, then `window.open(whatsapp_invite_url, '_blank')`, then show existing success state.
- **Footer.tsx / Nav.tsx** — social icons read from `site_settings`.

No CSS, Tailwind class, animation, font, or layout edits anywhere on the public site.

## Technical notes

- Supabase typed client used everywhere; no service role key in the browser — admin writes rely on the signed-in admin auth user + RLS.
- New route file `src/routes/admin.tsx` (flat TanStack Start convention).
- New files: `src/integrations/supabase/*` (auto), `src/hooks/useSiteSettings.ts`, `src/lib/admin-auth.ts`, `src/components/admin/{Sidebar,MusicTab,VideosTab,BookingsTab,SettingsTab,LoginGate}.tsx`, `src/components/site/VideoLightbox.tsx`.
- One SQL migration creates tables, policies, `is_admin()` function, buckets + bucket policies, and seeds `site_settings`.
- The single admin auth user (`admin@usmanbee.local`) and its `admin_users` row are created in the same migration via Supabase admin API call so the hardcoded credentials gate can sign in immediately.

## Out of scope

- No redesign of the public site.
- No additional admin users, password reset, or 2FA.
- No analytics dashboards beyond unread booking count.

ASK QUESTIONS IF NEEDED 