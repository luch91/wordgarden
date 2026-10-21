/* global process, console */
import { chromium } from "@playwright/test";
import { mkdirSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";
const [url, name, outDir, sceneSelector, hotspotSelector] =
  process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
async function run(label, viewport, isMobile = false) {
  const videoDir = join(outDir, "video-" + label);
  mkdirSync(videoDir, { recursive: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    recordVideo: { dir: videoDir, size: viewport },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.locator(sceneSelector).waitFor({ state: "visible" });
  await page.screenshot({
    path: join(outDir, name + "-" + label + "-initial.png"),
    fullPage: false,
  });
  const scene = page.locator(sceneSelector);
  const before = await scene.getAttribute("style");
  const box = await scene.boundingBox();
  if (!box) throw new Error("scene missing");
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.55);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.46, {
    steps: 12,
  });
  await page.mouse.up();
  await page.mouse.wheel(0, -420);
  await page.waitForTimeout(250);
  for (let cycle = 0; cycle < 3; cycle++) {
    const cx = box.x + box.width * 0.5, cy = box.y + box.height * 0.5;
    await scene.dispatchEvent("pointerdown", {pointerId:31,pointerType:"touch",clientX:cx-30,clientY:cy});
    await scene.dispatchEvent("pointerdown", {pointerId:32,pointerType:"touch",clientX:cx+30,clientY:cy});
    await scene.dispatchEvent("pointermove", {pointerId:31,pointerType:"touch",clientX:cx-55,clientY:cy});
    await scene.dispatchEvent("pointermove", {pointerId:32,pointerType:"touch",clientX:cx+55,clientY:cy});
    await scene.dispatchEvent("pointerup", {pointerId:31,pointerType:"touch",clientX:cx-55,clientY:cy});
    await scene.dispatchEvent("pointerup", {pointerId:32,pointerType:"touch",clientX:cx+55,clientY:cy});
  }
  await page.waitForTimeout(700);
  const after = await scene.getAttribute("style");
  if (before === after) throw new Error("camera transform did not respond");
  const hotspot = page.locator(hotspotSelector).first();
  const hotspotCount = await hotspot.count();
  if (hotspotCount) {
    await hotspot.focus();
    await hotspot.press("Enter");
    await page.waitForTimeout(600);
  }
  await page.screenshot({
    path: join(outDir, name + "-" + label + "-interaction.png"),
    fullPage: false,
  });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("+");
  await page.waitForTimeout(250);
  if (errors.length) throw new Error(errors.join("; "));
  const video = await page.video()?.path();
  await context.close();
  if (video && existsSync(video))
    renameSync(video, join(outDir, name + "-" + label + ".webm"));
  return { label, before, after, hotspot: hotspotCount, errors };
}
const result = [];
if (!existsSync(join(outDir, name + "-desktop.webm")))
  result.push(await run("desktop", { width: 1440, height: 900 }));
result.push(await run("mobile", { width: 390, height: 844 }, true));
await browser.close();
console.log(JSON.stringify(result, null, 2));
