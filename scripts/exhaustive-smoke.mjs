import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import cases from "../src/data/cases.json" with { type: "json" };
import reels from "../src/data/reels.json" with { type: "json" };
import profile from "../src/data/profile.json" with { type: "json" };

const ROOT = new URL("..", import.meta.url).pathname;
const APP_URL = process.env.SMOKE_URL || "http://127.0.0.1:4173";
const REPORT_PATH = new URL("../smoke-report.json", import.meta.url).pathname;
const OUT_REPORT_PATH = "/Users/drishventure/Documents/Codex/2026-05-31/files-mentioned-by-the-user-pushkar-3/outputs/pushkar-exhaustive-smoke-report.json";

const results = [];
let browser;
let server;

async function waitForServer(url, ms = 25000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
}

async function ensureServer() {
  if (await waitForServer(APP_URL, 1200)) return;
  server = spawn("npm", ["run", "dev"], {
    cwd: ROOT,
    stdio: "pipe",
    env: { ...process.env, BROWSER: "none" },
  });
  let buffer = "";
  server.stdout.on("data", (d) => { buffer += d.toString(); });
  server.stderr.on("data", (d) => { buffer += d.toString(); });
  if (!(await waitForServer(APP_URL))) {
    throw new Error(`Astro server did not start. Output:\n${buffer}`);
  }
}

async function run(name, fn) {
  const startedAt = Date.now();
  try {
    const details = await fn();
    results.push({ name, status: "passed", ms: Date.now() - startedAt, details });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: "failed", ms: Date.now() - startedAt, error: error?.message || String(error) });
    console.error(`FAIL ${name}: ${error?.message || error}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function visibleText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: 9000 }).catch(() => {
    throw new Error(`Missing visible text: ${text}`);
  });
}

async function goXP(page) {
  await page.goto(`${APP_URL}/xp`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /skip intro/i }).click();
  await page.getByRole("button", { name: /Log on/i }).click();
  await page.locator(".xp-taskbar").waitFor({ state: "visible", timeout: 9000 });
  await page.waitForTimeout(250);
}

async function clickDesktopIcon(page, label) {
  await page.getByLabel(`${label}: open`).click();
  await page.waitForTimeout(150);
}

async function windowByTitle(page, title) {
  const win = page.locator(".xp-window").filter({
    has: page.locator(".xp-titlebar b", { hasText: title }),
  }).first();
  await win.waitFor({ state: "visible", timeout: 9000 }).catch(() => {
    throw new Error(`Window did not open: ${title}`);
  });
  return win;
}

async function closeDialog(page) {
  const dialog = page.locator(".xp-dialog");
  if (await dialog.count()) {
    await dialog.locator("button", { hasText: "OK" }).first().click().catch(async () => {
      await page.keyboard.press("Escape");
    });
  }
}

await ensureServer();

browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1365, height: 768 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(9000);

await run("structured content files expose required portfolio fields", async () => {
  for (const key of ["name", "headline", "subheadline", "email", "phone", "linkedin", "instagram", "cvUrl", "profileImage", "stats"]) {
    expect(profile[key], `profile.json missing ${key}`);
  }
  for (const item of cases) {
    for (const key of ["id", "title", "year", "role", "metric", "tags", "summary", "problem", "moves", "outcomes", "proof", "toneLine"]) {
      expect(item[key], `case ${item.id} missing ${key}`);
    }
  }
  for (const reel of reels) {
    for (const key of ["id", "title", "brand", "platform", "embedUrl", "openUrl", "proof", "category"]) {
      expect(reel[key], `reel ${reel.id} missing ${key}`);
    }
  }
});

await run("selector loads and links to both equal portfolio modes", async () => {
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await visibleText(page, "Pushkar Vashisht");
  await visibleText(page, "Same work, different reading mode.");
  await visibleText(page, "Formal Dossier");
  await visibleText(page, "Fun XP OS");
  expect(await page.locator('a[href="/formal"]').count() >= 1, "Selector missing formal link");
  expect(await page.locator('a[href="/xp"]').count() >= 1, "Selector missing XP link");
});

await run("formal dossier renders HR-grade proof, contact utilities and direct embeds", async () => {
  await page.goto(`${APP_URL}/formal`, { waitUntil: "domcontentloaded" });
  await visibleText(page, profile.headline);
  await visibleText(page, "Proof-led creative operator");
  await visibleText(page, "What he is useful for");
  await visibleText(page, "Proof that has a point of view.");
  await visibleText(page, profile.email);
  await visibleText(page, "Download CV");
  for (const stat of profile.stats) await visibleText(page, stat.value);
  for (const item of cases.slice(0, 4)) await visibleText(page, item.title);
  const videos = page.locator(".reel-section iframe");
  expect(await videos.count() === reels.length, "Formal page should directly embed every reel");
  const box = await videos.first().boundingBox();
  expect(box && box.height > box.width * 1.45, "Formal embeds should be vertical players");
  expect(await page.locator(`img[src="${profile.profileImage}"]`).count() >= 1, "Profile image should render");
});

await run("each case page is generated from cases.json", async () => {
  for (const item of cases) {
    await page.goto(`${APP_URL}/formal/cases/${item.id}`, { waitUntil: "domcontentloaded" });
    await visibleText(page, item.title);
    await visibleText(page, item.problem);
    await visibleText(page, item.proof);
    await visibleText(page, item.metric);
  }
});

await run("contact route exposes direct hiring actions", async () => {
  await page.goto(`${APP_URL}/contact`, { waitUntil: "domcontentloaded" });
  await visibleText(page, "Bring him into the room");
  expect(await page.locator(`a[href="mailto:${profile.email}"]`).count() === 1, "Email link missing");
  expect(await page.locator(`a[href="${profile.linkedin}"]`).count() === 1, "LinkedIn link missing");
  expect(await page.locator(`a[href="${profile.cvUrl}"]`).count() === 1, "CV link missing");
});

await run("XP boots to guide-only desktop with Bliss wallpaper and profile asset", async () => {
  await goXP(page);
  const bg = await page.locator(".xp-wall").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg.includes("Bliss_%28Windows_XP%29.png"), "XP wallpaper is not the real Bliss image URL");
  await windowByTitle(page, "Start Here - Guide");
  expect(await page.locator(".xp-window").count() === 1, "XP should start with only the guide window open");
  expect(await page.locator(`img[src="${profile.profileImage}"]`).count() >= 1, "XP guide should render profile picture");
});

await run("desktop icons open every XP app with one click", async () => {
  await goXP(page);
  const apps = [
    ["My Computer", "My Computer"],
    ["Case Studies", "Case Studies"],
    ["Reel Player", "Reel Player"],
    ["Internet", "Internet Explorer"],
    ["Hire Me", "Hire Me"],
    ["Command", "Command Prompt"],
    ["Paint", "untitled - Paint"],
    ["Games", "Games"],
    ["README", "README - Notepad"],
    ["Control Panel", "Control Panel"],
    ["Recycle Bin", "Recycle Bin"],
  ];
  for (const [icon, title] of apps) {
    await clickDesktopIcon(page, icon);
    await windowByTitle(page, title);
  }
});

await run("XP titlebar controls, joke menus and sound toggle work", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Games");
  const win = await windowByTitle(page, "Games");
  await win.locator('button[aria-label^="Minimize"]').click();
  await page.waitForTimeout(150);
  expect(await page.locator(".xp-window").filter({ has: page.locator(".xp-titlebar b", { hasText: "Games" }) }).count() === 0, "Games should hide after minimize");
  await page.locator(".xp-task", { hasText: "Games" }).click();
  await windowByTitle(page, "Games");
  await win.locator('button[aria-label^="Maximize"]').click();
  await page.waitForTimeout(100);
  await win.locator('button[aria-label^="Restore"]').click();
  await win.locator(".xp-menubar button", { hasText: "File" }).click();
  await visibleText(page, "File menu opened");
  await closeDialog(page);
  await page.getByLabel("Toggle sound").click();
});

await run("XP paint, games, reels and do-not-touch interactions work", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Reel Player");
  await page.locator(".reel-card").first().click();
  await page.locator(".reel-player-frame iframe").first().waitFor({ state: "visible" });

  await clickDesktopIcon(page, "Paint");
  const canvas = page.locator("canvas").first();
  const box = await canvas.boundingBox();
  expect(Boolean(box), "Paint canvas missing");
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 80);
  await page.mouse.up();
  await page.locator(".paint-tool-btn", { hasText: "E" }).click();
  await page.getByRole("button", { name: /clear/i }).click();

  await clickDesktopIcon(page, "Games");
  await page.locator(".buzz-grid button").first().click();
  await page.getByRole("button", { name: /crash the portfolio/i }).click();
  await visibleText(page, "ran into recruiter boredom");
  await page.locator(".fake-bsod").click();

  await page.getByRole("button", { name: /do not touch/i }).click();
  await page.locator(".chaos-warning").first().waitFor({ state: "visible" });
  expect(await page.locator(".chaos-warning").count() >= 60, "Warning storm did not spawn");
  await page.getByRole("button", { name: /told you/i }).click();
  await page.waitForTimeout(150);
  expect(await page.locator(".chaos-warning").count() === 0, "Warning storm did not reset");
});

await run("responsive formal and XP surfaces stay visible", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${APP_URL}/formal`, { waitUntil: "domcontentloaded" });
  await visibleText(page, profile.headline);
  await page.goto(`${APP_URL}/xp`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /skip intro/i }).click();
  await page.getByRole("button", { name: /Log on/i }).click();
  await page.locator(".xp-taskbar").waitFor({ state: "visible" });
  await windowByTitle(page, "Start Here - Guide");
  await page.setViewportSize({ width: 1365, height: 768 });
});

await browser.close();
if (server) server.kill();

const report = {
  generatedAt: new Date().toISOString(),
  url: APP_URL,
  passed: results.filter((r) => r.status === "passed").length,
  failed: results.filter((r) => r.status === "failed").length,
  results,
};

await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
await fs.mkdir(path.dirname(OUT_REPORT_PATH), { recursive: true }).catch(() => {});
await fs.writeFile(OUT_REPORT_PATH, JSON.stringify(report, null, 2)).catch(() => {});
console.log(JSON.stringify(report, null, 2));
process.exit(report.failed ? 1 : 0);
