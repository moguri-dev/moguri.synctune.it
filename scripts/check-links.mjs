// Checks every local link in dist/ and requests every external URL, including download links.
// Run after `npm run build`. Needs network access, so it isn't part of `npm test`.
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { checkLocalLinks } from "./links.mjs";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const timeout = 20_000;

async function pages(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".html")).map((entry) => relative(root, join(entry.parentPath, entry.name)));
}

async function status(url) {
  for (const method of ["HEAD", "GET"]) {
    const response = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(timeout), headers: { "User-Agent": "moguri-website-link-check" } });
    await response.body?.cancel();
    if (method === "HEAD" && [403, 405, 501].includes(response.status)) continue;
    return response.status;
  }
}

try {
  const { problems, externals } = await checkLocalLinks(root, await pages(root));
  const urls = [...externals.keys()];
  const results = [];
  for (let index = 0; index < urls.length; index += 6) {
    results.push(...await Promise.all(urls.slice(index, index + 6).map(async (url) => {
      try {
        return { url, status: await status(url) };
      } catch (error) {
        return { url, status: 0, error: error.cause?.code ?? error.name };
      }
    })));
  }
  for (const { url, status: code, error } of results) {
    if (code >= 200 && code < 400) continue;
    problems.push(`${url} returned ${code || error} (linked from ${externals.get(url).slice(0, 3).join(", ")})`);
  }
  console.log(`Checked local links and ${urls.length} external URLs.`);
  if (problems.length) {
    console.error(`Link check failed:\n${problems.join("\n")}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error("Link check failed:", error.code === "ENOENT" ? "dist/ is missing. Run npm run build first." : error);
  process.exitCode = 1;
}
