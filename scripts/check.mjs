/**
 * The site's own checks, run before every commit (node scripts/check.mjs):
 *
 *  1. every operation in api-reference/openapi.json has a hand-written page, and no page
 *     names an operation that is no longer published;
 *  2. every page in docs.json exists, and no .mdx page is left out of docs.json;
 *  3. no page carries anything from STYLE.md's "must never appear" list;
 *  4. every screenshot a page shows exists.
 *
 * Plain Node, no dependencies.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const problems = [];

function pages(dir = ROOT) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (["node_modules", ".git", ".mintlify", "scripts", "images", "logo"].includes(name)) return [];
    if (statSync(path).isDirectory()) return pages(path);
    return name.endsWith(".mdx") ? [path] : [];
  });
}

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^(\w+):\s*"?(.*?)"?\s*$/))
      .filter(Boolean)
      .map((found) => [found[1], found[2]]),
  );
}

const all = pages();
const texts = Object.fromEntries(all.map((path) => [relative(ROOT, path), readFileSync(path, "utf8")]));

// 1. Operations and their pages.
const schema = JSON.parse(readFileSync(join(ROOT, "api-reference/openapi.json"), "utf8"));
const published = new Set(
  Object.entries(schema.paths).flatMap(([path, methods]) =>
    Object.keys(methods)
      .filter((method) => ["get", "post", "patch", "put", "delete"].includes(method))
      .map((method) => `${method.toUpperCase()} ${path}`),
  ),
);
const documented = new Map();
for (const [file, text] of Object.entries(texts)) {
  if (!file.startsWith("api-reference/")) continue;
  const title = frontmatter(text).title ?? "";
  if (/^(GET|POST|PATCH|PUT|DELETE) \/v1\//.test(title)) documented.set(title, file);
}
for (const operation of published) {
  if (!documented.has(operation)) problems.push(`No page for ${operation}`);
}
for (const [operation, file] of documented) {
  if (!published.has(operation)) problems.push(`${file} documents ${operation}, which isn't published`);
}

// 2. Navigation and files agree.
const config = JSON.parse(readFileSync(join(ROOT, "docs.json"), "utf8"));
const listed = new Set();
(function walk(node) {
  if (Array.isArray(node)) return node.forEach(walk);
  if (node && typeof node === "object") {
    if (Array.isArray(node.pages)) node.pages.forEach((page) => (typeof page === "string" ? listed.add(page) : walk(page)));
    Object.values(node).forEach((value) => typeof value === "object" && walk(value));
  }
})(config.navigation);
for (const page of listed) {
  if (!existsSync(join(ROOT, `${page}.mdx`))) problems.push(`docs.json lists ${page}, which has no page`);
}
for (const file of Object.keys(texts)) {
  const page = file.replace(/\.mdx$/, "");
  if (!listed.has(page)) problems.push(`${file} isn't in docs.json`);
}

// 3. What must never appear.
const FORBIDDEN = [
  [/github\.com|gitlab\.com|bitbucket\.org/i, "a link to a code host"],
  [/\bopen[- ]source\b|\bGPL\b|free software/i, "an open-source claim"],
  [/\/home\/|\.py\b|\.tsx?\b(?!t)|\bfireflo_\w+|\bomni\/\w+|\bau\.remotiq/i, "an internal path or module name"],
  [/\b(?:git clone|fork the)\b/i, "wording about obtaining the source"],
  [/[\w.+-]+@(?!fireflo\.au\b)(?!acme\.in\b)(?!example\.com\b)[\w-]+\.[\w.]+/i, "an email address other than support@fireflo.au"],
  [/\b(?:127\.0\.0\.1|localhost|0\.0\.0\.0)\b/i, "a local address"],
];
for (const [file, text] of Object.entries(texts)) {
  // The gap between a page and a mistake is rarely the code samples: check them too.
  for (const [pattern, what] of FORBIDDEN) {
    const found = text.match(pattern);
    if (found) problems.push(`${file}: ${what} ("${found[0]}")`);
  }
  if (/support@/.test(text) && /support@(?!fireflo\.au)/.test(text)) problems.push(`${file}: support routed elsewhere`);
}
for (const file of ["docs.json", "README.md"]) {
  const text = readFileSync(join(ROOT, file), "utf8");
  if (/github\.com/i.test(text) && file === "docs.json") problems.push(`${file}: a link to a code host`);
}

// 4. Screenshots.
for (const [file, text] of Object.entries(texts)) {
  for (const found of text.matchAll(/src="(\/images\/[^"]+)"/g)) {
    if (!existsSync(join(ROOT, found[1]))) problems.push(`${file}: ${found[1]} is missing`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`OK: ${Object.keys(texts).length} pages, ${published.size} operations documented, nothing that must not appear.`);
