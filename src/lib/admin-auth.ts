import { supabase } from "@/integrations/supabase/client";

const FLAG = "adminAuthenticated";

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(FLAG) === "true";
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch("/api/public/admin-bootstrap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { ok: boolean; email?: string; password?: string };
  if (!json.ok || !json.email || !json.password) return false;

  const { error } = await supabase.auth.signInWithPassword({
    email: json.email,
    password: json.password,
  });
  if (error) return false;
  sessionStorage.setItem(FLAG, "true");
  return true;
}

export async function adminLogout() {
  sessionStorage.removeItem(FLAG);
  await supabase.auth.signOut();
}
