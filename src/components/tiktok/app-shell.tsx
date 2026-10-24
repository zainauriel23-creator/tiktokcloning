import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

/**
 * Centers the app in a phone-width column with a dark background and floats
 * the bottom navigation over the content. Pass `feed` for the immersive,
 * full-bleed video feed (no inner scroll padding); otherwise the content
 * scrolls with room reserved for the nav.
 */
export function AppShell({ children, feed = false }: { children: ReactNode; feed?: boolean }) {
  return (
    <div className="relative mx-auto h-[100dvh] max-w-[460px] overflow-hidden bg-black text-white">
      <div className={feed ? "h-full" : "h-full overflow-y-auto pb-16"}>{children}</div>
      <BottomNav />
    </div>
  );
}
