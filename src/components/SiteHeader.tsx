"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { ChangelogBadge } from "./ChangelogBadge";
import { AuthButton } from "./AuthButton";
import { useAuth } from "@/lib/auth/context";

type NavLink = { href: string; label: string; icon: string };

const links: NavLink[] = [
  // ホームはロゴクリックで戻れるためナビには含めない
  { href: "/roadmap", label: "ロードマップ", icon: "🗺️" },
  { href: "/guide", label: "参考書", icon: "📚" },
  { href: "/crud", label: "CRUD 課題", icon: "🛠️" },
  { href: "/journal", label: "ジャーナル", icon: "📝" },
  { href: "/flashcards", label: "カード", icon: "🃏" },
  { href: "/review", label: "復習", icon: "🔁" },
  { href: "/stats", label: "統計", icon: "📈" },
  { href: "/about", label: "使い方", icon: "📖" },
];

// ログイン同期 (Supabase) が有効なときだけ出すナビ
const authLinks: NavLink[] = [{ href: "/groups", label: "仲間", icon: "👥" }];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false; // ハッシュ系はアクティブ判定対象外
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { enabled } = useAuth();
  const navLinks = enabled ? [...links, ...authLinks] : links;

  // スクロールでヘッダーの装飾を強める
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 8);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ルート遷移でメニュー閉じる
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur-xl shadow-sm shadow-black/[0.02] dark:border-white/10 dark:bg-zinc-950/85 dark:shadow-black/40"
          : "border-b border-transparent bg-zinc-50/50 backdrop-blur-md dark:bg-zinc-950/40"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* ロゴ */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 8 L4 12 L8 16" />
              <path d="M16 8 L20 12 L16 16" />
              <line x1="14" y1="6" x2="10" y2="18" />
            </svg>
          </span>
          <span className="text-base text-zinc-900 dark:text-zinc-100">
            Code<span className="text-rose-600 dark:text-rose-400">Dojo</span>
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-rose-500/15 to-fuchsia-500/15 text-rose-700 dark:from-rose-500/20 dark:to-fuchsia-500/20 dark:text-rose-200"
                    : "text-zinc-600 hover:bg-white/80 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-rose-300"
                }`}
              >
                <span>{l.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-white/10" />
          <ChangelogBadge />
          <ThemeToggle />
          <AuthButton />
        </nav>

        {/* モバイルナビ */}
        <div className="flex items-center gap-2 sm:hidden">
          <ChangelogBadge />
          <ThemeToggle />
          <AuthButton />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニュー"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:border-rose-400 hover:text-rose-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
          >
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-base"
            >
              {open ? "✕" : "☰"}
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-200/70 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 sm:hidden"
          >
            <nav className="mx-auto flex max-w-5xl flex-col px-2 py-2">
              {navLinks.map((l, i) => {
                const active = isActive(pathname, l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-gradient-to-r from-rose-500/15 to-fuchsia-500/15 text-rose-700 dark:from-rose-500/20 dark:to-fuchsia-500/20 dark:text-rose-200"
                          : "text-zinc-700 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-rose-300"
                      }`}
                    >
                      <span>{l.icon}</span>
                      <span>{l.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
