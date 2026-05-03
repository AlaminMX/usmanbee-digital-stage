import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  hero_image_url: "",
  hero_tagline:
    "From the dust of the North to the lights of Lagos — and now, to the world. A new sound is rising.",
  hero_stat1_label: "Streams",
  hero_stat1_value: "2.4M+",
  hero_stat2_label: "Followers",
  hero_stat2_value: "50K+",
  hero_stat3_label: "Releases",
  hero_stat3_value: "12",
  countdown_active: "true",
  countdown_target_date: "",
  countdown_release_title: "New Single",
  whatsapp_invite_url: "",
  instagram_url: "",
  audiomack_url: "",
  spotify_url: "",
  apple_music_url: "",
  youtube_channel_url: "",
  twitter_url: "",
  artist_bio: "",
};

let cache: SiteSettings | null = null;
const subs = new Set<(s: SiteSettings) => void>();

async function load() {
  const { data } = await supabase.from("site_settings").select("key,value");
  const next: SiteSettings = { ...DEFAULTS };
  if (data) for (const row of data) next[row.key] = row.value ?? "";
  cache = next;
  subs.forEach((fn) => fn(next));
  return next;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache ?? DEFAULTS);
  useEffect(() => {
    subs.add(setSettings);
    if (!cache) load();
    else setSettings(cache);
    return () => {
      subs.delete(setSettings);
    };
  }, []);
  return settings;
}

export function refreshSiteSettings() {
  return load();
}
