"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  createGroup,
  joinGroupByCode,
  listMyGroups,
  type Group,
} from "@/lib/groups";

export function GroupsView() {
  const { enabled, ready, user } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!enabled || !user) {
        if (!cancelled) setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const timeout = new Promise<"timeout">((resolve) =>
        setTimeout(() => resolve("timeout"), 15000),
      );
      try {
        const gs = await Promise.race([listMyGroups(), timeout]);
        if (cancelled) return;
        if (gs === "timeout") {
          setError(
            "読み込みがタイムアウトしました。通信状況を確認して、ページを再読み込みしてください。",
          );
        } else {
          setGroups(gs);
        }
      } catch (e) {
        if (!cancelled) {
          setError("グループ一覧の読み込みでエラーが発生しました。");
          console.error("[groups] list load failed", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, user]);

  const onCreate = useCallback(async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    const id = await createGroup(name.trim(), description.trim());
    setBusy(false);
    if (!id) {
      setError("グループの作成に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    router.push(`/groups/${id}`);
  }, [name, description, busy, router]);

  const onJoin = useCallback(async () => {
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    const result = await joinGroupByCode(code.trim());
    setBusy(false);
    if (!result.ok) {
      setError(
        result.error === "invalid"
          ? "招待コードが見つかりません。コードを確認してください。"
          : "参加に失敗しました。時間をおいて再度お試しください。",
      );
      return;
    }
    router.push(`/groups/${result.groupId}`);
  }, [code, busy, router]);

  // --- 認証ゲート -----------------------------------------------------------
  if (!ready) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</p>;
  }
  if (!enabled) {
    return (
      <Gate
        title="グループ機能はログイン同期が必要です"
        body="このデプロイではクラウド同期 (Supabase) が未設定のため、グループ機能は利用できません。"
      />
    );
  }
  if (!user) {
    return (
      <Gate
        title="ログインするとグループに参加できます"
        body="ヘッダー右上の「ログイン」から GitHub でログインしてください。仲間と学習の投稿にスタンプやコメントで反応し合えます。"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb />
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Groups
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          👥 学習グループ
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          仲間とグループを作って、学びの投稿にスタンプやコメントで反応し合いましょう。
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* 作成 */}
        <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            グループを作る
          </h2>
          <div className="mt-3 space-y-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="グループ名 (例: 朝活 Rails 道場)"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="ひとこと説明 (任意)"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => void onCreate()}
              disabled={busy || !name.trim()}
              className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
            >
              作成する
            </button>
          </div>
        </section>

        {/* 参加 */}
        <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            招待コードで参加
          </h2>
          <div className="mt-3 space-y-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="招待コード"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => void onJoin()}
              disabled={busy || !code.trim()}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              参加する
            </button>
          </div>
        </section>
      </div>

      {/* 一覧 */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          参加中のグループ
        </h2>
        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</p>
        ) : groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
            まだグループに参加していません。上から作成するか、招待コードで参加しましょう。
          </p>
        ) : (
          <ul className="space-y-2">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/groups/${g.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
                >
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {g.name}
                  </p>
                  {g.description && (
                    <p className="mt-0.5 truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {g.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
        <p className="text-3xl">👥</p>
        <h1 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          {body}
        </p>
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <Link
        href="/"
        className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
      >
        ホーム
      </Link>
      <span>›</span>
      <span className="font-medium text-zinc-700 dark:text-zinc-200">グループ</span>
    </div>
  );
}
