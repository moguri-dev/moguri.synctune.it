import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { canonicalPages, guidePages, moguri, origin, templatePages } from "../scripts/catalogue.mjs";
import { checkLocalLinks } from "../scripts/links.mjs";

const root = new URL("../dist/", import.meta.url);
const pages = [...templatePages, ...guidePages.map((page) => page.route), ...canonicalPages.map((page) => page.route)];
const read = (path) => readFile(new URL(path, root), "utf8");
const canonicalOf = (page) => `${origin}/${page.replace(/index\.html$/, "")}`;

for (const page of pages) {
  test(`${page} has accessible page structure and metadata`, async () => {
    const html = await read(page);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1);
    assert.match(html, /href="#main"/);
    assert.match(html, /<main[^>]+id="main"[^>]+tabindex="-1"/);
    assert.match(html, /<nav class="site-nav" aria-label="Primary">/);
    assert.match(html, /<nav aria-label="Footer">/);
    assert.doesNotMatch(html, /\{\{[A-Z_]+(?::[^}]+)?\}\}/, `${page} has an unreplaced template marker`);
    if (!canonicalPages.some((entry) => entry.route === page)) {
      assert.doesNotMatch(html, /\b(?:TODO|lorem ipsum)\b/i);
      assert.doesNotMatch(html, /\u2014/, `${page} contains an em dash`);
    }
    for (const repository of moguri.privateRepositories) {
      const link = new RegExp(`href="https://github\\.com/${repository.replace(/[.]/g, "\\.")}(?:\\.git)?(?:[/#?"])`, "i");
      assert.doesNotMatch(html, link, `${page} links to private ${repository}`);
    }

    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page} has duplicate IDs`);
    for (const match of html.matchAll(/\baria-(?:labelledby|describedby|controls)="([^"]+)"/g)) {
      for (const id of match[1].split(/\s+/)) {
        assert.ok(ids.includes(id), `${page} has a missing ARIA target: ${id}`);
      }
    }
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /\balt="/, `${page} has an image without alt text`);
      assert.match(image[0], /\bwidth="\d+" height="\d+"/, `${page} has an image without dimensions`);
    }
  });
}

test("every local link, asset and anchor in the build exists", async () => {
  const { problems } = await checkLocalLinks(root.pathname, pages);
  assert.deepEqual(problems, []);
});

test("the link checker reports missing files and anchors", async () => {
  const fixture = new URL("fixtures/links/", import.meta.url);
  const { problems, externals } = await checkLocalLinks(fixture.pathname, ["index.html"]);
  assert.deepEqual(problems, ["index.html: missing anchor #nowhere", "index.html: missing other.html", "index.html: missing anchor page.html#gone", "index.html: insecure or unsupported URL http://example.test/"]);
  assert.deepEqual([...externals.keys()], ["https://example.test/ok"]);
});

test("every page states the alpha status and current version", async () => {
  const { version } = JSON.parse(await readFile(new URL("../vendor/moguri/SOURCE.json", import.meta.url), "utf8"));
  for (const page of pages.filter((page) => page !== "404.html")) {
    assert.ok((await read(page)).includes(`macOS alpha, ${version}`), `${page} doesn't state the alpha status`);
  }
});

test("pages published from Moguri name their source and commit", async () => {
  const { commit } = JSON.parse(await readFile(new URL("../vendor/moguri/SOURCE.json", import.meta.url), "utf8"));
  for (const page of canonicalPages) {
    const html = await read(page.route);
    assert.ok(html.includes(`Published unchanged from <code>${page.upstream}</code>`), page.route);
    assert.ok(html.includes(`<code>${commit.slice(0, 7)}</code>`), page.route);
  }
  for (const page of ["docs/vision.html", "developers/specification.html"]) {
    assert.match(await read(page), /<strong>Not a feature list\.<\/strong>/);
  }
});

test("the download page offers no artifacts until a public release exists", async () => {
  const html = await read("download/index.html");
  assert.doesNotMatch(html, /releases\/download\//);
  assert.match(html, /No public release yet/);
  assert.match(html, /shasum -a 256 --check --ignore-missing SHA256SUMS/);
  assert.match(html, /System Settings &gt; Privacy &amp; Security/);
  assert.match(html, /<strong>Open Anyway<\/strong>/);
  assert.match(html, /href="https:\/\/support\.apple\.com\/en-us\/102445"/);
  assert.match(html, /macOS on Apple silicon \(arm64\)/);
});

test("all website fonts are local and retain their license notices", async () => {
  const css = await read("styles.css");
  assert.doesNotMatch(css, /@import|https?:\/\//);
  for (const match of css.matchAll(/url\("([^"]+)"\)/g)) {
    await access(new URL(match[1], root));
  }
  for (const family of ["Outfit", "WorkSans", "GeistMono"]) {
    const license = await read(`assets/fonts/licenses/${family}-OFL.txt`);
    assert.match(license, /SIL OPEN FONT LICENSE/);
  }
});

test("website code makes no third-party network or tracking requests", async () => {
  const js = await read("app.js");
  assert.doesNotMatch(js, /\b(?:fetch|XMLHttpRequest|WebSocket)\b|document\.cookie|localStorage/);
  for (const page of pages) {
    const html = await read(page);
    assert.doesNotMatch(html, /<(?:script|iframe)[^>]+src="https?:/);
    assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"[^>]+href="https?:/);
  }
});

test("the sitemap and custom domain use the canonical website", async () => {
  assert.equal((await read("CNAME")).trim(), "moguri.synctune.it");
  assert.match(await read("robots.txt"), /Sitemap: https:\/\/moguri\.synctune\.it\/sitemap\.xml/);
  const sitemap = await read("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const published = pages.filter((page) => page !== "404.html");
  assert.deepEqual(locations.sort(), published.map(canonicalOf).sort());
  for (const page of published) {
    assert.ok((await read(page)).includes(`<link rel="canonical" href="${canonicalOf(page)}">`), page);
  }
});

test("the build excludes source, synced Markdown, data and dependencies", async () => {
  assert.deepEqual((await readdir(root)).sort(), [
    ".nojekyll", "404.html", "CNAME", "app.js", "assets", "developers", "docs", "download",
    "index.html", "robots.txt", "sitemap.xml", "styles.css",
  ]);
  for (const path of ["package.json", "README.md", "node_modules", ".git", "tests", "data", "vendor", "scripts", "docs/development.md", "docs/layout.html", "docs/usage"]) {
    await assert.rejects(access(new URL(path, root)), { code: "ENOENT" });
  }
  for (const path of ["styles.css", "app.js", "CNAME", "assets/mascot.svg"]) {
    assert.deepEqual(await readFile(new URL(path, root)), await readFile(new URL(`../${path}`, import.meta.url)));
  }
});
