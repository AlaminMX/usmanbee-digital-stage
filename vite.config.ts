import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Detect Vercel build environment. On Vercel, use the `vercel` preset
// (Build Output API v3 → .vercel/output, no vercel.json needed).
// Locally and elsewhere, build a standalone Node server into ./dist.
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
