"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

type NavLink = { href: string; label: string };

const links: NavLink[] = [
  { href: "/", label: "ホーム" },
  { href: "/#categories", label: "カテゴリ" },
  { href: "/journal", label: "ジャーナル" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur-md dark:border-white/5 dark:bg-zinc-950/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="text-lg">💎</span>
          <span className="bg-gradient-to-br from-rose-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent dark:from-rose-300 dark:via-fuchsia-300 dark:to-violet-300">
            RubyDojo
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-rose-300"
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* モバイルナビ (ハンバーガー) */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニュー"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:border-rose-400 hover:text-rose-500 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
          >
            <span className="text-base">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-zinc-200/70 bg-white/95 backdrop-blur dark:border-white/5 dark:bg-zinc-950/95 sm:hidden"
          >
            <nav className="mx-auto flex max-w-5xl flex-col px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-rose-300"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
