# Development

This guide is for contributors working on Moguri itself. Users installing the
app should read [installation](installation.md). Coding agents also follow
[`AGENTS.md`](../AGENTS.md), which holds the repository's binding architecture
rules.

## Toolchain

- macOS on Apple silicon runs the full suite, the desktop app and packaging.
  Linux runs the portable foundation only; it is not release qualification.
- Node.js 26, pinned in [`.node-version`](../.node-version). `package.json`
  enforces it with `engine-strict`.
- npm (bundled with Node). Dependencies are pinned exactly (`save-exact`).
- Git, and the GitHub CLI (`gh`) for GitHub workflows and releases.
- Python 3.10+ for DMG packaging. Packaging creates a private virtual
  environment under `.native/` and never changes system Python packages.
- Apple `container` only for Sandbox images, packaging and native
  qualification.

## Setup and running

```sh
npm ci
npm run build
npm start -- --project /absolute/path/to/project   # TUI
npm run desktop                                    # desktop app, same service and sessions
```

`npm run dev:tui` and `npm run service` run the TUI and the local service from
TypeScript sources without building. State goes to
`~/Library/Application Support/Moguri` unless `MOGURI_STATE_DIR` points to a
private directory; use a separate one for development. The service writes
diagnostics to `service.log` in that directory; see
[state, policy and diagnostics](setup.md#state-policy-and-diagnostics).

## Code layout

| Path | Contents |
| --- | --- |
| `apps/service` | The local control plane: event store, controller, model and tool workers, MCP gateway, PTY broker, environments and updater |
| `apps/cli`, `apps/tui` | The `moguri` CLI and the OpenTUI terminal client |
| `apps/desktop` | The Electron main process and the React renderer |
| `packages/protocol` | Shared TypeBox schemas, events and domain types |
| `packages/sdk`, `packages/client` | The importable Moguri SDK used by every client; root and React entrypoints are browser-safe |
| `scripts` | Build, packaging, spikes, qualification and [release](releasing.md) tooling |
| `tests` | Node test runner suites; `tests/e2e` holds hidden Electron Playwright specs |
| `docs` | User, developer and architecture documentation; see the [index](README.md) |

The [architecture overview](architecture/overview.md), the
[implementation specification](implementation.md) and
[architecture decisions](architecture/decisions.md) explain how the pieces fit.
The [SDK reference](sdk.md) documents the public API and CLI.

## Checks

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | TypeScript for the service, SDK, desktop, tests and TUI |
| `npm run build` | Production bundles, SDK types and `dist/THIRD_PARTY_NOTICES.md` |
| `npm test` | Full Node suite, including the native TUI interaction test and the covering-array milestone matrix. Run `npm run build` first: some tests execute `dist` bundles |
| `node --import tsx --test tests/<name>.test.ts` | One or more focused suites |
| `npm run test:e2e` | Hidden Electron end-to-end tests. Needs a build and `npm exec -- playwright install chromium` once |
| `npm run verify:sdk` | Packs the SDK and checks every entrypoint in an external consumer |
| `npm audit --audit-level=moderate` | Dependency audit |
| `npm run test:matrix` | Opt-in full 10,080-cell milestone matrix |

Tests use generated fixtures only: no real credentials, personal data,
microphones or live provider logins. Electron tests run hidden and never open
the real GitHub authorization page. Phase 0 and platform spikes
(`npm run spike`, `npm run spike:*`) are listed in `AGENTS.md`.

## Continuous integration

[`ci.yml`](../.github/workflows/ci.yml) runs only on pushes to `main`, on
macOS and Ubuntu: audit, typecheck, build, `npm test`, `verify:sdk` and, on
macOS, `test:e2e`. It does not run on pull requests or feature branches, so run
the relevant checks locally before opening a PR. The tag-triggered
[`release.yml`](../.github/workflows/release.yml) verifies and publishes
releases; see [releasing](releasing.md).

## Packaging

`npm run package:mac` builds an ad-hoc-signed development app, DMG, ZIP and
integrity manifest under `release/`. `npm run verify:update` checks the ZIP
through the production updater and the DMG layout without launching the app.
Packaging requires `LICENSE.md` and the generated third-party notices in the
app bundle; see [third-party components](third-party.md).

## Documentation

Put durable documentation under `docs/` and update the relevant setup,
settings, architecture or protocol page in the same change. Keep the
[README](../README.md) short and link here instead.
