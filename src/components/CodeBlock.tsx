type Props = {
  code: string;
  label?: string;
};

const KEYWORDS = new Set([
  "def",
  "end",
  "class",
  "module",
  "if",
  "unless",
  "elsif",
  "else",
  "while",
  "until",
  "for",
  "do",
  "return",
  "yield",
  "begin",
  "rescue",
  "ensure",
  "raise",
  "nil",
  "true",
  "false",
  "self",
  "super",
  "include",
  "extend",
  "prepend",
  "attr_accessor",
  "attr_reader",
  "attr_writer",
  "require",
  "require_relative",
  "case",
  "when",
  "in",
  "then",
  "puts",
  "p",
  "print",
  "lambda",
  "proc",
  "new",
  "private",
  "protected",
  "public",
  "validates",
  "validate",
  "scope",
  "belongs_to",
  "has_many",
  "has_one",
  "has_and_belongs_to_many",
  "before_action",
  "after_action",
  "before_save",
  "before_create",
  "before_destroy",
  "before_validation",
  "rescue_from",
  "params",
  "render",
  "redirect_to",
  "resources",
  "resource",
  "namespace",
]);

function highlightLine(line: string, lineKey: number) {
  const tokens: Array<{ text: string; cls: string }> = [];
  let remaining = line;

  while (remaining.length > 0) {
    if (remaining.startsWith("#")) {
      tokens.push({ text: remaining, cls: "text-zinc-500 italic" });
      remaining = "";
      break;
    }
    const dq = remaining.match(/^"([^"\\]|\\.)*"/);
    if (dq) {
      tokens.push({ text: dq[0], cls: "text-amber-300" });
      remaining = remaining.slice(dq[0].length);
      continue;
    }
    const sq = remaining.match(/^'([^'\\]|\\.)*'/);
    if (sq) {
      tokens.push({ text: sq[0], cls: "text-amber-300" });
      remaining = remaining.slice(sq[0].length);
      continue;
    }
    const sym = remaining.match(/^:[a-zA-Z_][a-zA-Z0-9_]*[?!=]?/);
    if (sym) {
      tokens.push({ text: sym[0], cls: "text-fuchsia-300" });
      remaining = remaining.slice(sym[0].length);
      continue;
    }
    const ivar = remaining.match(/^@@?[a-zA-Z_][a-zA-Z0-9_]*/);
    if (ivar) {
      tokens.push({ text: ivar[0], cls: "text-rose-300" });
      remaining = remaining.slice(ivar[0].length);
      continue;
    }
    const num = remaining.match(/^\d+(\.\d+)?/);
    if (num) {
      tokens.push({ text: num[0], cls: "text-emerald-300" });
      remaining = remaining.slice(num[0].length);
      continue;
    }
    const constMatch = remaining.match(/^[A-Z][a-zA-Z0-9_]*/);
    if (constMatch) {
      tokens.push({ text: constMatch[0], cls: "text-cyan-300" });
      remaining = remaining.slice(constMatch[0].length);
      continue;
    }
    const ident = remaining.match(/^[a-z_][a-zA-Z0-9_]*[?!]?/);
    if (ident) {
      const word = ident[0];
      tokens.push({
        text: word,
        cls: KEYWORDS.has(word)
          ? "text-violet-300 font-medium"
          : "text-zinc-200",
      });
      remaining = remaining.slice(word.length);
      continue;
    }
    tokens.push({ text: remaining[0], cls: "text-zinc-400" });
    remaining = remaining.slice(1);
  }

  return (
    <span>
      {tokens.map((t, i) => (
        <span key={`${lineKey}-${i}`} className={t.cls}>
          {t.text}
        </span>
      ))}
    </span>
  );
}

export function CodeBlock({ code, label }: Props) {
  const lines = code.split("\n");

  // ライト/ダーク共通: コードブロックは VSCode 風に常時暗めの背景
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md shadow-black/10 dark:border-white/5 dark:bg-zinc-900/80 dark:shadow-2xl dark:shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {label ?? "ruby"}
        </span>
      </div>
      <pre className="code-block overflow-x-auto p-4 text-zinc-200">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span className="select-none pr-4 text-right font-mono text-[10px] text-zinc-600">
                {String(i + 1).padStart(2, " ")}
              </span>
              <span className="flex-1">
                {line.length === 0 ? " " : highlightLine(line, i)}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
