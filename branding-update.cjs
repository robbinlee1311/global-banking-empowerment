const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const EXCLUDED = new Set([
  "node_modules",
  ".git",
  ".github",
  ".astro",
  ".vscode"
]);

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".astro",
  ".md",
  ".mdx",
  ".json",
  ".js",
  ".mjs",
  ".ts",
  ".scss",
  ".css",
  ".svg",
  ".txt",
  ".xml",
  ".yml",
  ".yaml"
]);

const replacements = [
  [/AdminLTE v4/gi, "Global Banking Empowerment"],
  [/AdminLTE/gi, "Global Banking Empowerment"],
  [/AdminLTE\.io/gi, "globalbankingemployment.online"],
  [/Colorlib/gi, "Global Banking Empowerment"],
  [/Responsive open source admin dashboard and control panel\./gi,
    "Professional Online Banking Platform"],
  [/2014-2026/gi, "2012"],
  [/2024/gi, "2012"],
  [/2025/gi, "2012"],
  [/2026/gi, "2012"]
];

let filesChanged = 0;
let replacementsMade = 0;

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED.has(item.name)) continue;

    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      walk(full);
      continue;
    }

    const ext = path.extname(item.name).toLowerCase();

    if (!TEXT_EXTENSIONS.has(ext)) continue;

    let data;

    try {
      data = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }

    let original = data;

    for (const [find, replace] of replacements) {
      data = data.replace(find, replace);
    }

    if (data !== original) {
      fs.writeFileSync(full, data, "utf8");
      filesChanged++;
    }
  }
}

walk(ROOT);

console.log("");
console.log("===============================");
console.log("Branding conversion complete");
console.log("===============================");
console.log("Files modified:", filesChanged);
console.log("===============================");
