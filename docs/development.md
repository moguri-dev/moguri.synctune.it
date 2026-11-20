# Website development

The site is plain HTML, CSS and JavaScript with no runtime dependencies,
analytics or cookies. Node 26 and npm are only needed to build `dist/` and run
checks. Marked is a build-time dev dependency that renders Markdown.

## Structure

| Path | What it is |
| --- | --- |
| `index.html`, `download/index.html`, `docs/index.html`, `developers/index.html`, `404.html` | Page templates with `{{MARKERS}}` for the shared header, footer, sidebar, cards and screenshots |
| `docs/usage/*.md` | Task guides written for this website (Getting started, sessions, models, execution, tools, CLI, troubleshooting, SDK quickstart) |
| `docs/layout.html` | The page shell for every Markdown page |
| `vendor/moguri/` | Moguri's own documents, synced unchanged. Never edit these by hand |
| `vendor/moguri/SOURCE.json` | The source repository, commit, version and SHA-256 of every synced file and screenshot |
| `assets/screenshots/` | Real desktop captures from Moguri's design-capture test |
| `data/releases.json` | Published releases. Download links come only from here |
| `scripts/catalogue.mjs` | The single list of pages, routes, synced documents, screenshots and private repositories |
| `scripts/build.mjs` | Builds `dist/` and fails on any broken local link or anchor |

The build publishes the user guide under `/docs/`, the developer docs under
`/developers/`, the download page under `/download/` and the landing page at `/`.
Only catalogued pages publish. Markdown sources, templates, `vendor/`, `data/`
and scripts stay out of `dist/`.

## Local setup and preview

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://127.0.0.1:4173`. The preview binds only to loopback and serves
`dist/`, not source files. Stop it with Ctrl+C and rerun `npm run dev` after
editing. `node scripts/serve.mjs --port 4174` previews an existing build on
another port.

## Checks

```sh
npm test
npm run test:browser
npm run check:links
```

`npm test` checks JavaScript syntax, builds the site and runs the Node tests:
page structure and metadata, every local link and anchor, the sitemap, the
alpha status line, source notes on synced pages, the download page, the
Markdown renderer, release rendering, and the integrity of `vendor/moguri/`
against `SOURCE.json`.

`npm run test:browser` starts its own loopback preview on port 4187. It checks
keyboard navigation, the interface tabs, the docs sidebars, layouts from 320px
to 2560px without overflow or overlapping controls, no-JavaScript fallbacks,
reduced motion, screenshots, HTTP errors, and axe WCAG 2.2 AA rules on every
page. It needs Playwright's headless Chromium once:

```sh
PLAYWRIGHT_SKIP_BROWSER_GC=1 npx playwright install chromium --only-shell
```

If another project shares the Playwright cache with a different version, set
`PLAYWRIGHT_BROWSERS_PATH` to a folder inside this repository instead.

`npm run check:links` builds the site, then requests every external URL. Run it
before publishing and after adding a release. It needs network access, so CI
doesn't run it.

## Sync Moguri's documents and screenshots

The user guide's reference pages and most developer pages are Moguri's own
documents. To update them, change them in the Moguri repository first, then
sync from a clean checkout of the commit you want to publish:

```sh
# In the Moguri checkout: build once, then capture the desktop app with generated fixtures.
npm ci && npm run build
MOGURI_DESIGN_CAPTURE_DIR=/absolute/captures MOGURI_DESIGN_CAPTURE_PREFIX=after \
  npx playwright test tests/e2e/design-captures.spec.ts

# In this repository:
npm run sync:moguri -- --source /absolute/moguri --captures /absolute/captures
npm test
```

The capture test runs hidden Electron windows on macOS with generated
projects, conversations and models only. Use captures made from the same
checkout you sync. The sync refuses uncommitted changes to synced files,
replaces `vendor/moguri/` and `assets/screenshots/` as a whole and records the
commit and hashes. Review the new screenshots for personal data before
committing.

To publish another Moguri document, add it to `canonicalPages` in
`scripts/catalogue.mjs` and sync again. To add a screenshot, add it to
`screenshots` with descriptive alt text and sync again.

Links in synced documents are rewritten to their published pages. A link to a
file that isn't published, or to a repository listed in `privateRepositories`,
renders as plain text with a dotted underline and a screen-reader note, because
those URLs return 404 to visitors. Remove a repository from that list when it
becomes public. `unavailableLinks` does the same for dead external links found
by `npm run check:links`; fix those upstream, then remove them.

## Releases and download links

The download page shows "No public release yet" until `data/releases.json`
lists a release. After a release is published on GitHub **and** the
repository is public, add it newest first:

```json
{
  "repository": "mbianchidev/moguri",
  "releases": [
    { "version": "0.33.0-alpha.1", "date": "2026-12-01", "prerelease": true }
  ]
}
```

Then remove `mbianchidev/moguri` from `privateRepositories`, sync the docs from
that release's commit, and run `npm test` and `npm run check:links`. The build
refuses release links for a private repository, invalid SemVer, a wrong
prerelease flag or a missing date. Asset names come from the release contract
in `scripts/catalogue.mjs` (`releaseAssets`).

## Writing guides

Each guide in `docs/usage/` has one H1 matching its catalogue title. Heading
anchors follow GitHub's rules, so the same links work on GitHub and on the site.
Link to other pages with relative Markdown paths, for example
`models.md#choose-a-model` or `../../vendor/moguri/docs/installation.md`. The
build fails on links to unpublished files.

Keep implemented capabilities separate from the roadmap and the product
vision. Where a guide summarizes a setting, link to its Settings reference page
and keep the Settings path current. Use generated examples only, and never
include credentials, personal data or internal release records.

## Deployment

The Website workflow (`.github/workflows/site.yml`) runs on pull requests,
pushes to `main` and manual runs. Draft PRs run `npm test`. Ready PRs and `main`
also run the browser checks. Runs on `main` deploy the tested `dist/` artifact
to GitHub Pages. PRs never deploy, and a manual run deploys only from `main`.
External actions are pinned to full commit SHAs.

GitHub Pages isn't enabled yet. Before the first deployment, a repository
admin must:

1. Set **Settings > Pages > Build and deployment > Source** to **GitHub Actions**.
2. Add a DNS `CNAME` record for `moguri.synctune.it` pointing to `moguri-dev.github.io`.
3. Enter `moguri.synctune.it` as the custom domain in **Settings > Pages**, wait
   for the DNS check, then turn on **Enforce HTTPS**.
4. Optionally verify `synctune.it` under the organization's **Settings > Pages**
   to prevent domain takeover.

Workflow-based Pages deployments ignore the `CNAME` file; it stays in `dist/`
as a record of the intended domain. The 404 page uses root-relative paths, so it
works on the custom domain at any URL depth.

## Artwork

The mascot, wordmark, icons, social card, colors and typefaces come from
Synctune's approved Moguri branding and are copied without modification.
Typography: Outfit for headings, Work Sans for body text and Geist Mono for
small technical labels. Fonts are self-hosted; keep the SIL Open Font License
notices in `assets/fonts/licenses/`. The terminal preview on the landing page
is an illustration and the SDK view is a diagram; every other product image is
a real capture.
