import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Film,
  Image as ImageIcon,
  Music2,
  Search,
  Send,
  X,
  Check,
  Play,
  Pause,
} from "lucide-react";
import { AppShell } from "@/components/tiktok/app-shell";
import { BottomSheet } from "@/components/tiktok/bottom-sheet";
import { useFeed } from "@/lib/feed-store";
import { sounds, defaultSound, getSound, type Sound } from "@/lib/sounds";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Create • TikTok Clone" }] }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const { addPost, pendingSound, setPendingSound } = useFeed();

  const [kind, setKind] = useState<"video" | "photo">("video");
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedSound, setSelectedSound] = useState<Sound>(() => pendingSound ?? defaultSound);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Audio preview state for the sound picker
  const previewAudioRef = useRef<HTMLAudioElement>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  // A sound chosen from the feed's "Use this sound" preselects here.
  useEffect(() => {
    if (pendingSound) {
      setSelectedSound(pendingSound);
      setPendingSound(null);
    }
    return () => {
      // Stop any preview when leaving this page
      previewAudioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load and play the previewed sound
  useEffect(() => {
    const el = previewAudioRef.current;
    if (!el) return;
    if (!previewingId) {
      el.pause();
      return;
    }
    const s = getSound(previewingId);
    el.src = s.audioUrl;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [previewingId]);

  // Stop preview when picker closes
  useEffect(() => {
    if (!pickerOpen) {
      previewAudioRef.current?.pause();
      setPreviewingId(null);
    }
  }, [pickerOpen]);

  const filteredSounds = sounds.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()),
  );

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (mediaUrl.startsWith("blob:")) URL.revokeObjectURL(mediaUrl);
    if (kind === "video") {
      setMediaUrl(URL.createObjectURL(f));
    } else {
      const reader = new FileReader();
      reader.onload = () => setMediaUrl(reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  function switchKind(next: "video" | "photo") {
    if (next === kind) return;
    if (mediaUrl.startsWith("blob:")) URL.revokeObjectURL(mediaUrl);
    setKind(next);
    setFile(null);
    setMediaUrl("");
  }

  function selectSound(s: Sound) {
    setSelectedSound(s);
    setPreviewingId(null);
    setPickerOpen(false);
  }

  function publish() {
    if (!mediaUrl) return;
    previewAudioRef.current?.pause();
    addPost({ mediaType: kind, mediaUrl, caption, soundId: selectedSound.id });
    void navigate({ to: "/" });
  }

  return (
    <AppShell>
      {/* Hidden audio element for sound previews */}
      <audio ref={previewAudioRef} loop className="hidden" />

      <div className="px-4 pt-6">
        {/* ── Reel / Photo toggle ──────────────────────────────────────── */}
        <div className="mb-4 inline-flex rounded-full bg-white/10 p-1 text-sm">
          <button
            onClick={() => switchKind("video")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium ${
              kind === "video" ? "bg-white text-black" : "text-white/70"
            }`}
          >
            <Film className="h-4 w-4" /> Reel
          </button>
          <button
            onClick={() => switchKind("photo")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium ${
              kind === "photo" ? "bg-white text-black" : "text-white/70"
            }`}
          >
            <ImageIcon className="h-4 w-4" /> Photo
          </button>
        </div>

        {/* ── Media dropzone / preview ─────────────────────────────────── */}
        {!mediaUrl ? (
          <label className="flex aspect-[9/16] max-h-[56dvh] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              {kind === "video" ? <Film className="h-7 w-7" /> : <ImageIcon className="h-7 w-7" />}
            </div>
            <p className="px-8 text-sm text-white/70">
              {kind === "video"
                ? "Drag a video here, or tap to browse"
                : "Drag a photo here, or tap to browse"}
            </p>
            <input
              type="file"
              accept={kind === "video" ? "video/*" : "image/*"}
              className="hidden"
              onChange={pickFile}
            />
          </label>
        ) : (
          <div className="relative">
            {kind === "video" ? (
              <video
                src={mediaUrl}
                controls
                loop
                playsInline
                className="aspect-[9/16] w-full rounded-2xl bg-black object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt="preview"
                className="aspect-[9/16] w-full rounded-2xl bg-black object-cover"
              />
            )}
            <button
              onClick={() => {
                if (mediaUrl.startsWith("blob:")) URL.revokeObjectURL(mediaUrl);
                setFile(null);
                setMediaUrl("");
              }}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
              aria-label="Remove media"
            >
              <X className="h-4 w-4" />
            </button>
            {file && <p className="mt-2 truncate text-sm text-white/70">{file.name}</p>}
          </div>
        )}

        {/* ── Caption ──────────────────────────────────────────────────── */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={150}
          placeholder="Write a caption... (use #hashtags)"
          className="mt-4 h-24 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-rose-500"
        />
        <p className="text-right text-xs text-white/40">{caption.length}/150</p>

        {/* ── Selected sound row ───────────────────────────────────────── */}
        <button
          onClick={() => setPickerOpen(true)}
          className="mt-2 flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left ring-1 ring-white/10"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${selectedSound.cover}`}
          >
            <Music2 className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/50">Sound</p>
            <p className="truncate text-sm font-medium">
              {selectedSound.title} — {selectedSound.artist}
            </p>
          </div>
          <span className="text-xs text-rose-400">Change</span>
        </button>

        {/* ── Post / Cancel ────────────────────────────────────────────── */}
        <div className="mt-5 flex gap-3 pb-4">
          <button
            onClick={publish}
            disabled={!mediaUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500 py-3 font-semibold text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post
          </button>
          <button
            onClick={() => {
              previewAudioRef.current?.pause();
              void navigate({ to: "/" });
            }}
            className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/80"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ── Sound picker sheet ───────────────────────────────────────────── */}
      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Add sound">
        <div className="px-4 pt-1">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-white/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sounds"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        <ul className="px-2 py-2">
          {filteredSounds.map((s) => {
            const isSelected = s.id === selectedSound.id;
            const isPreviewing = previewingId === s.id;
            return (
              <li key={s.id}>
                <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5">
                  {/* Cover art — tap to preview */}
                  <button
                    type="button"
                    aria-label={isPreviewing ? "Stop preview" : "Preview sound"}
                    onClick={() => setPreviewingId((cur) => (cur === s.id ? null : s.id))}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.cover} transition-opacity active:opacity-70`}
                  >
                    {isPreviewing ? (
                      <Pause className="h-5 w-5 text-white" fill="currentColor" />
                    ) : (
                      <Play className="h-5 w-5 text-white" fill="currentColor" />
                    )}
                  </button>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="truncate text-xs text-white/50">
                      {s.artist} · {s.uses}
                    </p>
                  </div>

                  {/* Select button */}
                  {isSelected ? (
                    <Check className="h-5 w-5 shrink-0 text-rose-500" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => selectSound(s)}
                      className="shrink-0 rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:border-rose-500"
                    >
                      Add
                    </button>
                  )}
                </div>
              </li>
            );
          })}
          {filteredSounds.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-white/40">No sounds found.</p>
          )}
        </ul>
      </BottomSheet>
    </AppShell>
  );
}
