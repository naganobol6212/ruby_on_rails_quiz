export type Difficulty = "beginner" | "intermediate" | "advanced";

// ===========================================================================
// Track (上位: 言語/フレームワーク軸)
// ===========================================================================
export type TrackId =
  | "ruby"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "nuxt"
  | "python"
  | "sql";

export type Track = {
  id: TrackId;
  name: string;
  short: string;
  emoji: string;
  description: string;
  accentClass: string;
  ringClass: string;
  status: "available" | "coming-soon";
};

// ===========================================================================
// Category
// ===========================================================================
export type CategoryId =
  // Ruby/Rails (既存)
  | "ruby-basics"
  | "collections"
  | "ruby-oop"
  | "ruby-advanced"
  | "code-reading"
  | "rails-convention"
  | "routing-controller"
  | "active-record"
  | "rspec"
  | "logs"
  | "git-github"
  | "security"
  | "debugging"
  | "linux-cli"
  | "practical"
  // JavaScript / TypeScript
  | "js-basics"
  | "js-functions"
  | "js-async"
  | "ts-basics"
  // React / Next.js / Nuxt
  | "react-fundamentals"
  | "nextjs-basics"
  | "nuxt-basics"
  // Python
  | "python-basics"
  // SQL
  | "sql-basics"
  | "sql-joins"
  | "sql-advanced";

export type Category = {
  id: CategoryId;
  trackId: TrackId;
  name: string;
  description: string;
  emoji: string;
  accentClass: string;
  ringClass: string;
};

// ===========================================================================
// Question
// ===========================================================================
export type Explanation = {
  summary: string;
  reason: string;
  codeExample?: string;
  commonMistakes?: string[];
  references?: { label: string; url: string }[];
};

type BaseQuestion = {
  id: string;
  categoryId: CategoryId;
  difficulty: Difficulty;
  question: string;
  code?: string;
  hints: string[];
  explanation: Explanation;
};

export type ChoiceQuestion = BaseQuestion & {
  type: "choice";
  choices: string[];
  answerIndex: number;
};

export type TextQuestion = BaseQuestion & {
  type: "text";
  answers: string[];
};

export type PracticalQuestion = BaseQuestion & {
  type: "practical";
  requirements: string[];
  sampleSolution: string;
  reviewPoints: string[];
};

export type Question = ChoiceQuestion | TextQuestion | PracticalQuestion;

// ===========================================================================
// Progress
// ===========================================================================
export type ReviewMark = "mastered" | "review" | null;

export type QuestionAttempt = {
  questionId: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  lastAnsweredAt: string;
  mark: ReviewMark;
  /** 構造化言語訓練: ユーザーが自分の言葉で書いた説明 */
  selfExplanation?: string;
  selfExplanationUpdatedAt?: string;
};

export type Progress = {
  attempts: Record<string, QuestionAttempt>;
  totalSolved: number;
  totalAttempts: number;
  bestStreak: number;
};
