import { cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { guidePages, renderUsageIndex, renderUsagePage, renderSitemap } from "./docs.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const pages = [
  "index.html",
  "404.html",
  "styles.css",
  "app.js",
  "CNAME",
  ".nojekyll",
  "robots.txt",
];
let staging;
let previous;

try {
  const layout = await readFile(join(root, "docs/layout.html"), "utf8");
  const overview = renderUsageIndex(await readFile(join(root, "docs/index.html"), "utf8"));
  const guides = await Promise.all(guidePages.map(async (page) => ({
    file: `docs/${page.slug}.html`,
    html: renderUsagePage({ page, layout, source: await readFile(join(root, `docs/usage/${page.slug}.md`), "utf8") }),
  })));
  staging = await mkdtemp(join(root, ".dist-build-"));
  await mkdir(join(staging, "docs"));
  await Promise.all(pages.map((page) => cp(join(root, page), join(staging, page))));
  await cp(join(root, "assets"), join(staging, "assets"), { recursive: true });
  await writeFile(join(staging, "docs/index.html"), overview);
  await writeFile(join(staging, "sitemap.xml"), renderSitemap());
  await Promise.all(guides.map((guide) => writeFile(join(staging, guide.file), guide.html)));
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
  console.log("Built the static website in dist/.");
} catch (error) {
  console.error("Website build failed:", error);
  process.exitCode = 1;
} finally {
  if (staging) await rm(staging, { recursive: true, force: true });
}
