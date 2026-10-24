import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Volume2, VolumeX, Play, Heart } from "lucide-react";
import { ActionRail } from "./action-rail";
import { CommentSheet } from "./comment-sheet";
import { SoundSheet } from "./sound-sheet";
import { useFeed } from "@/lib/feed-store";
import { getSound } from "@/lib/sounds";
import type { VideoPost } from "@/lib/feed-data";

export function VideoCard({ post }: { post: VideoPost }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { toggleLike, toggleBookmark } = useFeed();

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [burst, setBurst] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);

  const isVideo = post.mediaType === "video";
  const liked = !!post.liked;
  const bookmarked = !!post.bookmarked;
  const sound = getSound(post.soundId);

  // ─── Intersection-observer: autoplay / pause everything when card enters view ───
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const inView = entry.isIntersecting && entry.intersectionRatio >= 0.6;

          // Video element
          if (videoRef.current) {
            if (inView) {
              videoRef.current
                .play()
                .then(() => setPaused(false))
                .catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }

          // Separate audio element (background sound / photo sound)
          if (audioRef.current) {
            if (inView) {
              audioRef.current.play().catch(() => {});
            } else {
              audioRef.current.pause();
            }
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  // ─── Keep audio muted state in sync with the UI toggle ───────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    // Video audio is always muted — we play the separate sound track instead.
    if (videoRef.current) videoRef.current.muted = true;
  }, [muted]);

  function togglePlay() {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video && !audio) return;

    const isPaused = video ? video.paused : (audio?.paused ?? true);
    if (isPaused) {
      void video?.play();
      void audio?.play();
      setPaused(false);
    } else {
      video?.pause();
      audio?.pause();
      setPaused(true);
    }
  }

  function handleToggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted((m) => !m);
  }

  function handleDoubleTap() {
    if (!liked) toggleLike(post.id);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 700);
  }

  return (
    <section
      ref={wrapRef}
      className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
    >
      {/* ── Media ──────────────────────────────────────────────────────── */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={post.videoUrl}
          loop
          muted // always mute the video track; sound comes from <audio> below
          playsInline
          preload="metadata"
          onClick={togglePlay}
          onDoubleClick={handleDoubleTap}
          className="h-full w-full select-none object-cover"
        />
      ) : (
        <img
          src={post.videoUrl}
          alt={post.caption}
          onDoubleClick={handleDoubleTap}
          className="h-full w-full select-none object-cover"
        />
      )}

      {/* ── Background sound track ─────────────────────────────────────── */}
      {/* Plays for both video and photo posts. Starts muted; user unmutes with the volume button. */}
      <audio ref={audioRef} src={sound.audioUrl} loop muted preload="none" className="hidden" />

      {/* ── Gradients ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />

      {/* ── Action rail ────────────────────────────────────────────────── */}
      <ActionRail
        post={post}
        likeCount={post.likes}
        liked={liked}
        bookmarked={bookmarked}
        onLike={() => toggleLike(post.id)}
        onBookmark={() => toggleBookmark(post.id)}
        onComment={() => setCommentOpen(true)}
        onOpenSound={() => setSoundOpen(true)}
      />

      {/* ── Caption block ──────────────────────────────────────────────── */}
      <div className="absolute bottom-20 left-3 z-20 max-w-[72%] space-y-1.5 text-white drop-shadow">
        <Link to="/profile" className="inline-flex items-center gap-1.5 text-base font-bold">
          <span
            className={`inline-block h-6 w-6 rounded-full bg-gradient-to-br ${post.author.avatar}`}
          />
          @{post.author.username}
          {post.author.verified && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold">
              ✓
            </span>
          )}
        </Link>
        <p className="text-sm leading-snug">{post.caption}</p>
        <p className="text-xs">
          <span className="font-semibold text-rose-400">
            {post.hashtags.map((h) => `#${h}`).join(" ")}
          </span>
        </p>
        {/* Tapping the music label opens the sound sheet */}
        <button
          type="button"
          onClick={() => setSoundOpen(true)}
          className="flex items-center gap-1.5 text-xs hover:underline"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/15 text-white">
            ♪
          </span>
          <span className="max-w-[200px] truncate">{post.music}</span>
        </button>
      </div>

      {/* ── Volume toggle (always visible — controls the sound track) ─── */}
      <button
        type="button"
        onClick={handleToggleMute}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        className="absolute right-3 top-16 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* ── Paused overlay ─────────────────────────────────────────────── */}
      {paused && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <Play className="h-20 w-20 text-white/70 drop-shadow-lg" fill="currentColor" />
        </div>
      )}

      {/* ── Double-tap heart burst ─────────────────────────────────────── */}
      {burst && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <Heart
            className="h-32 w-32 animate-[pop_0.7s_ease-out] text-rose-500 drop-shadow-lg"
            fill="currentColor"
          />
        </div>
      )}

      {/* ── Sheets ─────────────────────────────────────────────────────── */}
      <CommentSheet post={post} open={commentOpen} onClose={() => setCommentOpen(false)} />
      <SoundSheet soundId={post.soundId} open={soundOpen} onClose={() => setSoundOpen(false)} />
    </section>
  );
}
