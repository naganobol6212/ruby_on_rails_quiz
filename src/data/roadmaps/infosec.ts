/**
 * セキュリティ学習ロードマップ: OWASP の主要脅威から認証認可・守りの運用まで。
 * 参考書 (infosec-intro) の章とクイズ (security) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const infosecRoadmap: RoadmapPhase[] = [
  {
    id: "sec-threats",
    title: "Phase 1 · Web の主要脅威",
    description: "OWASP の地図を持ち、インジェクションと XSS を理解する。",
    color: "rose",
    steps: [
      {
        id: "sec-01-owasp",
        number: 1,
        title: "OWASP 概観",
        emoji: "🛡️",
        goal: "OWASP Top 10 の全体像と、攻撃 / 防御を考える枠組みを掴む。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/owasp-overview",
            label: "📖 セキュリティ入門: OWASP 概観",
          },
          {
            kind: "quiz-category",
            href: "/quiz/security",
            label: "🧩 セキュリティクイズ (10 問)",
            hint: "sec-001〜010",
            requiredQuestionIds: idRange("sec", 1, 10),
          },
        ],
      },
      {
        id: "sec-02-injection-xss",
        number: 2,
        title: "インジェクションと XSS",
        emoji: "💉",
        goal: "SQLi などのインジェクション、XSS の種類と CSP による緩和を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/injection",
            label: "📖 セキュリティ入門: インジェクション",
          },
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/xss-and-csp",
            label: "📖 セキュリティ入門: XSS と CSP",
          },
          {
            kind: "quiz-category",
            href: "/quiz/security",
            label: "🧩 セキュリティクイズ (10 問)",
            hint: "sec-011〜020",
            requiredQuestionIds: idRange("sec", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "sec-authn",
    title: "Phase 2 · セッションと認証認可",
    description: "CSRF・セッション・Cookie と、認証 (Authn) / 認可 (Authz) の設計。",
    color: "amber",
    steps: [
      {
        id: "sec-03-csrf",
        number: 3,
        title: "CSRF・セッション・Cookie",
        emoji: "🍪",
        goal: "CSRF の原理とトークン対策、セッション管理、Cookie 属性を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/csrf-session-cookie",
            label: "📖 セキュリティ入門: CSRF・セッション・Cookie",
          },
        ],
      },
      {
        id: "sec-04-authn-authz",
        number: 4,
        title: "認証と認可",
        emoji: "🔑",
        goal: "パスワード保管、トークン / セッション認証、認可モデルの基本を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/authn-and-authz",
            label: "📖 セキュリティ入門: 認証と認可",
          },
        ],
      },
    ],
  },
  {
    id: "sec-ops",
    title: "Phase 3 · 守りの運用",
    description: "秘密情報と通信の保護、レート制限・アップロード・依存関係のリスク。",
    color: "violet",
    steps: [
      {
        id: "sec-05-secrets",
        number: 5,
        title: "秘密情報と通信",
        emoji: "🔒",
        goal: "秘密情報の管理、TLS / 暗号化、ハッシュとソルトの基本を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/secrets-and-transport",
            label: "📖 セキュリティ入門: 秘密情報と通信",
          },
        ],
      },
      {
        id: "sec-06-supply",
        number: 6,
        title: "レート制限・アップロード・依存関係",
        emoji: "📦",
        goal: "レート制限、安全なファイルアップロード、依存ライブラリのリスク管理を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/infosec-intro/rate-limit-upload-deps",
            label: "📖 セキュリティ入門: レート制限・アップロード・依存",
          },
        ],
      },
    ],
  },
];
