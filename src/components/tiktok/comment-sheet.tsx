import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";
import { useFeed } from "@/lib/feed-store";
import { formatCount, type VideoPost } from "@/lib/feed-data";

export function CommentSheet({
  post,
  open,
  onClose,
}: {
  post: VideoPost;
  open: boolean;
  onClose: () => void;
}) {
  const { addComment, toggleCommentLike } = useFeed();
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    addComment(post.id, text);
    setText("");
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={`${formatCount(post.comments)} comments`}>
      <ul className="divide-y divide-white/5 px-4 pb-4">
        {post.commentsList.length === 0 && (
          <li className="py-10 text-center text-sm text-white/40">
            No comments yet. Be the first to comment.
          </li>
        )}
        {post.commentsList.map((c) => (
          <li key={c.id} className="flex items-start gap-3 py-3">
            <span
              className={`mt-0.5 block h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${c.avatar}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/60">@{c.author}</p>
              <p className="text-sm text-white">{c.text}</p>
              <p className="mt-1 text-xs text-white/40">{c.time}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleCommentLike(post.id, c.id)}
              className="flex shrink-0 flex-col items-center gap-1 pt-1"
            >
              <Heart
                className={`h-5 w-5 ${c.liked ? "text-rose-500" : "text-white/50"}`}
                fill={c.liked ? "currentColor" : "none"}
              />
              <span className="text-xs text-white/50">{formatCount(c.likes)}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 flex items-center gap-2 border-t border-white/10 bg-zinc-900 px-3 py-3">
        <span className="block h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add comment..."
          className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-full bg-rose-500 p-2.5 text-white disabled:opacity-40"
          aria-label="Post comment"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </BottomSheet>
  );
}
