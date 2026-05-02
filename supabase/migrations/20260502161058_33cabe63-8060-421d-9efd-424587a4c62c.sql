
-- Helper: admin check
CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _uid);
$$;

CREATE POLICY "admins read admin_users" ON public.admin_users FOR SELECT USING (public.is_admin(auth.uid()));

-- Tracks
CREATE TABLE public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  duration text,
  plays text,
  spotify_embed_url text,
  audiomack_embed_url text,
  cover_image_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active tracks" ON public.tracks FOR SELECT USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "admin write tracks" ON public.tracks FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Videos
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text,
  youtube_video_id text NOT NULL,
  thumbnail_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active videos" ON public.videos FOR SELECT USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "admin write videos" ON public.videos FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Bookings
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read bookings" ON public.bookings FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update bookings" ON public.bookings FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete bookings" ON public.bookings FOR DELETE USING (public.is_admin(auth.uid()));

-- Site settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admin write settings" ON public.site_settings FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Fan emails
CREATE TABLE public.fan_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  whatsapp_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fan_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert fan_emails" ON public.fan_emails FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read fan_emails" ON public.fan_emails FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete fan_emails" ON public.fan_emails FOR DELETE USING (public.is_admin(auth.uid()));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('track-covers','track-covers',true), ('site-images','site-images',true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read track-covers" ON storage.objects FOR SELECT USING (bucket_id = 'track-covers');
CREATE POLICY "admin write track-covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'track-covers' AND public.is_admin(auth.uid()));
CREATE POLICY "admin update track-covers" ON storage.objects FOR UPDATE USING (bucket_id = 'track-covers' AND public.is_admin(auth.uid()));
CREATE POLICY "admin delete track-covers" ON storage.objects FOR DELETE USING (bucket_id = 'track-covers' AND public.is_admin(auth.uid()));

CREATE POLICY "public read site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "admin write site-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin update site-images" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin delete site-images" ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()));

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_image_url',''),
  ('hero_tagline','From the dust of the North to the lights of Lagos — and now, to the world. A new sound is rising.'),
  ('hero_stat1_label','Streams'),('hero_stat1_value','2.4M+'),
  ('hero_stat2_label','Followers'),('hero_stat2_value','50K+'),
  ('hero_stat3_label','Releases'),('hero_stat3_value','12'),
  ('countdown_active','true'),
  ('countdown_target_date',(now() + interval '30 days')::text),
  ('countdown_release_title','New Single'),
  ('whatsapp_invite_url','#'),
  ('instagram_url','#'),('audiomack_url','#'),('spotify_url','#'),('youtube_channel_url','#'),('twitter_url','#'),
  ('artist_bio','Born in Northern Nigeria, raised between dust and dreams, Usman Bee turns lived experience into anthems. Hip-hop, Afro-rap, and a relentless work ethic — built for the global stage.')
ON CONFLICT (key) DO NOTHING;
