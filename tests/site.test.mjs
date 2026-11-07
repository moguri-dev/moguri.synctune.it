import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { guidePages } from "../scripts/docs.mjs";

const sourceRoot = new URL("../", import.meta.url);
const root = new URL("../dist/", import.meta.url);
const origin = "https://moguri.synctune.it/";
const pages = ["index.html", "docs/index.html", ...guidePages.map((page) => `docs/${page.slug}.html`), "404.html"];
const read = (path) => readFile(new URL(path, root), "utf8");

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
    assert.match(html, /<link rel="icon"[^>]+href="/);
    assert.doesNotMatch(html, /https:\/\/github\.com\/mbianchidev\/moguri/);
    assert.doesNotMatch(html, /\b(?:TODO|lorem ipsum)\b/i);

    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page} has duplicate IDs`);
    for (const match of html.matchAll(/\baria-(?:labelledby|describedby|controls)="([^"]+)"/g)) {
      for (const id of match[1].split(/\s+/)) {
        assert.ok(ids.includes(id), `${page} has a missing ARIA target: ${id}`);
      }
    }
  });

  test(`${page} has no broken local links or assets`, async () => {
    const html = await read(page);
    const references = [
      ...[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
      ...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((match) => match[1].split(",").map((entry) => entry.trim().split(/\s+/)[0])),
    ];
    for (const reference of references) {
      const url = new URL(reference, new URL(page, origin));
      if (url.origin !== new URL(origin).origin) {
        assert.equal(url.protocol, "https:", `Insecure external reference: ${reference}`);
        continue;
      }
      let path = decodeURIComponent(url.pathname).slice(1);
      if (!path || path.endsWith("/")) path += "index.html";
      await access(new URL(path, root));
      if (url.hash) {
        const target = await read(path);
        assert.ok(target.includes(`id="${url.hash.slice(1)}"`), `Missing anchor: ${reference}`);
      }
    }
  });
}

test("the homepage and all docs make development status explicit", async () => {
  for (const page of pages.filter((page) => page !== "404.html")) {
    assert.match(await read(page), /[Ii]n development/);
  }
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
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/</loc>"));
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/docs/</loc>"));
  for (const page of pages.filter((page) => page !== "404.html")) {
    const canonical = page === "index.html" ? origin : page === "docs/index.html" ? `${origin}docs/` : `${origin}${page}`;
    assert.ok((await read(page)).includes(`<link rel="canonical" href="${canonical}">`));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  }
});

test("the build excludes source, maintenance docs, and dependencies", async () => {
  const output = root;
  assert.deepEqual((await readdir(output)).sort(), [
    ".nojekyll", "404.html", "CNAME", "app.js", "assets", "docs",
    "index.html", "robots.txt", "sitemap.xml", "styles.css",
  ]);
  assert.deepEqual((await readdir(new URL("docs/", output))).sort(), ["index.html", ...guidePages.map((page) => `${page.slug}.html`)].sort());
  for (const path of ["package.json", "README.md", "node_modules", ".git", "tests", "docs/development.md", "docs/layout.html", "docs/usage", "scripts"]) {
    await assert.rejects(access(new URL(path, output)), { code: "ENOENT" });
  }
  for (const path of ["index.html", "404.html", "styles.css", "app.js", "CNAME", "assets/mascot.svg"]) {
    assert.deepEqual(await readFile(new URL(path, output)), await readFile(new URL(path, sourceRoot)));
  }
});
