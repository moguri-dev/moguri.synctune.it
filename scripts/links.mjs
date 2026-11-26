import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { origin } from "./catalogue.mjs";

// Every href, src and srcset URL in a page, decoded from HTML attribute encoding.
export function references(html) {
  const decode = (value) => value.replace(/&amp;/g, "&");
  return [
    ...[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => decode(match[1])),
    ...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((match) => match[1].split(",").map((entry) => decode(entry.trim().split(/\s+/)[0]))),
  ];
}

export const ids = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));

// The clean URL for a link written with ".html": "page.html#x" becomes "page#x", "dir/index.html" becomes "dir/".
const cleanUrl = (reference) => {
  const [, path, rest] = /^([^?#]*)(.*)$/.exec(reference);
  const clean = path.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  return `${clean || "./"}${rest}`;
};

// Checks that local links, assets and anchors in the built pages exist. Returns external URLs.
// Page links follow GitHub Pages' clean URLs: "/page" serves page.html and "/dir/" serves dir/index.html.
export async function checkLocalLinks(directory, pages) {
  const problems = [];
  const externals = new Map();
  const cache = new Map();
  const page = async (path) => {
    if (!cache.has(path)) cache.set(path, readFile(join(directory, path), "utf8"));
    return cache.get(path);
  };
  const isFile = async (path) => {
    try {
      return (await stat(join(directory, path))).isFile();
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "ENOTDIR") return false;
      throw error;
    }
  };
  // Returns the file a URL path serves, or a problem describing why it doesn't serve one.
  const resolve = async (target, reference) => {
    if (target.endsWith(".html")) return { problem: `links to ${reference} with ".html"; use the clean URL ${cleanUrl(reference)}` };
    if (!target || target.endsWith("/")) return await isFile(`${target}index.html`) ? { file: `${target}index.html` } : { problem: `missing ${reference}` };
    if (await isFile(target)) return { file: target };
    if (await isFile(`${target}.html`)) return { file: `${target}.html` };
    if (await isFile(`${target}/index.html`)) return { problem: `links to directory ${reference} without a trailing slash; add "/" because GitHub Pages redirects it` };
    return { problem: `missing ${reference}` };
  };
  for (const path of pages) {
    for (const reference of references(await page(path))) {
      if (reference.startsWith("#")) {
        if (!ids(await page(path)).has(decodeURIComponent(reference.slice(1)))) problems.push(`${path}: missing anchor ${reference}`);
        continue;
      }
      const base = path === "404.html" ? `${origin}/missing/page` : `${origin}/${path}`;
      const url = new URL(reference, base);
      if (url.origin !== origin) {
        if (url.protocol === "mailto:") continue;
        if (url.protocol !== "https:") problems.push(`${path}: insecure or unsupported URL ${reference}`);
        else externals.set(url.href, [...(externals.get(url.href) ?? []), path]);
        continue;
      }
      const { file: target, problem } = await resolve(decodeURIComponent(url.pathname).slice(1), reference);
      if (problem) {
        problems.push(`${path}: ${problem}`);
        continue;
      }
      if (url.hash && target.endsWith(".html") && !ids(await page(target)).has(decodeURIComponent(url.hash.slice(1)))) {
        problems.push(`${path}: missing anchor ${reference}`);
      }
    }
  }
  return { problems, externals };
}
