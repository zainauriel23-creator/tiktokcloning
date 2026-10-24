import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, AtSign, UserPlus } from "lucide-react";
import { AppShell } from "@/components/tiktok/app-shell";
import { authors, formatCount, posts } from "@/lib/feed-data";

type Activity = {
  id: string;
  kind: "like" | "comment" | "mention" | "follow";
  user: string;
  avatar: string;
  text: string;
  videoId?: string;
  time: string;
};

const activities: Activity[] = [
  {
    id: "a1",
    kind: "like",
    user: authors[2]!.username,
    avatar: authors[2]!.avatar,
    text: "liked your video.",
    videoId: "p1",
    time: "2m",
  },
  {
    id: "a2",
    kind: "follow",
    user: authors[4]!.username,
    avatar: authors[4]!.avatar,
    text: "started following you.",
    time: "15m",
  },
  {
    id: "a3",
    kind: "comment",
    user: authors[1]!.username,
    avatar: authors[1]!.avatar,
    text: "replied: this is fire 🔥",
    videoId: "p2",
    time: "1h",
  },
  {
    id: "a4",
    kind: "mention",
    user: authors[5]!.username,
    avatar: authors[5]!.avatar,
    text: "mentioned you in a comment.",
    videoId: "p3",
    time: "3h",
  },
  {
    id: "a5",
    kind: "like",
    user: authors[0]!.username,
    avatar: authors[0]!.avatar,
    text: "and 12 others liked your video.",
    videoId: "p4",
    time: "5h",
  },
  {
    id: "a6",
    kind: "follow",
    user: authors[3]!.username,
    avatar: authors[3]!.avatar,
    text: "started following you.",
    time: "1d",
  },
];

const tabs = ["All", "Likes", "Comments", "Mentions", "Followers"] as const;

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox • TikTok Clone" }] }),
  component: InboxPage,
});

function InboxPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = activities.filter((a) => {
    if (tab === "All") return true;
    if (tab === "Likes") return a.kind === "like";
    if (tab === "Comments") return a.kind === "comment";
    if (tab === "Mentions") return a.kind === "mention";
    if (tab === "Followers") return a.kind === "follow";
    return true;
  });

  return (
    <AppShell>
      <h1 className="px-4 pt-6 text-xl font-bold">Inbox</h1>
      <div className="sticky top-0 z-10 mt-2 flex gap-1 overflow-x-auto bg-black/90 px-4 pb-2 backdrop-blur [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === t ? "bg-white text-black" : "bg-white/10 text-white/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-white/5">
        {filtered.map((a) => {
          const video = a.videoId ? posts.find((p) => p.id === a.videoId) : undefined;
          return (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <span className={`block h-11 w-11 rounded-full bg-gradient-to-br ${a.avatar}`} />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                  {a.kind === "like" && <Heart className="h-3 w-3" fill="currentColor" />}
                  {a.kind === "comment" && <MessageCircle className="h-3 w-3" />}
                  {a.kind === "mention" && <AtSign className="h-3 w-3" />}
                  {a.kind === "follow" && <UserPlus className="h-3 w-3" />}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <span className="font-semibold">@{a.user}</span>{" "}
                  <span className="text-white/70">{a.text}</span>
                </p>
                <p className="mt-0.5 text-xs text-white/40">{a.time} ago</p>
              </div>
              {video ? (
                <video
                  src={video.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-12 w-9 shrink-0 rounded bg-zinc-800 object-cover"
                />
              ) : (
                <button className="rounded-md bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white">
                  Follow back
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="px-4 py-6 text-center text-xs text-white/30">
        {formatCount(activities.length)} new activities
      </p>
    </AppShell>
  );
}
