import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { VideoCard } from "./video-card";
import { useFeed } from "@/lib/feed-store";

export function VideoFeed() {
  const [tab, setTab] = useState<"following" | "foryou">("foryou");
  const { posts } = useFeed();

  return (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]">
      {/* Hide scrollbar for an immersive, app-like feel */}
      <style>{`div::-webkit-scrollbar{display:none}`}</style>

      {/* Top tabs + search */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto flex max-w-[460px] items-center justify-center gap-6 pt-3">
        <div className="pointer-events-auto flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setTab("following")}
            className={`font-semibold transition-opacity ${
              tab === "following" ? "text-white opacity-100" : "text-white/60"
            }`}
          >
            Following
          </button>
          <span className="text-white/40">|</span>
          <button
            type="button"
            onClick={() => setTab("foryou")}
            className={`font-semibold transition-opacity ${
              tab === "foryou" ? "text-white opacity-100" : "text-white/60"
            }`}
          >
            For You
          </button>
        </div>
        <Link
          to="/discover"
          className="pointer-events-auto absolute right-3 top-3 text-white"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </Link>
      </header>

      {posts.map((post) => (
        <VideoCard key={post.id} post={post} />
      ))}
    </div>
  );
}
