import { access, readFile } from "node:fs/promises";
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

// Checks that local links, assets and anchors in the built pages exist. Returns external URLs.
export async function checkLocalLinks(directory, pages) {
  const problems = [];
  const externals = new Map();
  const cache = new Map();
  const page = async (path) => {
    if (!cache.has(path)) cache.set(path, readFile(join(directory, path), "utf8"));
    return cache.get(path);
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
      let target = decodeURIComponent(url.pathname).slice(1);
      if (!target || target.endsWith("/")) target += "index.html";
      try {
        await access(join(directory, target));
      } catch {
        problems.push(`${path}: missing ${reference}`);
        continue;
      }
      if (url.hash && target.endsWith(".html") && !ids(await page(target)).has(decodeURIComponent(url.hash.slice(1)))) {
        problems.push(`${path}: missing anchor ${reference}`);
      }
    }
  }
  return { problems, externals };
}
