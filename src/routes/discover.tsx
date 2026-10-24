import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/tiktok/app-shell";
import { posts, trendingHashtags, formatCount } from "@/lib/feed-data";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover • TikTok Clone" }] }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [q, setQ] = useState("");
  const results = q
    ? posts.filter(
        (p) =>
          p.caption.toLowerCase().includes(q.toLowerCase()) ||
          p.author.username.toLowerCase().includes(q.toLowerCase()) ||
          p.hashtags.some((h) => h.includes(q.toLowerCase())),
      )
    : posts;

  return (
    <AppShell>
      <div className="sticky top-0 z-20 bg-black/90 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5">
          <Search className="h-5 w-5 text-white/50" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search creators, sounds, hashtags"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {!q && (
        <div className="px-4 py-3">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/80">
            <TrendingUp className="h-4 w-4" /> Trending
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((t) => (
              <div key={t.tag} className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <p className="text-sm font-bold text-white">#{t.tag}</p>
                <p className="text-xs text-white/50">
                  {t.posts} • {t.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {results.map((p) => (
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
              <span>▶</span> {formatCount(p.likes)}
            </div>
          </div>
        ))}
      </div>
      {results.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-white/50">No results for “{q}”.</p>
      )}
    </AppShell>
  );
}
