import { Marked, Renderer } from "marked";

export const guidePages = [
  { slug: "getting-started", title: "Getting started", description: "Install a development build, connect a model, and start your first session." },
  { slug: "sessions", title: "Projects and sessions", description: "Manage repositories, worktrees, profiles, prompts, attachments, and saved work." },
  { slug: "models", title: "Models and budgets", description: "Configure providers, local models, context windows, Kupo, and usage limits." },
  { slug: "execution", title: "Permissions and execution", description: "Review tool access and configure Local, SSH, and managed Sandbox execution." },
  { slug: "tools", title: "Tools and integrations", description: "Use GitHub, Linear, MCP, memory, skills, dictation, and dependency caching." },
  { slug: "cli", title: "CLI and shortcuts", description: "Look up command syntax, global options, slash commands, and keyboard controls." },
  { slug: "sdk", title: "SDK usage", description: "Install the SDK, connect a client, select a profile, and handle jobs and errors." },
  { slug: "troubleshooting", title: "Troubleshooting", description: "Diagnose startup, authentication, model, workspace, and interrupted-work errors." },
];

const origin = "https://moguri.synctune.it";
const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

function guideLinks(current, cards = false) {
  return guidePages.map((page) => {
    const selected = page.slug === current ? ' aria-current="page"' : "";
    const description = cards ? `<span>${escapeHtml(page.description)}</span>` : "";
    return `<a href="${page.slug}.html"${selected}>${cards ? "<strong>" : ""}${escapeHtml(page.title)}${cards ? "</strong>" : ""}${description}</a>`;
  }).join("\n");
}

function linkTarget(href) {
  const markdown = /^([a-z-]+)\.md(#[^]*)?$/.exec(href);
  if (markdown) {
    if (!guidePages.some((page) => page.slug === markdown[1])) {
      throw new Error(`Unknown documentation guide link: ${href}`);
    }
    return `${markdown[1]}.html${markdown[2] ?? ""}`;
  }
  const url = new URL(href, `${origin}/docs/`);
  if (url.protocol !== "https:") throw new Error(`Unsupported documentation link protocol: ${href}`);
  return href;
}

function markdownPage(source, page) {
  const headings = [];
  const ids = new Map();
  let titles = 0;
  const markdown = new Marked({
    gfm: true,
    renderer: {
      heading(token) {
        if (token.depth === 1) {
          if (++titles !== 1 || token.text !== page.title) {
            throw new Error(`The ${page.slug} guide needs one matching top-level title.`);
          }
          return "";
        }
        const slug = token.text.replace(/<[^>]*>|[`*_]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (!slug) throw new Error(`The ${page.slug} guide has an empty heading.`);
        const count = (ids.get(slug) ?? 0) + 1;
        ids.set(slug, count);
        const id = count === 1 ? slug : `${slug}-${count}`;
        const text = this.parser.parseInline(token.tokens);
        if (token.depth === 2) headings.push({ id, text });
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
      },
      link(token) {
        return Renderer.prototype.link.call(this, { ...token, href: linkTarget(token.href) });
      },
      table(token) {
        return `<div class="docs-table">${Renderer.prototype.table.call(this, token)}</div>`;
      },
    },
  });
  const content = markdown.parse(source, { async: false });
  if (titles !== 1 || typeof content !== "string") {
    throw new Error(`The ${page.slug} guide is missing its top-level title.`);
  }
  return { content, headings };
}

export function renderUsagePage({ source, page, layout }) {
  const { content, headings } = markdownPage(source, page);
  const navigation = `<details class="docs-guide-menu"><summary>Usage guides</summary>
<nav aria-label="Usage guides"><a href="./">Overview</a>${guideLinks(page.slug)}</nav></details>
<p>On this page</p><nav aria-label="On this page">${headings.map((heading) => `<a href="#${heading.id}">${heading.text}</a>`).join("")}</nav>`;
  const values = {
    TITLE: `${escapeHtml(page.title)} | Moguri docs`,
    DESCRIPTION: escapeHtml(page.description),
    CANONICAL: `${origin}/docs/${page.slug}.html`,
    NAVIGATION: navigation,
    HEADING: escapeHtml(page.title),
    CONTENT: content,
  };
  for (const key of Object.keys(values)) {
    if (!layout.includes(`{{${key}}}`)) throw new Error(`Documentation template is missing {{${key}}}.`);
  }
  for (const match of layout.matchAll(/\{\{([A-Z_]+)\}\}/g)) {
    if (!Object.hasOwn(values, match[1])) throw new Error(`Unknown documentation template marker: ${match[1]}`);
  }
  return layout.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => values[key]);
}

export function renderUsageIndex(source) {
  const marker = "<!-- USAGE_GUIDES -->";
  if (!source.includes(marker)) throw new Error("The documentation overview is missing its usage-guide marker.");
  return source.replace(marker, () => `<div class="docs-guide-grid">${guideLinks(null, true)}</div>`);
}

export function renderSitemap() {
  const urls = [`${origin}/`, `${origin}/docs/`, ...guidePages.map((page) => `${origin}/docs/${page.slug}.html`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
}
