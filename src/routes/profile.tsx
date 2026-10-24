import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Grid3x3, Heart, Bookmark, Settings, Share2 } from "lucide-react";
import { AppShell } from "@/components/tiktok/app-shell";
import { posts, formatCount } from "@/lib/feed-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile • TikTok Clone" }] }),
  component: ProfilePage,
});

const tabs = [
  { key: "videos", icon: Grid3x3 },
  { key: "liked", icon: Heart },
  { key: "saved", icon: Bookmark },
] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("videos");
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);

  return (
    <AppShell>
      {/* Banner */}
      <div className="relative h-28 bg-gradient-to-r from-rose-500/40 via-fuchsia-500/30 to-cyan-500/30">
        <Link
          to="/signup"
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      <div className="-mt-12 px-4">
        <div className="flex items-end justify-between">
          <span className="block h-24 w-24 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 ring-4 ring-black" />
          <div className="flex gap-2 pb-2">
            <button className="rounded-md bg-rose-500 px-5 py-2 text-sm font-semibold text-white">
              Edit profile
            </button>
            <button className="rounded-md border border-white/20 p-2 text-white">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h1 className="mt-3 text-lg font-bold">Buck Bunny</h1>
        <p className="text-sm text-white/50">@buck.bunny</p>

        <p className="mt-2 text-sm text-white/80">
          🐰 Forest main character. Posting chaos & vibes. New clip every other day.
        </p>

        <div className="mt-3 flex gap-6 text-sm">
          <span>
            <strong>184</strong> <span className="text-white/50">Following</span>
          </span>
          <span>
            <strong>2.1M</strong> <span className="text-white/50">Followers</span>
          </span>
          <span>
            <strong>{formatCount(totalLikes)}</strong> <span className="text-white/50">Likes</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 mt-4 flex border-b border-white/10 bg-black/90 backdrop-blur">
        {tabs.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium ${
              tab === key ? "border-b-2 border-white text-white" : "text-white/50"
            }`}
          >
            <Icon className="h-4 w-4" /> {key}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5 py-0.5">
        {posts.map((p) => (
          <div key={p.id} className="relative aspect-[9/16] overflow-hidden bg-zinc-900">
            <video
              src={p.videoUrl}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
            <div className="absolute bottom-1 left-1.5 flex items-center gap-1 text-xs text-white drop-shadow">
              <Heart className="h-3 w-3" fill="currentColor" /> {formatCount(p.likes)}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
