import { posix } from "node:path";
import { Marked, Renderer } from "marked";
import { isPrivateRepository } from "./catalogue.mjs";

export const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const decodeHtml = (html) => html.replace(/<[^>]*>/g, "").replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({
  amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'",
})[entity]);

// Matches github-slugger, so anchors written for GitHub keep working on the website.
export function createSlugger() {
  const occurrences = new Map();
  return (text) => {
    const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-");
    let slug = base;
    while (occurrences.has(slug)) {
      occurrences.set(base, occurrences.get(base) + 1);
      slug = `${base}-${occurrences.get(base)}`;
    }
    occurrences.set(slug, 0);
    return slug;
  };
}

// A relative URL from one published route to another. Index pages use their directory URL.
export function routeHref(fromRoute, toRoute, hash = "") {
  if (toRoute === fromRoute && hash) return hash;
  const fromDirectory = posix.dirname(fromRoute);
  if (toRoute.endsWith("index.html")) {
    const relative = posix.relative(fromDirectory, posix.dirname(toRoute));
    return `${relative ? `${relative}/` : "./"}${hash}`;
  }
  return `${posix.relative(fromDirectory, toRoute)}${hash}`;
}

function isPrivateGitHub(url) {
  if (url.hostname !== "github.com") return false;
  const [owner, name] = url.pathname.split("/").filter(Boolean);
  if (!owner || !name) return false;
  return isPrivateRepository(`${owner}/${name.replace(/\.git$/, "")}`);
}

const privateText = (text) => `<span class="doc-private" title="In Moguri's source repository, which isn't public yet">${text}<span class="visually-hidden"> (not public yet)</span></span>`;
const anchorHtml = /^(?:\s*<a id="[\w-]+"><\/a>\s*)+$/;

// Resolves a Markdown link from a repository file. Returns an href, or null for private sources.
function resolveLink(href, { path, route, routes, upstreamRoot }) {
  if (href.startsWith("#")) return href;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href)?.[1]?.toLowerCase();
  if (scheme) {
    if (scheme === "mailto") return href;
    if (scheme !== "https") throw new Error(`${path} has an unsupported link protocol: ${href}`);
    return isPrivateGitHub(new URL(href)) ? null : href;
  }
  const [target, hash = ""] = href.split(/(?=#)/);
  const file = posix.normalize(posix.join(posix.dirname(path), decodeURIComponent(target)));
  const destination = routes.get(file);
  if (destination) return routeHref(route, destination, hash);
  if (upstreamRoot && (file.startsWith(upstreamRoot) || file.startsWith("../") || file === "..")) return null;
  throw new Error(`${path} links to an unpublished file: ${href}`);
}

// Renders one Markdown document. `path` is its repository path; links resolve against it.
export function renderMarkdown(source, { path, route, routes, upstreamRoot = null, fallbackTitle = null }) {
  const headings = [];
  const slug = createSlugger();
  let title = null;
  let privateLinks = 0;
  const markdown = new Marked({
    gfm: true,
    renderer: {
      heading(token) {
        const html = this.parser.parseInline(token.tokens);
        if (token.depth === 1) {
          if (title !== null) throw new Error(`${path} has more than one top-level title.`);
          title = decodeHtml(html);
          return "";
        }
        const text = decodeHtml(html);
        const id = slug(text);
        if (!id) throw new Error(`${path} has an empty heading.`);
        if (token.depth === 2) headings.push({ id, html });
        return `<h${token.depth} id="${id}">${html}</h${token.depth}>\n`;
      },
      link(token) {
        const href = resolveLink(token.href, { path, route, routes, upstreamRoot });
        const text = this.parser.parseInline(token.tokens);
        if (href === null) {
          privateLinks += 1;
          return privateText(text);
        }
        return Renderer.prototype.link.call(this, { ...token, href });
      },
      image(token) {
        throw new Error(`${path} embeds an image (${token.href}). Add screenshots through the page templates instead.`);
      },
      html(token) {
        const raw = token.raw ?? token.text;
        if (anchorHtml.test(raw) || /^<a id="[\w-]+">$|^<\/a>$/.test(raw.trim())) return raw;
        return escapeHtml(raw);
      },
      checkbox(token) {
        return `<input type="checkbox" disabled${token.checked ? " checked" : ""} aria-label="${token.checked ? "Done" : "Not done"}"> `;
      },
      table(token) {
        return `<div class="docs-table">${Renderer.prototype.table.call(this, token)}</div>`;
      },
    },
  });
  const content = markdown.parse(source, { async: false });
  if (typeof content !== "string") throw new Error(`${path} could not be rendered.`);
  if (title === null) {
    if (!fallbackTitle) throw new Error(`${path} is missing its top-level title.`);
    title = fallbackTitle;
  }
  return { title, content, headings, privateLinks };
}
