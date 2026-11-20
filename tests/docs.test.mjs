import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { Lexer } from "marked";
import { guidePages, releaseAssets } from "../scripts/catalogue.mjs";
import { createSlugger, renderMarkdown, routeHref } from "../scripts/markdown.mjs";
import { fill, renderDownloads, renderSitemap } from "../scripts/site.mjs";

const routes = new Map([
  ["docs/usage/getting-started.md", "docs/getting-started.html"],
  ["docs/usage/models.md", "docs/models.html"],
  ["vendor/moguri/docs/installation.md", "docs/installation.html"],
  ["vendor/moguri/docs/settings/README.md", "docs/settings/index.html"],
  ["vendor/moguri/docs/settings/general.md", "docs/settings/general.html"],
  ["download/index.html", "download/index.html"],
]);
const guide = (source) => renderMarkdown(source, { path: "docs/usage/getting-started.md", route: "docs/getting-started.html", routes });
const upstream = (source, fallbackTitle = null) => renderMarkdown(source, {
  path: "vendor/moguri/docs/settings/general.md", route: "docs/settings/general.html", routes, upstreamRoot: "vendor/moguri/", fallbackTitle,
});

test("heading anchors match GitHub's, including duplicates and punctuation", () => {
  const slug = createSlugger();
  assert.deepEqual(["Install", "Install", "Ctrl+L / Ctrl+M", "`MOGURI_STATE_DIR` setup", "Install"].map(slug), [
    "install", "install-1", "ctrll--ctrlm", "moguri_state_dir-setup", "install-2",
  ]);
  const { title, content, headings } = guide("# Getting started\n\n## Install\n\nText.\n\n## Install\n\n### Notes");
  assert.equal(title, "Getting started");
  assert.ok(content.includes('<h2 id="install">') && content.includes('<h2 id="install-1">') && content.includes('<h3 id="notes">'));
  assert.deepEqual(headings.map((heading) => heading.id), ["install", "install-1"]);
});

test("links resolve to published routes from both guides and synced documents", () => {
  const { content } = guide("# Getting started\n\n[Models](models.md#choose-a-model) [Install](../../vendor/moguri/docs/installation.md#first-use) [Download](../../download/index.html) [Top](#install)");
  assert.ok(content.includes('href="models.html#choose-a-model"'));
  assert.ok(content.includes('href="installation.html#first-use"'));
  assert.ok(content.includes('href="../download/"'));
  assert.ok(content.includes('href="#install"'));
  const synced = upstream("# General\n\n[Settings](README.md) [Install](../installation.md#upgrade) [Mail](mailto:demo@example.test)").content;
  assert.ok(synced.includes('href="./"'));
  assert.ok(synced.includes('href="../installation.html#upgrade"'));
  assert.ok(synced.includes('href="mailto:demo@example.test"'));
  assert.equal(routeHref("docs/settings/general.html", "index.html", "#features"), "../../#features");
});

test("references to private repositories and unpublished files become marked plain text", () => {
  const { content, privateLinks } = upstream([
    "# General",
    "[setup guide](../setup.md#claude-agent) [issue](https://github.com/mbianchidev/moguri/issues/39)",
    "[clone](https://github.com/mbianchidev/moguri.git) [agents](../../AGENTS.md)",
    "[SendBox](https://github.com/mbianchidev/sendbox)",
  ].join("\n\n"));
  assert.equal(privateLinks, 4);
  assert.doesNotMatch(content, /href="[^"]*(?:setup\.md|mbianchidev\/moguri|AGENTS)/);
  assert.equal([...content.matchAll(/\(not public yet\)/g)].length, 4);
  assert.ok(content.includes('href="https://github.com/mbianchidev/sendbox"'));
});

test("site guides fail on links to unpublished files or unsafe protocols", () => {
  assert.throws(() => guide("# Getting started\n\n[Missing](unknown.md)"), /unpublished/);
  assert.throws(() => guide("# Getting started\n\n[Setup](../../vendor/moguri/docs/setup.md)"), /unpublished/);
  assert.throws(() => guide("# Getting started\n\n[Unsafe](javascript:alert(1))"), /protocol/);
  assert.throws(() => guide("# Getting started\n\n[Plain](http://example.test/)"), /protocol/);
});

test("code and raw HTML stay text, except GitHub-style anchors", () => {
  const { content } = upstream('# General\n\n<a id="legacy-anchor"></a>\n\nUse <version> and <script>alert(1)</script>.\n\n```js\nconst sample = "<script>demo</script> $&";\n```');
  assert.ok(content.includes('<a id="legacy-anchor"></a>'));
  assert.ok(content.includes("&lt;version&gt;"));
  assert.ok(content.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(content.includes("&lt;script&gt;demo&lt;/script&gt; $&amp;"));
  assert.doesNotMatch(content, /<script>/);
});

test("task-list checkboxes have accessible names", () => {
  const { content } = upstream("# General\n\n- [x] Shipped\n- [ ] Pending");
  assert.ok(content.includes('<input type="checkbox" disabled checked aria-label="Done">'));
  assert.ok(content.includes('<input type="checkbox" disabled aria-label="Not done">'));
});

test("titles, images and template markers fail explicitly", () => {
  assert.equal(upstream("MIT License\n\nText.", "MIT License").title, "MIT License");
  assert.throws(() => upstream("No title."), /title/);
  assert.throws(() => guide("# One\n\n# Two"), /more than one/);
  assert.throws(() => guide("# Getting started\n\n![Shot](shot.png)"), /image/);
  assert.equal(fill("{{A}} {{B:x}}", { A: "a", B: (value) => value.toUpperCase() }, "page"), "a X");
  assert.throws(() => fill("{{MISSING}}", {}, "page.html"), /page\.html.*MISSING/);
});

test("downloads render only real assets of a published release in a public repository", () => {
  const empty = renderDownloads({ repository: "example/moguri", releases: [] });
  assert.match(empty, /No public release yet/);
  assert.doesNotMatch(empty, /releases\/download/);
  const release = { version: "1.2.0-alpha.1", date: "2027-01-15", prerelease: true };
  const html = renderDownloads({ repository: "example/moguri", releases: [release] });
  const links = [...html.matchAll(/href="([^"]+\/releases\/download\/[^"]+)"/g)].map((match) => match[1]);
  const expected = releaseAssets(release.version).map((asset) => `https://github.com/example/moguri/releases/download/v1.2.0-alpha.1/${asset.file}`);
  assert.deepEqual([...new Set(links)].sort(), expected.sort());
  assert.match(html, /This is a prerelease/);
  assert.throws(() => renderDownloads({ repository: "mbianchidev/moguri", releases: [release] }), /private/);
  assert.throws(() => renderDownloads({ repository: "MBianchiDev/Moguri", releases: [release] }), /private/);
  assert.throws(() => renderDownloads({ repository: "example/moguri", releases: [{ ...release, version: "1.2" }] }), /SemVer/);
  assert.throws(() => renderDownloads({ repository: "example/moguri", releases: [{ ...release, version: "1.2.0+build" }] }), /SemVer/);
  assert.throws(() => renderDownloads({ repository: "example/moguri", releases: [{ ...release, prerelease: false }] }), /prerelease/);
  assert.throws(() => renderDownloads({ repository: "example/moguri", releases: [{ ...release, date: "soon" }] }), /date/);
  assert.throws(() => renderDownloads({ releases: [] }), /repository/);
});

test("the sitemap lists directory URLs for index pages", () => {
  const sitemap = renderSitemap(["index.html", "docs/index.html", "docs/models.html"]);
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/</loc>"));
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/docs/</loc>"));
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/docs/models.html</loc>"));
});

for (const page of guidePages) {
  test(`${page.slug} code examples have valid shell, JavaScript and JSON syntax`, async () => {
    const source = await readFile(new URL(`../${page.source}`, import.meta.url), "utf8");
    for (const token of Lexer.lex(source)) {
      if (token.type !== "code") continue;
      try {
        if (token.lang === "json") JSON.parse(token.text);
        else if (["sh", "bash"].includes(token.lang)) {
          execFileSync("bash", ["-n"], { input: token.text, stdio: ["pipe", "pipe", "pipe"] });
        } else if (["js", "javascript"].includes(token.lang)) {
          execFileSync(process.execPath, ["--check", "--input-type=module"], { input: token.text, stdio: ["pipe", "pipe", "pipe"] });
        }
      } catch (error) {
        assert.fail(`${page.slug} has an invalid ${token.lang} example: ${error.message}`);
      }
    }
  });
}
