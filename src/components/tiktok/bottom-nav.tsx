import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem =
  | {
      to: string;
      label: string;
      icon: ComponentType<LucideProps>;
      kind: "regular";
      exact?: boolean;
    }
  | { to: string; label: string; icon: ComponentType<LucideProps>; kind: "accent" };

const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home, kind: "regular", exact: true },
  { to: "/discover", label: "Discover", icon: Search, kind: "regular" },
  { to: "/upload", label: "Create", icon: Plus, kind: "accent" },
  { to: "/inbox", label: "Inbox", icon: MessageCircle, kind: "regular" },
  { to: "/profile", label: "Profile", icon: User, kind: "regular" },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-[460px] items-center justify-around border-t border-white/10 bg-black/80 px-2 backdrop-blur-md">
        {items.map((item) => {
          const { to, label, icon: Icon } = item;

          if (item.kind === "accent") {
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className="relative -mt-6 flex h-12 w-12 items-center justify-center"
              >
                <span className="absolute inset-x-0 -bottom-1 h-3 rounded-sm bg-cyan-400" />
                <span className="-translate-x-1.5 absolute inset-x-0 bottom-0 h-3 rounded-sm bg-rose-500" />
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
              </Link>
            );
          }

          const active = item.exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                active ? "text-white" : "text-white/60"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={active ? 2.6 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
