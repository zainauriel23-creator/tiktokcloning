import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Play, Pause, Music2 } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";
import { useFeed } from "@/lib/feed-store";
import { sounds, getSound } from "@/lib/sounds";

export function SoundSheet({
  soundId,
  open,
  onClose,
}: {
  soundId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { setPendingSound } = useFeed();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const sound = getSound(soundId);
  const related = sounds.filter((s) => s.id !== soundId).slice(0, 5);

  // Stop audio and reset when sheet closes
  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
  }, [open]);

  // Swap audio src and play when the playing sound changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!playingId) {
      el.pause();
      return;
    }
    const s = getSound(playingId);
    el.src = s.audioUrl;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [playingId]);

  function togglePreview(id: string) {
    setPlayingId((cur) => (cur === id ? null : id));
  }

  function useThisSound(id: string) {
    audioRef.current?.pause();
    setPlayingId(null);
    setPendingSound(getSound(id));
    onClose();
    void navigate({ to: "/upload" });
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Original sound">
      {/* Hidden audio element used for preview */}
      <audio ref={audioRef} loop className="hidden" />

      <div className="p-4">
        {/* ── Featured sound ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={playingId === sound.id ? "Pause preview" : "Play preview"}
            onClick={() => togglePreview(sound.id)}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sound.cover} transition-opacity active:opacity-80`}
          >
            {playingId === sound.id ? (
              <Pause className="h-7 w-7 text-white" fill="currentColor" />
            ) : (
              <Play className="h-7 w-7 text-white" fill="currentColor" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold">{sound.title}</p>
            <p className="truncate text-sm text-white/60">{sound.artist}</p>
            <p className="text-xs text-white/40">
              {sound.duration} · {sound.uses}
            </p>
          </div>

          <button
            type="button"
            onClick={() => useThisSound(sound.id)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Use sound
          </button>
        </div>

        {/* ── Related sounds ─────────────────────────────────────────────── */}
        <h4 className="mb-2 mt-6 text-sm font-semibold text-white/80">Sounds you might like</h4>
        <ul className="space-y-1">
          {related.map((s) => {
            const isPlaying = playingId === s.id;
            return (
              <li key={s.id}>
                <div className="flex items-center gap-3 rounded-lg px-1 py-2 hover:bg-white/5">
                  {/* Cover + preview toggle */}
                  <button
                    type="button"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={() => togglePreview(s.id)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.cover}`}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-white" fill="currentColor" />
                    ) : (
                      <Music2 className="h-4 w-4 text-white" />
                    )}
                  </button>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="truncate text-xs text-white/50">
                      {s.artist} · {s.uses}
                    </p>
                  </div>

                  {/* Use button */}
                  <button
                    type="button"
                    onClick={() => useThisSound(s.id)}
                    className="shrink-0 rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-rose-500 hover:text-rose-400"
                  >
                    Use
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </BottomSheet>
  );
}
