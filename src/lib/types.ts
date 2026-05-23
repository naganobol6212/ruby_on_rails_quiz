export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CategoryId =
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
  | "practical";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  emoji: string;
  accentClass: string;
  ringClass: string;
};

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

export type ReviewMark = "mastered" | "review" | null;

export type QuestionAttempt = {
  questionId: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  lastAnsweredAt: string;
  mark: ReviewMark;
};

export type Progress = {
  attempts: Record<string, QuestionAttempt>;
  totalSolved: number;
  totalAttempts: number;
  bestStreak: number;
};
