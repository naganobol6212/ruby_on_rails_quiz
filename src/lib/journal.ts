// 学習ジャーナル: 構造化テンプレートで日々の学びを記録する

export type TemplateId =
  | "kpt"
  | "star"
  | "5w1h"
  | "yww" // やったこと/わかったこと/わからなかったこと
  | "prep" // PREP法 (Point/Reason/Example/Point)
  | "daily-report"; // 日報

export type TemplateField = {
  key: string;
  label: string;
  hint: string;
  placeholder: string;
  multiline?: boolean;
};

export type Template = {
  id: TemplateId;
  name: string;
  emoji: string;
  description: string;
  rationale: string; // この型式を使うと何が鍛えられるか
  fields: TemplateField[];
};

export const templates: Template[] = [
  {
    id: "kpt",
    name: "KPT 振り返り",
    emoji: "📋",
    description: "Keep (続ける) / Problem (課題) / Try (試す) の 3 観点で 1 日を振り返る",
    rationale:
      "事実 → 課題 → アクションの順で書くことで、感想で終わらず次の行動に繋げる訓練になります。アジャイル開発で広く使われる定番。",
    fields: [
      {
        key: "keep",
        label: "Keep — 続けたい良かったこと",
        hint: "うまく行ったやり方、習慣、ツール、姿勢など。",
        placeholder: "例: 詰まったらまず公式ドキュメントを開く習慣がついた",
        multiline: true,
      },
      {
        key: "problem",
        label: "Problem — 課題に感じたこと",
        hint: "つまずいた点、時間を浪費した原因、理解が浅い領域。",
        placeholder: "例: ActiveRecord の N+1 を毎回 includes で慌てて直している",
        multiline: true,
      },
      {
        key: "try",
        label: "Try — 次に試すこと",
        hint: "Problem への具体的な対応策。明日から実行可能なレベルに落とす。",
        placeholder: "例: PR 出す前に bullet gem のログを確認する手順をチェックリスト化する",
        multiline: true,
      },
    ],
  },
  {
    id: "star",
    name: "STAR 法",
    emoji: "🌟",
    description: "Situation / Task / Action / Result で 1 つの経験を整理する",
    rationale:
      "面接でも実務報告でも役立つ『再現性のある説明』の型。状況→課題→自分の行動→結果と数字で説明する力が付きます。",
    fields: [
      {
        key: "situation",
        label: "Situation — 状況",
        hint: "5W1H を意識して、誰が何の前提で、いつ、どこで起きたか。",
        placeholder: "例: 本番リリース直前、決済 API のレスポンス劣化が報告された",
        multiline: true,
      },
      {
        key: "task",
        label: "Task — 自分が取り組むべき課題",
        hint: "自分の役割と達成すべきゴール。",
        placeholder: "例: 30 分以内に原因仮説を立て、暫定対応の判断材料を提示する",
        multiline: true,
      },
      {
        key: "action",
        label: "Action — 自分の行動",
        hint: "具体的に何をどう実行したか。判断の根拠も含める。",
        placeholder: "例: APM の遅延クエリを確認 → 該当エンドポイントの N+1 を特定 → ステージングで再現",
        multiline: true,
      },
      {
        key: "result",
        label: "Result — 結果と学び",
        hint: "定量・定性両方で。次に活かせる教訓も書く。",
        placeholder: "例: P95 800ms→120ms。次回からは負荷試験を CI に含める",
        multiline: true,
      },
    ],
  },
  {
    id: "5w1h",
    name: "5W1H 整理",
    emoji: "🔍",
    description: "Who / When / Where / What / Why / How で事象を多角的に分解",
    rationale:
      "1 つの出来事を 6 軸で分解する練習。要素抜けに気付く癖がつき、報告書・タスク依頼の質が上がります。",
    fields: [
      { key: "what", label: "What — 何が起きた / 何を学んだ", hint: "中心となる事実 (動詞で書く)", placeholder: "Sidekiq Job がリトライループに入った" },
      { key: "when", label: "When — いつ", hint: "日時、フェーズ、発生頻度", placeholder: "本番デプロイ後 23:00 ごろ" },
      { key: "where", label: "Where — どこで", hint: "システム名、画面、コードパス", placeholder: "config/sidekiq.yml の retry 設定" },
      { key: "who", label: "Who — 誰が関与", hint: "ユーザー / 自分 / チーム / 外部", placeholder: "自分とインフラ担当 1 名" },
      { key: "why", label: "Why — なぜ起きた / なぜ学ぶ価値あり", hint: "原因 or 学習の動機", placeholder: "discard_on を入れ忘れた + ジョブ引数が壊れていた" },
      { key: "how", label: "How — どう対応 / どう適用する", hint: "対応手順 or 今後の使い道", placeholder: "ApplicationJob に discard_on の標準を追加 + PR テンプレに項目追加" },
    ],
  },
  {
    id: "yww",
    name: "YWT (やった/わかった/次やる)",
    emoji: "✍️",
    description: "やったこと / わかったこと / 次やること を簡潔に。短時間で書ける日次振り返り型",
    rationale:
      "毎日続けやすいシンプル型。継続的な学習ログとして使うと『わかった』の積み重ねが見えるので自己効力感が上がります。",
    fields: [
      { key: "done", label: "Y — 今日やったこと", hint: "事実ベース。タスク・読んだもの・書いたコード", placeholder: "Rails の Active Job 章を読んで Welcome メール送信を Job 化した", multiline: true },
      { key: "learned", label: "W — わかったこと", hint: "理解できた概念や仕組み。『なぜそうなるか』を含めると深まる", placeholder: "deliver_later は ActionMailer が ActiveJob でラップしている。perform_later との実装的な違いは…", multiline: true },
      { key: "next", label: "T — 次にやること", hint: "明日 / 次回の具体的なアクション", placeholder: "リトライ戦略 (retry_on/discard_on) と Sidekiq の DLQ について学ぶ", multiline: true },
    ],
  },
  {
    id: "prep",
    name: "PREP 法 (説明訓練)",
    emoji: "🗣️",
    description: "Point (結論) / Reason (理由) / Example (具体例) / Point (再結論)",
    rationale:
      "技術的な質問に答える時の標準型。最初と最後に結論を 2 度言うことで聞き手の理解が定着し、説明力・プレゼン力が伸びます。",
    fields: [
      { key: "topic", label: "テーマ / 質問", hint: "誰かに説明する想定のお題を 1 文で", placeholder: "Ruby の Symbol と String の使い分けはどうする？" },
      { key: "point", label: "P — 結論 (一言で)", hint: "最初に言い切る。曖昧語を避け『〜である』で締める", placeholder: "識別子としての用途は Symbol、データとしての値は String を使う", multiline: true },
      { key: "reason", label: "R — 理由", hint: "なぜそう言えるのかを 1-3 個", placeholder: "Symbol は immutable で同名なら同一オブジェクト。比較・メモリ効率が良いから", multiline: true },
      { key: "example", label: "E — 具体例", hint: "コード例 / シナリオで補強", placeholder: "Hash のキー / 状態フラグは :pending :done のように Symbol、ユーザー入力やDB保存値は String", multiline: true },
      { key: "point2", label: "P — 再結論", hint: "最初の Point を別の言い回しで補強", placeholder: "つまり『役割が固定された名前』なら Symbol、『可変なテキスト』なら String", multiline: true },
    ],
  },
  {
    id: "daily-report",
    name: "日報フォーマット",
    emoji: "📝",
    description: "上司・チームに共有する形式 (タスク進捗 / 学び / 相談 / 明日)",
    rationale:
      "報連相に必要な情報を漏れなく構造化。AI レビューと組み合わせれば『曖昧な進捗報告』が減り、信頼を得やすくなります。",
    fields: [
      { key: "summary", label: "1 行サマリー", hint: "今日を一言で。スレッドの最初に貼れるレベル", placeholder: "Welcome Mailer の Job 化 PR をレビュー依頼まで完了" },
      { key: "progress", label: "今日の進捗", hint: "タスク → 結果 (% or ✓)。番号付きでもOK", placeholder: "1. メール Job 化 ✓\n2. テスト追加 80%\n3. ドキュメント更新 未着手", multiline: true },
      { key: "learnings", label: "今日の学び", hint: "技術 / プロセスで気付いたこと", placeholder: "Active Job の retry_on は exponentially_longer がデフォではない (Rails 7.1+)", multiline: true },
      { key: "blockers", label: "詰まり / 相談したいこと", hint: "誰の判断が必要か明示すると即返事もらえる", placeholder: "Sidekiq の DLQ 運用ルールについて @チーム の合意が欲しい", multiline: true },
      { key: "tomorrow", label: "明日の予定", hint: "優先順 + 想定時間", placeholder: "1. テスト残り (1h) / 2. PR レビュー対応 (1h) / 3. 新規 API 設計 (2h)", multiline: true },
    ],
  },
];

export const findTemplate = (id: string) =>
  templates.find((t) => t.id === id);

// LocalStorage に保存される journal entry
export type JournalEntry = {
  id: string; // ulid-like
  templateId: TemplateId;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  title: string; // 自動 or 手動の見出し
  content: Record<string, string>; // field key -> 内容
};

const STORAGE_KEY = "rrq_journal_v1";

const emit = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rrq:journal-updated"));
  }
};

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as JournalEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  emit();
}

export function createEntry(
  templateId: TemplateId,
  content: Record<string, string>,
  title?: string,
): JournalEntry {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    templateId,
    createdAt: now,
    updatedAt: now,
    title: title?.trim() || defaultTitle(templateId, content),
    content,
  };
  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);
  return entry;
}

export function updateEntry(
  id: string,
  content: Record<string, string>,
  title?: string,
): JournalEntry | null {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: JournalEntry = {
    ...entries[idx],
    content,
    title: title?.trim() || entries[idx].title,
    updatedAt: new Date().toISOString(),
  };
  entries[idx] = updated;
  saveEntries(entries);
  return updated;
}

export function deleteEntry(id: string) {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
}

export function findEntry(id: string): JournalEntry | undefined {
  return loadEntries().find((e) => e.id === id);
}

function defaultTitle(
  templateId: TemplateId,
  content: Record<string, string>,
): string {
  // 主要フィールドの先頭 30 文字を仮タイトルに
  const candidates: Record<TemplateId, string[]> = {
    kpt: ["keep", "problem", "try"],
    star: ["task", "situation"],
    "5w1h": ["what", "why"],
    yww: ["learned", "done"],
    prep: ["topic", "point"],
    "daily-report": ["summary", "progress"],
  };
  const keys = candidates[templateId] ?? Object.keys(content);
  for (const k of keys) {
    const v = (content[k] ?? "").trim();
    if (v) return v.slice(0, 40);
  }
  const today = new Date().toLocaleDateString("ja-JP");
  return `${today} の振り返り`;
}

// 日報用テキストエクスポート (Slack/Notion 等にコピペ可)
export function entryToText(entry: JournalEntry): string {
  const template = findTemplate(entry.templateId);
  if (!template) return JSON.stringify(entry.content, null, 2);

  const date = new Date(entry.createdAt).toLocaleDateString("ja-JP");
  const lines: string[] = [];
  lines.push(`【${template.name}】${entry.title}`);
  lines.push(`日付: ${date}`);
  lines.push("");
  for (const field of template.fields) {
    const value = entry.content[field.key]?.trim();
    if (!value) continue;
    lines.push(`■ ${field.label}`);
    lines.push(value);
    lines.push("");
  }
  return lines.join("\n").trim();
}
