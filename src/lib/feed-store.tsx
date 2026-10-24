import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { forYouPosts, currentUser, type Comment, type VideoPost } from "./feed-data";
import { getSound, type Sound } from "./sounds";

export type NewPostInput = {
  mediaType: "video" | "photo";
  mediaUrl: string;
  caption: string;
  soundId: string;
};

type FeedStore = {
  posts: VideoPost[];
  pendingSound: Sound | null;
  setPendingSound: (s: Sound | null) => void;
  addPost: (input: NewPostInput) => void;
  addComment: (postId: string, text: string) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
};

const FeedContext = createContext<FeedStore | null>(null);

// Deep-copy the seed so the store fully owns its data and never mutates the mock.
function seedPosts(): VideoPost[] {
  return forYouPosts.map((p) => ({ ...p, commentsList: [...p.commentsList] }));
}

export function FeedStoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<VideoPost[]>(seedPosts);
  const [pendingSound, setPendingSound] = useState<Sound | null>(null);

  const value = useMemo<FeedStore>(
    () => ({
      posts,
      pendingSound,
      setPendingSound,
      addPost(input) {
        const sound = getSound(input.soundId);
        const newPost: VideoPost = {
          id: `p-${Date.now()}`,
          videoUrl: input.mediaUrl,
          mediaType: input.mediaType,
          author: currentUser,
          caption: input.caption.trim() || "new post",
          hashtags: input.caption.match(/#(\w+)/g)?.map((h) => h.slice(1)) ?? ["fyp", "new"],
          music: `${sound.title} — ${sound.artist}`,
          soundId: input.soundId,
          likes: 0,
          comments: 0,
          shares: 0,
          bookmarks: 0,
          commentsList: [],
          liked: false,
          bookmarked: false,
        };
        setPosts((prev) => [newPost, ...prev]);
      },
      addComment(postId, text) {
        const t = text.trim();
        if (!t) return;
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            const c: Comment = {
              id: `c-${Date.now()}`,
              author: currentUser.username,
              avatar: currentUser.avatar,
              text: t,
              time: "now",
              likes: 0,
            };
            return {
              ...p,
              comments: p.comments + 1,
              commentsList: [c, ...p.commentsList],
            };
          }),
        );
      },
      toggleLike(postId) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            const liked = !p.liked;
            return { ...p, liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) };
          }),
        );
      },
      toggleBookmark(postId) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            const bookmarked = !p.bookmarked;
            return {
              ...p,
              bookmarked,
              bookmarks: Math.max(0, p.bookmarks + (bookmarked ? 1 : -1)),
            };
          }),
        );
      },
      toggleCommentLike(postId, commentId) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              commentsList: p.commentsList.map((c) => {
                if (c.id !== commentId) return c;
                const liked = !c.liked;
                return { ...c, liked, likes: Math.max(0, c.likes + (liked ? 1 : -1)) };
              }),
            };
          }),
        );
      },
    }),
    [posts, pendingSound],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed(): FeedStore {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within a FeedStoreProvider");
  return ctx;
}
