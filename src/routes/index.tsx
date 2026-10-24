import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/tiktok/app-shell";
import { VideoFeed } from "@/components/tiktok/video-feed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For You • TikTok Clone" },
      { name: "description", content: "A vertical video feed built with TanStack Start." },
      { property: "og:title", content: "For You • TikTok Clone" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <AppShell feed>
      <VideoFeed />
    </AppShell>
  );
}
