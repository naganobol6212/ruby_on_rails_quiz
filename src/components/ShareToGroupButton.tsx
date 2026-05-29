"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { listMyGroups, sharePost, type Group } from "@/lib/groups";

type Props = {
  /** 投稿に付けるタイトル (例: ジャーナルのタイトル) */
  title: string;
  /** 共有する本文 (スナップショット) */
  body: string;
  /** 任意の出典メタ (例: { journalId } / { questionId }) */
  source?: Record<string, unknown>;
};

/**
 * 学習コンテンツ (ジャーナル / 自己説明など) をグループに opt-in 共有するボタン。
 * - ログイン同期が無効 / 未ログインなら何も描画しない (ローカル専用利用では出ない)。
 * - 押すと参加中グループの一覧を出し、選んだグループへ内容をコピー共有する。
 */
export function ShareToGroupButton({ title, body, source }: Props) {
  const { enabled, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [sharedTo, setSharedTo] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!enabled || !user) return null;

  const canShare = body.trim().length > 0;

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && groups === null) {
      setGroups(await listMyGroups());
    }
  };

  const onShare = async (g: Group) => {
    if (busy || !canShare) return;
    setBusy(true);
    const post = await sharePost(g.id, title, body, source ?? null);
    setBusy(false);
    setOpen(false);
    if (post) {
      setSharedTo(g.name);
      setTimeout(() => setSharedTo(null), 2500);
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={!canShare}
        title={canShare ? "グループに共有" : "共有する内容がありません"}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-400/40"
      >
        <span>👥</span>
        <span>{sharedTo ? `「${sharedTo}」に共有しました` : "グループに共有"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-60 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            共有先のグループ
          </p>
          {groups === null ? (
            <p className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              読み込み中...
            </p>
          ) : groups.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              参加中のグループがありません。
            </p>
          ) : (
            groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => void onShare(g)}
                disabled={busy}
                className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              >
                {g.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
