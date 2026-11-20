import { canonicalPages, guidePages, isPrivateRepository, origin, releaseAssets, screenshots, settingsMenu } from "./catalogue.mjs";
import { escapeHtml, routeHref } from "./markdown.mjs";

const external = '<span aria-hidden="true">&#8599;</span>';

// "" for the root, "../" one level down. The 404 page is served at any depth, so it uses "/".
export const rootFor = (route) => "../".repeat(route.split("/").length - 1);
const home = (root) => root || "./";
const sectionOf = (route) => route.split("/").length > 1 && ["docs", "developers", "download"].includes(route.split("/")[0]) ? route.split("/")[0] : "home";

export function siteHeader(root, route) {
  const section = sectionOf(route);
  const item = (href, label, key, page) => {
    const current = route === page ? ' aria-current="page"' : section === key ? ' aria-current="true"' : "";
    return `<a href="${href}"${current}>${label}</a>`;
  };
  return `<header class="site-header shell">
    <a class="brand" href="${home(root)}" aria-label="Moguri home"><img class="brand-face" src="${root}assets/favicon.svg" width="36" height="36" alt=""><img class="brand-wordmark" src="${root}assets/wordmark.svg" width="128" height="40" alt=""></a>
    <nav class="site-nav" aria-label="Primary">${[
      item(`${root}#features`, "Features", "features", null),
      item(`${root}download/`, "Download", "download", "download/index.html"),
      item(`${root}docs/`, "User guide", "docs", "docs/index.html"),
      item(`${root}developers/`, "Developers", "developers", "developers/index.html"),
    ].join("")}</nav>
    <a class="header-github" href="https://github.com/moguri-dev">GitHub ${external}</a>
  </header>`;
}

export function siteFooter(root) {
  return `<footer class="site-footer shell">
    <div><a class="footer-brand" href="${home(root)}"><img src="${root}assets/wordmark.svg" width="128" height="40" alt="Moguri home"></a><p>Coding agents on your terms. A macOS alpha.</p></div>
    <nav aria-label="Footer"><a href="${root}download/">Download</a><a href="${root}docs/">User guide</a><a href="${root}developers/">Developers</a><a href="${root}developers/#source">Source code</a><a href="${root}developers/security.html">Security</a><a href="${root}developers/license.html">MIT License</a><a href="https://github.com/moguri-dev/moguri.synctune.it">Site source ${external}</a><a href="https://github.com/synctune-io">A Synctune project ${external}</a></nav>
  </footer>`;
}

// Navigation entries for each documentation section, in display order.
export function sectionPages(titles) {
  const title = (page) => page.title ?? titles.get(page.route);
  const pages = [
    { route: "docs/index.html", section: "user", group: "Start", title: "Overview" },
    { route: "download/index.html", section: "user", group: "Start", title: "Download" },
    { route: "developers/index.html", section: "developers", group: "Start", title: "Overview" },
    ...canonicalPages.filter((page) => page.group !== "Settings"),
    ...guidePages,
  ].map((page) => ({ ...page, title: title(page) }));
  const order = { user: ["Start", "Guides", "Reference"], developers: ["Start", "Architecture and API", "Project"] };
  const startOrder = ["docs/index.html", "download/index.html", "docs/installation.html", "docs/getting-started.html", "developers/index.html", "developers/development.html", "developers/contributing.html"];
  const rank = (page) => startOrder.includes(page.route) ? startOrder.indexOf(page.route) : 100;
  return Object.fromEntries(Object.entries(order).map(([section, groups]) => [section, groups.map((group) => ({
    group,
    pages: pages.filter((page) => page.section === section && page.group === group).sort((a, b) => rank(a) - rank(b)),
  }))]));
}

function links(route, pages) {
  return pages.map((page) => `<a href="${routeHref(route, page.route)}"${page.route === route ? ' aria-current="page"' : ""}>${escapeHtml(page.title)}</a>`).join("");
}

export function docsNavigation({ route, titles, headings = [] }) {
  const section = route.startsWith("developers/") ? "developers" : "user";
  const label = section === "user" ? "User guide" : "Developer docs";
  const groups = sectionPages(titles)[section];
  let html = `<details class="docs-menu" data-docs-menu><summary>${label} pages</summary><nav aria-label="${label}">${groups.map(({ group, pages }) => `<p class="docs-nav-group">${group}</p>${links(route, pages)}`).join("")}</nav></details>`;
  if (route.startsWith("docs/settings/")) {
    const settings = settingsMenu.map(([group, slugs]) => `<p class="docs-nav-group">${group}</p>${links(route, slugs.map((slug) => ({ route: `docs/settings/${slug}.html`, title: titles.get(`docs/settings/${slug}.html`) })))}`).join("");
    html += `<details class="docs-menu" data-docs-menu><summary>Settings pages</summary><nav aria-label="Settings pages">${links(route, [{ route: "docs/settings/index.html", title: "All settings" }])}${settings}</nav></details>`;
  }
  if (headings.length) {
    html += `<p class="docs-nav-label">On this page</p><nav aria-label="On this page">${headings.map((heading) => `<a href="#${heading.id}">${heading.html}</a>`).join("")}</nav>`;
  }
  return html;
}

export function cards(route, titles, section, group) {
  const entry = sectionPages(titles)[section].find((item) => item.group === group);
  if (!entry) throw new Error(`Unknown card group: ${section}/${group}`);
  const all = [...canonicalPages, ...guidePages];
  return `<div class="docs-guide-grid">${entry.pages.filter((page) => page.route !== route).map((page) => {
    const description = all.find((item) => item.route === page.route)?.description;
    return `<a href="${routeHref(route, page.route)}"><strong>${escapeHtml(page.title)}</strong>${description ? `<span>${escapeHtml(description)}</span>` : ""}</a>`;
  }).join("\n")}</div>`;
}

export function screenshotFigure(name, { root, record, version, eager = false }) {
  const shot = screenshots.find((item) => item.name === name);
  if (!shot) throw new Error(`Unknown screenshot: ${name}`);
  const file = (suffix) => {
    const path = `assets/screenshots/moguri-${name}${suffix}.png`;
    const size = record.screenshots.files[path];
    if (!size) throw new Error(`${path} is missing from vendor/moguri/SOURCE.json. Run the Moguri sync.`);
    return { href: `${root}${path}`, ...size };
  };
  const wide = file("");
  const narrow = shot.narrow ? file("-narrow") : null;
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<figure class="screenshot">
      <a class="screenshot-link" href="${wide.href}">
        <picture>${narrow ? `<source media="(max-width: 40rem)" srcset="${narrow.href}" width="${narrow.width}" height="${narrow.height}">` : ""}<img src="${wide.href}" width="${wide.width}" height="${wide.height}" ${loading} decoding="async" alt="${escapeHtml(shot.alt)}"></picture>
        <span class="visually-hidden">Open the full-size screenshot</span>
      </a>
      <figcaption><strong>${escapeHtml(shot.title)}.</strong> Moguri ${escapeHtml(version)} desktop app with generated test data.</figcaption>
    </figure>`;
}

const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/;

// Download links only render for published releases in a public repository.
export function renderDownloads(data) {
  if (!data || typeof data.repository !== "string" || !/^[\w.-]+\/[\w.-]+$/.test(data.repository) || !Array.isArray(data.releases)) {
    throw new Error("data/releases.json needs a repository (owner/name) and a releases array.");
  }
  if (data.releases.length === 0) {
    return `<div class="release-status">
        <p class="section-label">Release status</p>
        <h2 id="release-title">No public release yet</h2>
        <p>The first Moguri release hasn't been published, so there's nothing to download from this site yet. The release process is ready: each release will publish a DMG, an updater ZIP, its manifest, a provenance record and <code>SHA256SUMS</code> to GitHub Releases. Builds are not available from any other source.</p>
        <p>Follow <a href="https://github.com/moguri-dev">Moguri on GitHub</a> for the release. Until then, read the <a href="../docs/installation.html">installation guide</a> to see exactly what installing will involve.</p>
      </div>`;
  }
  if (isPrivateRepository(data.repository)) {
    throw new Error(`${data.repository} is private, so its release assets return 404 to visitors. Remove it from privateRepositories in scripts/catalogue.mjs once the repository is public.`);
  }
  data.releases.forEach((release, index) => {
    if (!semver.test(release.version ?? "")) throw new Error(`Release ${index} has an invalid SemVer version: ${release.version}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(release.date ?? "")) throw new Error(`Release ${release.version} needs a YYYY-MM-DD date.`);
    if (release.prerelease !== release.version.includes("-")) throw new Error(`Release ${release.version} has the wrong prerelease flag.`);
  });
  const [latest] = data.releases;
  const base = `https://github.com/${data.repository}/releases`;
  const assets = releaseAssets(latest.version).map((asset) => `<tr><td><a href="${base}/download/v${latest.version}/${asset.file}">${escapeHtml(asset.file)}</a></td><td>${escapeHtml(asset.purpose)}</td></tr>`).join("");
  return `<div class="release-status">
        <p class="section-label">Latest release</p>
        <h2 id="release-title">Moguri ${escapeHtml(latest.version)}</h2>
        <p>Published ${escapeHtml(latest.date)}${latest.prerelease ? ". This is a prerelease." : "."} macOS on Apple silicon only. Ad-hoc signed, not notarized.</p>
        <div class="hero-actions"><a class="button button-primary" href="${base}/download/v${latest.version}/Moguri-${latest.version}-macos-arm64.dmg">Download the DMG <span aria-hidden="true">&darr;</span></a><a class="text-link" href="${base}/tag/v${latest.version}">Release notes ${external}</a></div>
        <div class="docs-table"><table><thead><tr><th>Asset</th><th>Purpose</th></tr></thead><tbody>${assets}</tbody></table></div>
      </div>`;
}

export function renderSitemap(routes) {
  const url = (route) => `${origin}/${route.replace(/index\.html$/, "")}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${url(route)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

export const canonicalUrl = (route) => `${origin}/${route.replace(/index\.html$/, "")}`;

// Replaces {{MARKER}} and {{KIND:argument}} markers. Unknown markers fail the build.
export function fill(template, values, path) {
  const output = template.replace(/\{\{([A-Z_]+)(?::([^}]+))?\}\}/g, (marker, key, argument) => {
    const value = values[key];
    if (value === undefined) throw new Error(`${path} has an unknown template marker: ${marker}`);
    return typeof value === "function" ? value(argument) : value;
  });
  return output;
}

