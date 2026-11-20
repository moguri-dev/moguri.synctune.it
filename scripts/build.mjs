import { cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalPages, guidePages, templatePages as templates } from "./catalogue.mjs";
import { checkLocalLinks } from "./links.mjs";
import { escapeHtml, renderMarkdown, routeHref } from "./markdown.mjs";
import { canonicalUrl, cards, docsNavigation, fill, renderDownloads, renderSitemap, rootFor, screenshotFigure, siteFooter, siteHeader } from "./site.mjs";
import { readVendor } from "./vendor.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const copied = ["styles.css", "app.js", "CNAME", ".nojekyll", "robots.txt"];
const read = (path) => readFile(join(root, path), "utf8");
let staging;
let previous;

function markdownPages() {
  const all = [...guidePages, ...canonicalPages];
  const routes = new Map([...templates.map((route) => [route, route]), ...all.map((page) => [page.source, page.route])]);
  return Promise.all(all.map(async (page) => {
    const canonical = page.source.startsWith("vendor/");
    const rendered = renderMarkdown(await read(page.source), {
      path: page.source,
      route: page.route,
      routes,
      upstreamRoot: canonical ? "vendor/moguri/" : null,
      fallbackTitle: page.title,
    });
    if (!canonical && rendered.title !== page.title) throw new Error(`${page.source} needs the top-level title "${page.title}".`);
    return { ...page, canonical, ...rendered, navTitle: page.title ?? rendered.title };
  }));
}

function sourceNote(page, record) {
  if (!page.canonical) {
    const [route, name] = page.section === "user" ? ["docs/settings/index.html", "Settings reference"] : ["developers/sdk-reference.html", "SDK and CLI reference"];
    return `<div class="docs-source"><p>A task guide written for this website. Where it summarizes a setting or an API, the <a href="${routeHref(page.route, route)}">${name}</a> is authoritative.</p></div>`;
  }
  const notice = page.notice ? `<p class="docs-notice"><strong>Not a feature list.</strong> ${escapeHtml(page.notice)}</p>` : "";
  const hidden = page.privateLinks > 0 ? " That repository isn't public yet, so references to files that only exist there appear as plain text with a dotted underline." : "";
  return `<div class="docs-source">${notice}<p>Published unchanged from <code>${escapeHtml(page.upstream)}</code> in Moguri's source repository at commit <code>${record.commit.slice(0, 7)}</code> (${escapeHtml(record.version)}).${hidden}</p></div>`;
}

try {
  const record = await readVendor(root);
  const releases = JSON.parse(await read("data/releases.json"));
  const layout = await read("docs/layout.html");
  const pages = await markdownPages();
  const titles = new Map(pages.map((page) => [page.route, page.navTitle]));
  const shared = (route) => {
    const base = route === "404.html" ? "/" : rootFor(route);
    return {
      ROOT: base,
      HEADER: siteHeader(base, route),
      FOOTER: siteFooter(base),
      VERSION: escapeHtml(record.version),
      COMMIT: record.commit.slice(0, 7),
      CANONICAL: canonicalUrl(route),
      NAVIGATION: docsNavigation({ route, titles }),
      CARDS: (argument) => cards(route, titles, ...argument.split(":")),
      SCREENSHOT: (argument) => screenshotFigure(argument.split(":")[0], { root: base, record, version: record.version, eager: argument.endsWith(":eager") }),
      DOWNLOADS: renderDownloads(releases),
    };
  };

  staging = await mkdtemp(join(root, ".dist-build-"));
  await Promise.all(copied.map((file) => cp(join(root, file), join(staging, file))));
  await cp(join(root, "assets"), join(staging, "assets"), { recursive: true });
  const write = async (route, html) => {
    await mkdir(dirname(join(staging, route)), { recursive: true });
    await writeFile(join(staging, route), html);
  };
  for (const route of templates) await write(route, fill(await read(route), shared(route), route));
  for (const page of pages) {
    const [home, name] = page.section === "user" ? ["docs/index.html", "user guide"] : ["developers/index.html", "developer docs"];
    await write(page.route, fill(layout, {
      ...shared(page.route),
      TITLE: `${escapeHtml(page.title)} | Moguri ${name}`,
      DESCRIPTION: escapeHtml(page.description),
      NAVIGATION: docsNavigation({ route: page.route, titles, headings: page.headings }),
      STATUS: `macOS alpha, ${escapeHtml(record.version)}`,
      HEADING: escapeHtml(page.title),
      SOURCE: sourceNote(page, record),
      CONTENT: page.content,
      SECTION_HOME: routeHref(page.route, home),
      SECTION_NAME: name,
    }, page.route));
  }
  const routes = [...templates.filter((route) => route !== "404.html"), ...pages.map((page) => page.route)];
  await writeFile(join(staging, "sitemap.xml"), renderSitemap(routes));
  const { problems } = await checkLocalLinks(staging, [...routes, "404.html"]);
  if (problems.length) throw new Error(`Broken local links:\n${problems.join("\n")}`);

  const backup = join(root, `.dist-old-${randomUUID()}`);
  try {
    await rename(output, backup);
    previous = backup;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    await rename(staging, output);
    staging = undefined;
  } catch (error) {
    if (previous) {
      try {
        await rename(previous, output);
        previous = undefined;
      } catch (restoreError) {
        throw new AggregateError([error, restoreError], `Build publication failed. The previous website is preserved at ${previous}.`);
      }
    }
    throw error;
  }
  if (previous) await rm(previous, { recursive: true });
  console.log(`Built ${routes.length} pages in dist/ from Moguri ${record.version} (${record.commit.slice(0, 7)}).`);
} catch (error) {
  console.error("Website build failed:", error.message ?? error);
  process.exitCode = 1;
} finally {
  if (staging) await rm(staging, { recursive: true, force: true });
}
