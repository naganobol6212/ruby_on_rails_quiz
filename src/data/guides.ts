/**
 * 参考書 (Study Guide) の集約点。
 *
 * 実体は `src/data/guides/<id>.ts` に分割済み (旧 5800 行 → ガイド単位)。
 * このファイルは既存の `import ... from "@/data/guides"` を壊さないための薄い
 * re-export。 新しいコードは `@/data/guides/index` から import しても良いが、
 * このパス経由でも同じ API を取得できる。
 */
export type { Guide, GuideChapter, GuideSection } from "./guides/index";
export {
  guides,
  findGuide,
  guidesByTrack,
  studyLinksForCategory,
} from "./guides/index";
