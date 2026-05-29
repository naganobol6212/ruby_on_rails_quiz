/**
 * Linux & CLI 学習ロードマップ: ファイル操作・テキスト処理から運用・シェル自動化まで。
 * 参考書 (linux-intro) の章とクイズ (linux-cli) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const linuxRoadmap: RoadmapPhase[] = [
  {
    id: "linux-foundations",
    title: "Phase 1 · ファイルとテキスト",
    description: "ファイルシステムの移動と、grep / sed / awk によるテキスト処理。",
    color: "emerald",
    steps: [
      {
        id: "linux-01-fs",
        number: 1,
        title: "ファイルシステムと移動",
        emoji: "🐧",
        goal: "cd / ls / パス、絶対 / 相対パス、cp / mv / rm の基本を体に入れる。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/filesystem-and-navigation",
            label: "📖 Linux 入門: ファイルシステムと移動",
          },
          {
            kind: "quiz-category",
            href: "/quiz/linux-cli",
            label: "🧩 Linux クイズ (10 問)",
            hint: "cli-001〜010",
            requiredQuestionIds: idRange("cli", 1, 10),
          },
        ],
      },
      {
        id: "linux-02-text",
        number: 2,
        title: "テキスト処理",
        emoji: "📄",
        goal: "grep / sed / awk / cut / sort / uniq でログやデータを加工できる。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/text-processing",
            label: "📖 Linux 入門: テキスト処理",
          },
          {
            kind: "quiz-category",
            href: "/quiz/linux-cli",
            label: "🧩 Linux クイズ (10 問)",
            hint: "cli-011〜020",
            requiredQuestionIds: idRange("cli", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "linux-pipes",
    title: "Phase 2 · 検索とパイプ",
    description: "find / xargs による一括処理と、標準入出力・パイプ・リダイレクト。",
    color: "sky",
    steps: [
      {
        id: "linux-03-find",
        number: 3,
        title: "find と xargs",
        emoji: "🔎",
        goal: "find の条件指定、xargs による一括実行、安全な削除の作法を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/find-and-xargs",
            label: "📖 Linux 入門: find と xargs",
          },
        ],
      },
      {
        id: "linux-04-io",
        number: 4,
        title: "I/O とパイプ",
        emoji: "🚰",
        goal: "標準入出力 / 標準エラー、リダイレクト、パイプの組み合わせを理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/io-and-pipes",
            label: "📖 Linux 入門: I/O とパイプ",
          },
        ],
      },
    ],
  },
  {
    id: "linux-ops",
    title: "Phase 3 · 運用",
    description: "プロセスと権限、SSH、そしてシェルスクリプトによる自動化。",
    color: "violet",
    steps: [
      {
        id: "linux-05-proc",
        number: 5,
        title: "プロセスと権限",
        emoji: "⚙️",
        goal: "ps / kill / ジョブ制御、パーミッション (chmod / chown)、所有権を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/processes-and-permissions",
            label: "📖 Linux 入門: プロセスと権限",
          },
        ],
      },
      {
        id: "linux-06-network",
        number: 6,
        title: "ネットワークと SSH",
        emoji: "🔐",
        goal: "ssh / scp、鍵認証、ポートとよく使う疎通確認コマンドを理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/networking-and-ssh",
            label: "📖 Linux 入門: ネットワークと SSH",
          },
        ],
      },
      {
        id: "linux-07-automation",
        number: 7,
        title: "シェル自動化と運用",
        emoji: "🤖",
        goal: "シェルスクリプトの基本、cron、安全なスクリプトの書き方を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/linux-intro/shell-automation-and-ops",
            label: "📖 Linux 入門: シェル自動化と運用",
          },
        ],
      },
    ],
  },
];
