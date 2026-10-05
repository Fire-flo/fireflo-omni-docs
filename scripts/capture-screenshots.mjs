/**
 * Capture every screenshot in scripts/screens.mjs from a running development panel.
 *
 *   OMNI_API_DIR=../fireflo-omni node scripts/capture-screenshots.mjs [filter]
 *
 * PANEL_URL is the panel (http://localhost:3200 by default). Each screen is shown as its
 * demo user, signed in with a short-lived session made by the API's own manage.py — no
 * password is used or stored. Saved at 1440×900, light, to images/<file>.png. A filter
 * captures only the screens whose file contains it ("channels/", "playground").
 */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { chromium } from "@playwright/test";

import { SCREENS } from "./screens.mjs";

const PANEL = process.env.PANEL_URL ?? "http://localhost:3200";
const API_DIR = resolve(process.env.OMNI_API_DIR ?? "../fireflo-omni");
const ROOT = new URL("..", import.meta.url).pathname;
const only = process.argv[2] ?? "";

const tokens = new Map();
function tokenFor(email) {
  if (!tokens.has(email)) {
    const code = [
      "from django.contrib.auth import get_user_model",
      "from rest_framework_simplejwt.tokens import AccessToken",
      `print(AccessToken.for_user(get_user_model().objects.get(email=${JSON.stringify(email)})))`,
    ].join("\n");
    const output = execFileSync("uv", ["run", "python", "manage.py", "shell", "-c", code], {
      cwd: API_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const token = output.trim().split("\n").at(-1) ?? "";
    if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) throw new Error(`No session for ${email}`);
    tokens.set(email, token);
  }
  return tokens.get(email);
}

const browser = await chromium.launch();
const contexts = new Map();
async function pageFor(email) {
  if (!contexts.has(email)) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: "light",
    });
    await context.addCookies([
      { name: "omni_access", value: tokenFor(email), url: PANEL, httpOnly: true, sameSite: "Lax" },
      // The side menu shows a screen's place in the product.
      { name: "omni_nav_layout", value: "side", url: PANEL, sameSite: "Lax" },
      { name: "omni_theme", value: "light", url: PANEL, sameSite: "Lax" },
    ]);
    contexts.set(email, await context.newPage());
  }
  return contexts.get(email);
}

/**
 * What a public screenshot must not show, made neutral before it is taken: a
 * development machine's addresses and logins, the raw text of a connection error, and
 * the development server's own badge. Runs in the page.
 */
function tidy() {
  const swaps = [
    [/https?:\/\/(?:127\.0\.0\.1|localhost|0\.0\.0\.0)(?::\d+)?/g, "https://gateway.example.com"],
    [/\b(?:127\.0\.0\.1|localhost)(?::\d+)?\b/g, "gateway.example.com"],
    [/\bdev-user\b/g, "acme-retail"],
    // Development never reaches Meta: its stand-in number, shown as an example one.
    [/\+00 0000 \(dry run\)/g, "+91 80 4567 8900"],
  ];
  const swap = (text) => swaps.reduce((out, [pattern, value]) => out.replace(pattern, value), text);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) node.nodeValue = swap(node.nodeValue);
  for (const input of document.querySelectorAll("input, textarea")) {
    if (input.value) input.value = swap(input.value);
  }
  // A connection error quotes the machine it tried; the screen still says it failed.
  for (const element of document.querySelectorAll("p, div, span")) {
    if (element.children.length === 0 && /HTTPConnectionPool|Errno|Max retries|NewConnectionError/.test(element.textContent)) {
      element.textContent = "Last check: the gateway didn't answer.";
    }
  }
  for (const badge of document.querySelectorAll("nextjs-portal, [data-nextjs-toast], #__next-build-watcher")) badge.remove();
}

let saved = 0;
const failed = [];
for (const screen of SCREENS.filter((row) => row.file.includes(only))) {
  const page = await pageFor(screen.as);
  try {
    await page.goto(`${PANEL}${screen.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    if (screen.open) {
      const link = page.locator(screen.open).first();
      await link.click({ timeout: 15_000 });
      await page.waitForLoadState("networkidle");
    }
    if (new URL(page.url()).pathname.startsWith("/login")) throw new Error("signed out");
    // Let charts and fonts settle.
    await page.waitForTimeout(800);
    await page.evaluate(tidy);
    const file = resolve(ROOT, "images", `${screen.file}.png`);
    mkdirSync(dirname(file), { recursive: true });
    await page.screenshot({ path: file });
    saved += 1;
    console.log(`saved ${screen.file}`);
  } catch (error) {
    failed.push(`${screen.file}: ${error.message.split("\n")[0]}`);
    console.error(`FAILED ${screen.file}: ${error.message.split("\n")[0]}`);
  }
}
await browser.close();
console.log(`${saved} saved, ${failed.length} failed`);
if (failed.length) process.exitCode = 1;
