import type { RoadmapPhase } from "../roadmap";

/**
 * 全トラック共通の「学びを言語化する」フェーズを生成する。
 *
 * - ファインマン・テクニック (相手を変えて説明する) のお題で自己説明を促す
 * - 週次振り返り (KPT / PREP) で定着させる
 *
 * @param phaseNumber そのトラックでの Phase 番号 (例: 他トラックは 4、Ruby は 8)
 * @param startStep   連番ステップの開始番号 (既存の最後のステップ番号 + 1)
 */
export function makeReflectionPhase(
  phaseNumber: number,
  startStep: number,
): RoadmapPhase {
  return {
    id: "reflection",
    title: `Phase ${phaseNumber} · 学びを言語化する`,
    description:
      "解いた内容を自分の言葉で説明できるか確認する。相手を変えて説明すると『分かったつもり』の穴が露わになり、定着率が上がる (ファインマン・テクニック)。",
    color: "emerald",
    steps: [
      {
        id: "reflection-feynman",
        number: startStep,
        title: "ファインマン・テクニックで自己説明",
        emoji: "🗣️",
        goal:
          "学んだトピックを 1 つ選び、4 人の相手に説明し直す: ① エンジニア仲間 (正確に・用語 OK) ② 初学者 (専門用語を噛み砕く) ③ 中学生 (身近な例えで) ④ おばあちゃん (前提知識ゼロ)。説明に詰まった所こそ『まだ理解できていない所』。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/feynman",
            label: "🗣️ ファインマン演習をはじめる",
            hint: "4 人の相手に説明し直す (エンジニア / 初学者 / 中学生 / おばあちゃん)",
          },
        ],
      },
      {
        id: "reflection-journal",
        number: startStep + 1,
        title: "週次振り返り (KPT / PREP)",
        emoji: "📝",
        goal:
          "学習ジャーナルで KPT (Keep / Problem / Try) または PREP (Point / Reason / Example / Point) で 1 週間を振り返り、次の一手を言語化する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/journal",
            label: "📝 学習ジャーナル",
            hint: "KPT / STAR / PREP / 5W1H など",
          },
        ],
      },
    ],
  };
}
