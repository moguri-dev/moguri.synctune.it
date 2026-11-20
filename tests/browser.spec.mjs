import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { canonicalPages, guidePages, templatePages } from "../scripts/catalogue.mjs";

const url = (route) => `/${route.replace(/index\.html$/, "")}`;
const pages = [...templatePages.filter((route) => route !== "404.html"), ...guidePages.map((page) => page.route), ...canonicalPages.map((page) => page.route)].map(url);
const representative = ["/", "/download/", "/docs/", "/developers/", "/docs/getting-started.html", "/docs/installation.html", "/docs/settings/", "/docs/settings/general.html", "/docs/features.html", "/developers/sdk.html", "/developers/sdk-reference.html", "/404.html"];

async function overlaps(page) {
  return page.evaluate(() => {
    const groups = [".site-header", ".hero-actions", ".follow-actions", ".site-footer nav", ".interface-tabs", ".docs-nav"];
    const found = [];
    for (const selector of groups) {
      for (const group of document.querySelectorAll(selector)) {
        const boxes = [...group.querySelectorAll("a, button, summary")]
          .filter((element) => element.checkVisibility() && !element.closest("details:not([open]) > nav"))
          .map((element) => ({ element, box: element.getBoundingClientRect() }))
          .filter(({ box }) => box.width > 0 && box.height > 0);
        for (let a = 0; a < boxes.length; a++) {
          for (let b = a + 1; b < boxes.length; b++) {
            const [one, two] = [boxes[a].box, boxes[b].box];
            const x = Math.min(one.right, two.right) - Math.max(one.left, two.left);
            const y = Math.min(one.bottom, two.bottom) - Math.max(one.top, two.top);
            if (x > 1 && y > 1 && !boxes[a].element.contains(boxes[b].element) && !boxes[b].element.contains(boxes[a].element)) {
              found.push(`${selector}: "${boxes[a].element.textContent.trim()}" overlaps "${boxes[b].element.textContent.trim()}"`);
            }
          }
        }
      }
    }
    return found;
  });
}

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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coding agents on your terms");
  await expect(page.getByText(/^macOS alpha, \d+\.\d+\.\d+/).first()).toBeVisible();
  for (const image of await page.locator("img[loading='lazy']").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  expect(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(requests.every((request) => request.startsWith("http://127.0.0.1:4187/"))).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("moguri-home-desktop.png"), fullPage: true, animations: "disabled" });
});

test("the header reaches every section with the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  for (const [name, path, heading] of [["Download", /\/download\/$/, "Download Moguri"], ["User guide", /\/docs\/$/, "Moguri user guide"], ["Developers", /\/developers\/$/, "Developer docs"]]) {
    await primary.getByRole("link", { name, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(primary.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await primary.getByRole("link", { name: "Features", exact: true }).click();
  await expect(page).toHaveURL(/\/#features$/);
  await expect(page.getByRole("heading", { name: "What works in the alpha" })).toBeInViewport();
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
  await expect(page.getByRole("tabpanel")).toContainText("The terminal UI");
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
  await expect(page.getByRole("link", { name: "SDK quickstart" })).toBeFocused();
});

test("docs sidebars open on wide screens, collapse on small ones and work with a keyboard", async ({ page }) => {
  await page.goto("/docs/settings/general.html");
  const guideMenu = page.locator("details.docs-menu").first();
  await expect(guideMenu).toHaveAttribute("open", "");
  await expect(page.getByRole("navigation", { name: "Settings pages" }).getByRole("link", { name: "General", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("navigation", { name: "Settings pages" }).getByRole("link", { name: "Voice dictation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/settings\/voice-dictation\.html$/);
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/#[\w-]+$/);

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/docs/");
  const summary = page.locator("details.docs-menu > summary");
  await expect(page.locator("details.docs-menu")).not.toHaveAttribute("open", "");
  await summary.focus();
  await summary.press("Enter");
  await expect(page.locator("details.docs-menu")).toHaveAttribute("open", "");
  await page.getByRole("navigation", { name: "User guide" }).getByRole("link", { name: "Installation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/installation\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Installing, upgrading and removing Moguri");
});

test("the user guide's in-page navigation and questions work with a keyboard", async ({ page }) => {
  await page.goto("/docs/");
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Session controls", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/#controls$/);
  await expect(page.getByRole("heading", { name: "Session controls", exact: true })).toBeInViewport();
  const question = page.getByText("Is remote execution sandboxed?", { exact: true });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open", "");
});

test("the download page is honest about availability and first launch", async ({ page }) => {
  await page.goto("/download/");
  await expect(page.getByRole("heading", { name: "No public release yet" })).toBeVisible();
  await expect(page.locator("a[href*='/releases/download/']")).toHaveCount(0);
  await expect(page.getByText("shasum -a 256 --check --ignore-missing SHA256SUMS")).toBeVisible();
  await expect(page.getByRole("link", { name: "Apple's guidance for opening apps that aren't notarized" })).toHaveAttribute("href", "https://support.apple.com/en-us/102445");
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Open it the first time" }).click();
  await expect(page.getByRole("heading", { name: "Open it the first time" })).toBeInViewport();
  await page.getByRole("link", { name: "macOS launch troubleshooting" }).click();
  await expect(page).toHaveURL(/\/docs\/installation\.html#macos-launch-troubleshooting$/);
  await expect(page.getByRole("heading", { name: "macOS launch troubleshooting" })).toBeInViewport();
});

test("references to the private source repository are marked, not linked", async ({ page }) => {
  await page.goto("/docs/installation.html");
  const reference = page.locator(".doc-private").first();
  await expect(reference).toContainText("(not public yet)");
  await expect(reference.locator("a")).toHaveCount(0);
  await expect(page.getByText(/That repository isn't public yet/)).toBeVisible();
  await page.goto("/");
  await page.getByRole("navigation", { name: "Footer" }).getByRole("link", { name: "Source code" }).click();
  await expect(page).toHaveURL(/\/developers\/#source$/);
  await expect(page.getByRole("heading", { name: "Source code" })).toBeInViewport();
  await expect(page.locator("#source")).toContainText("isn't public yet");
});

for (const width of [320, 375, 767, 768, 1024, 1440, 2560]) {
  test(`pages fit a ${width}px viewport without overlapping controls`, async ({ page }, testInfo) => {
    test.setTimeout(width <= 375 ? 180_000 : 60_000);
    await page.setViewportSize({ width, height: 900 });
    for (const path of width === 320 ? [...pages, "/404.html"] : representative) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(dimensions.content, path).toBeLessThanOrEqual(dimensions.viewport);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await overlaps(page), path).toEqual([]);
      for (const table of await page.locator(".docs-table").all()) {
        if (await table.evaluate((element) => element.scrollWidth > element.clientWidth)) {
          await expect(table).toHaveAttribute("tabindex", "0");
        }
      }
      if (path === "/" && width === 375) {
        for (const name of ["Terminal", "SDK", "Desktop"]) {
          await page.getByRole("tab", { name, exact: true }).click();
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        }
        await page.screenshot({ path: testInfo.outputPath("moguri-home-mobile.png"), fullPage: true, animations: "disabled" });
      }
    }
  });
}

test("all content and navigation remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4187/");
    await expect(page.locator(".interface-tabs")).toBeHidden();
    await expect(page.locator(".interface-panel")).toHaveCount(3);
    for (const panel of await page.locator(".interface-panel").all()) await expect(panel).toBeVisible();
    await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "User guide", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moguri user guide");
    await page.locator("details.docs-menu > summary").click();
    await page.getByRole("navigation", { name: "User guide" }).getByRole("link", { name: "Settings reference" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Settings reference");
  } finally {
    await context.close();
  }
});

test("reduced motion removes arrival animation and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.locator(".hero-shot").evaluate((shot) => ({
    animation: getComputedStyle(shot).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(motion).toEqual({ animation: "none", scroll: "auto" });
});

test("hero arrival never fades the screenshot", async ({ page }) => {
  await page.goto("/");
  const opacities = await page.locator(".hero-shot").evaluate((shot) => {
    const animation = shot.getAnimations()[0];
    if (!animation) throw new Error("The hero arrival animation is missing.");
    animation.pause();
    return [0, 300, 600].map((time) => {
      animation.currentTime = time;
      return getComputedStyle(shot).opacity;
    });
  });
  expect(opacities).toEqual(["1", "1", "1"]);
});

for (const path of [...pages, "/404.html"]) {
  test(`${path} meets automated WCAG AA checks`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const audit = () => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect((await audit()).violations).toEqual([]);
    if (path === "/") {
      for (const name of ["Terminal", "SDK"]) {
        await page.getByRole("tab", { name, exact: true }).click();
        expect((await audit()).violations).toEqual([]);
      }
    }
  });
}

test("small-screen layouts meet automated WCAG AA checks", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const path of ["/", "/download/", "/docs/", "/docs/settings/general.html", "/developers/"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(violations, path).toEqual([]);
  }
});

test("the preview serves correct errors and never publishes source files", async ({ request }) => {
  const home = await request.head("/");
  expect(home.status()).toBe(200);
  expect(await home.body()).toHaveLength(0);
  expect(home.headers()["content-type"]).toContain("text/html");
  const directory = await request.get("/docs?topic=models", { maxRedirects: 0 });
  expect(directory.status()).toBe(301);
  expect(directory.headers().location).toBe("/docs/?topic=models");
  for (const path of ["/not-a-page", "/missing/nested/page", "/package.json", "/README.md", "/docs/development.md", "/docs/layout.html", "/docs/usage/getting-started.md", "/vendor/moguri/SOURCE.json", "/vendor/moguri/docs/installation.md", "/data/releases.json", "/scripts/catalogue.mjs", "/.git/config", "/tests/site.test.mjs", "/%2e%2e%2fpackage.json"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(await response.text()).toContain("<h1>Page not found</h1>");
  }
  expect((await request.get("/%E0%A4%A")).status()).toBe(400);
  expect((await request.get("/%00")).status()).toBe(400);
  const unsupported = await request.post("/");
  expect(unsupported.status()).toBe(405);
  expect(unsupported.headers().allow).toBe("GET, HEAD");
});

test("real app screenshots load responsively and open at full size", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const links = page.locator(".screenshot-link");
  await expect(links).toHaveCount(8);
  const hero = page.locator(".hero-shot img");
  await expect.poll(() => hero.evaluate((image) => image.currentSrc)).toContain("moguri-conversation-narrow.png");
  for (const link of await links.all()) {
    const image = link.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("alt", /.{60,}/);
    await expect(image).toHaveAttribute("width", "1280");
    await expect(image).toHaveAttribute("height", "800");
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
    await link.focus();
    await expect(link).toBeFocused();
    const response = await page.request.get(await link.getAttribute("href"));
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const bytes = await response.body();
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1280, 800]);
  }
  await page.locator(".showcase .screenshot-link").first().press("Enter");
  await expect(page).toHaveURL(/\/assets\/screenshots\/moguri-autonomy\.png$/);
});
