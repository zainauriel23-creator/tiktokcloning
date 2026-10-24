import { Heart, MessageCircle, Bookmark, Share2, Music2, Plus } from "lucide-react";
import { formatCount, type VideoPost } from "@/lib/feed-data";

type Props = {
  post: VideoPost;
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
  onOpenSound: () => void;
};

function RailButton({
  icon: Icon,
  count,
  active,
  onClick,
  activeClass,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  count: string;
  active?: boolean;
  onClick?: () => void;
  activeClass?: string;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center transition-transform active:scale-90 ${
          active ? activeClass : "text-white drop-shadow"
        }`}
      >
        <Icon className="h-9 w-9" />
      </span>
      <span className="text-xs font-semibold text-white drop-shadow">{count}</span>
    </button>
  );
}

export function ActionRail({
  post,
  likeCount,
  liked,
  bookmarked,
  onLike,
  onBookmark,
  onComment,
  onOpenSound,
}: Props) {
  return (
    <div className="absolute bottom-20 right-2 z-20 flex flex-col items-center gap-5">
      {/* Author avatar with follow button */}
      <div className="relative mb-1">
        <span
          className={`block h-12 w-12 rounded-full bg-gradient-to-br ${post.author.avatar} ring-2 ring-white`}
        />
        <span className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 text-white">
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>

      <RailButton
        icon={Heart}
        label="Like"
        count={formatCount(likeCount)}
        active={liked}
        onClick={onLike}
        activeClass="text-rose-500 drop-shadow"
      />
      <RailButton
        icon={MessageCircle}
        label="Comments"
        count={formatCount(post.comments)}
        onClick={onComment}
      />
      <RailButton
        icon={Bookmark}
        label="Bookmark"
        count={formatCount(post.bookmarks)}
        active={bookmarked}
        onClick={onBookmark}
        activeClass="text-yellow-400 drop-shadow"
      />
      <RailButton icon={Share2} label="Share" count={formatCount(post.shares)} />

      {/* Spinning music disc — tap to open the sound */}
      <button
        type="button"
        aria-label="Original sound"
        onClick={onOpenSound}
        className="mt-1 h-11 w-11 animate-[spin_4s_linear_infinite] rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-1.5 ring-1 ring-white/20"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-white/70">
          <Music2 className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
