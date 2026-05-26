import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { RoadmapView } from "../RoadmapView";
import { getRoadmap } from "@/data/roadmaps";
import { findTrack, tracks } from "@/data/tracks";

type Params = { track: string };

// ロードマップ未整備でもトラックとしては存在する場合 (準備中) も含めて全部静的生成。
// 該当トラックがそもそも存在しない場合は notFound に振り分ける。
export function generateStaticParams(): Params[] {
  return tracks.map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { track: trackId } = await params;
  const track = findTrack(trackId);
  if (!track) return { title: "ロードマップ — CodeDojo" };
  const roadmap = getRoadmap(track.id);
  const baseTitle = `${track.name} ロードマップ — CodeDojo`;
  return {
    title: baseTitle,
    description: roadmap
      ? roadmap.summary
      : `${track.name} のロードマップは準備中。 クイズだけ先に進められます。`,
  };
}

export default async function TrackRoadmapPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { track: trackId } = await params;
  const track = findTrack(trackId);
  if (!track) notFound();

  const roadmap = getRoadmap(track.id);

  if (!roadmap) {
    // 準備中: クイズへの導線だけ提供
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/"
            className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
          >
            ホーム
          </Link>
          <span>›</span>
          <Link
            href="/roadmap"
            className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
          >
            ロードマップ
          </Link>
          <span>›</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            {track.name}
          </span>
        </div>
        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Learning Roadmap · Coming Soon
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {track.emoji} {track.name} ロードマップ (準備中)
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {track.description}
          </p>
        </header>
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-6 text-sm leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300">
          <p>
            このトラックのロードマップは整備中です。 クイズは既に解けるので、 先に問題で手を動かしておくと、
            ロードマップ公開時にスムーズに進められます。
          </p>
          <Link
            href={`/?track=${track.id}#categories`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600 dark:bg-rose-400 dark:text-zinc-900 dark:hover:bg-rose-300"
          >
            {track.emoji} {track.short} のクイズ一覧を見る →
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/roadmap"
            className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
          >
            ← すべてのトラック一覧へ戻る
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <RoadmapView
        roadmap={roadmap.phases}
        trackName={track.name}
        headline={roadmap.headline}
        showTrackBackLink
      />
    </div>
  );
}
