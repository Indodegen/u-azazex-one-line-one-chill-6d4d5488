import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const content = readFileSync(entryPath, "utf-8");

if (content.trim().length === 0) {
  console.error("entry.txt is empty or whitespace only");
  process.exit(1);
}

if (content.trim().length > 200) {
  console.error(`entry exceeds 200 characters (${content.trim().length})`);
  process.exit(1);
}

const bad = [...content].find(
  (ch) =>
    (ch < " " && ch !== "\n") ||
    ch === "\u007f" ||
    ch === "\u200b" ||
    ch === "\u200c" ||
    ch === "\u200d" ||
    ch === "\ufeff",
);
if (bad !== undefined) {
  console.error(
    `entry.txt contains an invisible control character: U+${bad
      .codePointAt(0)!
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`,
  );
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), content, "utf-8");
