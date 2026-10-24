import { useEffect, type ReactNode } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-[fadeIn_0.2s_ease-out] bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 flex max-h-[82%] flex-col animate-[slideUp_0.25s_ease-out] overflow-hidden rounded-t-2xl bg-zinc-900 text-white">
        <div className="flex shrink-0 items-center justify-center pt-2">
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold">{title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
