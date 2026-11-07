import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { Lexer } from "marked";
import { guidePages, renderUsagePage, renderUsageIndex, renderSitemap } from "../scripts/docs.mjs";

const layout = `<!doctype html><html lang="en"><head>
<title>{{TITLE}}</title><meta name="description" content="{{DESCRIPTION}}">
<link rel="canonical" href="{{CANONICAL}}"></head><body>
<aside>{{NAVIGATION}}</aside><main><h1>{{HEADING}}</h1>
<div class="docs-content">{{CONTENT}}</div></main></body></html>`;
const page = { slug: "getting-started", title: "Getting started", description: "Install and open Moguri." };

test("usage pages share navigation and keep one page heading", () => {
  const html = renderUsagePage({
    page,
    layout,
    source: "# Getting started\n\n## Install\n\nRead the source instructions.\n\n## Install\n\nCheck the result.",
  });
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  assert.ok(html.includes('id="install"'));
  assert.ok(html.includes('id="install-2"'));
  assert.ok(html.includes('aria-current="page"'));
  assert.ok(html.includes('href="#install"'));
  assert.ok(html.includes('href="#install-2"'));
  for (const guide of guidePages) assert.ok(html.includes(`href="${guide.slug}.html"`));
  assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/);
});

test("Markdown links resolve to the matching published guides and anchors", () => {
  const html = renderUsagePage({
    page,
    layout,
    source: "# Getting started\n\n[Models](models.md#choose-a-model)\n\n[SDK](sdk.md)",
  });
  assert.ok(html.includes('href="models.html#choose-a-model"'));
  assert.ok(html.includes('href="sdk.html"'));
  assert.doesNotMatch(html, /href="[^"]+\.md/);
});

test("code examples remain text and preserve replacement characters", () => {
  const html = renderUsagePage({
    page,
    layout,
    source: '# Getting started\n\n```js\nconst sample = "<script>demo</script> $&";\n```',
  });
  assert.ok(html.includes("&lt;script&gt;demo&lt;/script&gt;"));
  assert.ok(html.includes("$&amp;"));
  assert.doesNotMatch(html, /<script>/);
});

test("metadata is escaped without changing the rendered guide body", () => {
  const custom = { ...page, title: 'Models & "budgets"', description: 'A <demo> & "example".' };
  const html = renderUsagePage({ page: custom, layout, source: '# Models & "budgets"\n\nRead the guide.' });
  assert.ok(html.includes("Models &amp; &quot;budgets&quot;"));
  assert.ok(html.includes('content="A &lt;demo&gt; &amp; &quot;example&quot;."'));
});

test("invalid titles, template markers, and guide links fail explicitly", () => {
  assert.throws(() => renderUsagePage({ page, layout, source: "# A different guide" }), /title/i);
  assert.throws(() => renderUsagePage({ page, layout, source: "# Getting started\n\n# Getting started" }), /heading|title/i);
  assert.throws(() => renderUsagePage({ page, layout: "<main>{{CONTENT}}</main>", source: "# Getting started" }), /template/i);
  assert.throws(() => renderUsagePage({ page, layout, source: "# Getting started\n\n[Missing](unknown.md)" }), /guide|link/i);
  assert.throws(() => renderUsagePage({ page, layout, source: "# Getting started\n\n[Unsafe](javascript:demo)" }), /link|protocol/i);
});

test("the overview and sitemap expose every published guide", () => {
  const index = renderUsageIndex("<main><!-- USAGE_GUIDES --></main>");
  const sitemap = renderSitemap();
  for (const guide of guidePages) {
    assert.ok(index.includes(`href="${guide.slug}.html"`));
    assert.ok(index.includes(guide.title));
    assert.ok(sitemap.includes(`<loc>https://moguri.synctune.it/docs/${guide.slug}.html</loc>`));
  }
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/</loc>"));
  assert.ok(sitemap.includes("<loc>https://moguri.synctune.it/docs/</loc>"));
  assert.throws(() => renderUsageIndex("<main>No guide list.</main>"), /marker/i);
});

for (const guide of guidePages) {
  test(`${guide.slug} code examples have valid shell, JavaScript, and JSON syntax`, async () => {
    const source = await readFile(new URL(`../docs/usage/${guide.slug}.md`, import.meta.url), "utf8");
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
        assert.fail(`${guide.slug} has an invalid ${token.lang} example: ${error.message}`);
      }
    }
  });
}
