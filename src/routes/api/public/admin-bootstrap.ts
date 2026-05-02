import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "admin@usmanbee.local";
const ADMIN_PASSWORD = "U$M@N@DM!N";
const ADMIN_USERNAME = "Usmanadmin";

export const Route = createFileRoute("/api/public/admin-bootstrap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          username?: string;
          password?: string;
        };
        if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Ensure auth user + admin_users row exist
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        let user = list?.users.find((u) => u.email === ADMIN_EMAIL);
        if (!user) {
          const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
          });
          if (error || !created.user) {
            return new Response(JSON.stringify({ ok: false, error: error?.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          user = created.user;
        } else {
          // Make sure password is current
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: ADMIN_PASSWORD,
          });
        }

        await supabaseAdmin
          .from("admin_users")
          .upsert({ user_id: user.id }, { onConflict: "user_id" });

        return new Response(
          JSON.stringify({ ok: true, email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
          { headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
