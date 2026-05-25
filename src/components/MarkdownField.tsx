"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { JournalMarkdown } from "./JournalMarkdown";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  /** Ctrl+S 時に保存をトリガしたい場合 */
  onSubmit?: () => void;
};

type ToolKind =
  | "bold"
  | "italic"
  | "code"
  | "codeblock"
  | "h2"
  | "ul"
  | "ol"
  | "quote"
  | "link";

/**
 * Markdown ツールバー付き textarea。
 * - 各ボタンで選択範囲を wrap or 行頭にプレフィックス挿入
 * - ショートカット: Ctrl/⌘+B / I / K (link) / Shift+Enter で送信は無効、Ctrl+S で保存
 * - 編集 / プレビュー トグル
 * - 文字数カウンタ
 */
export function MarkdownField({
  value,
  onChange,
  placeholder,
  rows = 5,
  onSubmit,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  // selection range をラップ or 行頭プレフィックス挿入
  const applyTool = useCallback(
    (kind: ToolKind) => {
      const el = ref.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);
      const before = value.slice(0, start);
      const after = value.slice(end);

      let inserted = "";
      let cursorOffset = 0; // 挿入後のキャレット位置 (相対)
      let selectFromInserted: [number, number] | null = null;

      switch (kind) {
        case "bold": {
          if (selected) {
            inserted = `**${selected}**`;
            cursorOffset = inserted.length;
          } else {
            inserted = "**太字**";
            selectFromInserted = [2, 2 + 2]; // "太字" を選択 (2 chars in JS UTF-16 = 4)
          }
          break;
        }
        case "italic": {
          if (selected) {
            inserted = `*${selected}*`;
            cursorOffset = inserted.length;
          } else {
            inserted = "*斜体*";
            selectFromInserted = [1, 1 + 2];
          }
          break;
        }
        case "code": {
          if (selected) {
            inserted = `\`${selected}\``;
            cursorOffset = inserted.length;
          } else {
            inserted = "`code`";
            selectFromInserted = [1, 1 + 4];
          }
          break;
        }
        case "codeblock": {
          const body = selected || "ここにコード";
          inserted = `\n\`\`\`\n${body}\n\`\`\`\n`;
          if (!selected) {
            selectFromInserted = [5, 5 + 6]; // "ここにコード"
          } else {
            cursorOffset = inserted.length;
          }
          break;
        }
        case "h2": {
          const result = prefixLines(before, selected, after, "## ");
          inserted = result.inserted;
          cursorOffset = result.cursor;
          break;
        }
        case "ul": {
          const result = prefixLines(before, selected, after, "- ");
          inserted = result.inserted;
          cursorOffset = result.cursor;
          break;
        }
        case "ol": {
          const result = prefixLines(before, selected, after, "1. ");
          inserted = result.inserted;
          cursorOffset = result.cursor;
          break;
        }
        case "quote": {
          const result = prefixLines(before, selected, after, "> ");
          inserted = result.inserted;
          cursorOffset = result.cursor;
          break;
        }
        case "link": {
          const label = selected || "ラベル";
          inserted = `[${label}](https://)`;
          // URL 部分にキャレット
          const urlStart = inserted.length - 1;
          selectFromInserted = [urlStart, urlStart];
          break;
        }
      }

      // prefixLines は呼び出し側で before/after を再構築済みなので分岐
      const isPrefix = ["h2", "ul", "ol", "quote"].includes(kind);
      const newValue = isPrefix
        ? inserted // prefixLines 内で構築済み
        : `${before}${inserted}${after}`;

      onChange(newValue);

      // selection を次フレームで設定
      requestAnimationFrame(() => {
        const el2 = ref.current;
        if (!el2) return;
        if (selectFromInserted) {
          const [s, e] = selectFromInserted;
          el2.setSelectionRange(start + s, start + e);
        } else {
          const pos = isPrefix
            ? start + cursorOffset
            : start + cursorOffset;
          el2.setSelectionRange(pos, pos);
        }
        el2.focus();
      });
    },
    [value, onChange],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const meta = e.ctrlKey || e.metaKey;
    if (!meta) return;
    const k = e.key.toLowerCase();
    if (k === "b") {
      e.preventDefault();
      applyTool("bold");
    } else if (k === "i") {
      e.preventDefault();
      applyTool("italic");
    } else if (k === "k") {
      e.preventDefault();
      applyTool("link");
    } else if (k === "s" && onSubmit) {
      e.preventDefault();
      onSubmit();
    } else if (k === "e") {
      e.preventDefault();
      setPreview((p) => !p);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20 dark:border-white/10 dark:bg-white/5">
      {/* ツールバー */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 bg-zinc-50/70 px-1.5 py-1 dark:border-white/5 dark:bg-zinc-800/40">
        <ToolBtn label="見出し" symbol="H2" onClick={() => applyTool("h2")} />
        <ToolBtn
          label="太字 (⌘B)"
          symbol="B"
          bold
          onClick={() => applyTool("bold")}
        />
        <ToolBtn
          label="斜体 (⌘I)"
          symbol="I"
          italic
          onClick={() => applyTool("italic")}
        />
        <Divider />
        <ToolBtn label="箇条書き" symbol="• −" onClick={() => applyTool("ul")} />
        <ToolBtn label="番号付き" symbol="1." onClick={() => applyTool("ol")} />
        <ToolBtn label="引用" symbol="❝" onClick={() => applyTool("quote")} />
        <Divider />
        <ToolBtn
          label="インラインコード"
          symbol="</>"
          onClick={() => applyTool("code")}
        />
        <ToolBtn
          label="コードブロック"
          symbol="{ }"
          onClick={() => applyTool("codeblock")}
        />
        <ToolBtn
          label="リンク (⌘K)"
          symbol="🔗"
          onClick={() => applyTool("link")}
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
            {value.length} 字
          </span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            title={preview ? "編集に戻る (⌘E)" : "プレビュー表示 (⌘E)"}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold transition ${
              preview
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "border border-zinc-300 bg-white text-zinc-700 hover:border-rose-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-400/40"
            }`}
          >
            {preview ? "✏️ 編集" : "👁 プレビュー"}
          </button>
        </div>
      </div>

      {/* 本体 */}
      {preview ? (
        <div className="min-h-[6rem] px-3 py-2.5">
          {value.trim() ? (
            <JournalMarkdown text={value} />
          ) : (
            <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
              (まだ何も書かれていません)
            </p>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          className="block w-full resize-y bg-transparent px-3 py-2.5 font-sans text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      )}
    </div>
  );
}

// ===========================================================================
// helpers
// ===========================================================================

function ToolBtn({
  symbol,
  label,
  onClick,
  bold,
  italic,
}: {
  symbol: string;
  label: string;
  onClick: () => void;
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded px-1.5 text-xs text-zinc-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 ${
        bold ? "font-bold" : ""
      } ${italic ? "italic" : ""}`}
    >
      {symbol}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />;
}

/**
 * 選択中の各行 (selection を含む / 末尾改行考慮) の行頭に prefix を付ける。
 * 既に prefix が付いている行は除去 (toggle)。
 */
function prefixLines(
  before: string,
  selected: string,
  after: string,
  prefix: string,
): { inserted: string; cursor: number } {
  // 選択範囲を含む行全体を取り出す
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineEndRelative = after.indexOf("\n");

  const head = before.slice(0, lineStart);
  const tail = lineEndRelative === -1 ? "" : after.slice(lineEndRelative);
  const middle = (before.slice(lineStart) + selected + (lineEndRelative === -1 ? after : after.slice(0, lineEndRelative)));

  const lines = middle.split("\n");
  const allHavePrefix = lines.every((l) => l.startsWith(prefix));
  const newLines = lines.map((l) =>
    allHavePrefix ? l.slice(prefix.length) : prefix + l,
  );
  const replaced = newLines.join("\n");
  const inserted = `${head}${replaced}${tail}`;
  const cursor = head.length + replaced.length;
  return { inserted, cursor: cursor - inserted.length + inserted.length };
}
