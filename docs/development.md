# Website development

The site uses plain HTML, CSS, and JavaScript. Node 26 and npm are only needed
for development, building the publishable directory, and running checks.
There is no application server or runtime package dependency.

## Local setup

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://127.0.0.1:4173`. The preview binds only to loopback and serves
`dist/`, not source files. Stop it with Ctrl+C. After editing source, restart
`npm run dev` to rebuild. Use `node scripts/serve.mjs --port 4174` to preview
an existing build on another port.

## Build and checks

```sh
npm test
PLAYWRIGHT_SKIP_BROWSER_GC=1 npx playwright install chromium --only-shell
npm run test:browser
```

`npm test` checks JavaScript syntax, builds the site, and checks page structure,
local links, anchors, metadata, font licenses, and the actual publishable output.
`npm run build` builds `dist/` independently. The build includes only the
website pages, CSS, JavaScript, public assets, and hosting metadata.

Playwright starts and stops its own loopback preview on port 4187. Checks cover
320px through 2560px layouts, interface tabs and keyboard focus, docs navigation,
no-JavaScript content, reduced motion, local-only asset requests, WCAG AA checks,
and HTTP error behavior. Screenshots and failure traces go to `test-results/`.
All illustrated project names and conversations are fictional.

## GitHub Pages

The Website workflow runs on pull requests, pushes to `main`, and manual runs.
Draft PRs run the build and static checks. Ready PRs also run browser checks,
including when a draft is marked ready and when a ready PR receives new commits.
Main runs validate once and deploy the same tested artifact. PRs never deploy.

Before the first deployment, a repository admin must:

1. Set **Settings > Pages > Source** to **GitHub Actions**.
2. Point the `moguri.synctune.it` DNS CNAME to `moguri-dev.github.io`.
3. Set the Pages custom domain to `moguri.synctune.it` and enable HTTPS when
   GitHub finishes verification.

The checked-in `CNAME`, canonical URLs, and sitemap use that domain. The 404
page uses root-relative assets for unknown nested URLs on the custom domain.
A manual deployment must select `main`. Feature-branch manual runs validate
but don't deploy. Obsolete PR runs cancel; deployment runs aren't interrupted.
External actions are pinned to full commit SHAs.

## Content and artwork

Keep implemented capabilities distinct from qualification work and roadmap
items. The current product is a development-stage macOS alpha, not a finished
public v1. Don't add installer buttons or links to planned component repos until
their public availability is confirmed. Interface previews are labeled
illustrations, not screenshots or live product output.

Moguri's approved mascot, wordmark, icons, social card, colors, and typefaces
come from [Synctune branding](https://github.com/synctune-io/branding).
Artwork and font files are copied without modification. Preserve the SIL Open
Font License notices under `assets/fonts/licenses/` when redistributing.
Typography follows the approved kit: Outfit for headings, Work Sans for body
text, and Geist Mono for small technical labels.
Fonts are self-hosted; the site makes no analytics, cookie, or external font requests.

Edit `index.html`, `docs/index.html`, `styles.css`, and `app.js`, not `dist/`.
The maintenance Markdown in this folder is intentionally excluded from deployment.
