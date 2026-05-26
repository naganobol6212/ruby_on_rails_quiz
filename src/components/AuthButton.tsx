"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/auth/context";

/**
 * ヘッダー右側に置くサインインボタン / アバタードロップダウン。
 *
 * - Supabase 未設定なら何も描画しない (環境変数なしのデプロイでは UI に出ない)
 * - 未ログイン: 「ログイン」 ボタン
 * - ログイン中: アバター + ドロップダウン (ユーザー名 / 同期中表示 / ログアウト)
 */
export function AuthButton() {
  const { enabled, ready, user, syncing, signInWithGitHub, signOut } =
    useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!enabled || !ready) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => {
          void signInWithGitHub();
        }}
        title="GitHub でログインしてデバイス間で進捗を同期"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="currentColor"
        >
          <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.08.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8a8 8 0 0 0-8-8Z" />
        </svg>
        <span>ログイン</span>
      </button>
    );
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ??
    null;
  const handle =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    user.email ??
    "user";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={`ログイン中: ${handle}`}
        className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-300 bg-white transition hover:border-rose-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-rose-400/60"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={handle}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            {handle[0]?.toUpperCase() ?? "U"}
          </span>
        )}
        {syncing && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 dark:border-zinc-900">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="border-b border-zinc-200 px-3 py-2 dark:border-white/10">
              <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {handle}
              </p>
              {user.email && (
                <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              )}
            </div>
            <div className="px-3 py-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              {syncing
                ? "🔄 同期中..."
                : "☁️ デバイス間で進捗が同期されています"}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-rose-50 hover:text-rose-700 dark:text-zinc-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
            >
              ログアウト
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
