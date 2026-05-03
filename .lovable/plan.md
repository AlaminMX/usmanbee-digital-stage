## Goal

Reconfigure the TanStack Start build to target Vercel's Node.js serverless runtime instead of Cloudflare Workers, and route all incoming requests through a single Vercel Serverless Function.

## Important caveat (please read first)

This project is currently built with `@lovable.dev/vite-tanstack-config`, which is the wrapper that wires up the Cloudflare preset, Lovable's preview sandbox, and the in-editor Publish flow on `*.lovable.app`.

Moving to a Vercel Node build means:
- The Lovable in-editor **Preview** and **Publish** buttons (which deploy to `usmanbee-digital-stage.lovable.app`) will likely stop working correctly — those rely on the Cloudflare/Workers output. The "Publish or update your Lovable project for it to appear here" banner you're seeing is the Lovable preview pipeline; switching presets won't fix it and may make it worse.
- Deploys will move to **Vercel** (you'll need a Vercel project + `vercel deploy` or Git integration). Lovable Cloud (database, auth, storage, edge env vars) keeps working — only the hosting target changes.

If your real goal is just to fix the broken Lovable preview banner, the right fix is usually to click **Publish → Update** in the Lovable editor, not to switch hosts. Let me know if you'd rather I investigate that instead.

Assuming you do want the Vercel Node migration, here's the plan:

## Changes

### 1. Replace the Lovable Vite wrapper with a direct TanStack Start config

`vite.config.ts` — stop using `@lovable.dev/vite-tanstack-config` (Cloudflare-targeted) and configure plugins manually with the Node target:

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({ target: "node-server" }),
    viteReact(),
  ],
});
```

### 2. Remove Cloudflare-specific config

- Delete `wrangler.jsonc`.
- Remove `@cloudflare/vite-plugin` from `package.json` dependencies.
- Remove `@lovable.dev/vite-tanstack-config` from devDependencies (or keep it unused — but cleanest to remove).

### 3. Replace `vercel.json` with a Node-function rewrite

The current `vercel.json` rewrites everything to `/index.html` (SPA mode, no SSR). Replace with a single serverless function entry that hands every request to the TanStack Start Node server:

```json
{
  "version": 2,
  "functions": {
    "api/server.mjs": { "runtime": "nodejs20.x" }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/server" }
  ]
}
```

### 4. Add the Vercel Node function entry

`api/server.mjs` — thin adapter that imports the built TanStack Start Node server entry and exports a Vercel-compatible handler:

```js
import handler from "../.output/server/index.mjs";
export default handler;
```

(Exact import path depends on what `target: "node-server"` emits; will verify after first build and adjust to whatever output directory TanStack Start produces — likely `.output/server/index.mjs` or `dist/server/index.mjs`.)

### 5. Environment variables on Vercel

Document that the user must set these in Vercel project settings (they're currently injected by Lovable Cloud locally):
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### 6. Verify

- Run `bun install` and `bun run build`, confirm the build emits a Node server bundle (not a Worker).
- Inspect the output path and update `api/server.mjs` import if needed.
- After you deploy to Vercel, test `/`, `/admin`, and `/api/public/admin-bootstrap` to confirm SSR + server routes both work through the single function.

## What I will NOT touch

- Application code (`src/**`), database schema, Supabase clients — none of that changes.
- Lovable Cloud connection — your DB/auth/storage stay the same.

## Confirm before I proceed

1. You're okay losing the Lovable in-editor Publish/Preview to `lovable.app` and moving hosting fully to Vercel?
2. Or do you actually just want me to debug the "Publish or update…" preview banner on Lovable hosting (no host switch)?
