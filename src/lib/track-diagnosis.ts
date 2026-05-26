/**
 * トラック診断: 3 つの質問でユーザーに合うトラックを推奨する。
 *
 * 推奨対象は実際にロードマップが用意されているトラック (ruby / javascript / typescript) のみ。
 * それ以外のトラックは「あとで」マークで案内する。
 */
import type { TrackId } from "./types";

const STORAGE_KEY = "rrq_track_diagnosis";

export type DiagnosisQuestionId = "experience" | "interest" | "goal";

export type DiagnosisQuestion = {
  id: DiagnosisQuestionId;
  prompt: string;
  options: { value: string; label: string; emoji: string }[];
};

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: "experience",
    prompt: "プログラミング経験を教えてください",
    options: [
      { value: "none", label: "ほぼ初めて", emoji: "🌱" },
      { value: "js", label: "JavaScript を少し触ったことがある", emoji: "🟨" },
      { value: "ruby", label: "Ruby を触ったことがある", emoji: "💎" },
      { value: "other", label: "他の言語の経験がある", emoji: "🛠️" },
    ],
  },
  {
    id: "interest",
    prompt: "いま一番興味があるのは?",
    options: [
      { value: "web-backend", label: "Web のバックエンド (DB / API)", emoji: "🛤️" },
      { value: "web-frontend", label: "Web のフロントエンド (UI / SPA)", emoji: "🖼️" },
      { value: "typed", label: "型のある言語で堅く書きたい", emoji: "🔷" },
      { value: "undecided", label: "まだ決めかねている", emoji: "🤔" },
    ],
  },
  {
    id: "goal",
    prompt: "どんなふうに進めたいですか?",
    options: [
      { value: "fundamentals", label: "基礎から順番に固めたい", emoji: "📚" },
      { value: "hands-on", label: "手を動かしながら学びたい", emoji: "🛠️" },
      { value: "upgrade", label: "既存の知識を一段上に", emoji: "🚀" },
    ],
  },
];

export type DiagnosisAnswers = Record<DiagnosisQuestionId, string>;

export type DiagnosisResult = {
  /** 推奨トラックの ID (ロードマップが用意されているもの) */
  recommendedTrackId: Extract<TrackId, "ruby" | "javascript" | "typescript">;
  /** 推奨理由 1 行 */
  reason: string;
  /** 同時に検討すると良い 「準備中」 トラック (あれば) */
  alsoConsider?: TrackId;
};

export function diagnose(answers: DiagnosisAnswers): DiagnosisResult {
  const { experience, interest, goal } = answers;

  // TypeScript 推奨: 「型のある言語で堅く」 か、 既に JS 経験ありで「一段上に」
  if (interest === "typed" || (experience === "js" && goal === "upgrade")) {
    return {
      recommendedTrackId: "typescript",
      reason: "型の世界をしっかり押さえると、 中規模以上のコードベースで足元が安定します。",
    };
  }

  // JavaScript 推奨: Web フロント志向、 もしくは経験 js で基礎を固めたい
  if (
    interest === "web-frontend" ||
    (experience === "js" && goal === "fundamentals")
  ) {
    return {
      recommendedTrackId: "javascript",
      reason: "モダン JavaScript の基礎・関数・非同期を固めれば、 React / Next.js への橋渡しになります。",
      alsoConsider: "react",
    };
  }

  // Ruby 推奨: Web バック志向、 初心者、 Ruby 経験者
  if (
    interest === "web-backend" ||
    experience === "none" ||
    experience === "ruby"
  ) {
    return {
      recommendedTrackId: "ruby",
      reason: "Ruby on Rails は規約に乗ることで素早く Web アプリを形にできます。 ガイドと CRUD 課題で実装まで通せます。",
    };
  }

  // フォールバック: 経験 other / undecided → JavaScript (汎用性が高い)
  return {
    recommendedTrackId: "javascript",
    reason: "迷ったら JavaScript。 フロント・バックエンド双方の足場になり、 つぶしが効きます。",
  };
}

// ---------------------------------------------------------------------------
// LocalStorage I/O
// ---------------------------------------------------------------------------
type StoredDiagnosis = {
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  /** 受験日時 (ms) */
  answeredAt: number;
};

export function loadDiagnosis(): StoredDiagnosis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDiagnosis;
  } catch {
    return null;
  }
}

export function saveDiagnosis(
  answers: DiagnosisAnswers,
  result: DiagnosisResult,
): StoredDiagnosis {
  const stored: StoredDiagnosis = {
    answers,
    result,
    answeredAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    window.dispatchEvent(new Event("rrq:diagnosis-updated"));
  }
  return stored;
}

export function clearDiagnosis() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("rrq:diagnosis-updated"));
}
