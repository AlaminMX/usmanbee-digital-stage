import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// On Vercel: VERCEL env var is automatically set to "1" at build time.
// Nitro's vercel preset emits .vercel/output (Build Output API v3) which
// Vercel picks up automatically — no routing config needed in vercel.json.
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    nitro(
      isVercel
        ? { preset: "vercel" }
        : { preset: "node-server", output: { dir: "dist" } },
    ),
    viteReact(),
  ],
});
