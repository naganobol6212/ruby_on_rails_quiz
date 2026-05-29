"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  deleteGroup,
  getGroup,
  leaveGroup,
  listMembers,
  type Group,
  type GroupMember,
} from "@/lib/groups";

export function GroupDetailView({ groupId }: { groupId: string }) {
  const { enabled, ready, user } = useAuth();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!enabled || !user) {
        if (!cancelled) setLoading(false);
        return;
      }
      setLoading(true);
      const [g, m] = await Promise.all([
        getGroup(groupId),
        listMembers(groupId),
      ]);
      if (!cancelled) {
        setGroup(g);
        setMembers(m);
        setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, user, groupId]);

  const myRole = members.find((m) => m.userId === user?.id)?.role ?? null;
  const isOwner = myRole === "owner";

  const onCopy = useCallback(async () => {
    if (!group) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* クリップボード不可環境では無視 */
    }
  }, [group]);

  const onLeave = useCallback(async () => {
    if (busy || !window.confirm("このグループを退会しますか？")) return;
    setBusy(true);
    const ok = await leaveGroup(groupId);
    setBusy(false);
    if (ok) router.push("/groups");
  }, [busy, groupId, router]);

  const onDelete = useCallback(async () => {
    if (busy || !window.confirm("グループを解散します。投稿もすべて削除されます。よろしいですか？"))
      return;
    setBusy(true);
    const ok = await deleteGroup(groupId);
    setBusy(false);
    if (ok) router.push("/groups");
  }, [busy, groupId, router]);

  if (!ready || loading) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</p>
    );
  }
  if (!enabled || !user) {
    return (
      <div className="space-y-4">
        <Breadcrumb name={null} />
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          グループを表示するにはログインが必要です。
        </p>
      </div>
    );
  }
  if (!group) {
    return (
      <div className="space-y-4">
        <Breadcrumb name={null} />
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          このグループは見つからないか、参加していません。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb name={group.name} />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {group.name}
        </h1>
        {group.description && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {group.description}
          </p>
        )}
      </header>

      {/* 招待 */}
      <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          仲間を招待
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          このコードを共有すると、相手は「招待コードで参加」から加われます。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100">
            {group.inviteCode}
          </code>
          <button
            type="button"
            onClick={() => void onCopy()}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {copied ? "コピーしました" : "コピー"}
          </button>
        </div>
      </section>

      {/* メンバー */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          メンバー ({members.length})
        </h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.userId}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-zinc-900/60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800">
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {(m.displayName || "U")[0]?.toUpperCase()}
                  </span>
                )}
              </span>
              <span className="flex-1 truncate text-sm text-zinc-800 dark:text-zinc-100">
                {m.displayName || "(名前未設定)"}
                {m.userId === user.id && (
                  <span className="ml-1 text-xs text-zinc-400">(あなた)</span>
                )}
              </span>
              {m.role === "owner" && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                  オーナー
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* フィード (次の増分) */}
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
        <p className="text-2xl">📣</p>
        <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          フィード (投稿・スタンプ・コメント) は次のアップデートで追加予定
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          自由投稿と、ジャーナル / 自己説明の共有に対応します。
        </p>
      </section>

      {/* アクション */}
      <section className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-white/10">
        {isOwner ? (
          <button
            type="button"
            onClick={() => void onDelete()}
            disabled={busy}
            className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            グループを解散する
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void onLeave()}
            disabled={busy}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            グループを退会する
          </button>
        )}
      </section>
    </div>
  );
}

function Breadcrumb({ name }: { name: string | null }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <Link
        href="/"
        className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
      >
        ホーム
      </Link>
      <span>›</span>
      <Link
        href="/groups"
        className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
      >
        グループ
      </Link>
      {name && (
        <>
          <span>›</span>
          <span className="truncate font-medium text-zinc-700 dark:text-zinc-200">
            {name}
          </span>
        </>
      )}
    </div>
  );
}
