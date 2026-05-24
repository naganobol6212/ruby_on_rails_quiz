"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  icon: string;
};

const items: Item[] = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/roadmap", label: "学習", icon: "🗺️" },
  { href: "/guide", label: "参考書", icon: "📚" },
  { href: "/crud", label: "課題", icon: "🛠️" },
  { href: "/journal", label: "ノート", icon: "📝" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-zinc-950/90 sm:hidden print:hidden"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-zinc-500 hover:text-rose-500 active:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
                }`}
              >
                <span
                  className={`text-lg leading-none transition-transform ${
                    active ? "scale-110" : ""
                  }`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-b bg-gradient-to-r from-rose-500 to-fuchsia-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
