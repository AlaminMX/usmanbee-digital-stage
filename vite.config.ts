import { defineConfig as defineViteConfig } from "vite";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Build target switching:
// - On Vercel: use Nitro's `vercel` preset → emits .vercel/output (Build Output API v3).
//   No vercel.json needed. Vercel auto-detects and routes through serverless functions.
// - On Lovable (preview + publish): use the Lovable wrapper which configures the
//   Cloudflare Workers preset that Lovable's preview/publish pipeline expects.
// - Local `bun run build`: standalone Node server in ./dist (run via `bun start`).
const isVercel = !!process.env.VERCEL;
const isLocalNode = process.env.BUILD_TARGET === "node";

export default isVercel || isLocalNode
  ? defineViteConfig({
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
    })
  : defineLovableConfig({
      plugins: [tailwindcss(), tsConfigPaths()],
    });
