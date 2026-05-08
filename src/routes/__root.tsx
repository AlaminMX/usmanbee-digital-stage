import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Usman Bee" },
      { name: "description", content: "A Nigerian singer, songwriter, and musician known for Afrobeats." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Usman Bee" },
      { property: "og:description", content: "A Nigerian singer, songwriter, and musician known for Afrobeats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Usman Bee" },
      { name: "twitter:description", content: "A Nigerian singer, songwriter, and musician known for Afrobeats." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/2yipEYoNmHWICLn1VCgDVUwyObh1/social-images/social-1778217242988-54b751ef-18c0-4e1b-9de1-bea2810001bb.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/2yipEYoNmHWICLn1VCgDVUwyObh1/social-images/social-1778217242988-54b751ef-18c0-4e1b-9de1-bea2810001bb.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster theme="dark" richColors position="top-right" />
    </>
  );
}
