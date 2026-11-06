import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
  "sitemap.xml",
  "docs/index.html",
];

try {
  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, "docs"), { recursive: true });
  await Promise.all(pages.map((page) => cp(join(root, page), join(output, page))));
  await cp(join(root, "assets"), join(output, "assets"), { recursive: true });
  console.log("Built the static website in dist/.");
} catch (error) {
  console.error("Website build failed:", error);
  process.exitCode = 1;
}
