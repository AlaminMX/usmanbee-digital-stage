ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS spotify_url text;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS audiomack_url text;