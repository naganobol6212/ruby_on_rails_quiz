"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addComment,
  addReaction,
  createTextPost,
  deleteComment,
  deletePost,
  listComments,
  listPosts,
  listReactions,
  removeReaction,
  type GroupMember,
  type GroupPost,
  type PostComment,
  type PostReaction,
} from "@/lib/groups";

const EMOJIS = ["👍", "🎉", "🔥", "👏", "💡", "❤️"];

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  groupId: string;
  currentUserId: string;
  isOwner: boolean;
  members: GroupMember[];
};

export function GroupFeed({ groupId, currentUserId, isOwner, members }: Props) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [composer, setComposer] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const [p, r, c] = await Promise.all([
        listPosts(groupId),
        listReactions(groupId),
        listComments(groupId),
      ]);
      if (!cancelled) {
        setPosts(p);
        setReactions(r);
        setComments(c);
        setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const avatarByUser = useMemo(() => {
    const m = new Map<string, string | null>();
    for (const mem of members) m.set(mem.userId, mem.avatarUrl);
    return m;
  }, [members]);

  const onPost = async () => {
    const body = composer.trim();
    if (!body || busy) return;
    setBusy(true);
    const post = await createTextPost(groupId, body);
    setBusy(false);
    if (post) {
      setPosts((prev) => [post, ...prev]);
      setComposer("");
    }
  };

  const onDeletePost = async (id: string) => {
    if (!window.confirm("この投稿を削除しますか？")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setReactions((prev) => prev.filter((r) => r.postId !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
    await deletePost(id);
  };

  const toggleReaction = async (postId: string, emoji: string) => {
    const mine = reactions.some(
      (r) => r.postId === postId && r.userId === currentUserId && r.emoji === emoji,
    );
    if (mine) {
      setReactions((prev) =>
        prev.filter(
          (r) =>
            !(r.postId === postId && r.userId === currentUserId && r.emoji === emoji),
        ),
      );
      await removeReaction(postId, emoji);
    } else {
      setReactions((prev) => [...prev, { postId, userId: currentUserId, emoji }]);
      await addReaction(postId, emoji);
    }
  };

  const onComment = async (postId: string) => {
    const body = (drafts[postId] ?? "").trim();
    if (!body) return;
    const c = await addComment(postId, body);
    if (c) {
      setComments((prev) => [...prev, c]);
      setDrafts((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const onDeleteComment = async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await deleteComment(id);
  };

  return (
    <section className="space-y-5">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        フィード
      </h2>

      {/* 投稿コンポーザー */}
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60">
        <textarea
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          rows={3}
          maxLength={5000}
          placeholder="今日の学びや気づきをグループに投稿..."
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => void onPost()}
            disabled={busy || !composer.trim()}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
          >
            投稿する
          </button>
        </div>
      </div>

      {/* 投稿一覧 */}
      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          まだ投稿がありません。最初の投稿をしてみましょう。
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => {
            const postReactions = reactions.filter((r) => r.postId === post.id);
            const postComments = comments
              .filter((c) => c.postId === post.id)
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            const canDelete = post.authorId === currentUserId || isOwner;
            const avatar = avatarByUser.get(post.authorId) ?? null;
            return (
              <li
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60"
              >
                {/* ヘッダー */}
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {(post.authorName || "U")[0]?.toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {post.authorName || "(名前未設定)"}
                    </p>
                    <time className="text-[11px] text-zinc-400">
                      {fmt(post.createdAt)}
                    </time>
                  </div>
                  {post.kind === "shared" && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      共有
                    </span>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => void onDeletePost(post.id)}
                      title="削除"
                      className="text-xs text-zinc-400 transition hover:text-rose-600 dark:hover:text-rose-300"
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* 本文 */}
                {post.kind === "shared" && post.title && (
                  <p className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {post.title}
                  </p>
                )}
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {post.body}
                </p>

                {/* リアクション */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {EMOJIS.map((emoji) => {
                    const count = postReactions.filter((r) => r.emoji === emoji).length;
                    const mine = postReactions.some(
                      (r) => r.emoji === emoji && r.userId === currentUserId,
                    );
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => void toggleReaction(post.id, emoji)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
                          mine
                            ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300"
                            : "border-zinc-200 bg-white text-zinc-500 hover:border-rose-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span className="tabular-nums">{count}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* コメント */}
                {postComments.length > 0 && (
                  <ul className="mt-3 space-y-2 border-t border-zinc-100 pt-3 dark:border-white/5">
                    {postComments.map((c) => (
                      <li key={c.id} className="flex items-start gap-2 text-sm">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          {c.authorName || "(名前未設定)"}
                        </span>
                        <span className="min-w-0 flex-1 whitespace-pre-wrap break-words text-zinc-600 dark:text-zinc-300">
                          {c.body}
                        </span>
                        {(c.authorId === currentUserId || isOwner) && (
                          <button
                            type="button"
                            onClick={() => void onDeleteComment(c.id)}
                            title="削除"
                            className="shrink-0 text-[11px] text-zinc-400 transition hover:text-rose-600 dark:hover:text-rose-300"
                          >
                            ✕
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* コメント入力 */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={drafts[post.id] ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void onComment(post.id);
                      }
                    }}
                    maxLength={2000}
                    placeholder="コメントを追加..."
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => void onComment(post.id)}
                    disabled={!(drafts[post.id] ?? "").trim()}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    送信
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
