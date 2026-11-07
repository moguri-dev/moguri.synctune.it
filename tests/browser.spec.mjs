import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { guidePages } from "../scripts/docs.mjs";

const pages = ["/", "/docs/", ...guidePages.map((page) => `/docs/${page.slug}.html`)];

test("the homepage loads local assets without runtime errors", async ({ page }, testInfo) => {
  const errors = [];
  const failed = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => failed.push(request.url()));
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI coding workspace");
  await expect(page.getByText("In development", { exact: true })).toBeVisible();
  for (const image of await page.locator("img[loading='lazy']").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  const images = await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));
  expect(images).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(requests.every((url) => url.startsWith("http://127.0.0.1:4187/"))).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("moguri-home-desktop.png"), fullPage: true, animations: "disabled" });
});

test("interface tabs support mouse and the complete keyboard pattern", async ({ page }) => {
  await page.goto("/");
  const desktop = page.getByRole("tab", { name: "Desktop", exact: true });
  const terminal = page.getByRole("tab", { name: "Terminal", exact: true });
  const sdk = page.getByRole("tab", { name: "SDK", exact: true });
  await expect(desktop).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await terminal.click();
  await expect(terminal).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Chats in the terminal");
  await terminal.press("ArrowRight");
  await expect(sdk).toBeFocused();
  await expect(sdk).toHaveAttribute("aria-selected", "true");
  await sdk.press("ArrowRight");
  await expect(desktop).toBeFocused();
  await desktop.press("ArrowLeft");
  await expect(sdk).toBeFocused();
  await sdk.press("Home");
  await expect(desktop).toBeFocused();
  await desktop.press("End");
  await expect(sdk).toBeFocused();
  await sdk.press("Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "SDK guide" })).toBeFocused();
});

test("the skip link and docs navigation work with a keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await page.getByRole("navigation", { name: "Documentation topics" }).getByRole("link", { name: "Execution", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/#execution$/);
  await expect(page.getByRole("heading", { name: "Choose where work runs" })).toBeInViewport();
  const question = page.getByText("Is remote execution sandboxed?", { exact: true });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open", "");
});

for (const width of [320, 375, 767, 768, 1024, 1440, 2560]) {
  test(`homepage and docs fit a ${width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [...pages, "/404.html"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (path === "/" && width === 375) {
        await page.getByRole("tab", { name: "Terminal", exact: true }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.getByRole("tab", { name: "SDK", exact: true }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.getByRole("tab", { name: "Desktop", exact: true }).click();
        await page.screenshot({ path: testInfo.outputPath("moguri-home-mobile.png"), fullPage: true, animations: "disabled" });
      }
    }
  });
}

test("all interface content remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4187/");
    await expect(page.locator(".interface-tabs")).toBeHidden();
    await expect(page.locator(".interface-panel")).toHaveCount(3);
    for (const panel of await page.locator(".interface-panel").all()) await expect(panel).toBeVisible();
    await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Docs", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moguri user guide");
  } finally {
    await context.close();
  }
});

test("reduced motion removes arrival animation and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.locator(".control-board").evaluate((board) => ({
    animation: getComputedStyle(board).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(motion).toEqual({ animation: "none", scroll: "auto" });
});

test("hero arrival never fades readable labels", async ({ page }) => {
  await page.goto("/");
  const opacities = await page.locator(".control-board").evaluate((board) => {
    const animation = board.getAnimations()[0];
    if (!animation) throw new Error("The hero arrival animation is missing.");
    animation.pause();
    return [0, 300, 600].map((time) => {
      animation.currentTime = time;
      return getComputedStyle(board).opacity;
    });
  });
  expect(opacities).toEqual(["1", "1", "1"]);
});

for (const path of [...pages, "/404.html"]) {
  test(`${path} meets automated WCAG AA checks`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const audit = () => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect((await audit()).violations).toEqual([]);
    if (path === "/") {
      for (const name of ["Terminal", "SDK"]) {
        await page.getByRole("tab", { name, exact: true }).click();
        expect((await audit()).violations).toEqual([]);
      }
    }
  });
}

test("the preview serves correct errors and never publishes source files", async ({ request }) => {
  const home = await request.head("/");
  expect(home.status()).toBe(200);
  expect(await home.body()).toHaveLength(0);
  expect(home.headers()["content-type"]).toContain("text/html");
  const directory = await request.get("/docs?topic=models", { maxRedirects: 0 });
  expect(directory.status()).toBe(301);
  expect(directory.headers().location).toBe("/docs/?topic=models");
  for (const path of ["/not-a-page", "/missing/nested/page", "/package.json", "/README.md", "/docs/development.md", "/docs/layout.html", "/docs/usage/getting-started.md", "/scripts/docs.mjs", "/.git/config", "/tests/site.test.mjs", "/%2e%2e%2fpackage.json"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("<h1>Page not found</h1>");
  }
  expect((await request.get("/%E0%A4%A")).status()).toBe(400);
  expect((await request.get("/%00")).status()).toBe(400);
  const unsupported = await request.post("/");
  expect(unsupported.status()).toBe(405);
  expect(unsupported.headers().allow).toBe("GET, HEAD");
});

test("usage guides and their chapter navigation work without custom controls", async ({ page }) => {
  await page.goto("/docs/");
  await page.locator(".docs-guide-grid").getByRole("link", { name: /^Getting started/ }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Getting started");
  const menu = page.locator(".docs-guide-menu > summary");
  await menu.focus();
  await menu.press("Enter");
  await expect(page.locator(".docs-guide-menu")).toHaveAttribute("open", "");
  await page.getByRole("navigation", { name: "Usage guides" }).getByRole("link", { name: "Models and budgets", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/models\.html$/);
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Set budget limits", exact: true }).click();
  await expect(page).toHaveURL(/#set-budget-limits$/);
  await expect(page.getByRole("heading", { name: "Set budget limits", exact: true })).toBeInViewport();
});

test("all three real app screenshots load responsively and open at full size", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const links = page.locator(".screenshot-link");
  await expect(links).toHaveCount(3);
  await expect(page.locator(".mock-desktop")).toHaveCount(0);
  for (const link of await links.all()) {
    const image = link.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect(image).toHaveAttribute("width", "2880");
    await expect(image).toHaveAttribute("height", "2000");
    await expect(image).toHaveAttribute("srcset", /960w.*1440w.*2880w/);
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
    await link.focus();
    await expect(link).toBeFocused();
    const response = await page.request.get(await link.getAttribute("href"));
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const bytes = await response.body();
    expect(bytes.readUInt32BE(16)).toBe(2880);
    expect(bytes.readUInt32BE(20)).toBe(2000);
  }
  await page.getByRole("link", { name: "Open the Moguri model-controls screenshot at full size", exact: true }).press("Enter");
  await expect(page).toHaveURL(/\/assets\/screenshots\/moguri-model-controls\.png$/);
});
