import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Countdown } from "@/components/site/Countdown";
import { Music } from "@/components/site/Music";
import { Videos } from "@/components/site/Videos";
import { Story } from "@/components/site/Story";
import { FanCapture } from "@/components/site/FanCapture";
import { Booking } from "@/components/site/Booking";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Usman Bee — From the North to the World | Nigerian Hip-Hop & Afro-Rap" },
      {
        name: "description",
        content:
          "Official site of Usman Bee — Nigerian hip-hop & Afro-rap artist. Stream the latest singles, watch new music videos, and join the inner circle for early access to every drop.",
      },
      { property: "og:title", content: "Usman Bee — From the North to the World" },
      { property: "og:description", content: "Independent Nigerian hip-hop, built for the global stage." },
      { property: "og:type", content: "music.musician" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Countdown />
      <Music />
      <Videos />
      <Story />
      <FanCapture />
      <Booking />
      <Footer />
    </main>
  );
}
