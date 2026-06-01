import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const ROOT = new URL("..", import.meta.url).pathname;
const APP_URL = process.env.SMOKE_URL || "http://127.0.0.1:4173/";
const REPORT_PATH = new URL("../smoke-report.json", import.meta.url).pathname;
const OUT_REPORT_PATH = "/Users/drishventure/Documents/Codex/2026-05-31/files-mentioned-by-the-user-pushkar-3/outputs/pushkar-exhaustive-smoke-report.json";

const results = [];
let browser;
let server;

function now() {
  return new Date().toISOString();
}

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
  server = spawn("npm", ["run", "dev", "--", "--port", "4173"], {
    cwd: ROOT,
    stdio: "pipe",
    env: { ...process.env, BROWSER: "none" },
  });
  let buffer = "";
  server.stdout.on("data", (d) => { buffer += d.toString(); });
  server.stderr.on("data", (d) => { buffer += d.toString(); });
  if (!(await waitForServer(APP_URL))) {
    throw new Error(`Vite server did not start. Output:\n${buffer}`);
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
  await expectLocator(page.getByText(text, { exact: false }), `Missing visible text: ${text}`);
}

async function expectLocator(locator, message) {
  await locator.first().waitFor({ state: "visible", timeout: 7000 }).catch(() => {
    throw new Error(message);
  });
}

async function closeDialog(page) {
  const dialog = page.locator(".xp-dialog");
  if (await dialog.count()) {
    await dialog.locator("button", { hasText: "OK" }).first().click().catch(async () => {
      await page.keyboard.press("Escape");
    });
  }
}

async function goFormal(page) {
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Formal Dossier/i }).click();
  await visibleText(page, "opening dossier");
  await page.getByRole("button", { name: /open now/i }).click();
  await visibleText(page, "Pushkar Vashisht");
}

async function goXP(page) {
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Fun XP OS/i }).click();
  await page.getByRole("button", { name: /skip intro/i }).click();
  await page.getByRole("button", { name: /Log on/i }).click();
  await expectLocator(page.locator(".xp-taskbar"), "XP taskbar did not appear");
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
  await expectLocator(win, `Window did not open: ${title}`);
  return win;
}

async function topWindow(page) {
  const handle = await page.locator(".xp-window").evaluateAll((wins) => {
    const visible = wins.filter((win) => {
      const style = getComputedStyle(win);
      const rect = win.getBoundingClientRect();
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    return visible
      .map((win, index) => ({ index, z: Number(getComputedStyle(win).zIndex) || 0 }))
      .sort((a, b) => b.z - a.z)[0]?.index ?? 0;
  });
  return page.locator(".xp-window").nth(handle);
}

async function sourceUsesProfilePhotoAsset() {
  const src = await fs.readFile("/Users/drishventure/Downloads/pushkar_2050_dual_portfolio_prototype.jsx", "utf8");
  expect(src.includes("PROFILE_PHOTO_URL"), "Profile photo asset constant is missing");
  expect(src.includes("pushkar-profile.jpg"), "Profile photo is not wired into the prototype");
  expect(!src.includes("data:image/webp;base64"), "Embedded portrait data URI still exists");
}

await ensureServer();

browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1365, height: 768 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(9000);

await run("source uses served profile photo asset", sourceUsesProfilePhotoAsset);

await run("formal dossier has boot, profile, useful controls and direct embeds", async () => {
  await goFormal(page);
  await visibleText(page, "I build the messy middle");
  await visibleText(page, "What I Do");
  await visibleText(page, "Best Fit");
  await visibleText(page, "Why It Pulls");
  await visibleText(page, "pushkarvashisht5@gmail.com");
  await page.getByRole("button", { name: /Burger Bae/i }).click();
  await visibleText(page, "Creator-led Streetwear Growth");
  await page.getByPlaceholder(/filter cases/i).fill("startup");
  await visibleText(page, "InvestX");
  const videos = page.locator("section", { hasText: "Embedded work" }).locator("iframe");
  expect(await videos.count() >= 6, "Formal reel section should directly embed every video");
  const box = await videos.first().boundingBox();
  expect(box && box.height > box.width * 1.45, "Formal embeds should be vertical 9:16-ish players");
  expect(await page.locator('img[src="/pushkar-profile.jpg"]').count() >= 1, "Formal page should render the supplied profile picture");
  const dataImages = await page.locator('img[src^="data:image"]').count();
  expect(dataImages === 0, "Formal page still renders a data-image portrait");
});

await run("XP boots to guide-only desktop with Bliss wallpaper and profile asset", async () => {
  await goXP(page);
  const bg = await page.locator(".xp-wall").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg.includes("Bliss_%28Windows_XP%29.png"), "XP wallpaper is not the real Bliss image URL");
  const visibleClouds = await page.locator(".cloud").evaluateAll((els) => els.filter((el) => getComputedStyle(el).display !== "none").length);
  expect(visibleClouds === 0, "Animated clouds are still visible");
  const dataImages = await page.locator('img[src^="data:image"]').count();
  expect(dataImages === 0, "XP page still renders a data-image portrait");
  await windowByTitle(page, "Start Here - Guide");
  expect(await page.locator(".xp-window").count() === 1, "XP should start with only the guide window open");
  expect(await page.locator('img[src="/pushkar-profile.jpg"]').count() >= 1, "XP guide should render the supplied profile picture");
});

await run("desktop icons open every app with one click", async () => {
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
  const openCount = await page.locator(".xp-window").count();
  expect(openCount >= apps.length, `Expected at least ${apps.length} windows, got ${openCount}`);
});

await run("XP titlebar controls minimize, restore, maximize and close", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Games");
  const win = await windowByTitle(page, "Games");
  await win.locator('button[aria-label^="Minimize"]').click();
  await page.waitForTimeout(150);
  expect(await page.locator(".xp-window").filter({ has: page.locator(".xp-titlebar b", { hasText: "Games" }) }).count() === 0, "Games window should be hidden after minimize");
  await page.locator(".xp-task", { hasText: "Games" }).click();
  await expectLocator(win, "Games did not restore from taskbar");
  await win.locator('button[aria-label^="Maximize"]').click();
  await page.waitForTimeout(100);
  const isMax = await win.evaluate((el) => el.style.left === "0px" && el.style.top === "0px");
  expect(isMax, "Games window did not maximize");
  await win.locator('button[aria-label^="Restore"]').click();
  await win.locator('button[aria-label^="Close"]').click();
  await page.waitForFunction(() => {
    return [...document.querySelectorAll(".xp-window .xp-titlebar b")].every((el) => el.textContent !== "Games");
  });
  expect(await page.locator(".xp-window").filter({ has: page.locator(".xp-titlebar b", { hasText: "Games" }) }).count() === 0, "Games window did not close");
});

await run("File/Edit/View/Favorites/Tools/Help are joke buttons", async () => {
  await goXP(page);
  const win = await topWindow(page);
  const jokes = {
    File: "File menu opened. File not found.",
    Edit: "Edit what?",
    View: "proof first",
    Favorites: "Added to Favorites",
    Tools: "IE not included",
    Help: "Help = Hire Me window",
  };
  for (const [label, message] of Object.entries(jokes)) {
    await win.locator(".xp-menubar button", { hasText: label }).click();
    await visibleText(page, message);
    await closeDialog(page);
  }
});

await run("My Computer behaves like an Explorer hub", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "My Computer");
  const about = await windowByTitle(page, "My Computer");
  await visibleText(page, "System Tasks");
  await visibleText(page, "Files Stored On This Computer");
  await visibleText(page, "100+");
  await about.getByRole("button", { name: /View portfolio proof/i }).click();
  await windowByTitle(page, "Case Studies");
  await clickDesktopIcon(page, "My Computer");
  await about.getByRole("button", { name: /Play reel evidence/i }).click();
  await windowByTitle(page, "Reel Player");
  await clickDesktopIcon(page, "My Computer");
  await about.getByRole("button", { name: /^Games$/i }).click();
  await windowByTitle(page, "Games");
});

await run("reel library uses thumbnails and opens vertical embedded players", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Reel Player");
  const reels = await windowByTitle(page, "Reel Player");
  expect(await reels.locator(".reel-card").count() >= 6, "Reel library should include all reels");
  expect(await reels.locator(".reel-thumb-design").count() >= 6, "Reel cards should have branded thumbnails");
  const firstThumb = await reels.locator(".reel-thumb").first().boundingBox();
  expect(firstThumb && firstThumb.height > firstThumb.width * 1.45, "Fun XP reel cards are not vertical");
  await reels.locator(".reel-card").first().click();
  await expectLocator(page.locator(".reel-player-frame iframe").first(), "Embedded reel iframe did not open");
  const player = await page.locator(".reel-player-frame").first().boundingBox();
  expect(player && player.height > player.width * 1.25, "Reel player frame is not vertical enough for 1080x1920 content");
  const overlayButtons = await page.locator(".reel-player-frame button").count();
  expect(overlayButtons === 0, "Reel player should not add an extra play layer");
});

await run("Paint can draw, erase/clear, change size and save", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Paint");
  const paint = await windowByTitle(page, "untitled - Paint");
  const canvas = paint.locator("canvas").first();
  const nonWhite = async () => canvas.evaluate((c) => {
    const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255 || data[i + 3] !== 255) count++;
      if (count > 25) return count;
    }
    return count;
  });
  const before = await nonWhite();
  const box = await canvas.boundingBox();
  expect(!!box, "Paint canvas has no layout box");
  await page.mouse.move(box.x + 80, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 190, box.y + 140);
  await page.mouse.up();
  const after = await nonWhite();
  expect(after > before, "Paint canvas did not change after drawing");
  await paint.locator('input[type="range"]').fill("16");
  await visibleText(page, "16px");
  await paint.getByTitle("Clear").click();
  const cleared = await nonWhite();
  expect(cleared === 0, "Paint clear did not reset the canvas");
  const downloadPromise = page.waitForEvent("download");
  await paint.getByRole("button", { name: /Save PNG/i }).click();
  const download = await downloadPromise;
  expect((await download.suggestedFilename()) === "pushkar-paint.png", "Paint saved with the wrong filename");
  await closeDialog(page);
});

await run("Control Panel contains useful shortcuts and joke apps", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Control Panel");
  const control = await windowByTitle(page, "Control Panel");
  await visibleText(page, "Games");
  await visibleText(page, "Menu Jokes");
  await visibleText(page, "Laugh Lab");
  await control.getByRole("button", { name: /Menu Jokes/i }).click();
  await visibleText(page, "File menu opened. File not found.");
  await closeDialog(page);
  await control.getByRole("button", { name: /Laugh Lab/i }).click();
  await windowByTitle(page, "Games");
});

await run("do not touch creates and resets warning storm", async () => {
  await goXP(page);
  await page.getByRole("button", { name: /do not touch/i }).click();
  await visibleText(page, "told you");
  expect(await page.locator(".chaos-warning").count() >= 90, "Do not touch should open many warning windows");
  await page.getByRole("button", { name: /told you/i }).click();
  expect(await page.locator(".chaos-warning").count() === 0, "Do not touch reset did not clear warning windows");
});

await run("fun games have visible reactions", async () => {
  await goXP(page);
  await clickDesktopIcon(page, "Games");
  const games = await windowByTitle(page, "Games");
  await games.getByRole("button", { name: "synergy" }).click();
  await visibleText(page, "Hits: 1");
  await games.getByRole("button", { name: /crash the portfolio/i }).click();
  await visibleText(page, "recruiter boredom");
  await page.locator(".fake-bsod").click();
  expect((await page.locator(".fake-bsod").count()) === 0, "Fake BSOD did not dismiss");
});

await run("start menu, context menu, command prompt and sound toggle work", async () => {
  await goXP(page);
  await page.locator(".xp-start-btn").click();
  await expectLocator(page.locator(".xp-start"), "Start menu did not open");
  await visibleText(page, "Switch Mode");
  await page.getByRole("button", { name: /Tour/i }).click();
  await page.waitForTimeout(100);
  expect(await page.locator(".spark").count() > 0, "Tour did not create sparks");
  await page.mouse.click(500, 500, { button: "right" });
  await expectLocator(page.locator(".xp-context"), "Right-click context menu did not open");
  await visibleText(page, "Download CV");
  await page.keyboard.press("Escape");
  await clickDesktopIcon(page, "Command");
  const cmd = await windowByTitle(page, "Command Prompt");
  await cmd.locator("input").fill("joke");
  await cmd.getByRole("button", { name: /Run/i }).click();
  await visibleText(page, "Only the desktop gets a callback");
  const toggle = page.getByLabel("Toggle sound");
  const initial = await toggle.textContent();
  await toggle.click();
  const changed = await toggle.textContent();
  expect(initial !== changed, "Sound toggle did not change state");
});

await context.close();
await browser.close();
if (server) server.kill();

const failed = results.filter((r) => r.status === "failed");
const report = {
  generatedAt: now(),
  url: APP_URL,
  passed: results.length - failed.length,
  failed: failed.length,
  results,
};

await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
await fs.mkdir("/Users/drishventure/Documents/Codex/2026-05-31/files-mentioned-by-the-user-pushkar-3/outputs", { recursive: true });
await fs.writeFile(OUT_REPORT_PATH, JSON.stringify(report, null, 2));

if (failed.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
