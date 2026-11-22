# Reused components and licenses

Moguri is original application code, not an OpenCode or Pi fork. Its own code
is licensed under the [MIT License](../LICENSE.md). Versions are pinned in
`package.json` and `package-lock.json`; upstream license and copyright notices
remain in installed and packaged dependencies.

## Licensing of release artifacts

The MIT License covers Moguri's own source. It does not relicense any
dependency, bundled component or service Moguri connects to.

- Packages that ship unbundled in the app's `node_modules` keep their own
  license files in place.
- `npm run build` writes `dist/THIRD_PARTY_NOTICES.md`, which reproduces the
  license files of every package the esbuild and Vite builds bundle into
  Moguri's JavaScript. The packaged app ships it next to `LICENSE.md` under
  `Moguri.app/Contents/Resources/app/`, and packaging fails without them.
- The notices file lists bundled components without an OSI-approved license
  first. Today that is only `@anthropic-ai/claude-agent-sdk`: proprietary,
  "© Anthropic PBC. All rights reserved", and governed by
  [Anthropic's legal agreements](https://code.claude.com/docs/en/legal-and-compliance).
  It is excluded from Moguri's MIT License.
- Like other MIT-licensed agent GUIs that integrate Claude Code, Moguri ships
  only the SDK's JavaScript. The SDK's optional platform packages that carry
  Claude Code executables are replaced by an empty stub through `package.json`
  `overrides`, so no Claude Code binary is installed or redistributed. Claude
  Agent launches the user's own Claude Code, which the user authenticates
  themselves.
- The native speech runtimes under `dist/native` keep their upstream notices,
  and the packaged SendBox installer ships `SendBox.LICENSE` and
  `AppleContainerization.LICENSE` under `Contents/Resources/moguri-native`.

Redistributing the proprietary SDK inside public releases was a maintainer
decision on 2026-11-19, pending legal review. If that review rejects it,
remove the Claude Agent `sdk` transport from release builds rather than
relicensing it.

## Components

| Component | License | Use |
| --- | --- | --- |
| Node.js | MIT plus included third-party notices | Pinned 26.x service, worker and CLI runtime; built-in SQLite |
| `@earendil-works/pi-ai` | MIT | GitHub Copilot, OpenRouter, Anthropic API, OpenAI API and Sign in with ChatGPT authentication, catalogues and model transport |
| OpenTUI core and React renderer | MIT | Native terminal rendering |
| React and React DOM | MIT | Shared state hooks and desktop UI |
| Lucide (`lucide-react` 1.77.0) | ISC | Desktop interface icons |
| Electron | MIT plus Chromium/Node notices | Isolated desktop shell |
| TypeBox | MIT | Public command and private worker validation |
| `ws` | MIT | Authenticated local event transport |
| `node-pty` | MIT | Local PTYs and process ownership |
| `ghostty-web` 0.4.0 and its Ghostty WASM core | MIT | Maintained embedded desktop terminal, VT parsing and canvas rendering; self-hosted WASM, not a custom terminal emulator |
| `@napi-rs/keyring` | MIT | Explicit OS credential backend |
| `react-markdown`, `remark-gfm` | MIT | Safe Markdown presentation |
| `lowlight` 3.3.0 with `highlight.js` 11.11 | MIT; BSD-3-Clause | Read-only syntax highlighting in the Files view |
| `hast-util-to-jsx-runtime` 2.3.6 | MIT | Turns highlighted syntax trees into React elements without HTML strings |
| Vite, esbuild, tsx | MIT | Builds and development/test TypeScript execution |
| TypeScript | Apache-2.0 | Static verification |
| Playwright | Apache-2.0 | Hidden Electron end-to-end testing |
| `@electron/packager` | BSD-2-Clause | Development macOS application packaging |
| `@modelcontextprotocol/sdk` | MIT | Native gateway, stdio/Streamable HTTP connectors and outward single MCP |
| `@anthropic-ai/claude-agent-sdk` 0.3.325 | Proprietary, Anthropic Commercial Terms ([legal](https://code.claude.com/docs/en/legal-and-compliance)) | Optional Claude Agent `sdk` transport, bundled into `dist/claude-agent-worker.mjs`. Its optional bundled Claude Code binaries are replaced by an empty stub and never installed or shipped; Moguri launches the user's own Claude Code. |
| `sqlite-vec` | MIT/Apache-2.0 | Local project-partitioned lexical-vector database |
| Ajv | MIT | Current external MCP JSON-schema argument validation |
| YAML | ISC | Standard `SKILL.md` front matter |
| ignore | MIT | Root/nested `.gitignore` matching for repository indexing |
| Cheerio | MIT | Bounded approved-page text extraction |
| `@resvg/resvg-js` | MPL-2.0 | Build-only rasterization of Moguri's original SVG mascot |
| NVIDIA NeMo-Speech.cpp 0.2.0 | Apache-2.0 plus included upstream notices | Pinned native local recognizer runtime; notices retained with the downloaded runtime |
| transcribe.cpp 0.4.2 (handy-computer) | MIT plus included ggml, miniz and Silero VAD notices | Pinned native library archive (SHA-256 per platform) loaded through Node `node:ffi` in an isolated host process for user-trusted streaming models; notices retained with the downloaded runtime |
| NVIDIA Nemotron 3.5 ASR model | OpenMDW-1.1 | Optional user-downloaded GGUF weights, not bundled or implicitly downloaded |
| `cacache` 21.0.1 | ISC | Native npm-compatible content-addressed archive storage with integrity verification |
| pnpm 12.14.0 | MIT plus included notices | Pinned native script-free installer and shared copy-on-write-capable package store |
| semver 7.8.5 | ISC | Reject unqualified local/Git/executable dependency specifiers before cache admission |
| Git CLI | GPL-2.0-only | User-configured reviewed pushes, rebases and tags; read-only exact committed marketplace objects |
| GitHub CLI (`gh`) | MIT | Explicitly selected controller account for reviewed GitHub workflows; no token scraping or account substitution |
| Python / pip | PSF-2.0 / MIT, plus included notices | Explicit native locked wheel/cache primitives; no sdist/lifecycle execution on the host |
| Cargo / Rust tooling | MIT OR Apache-2.0, plus included notices | Explicit native locked registry-cache preparation, not host build-script execution |
| Go tooling | BSD-3-Clause, plus included notices | Native locked module checksum/cache verification; no implicit toolchain download |
| LobeHub Icons (`@lobehub/icons-static-svg` 1.102.0) | MIT | Monochrome provider marks (GitHub Copilot, OpenRouter, Anthropic, OpenAI, Claude Code, Codex) on Settings / Model providers. Path data is copied into `apps/desktop/src/ProviderLogo.tsx` with its license notice; no package dependency is added. The marks are their owners' trademarks, used only to identify each service. |
| Simple Icons 16.38.0 | CC0-1.0 | Monochrome GitHub, Linear and Model Context Protocol marks on Settings / Integrations. Path data is copied into `apps/desktop/src/IntegrationLogo.tsx`; no package dependency is added. The marks are their owners' trademarks, used only to identify each service. |
| Stainless app icon (`mbianchidev/stainless`, `chromium/branding/stainless-icon.png`) | Apache-2.0 | Resized to 64 px as `assets/integrations/stainless.png` for Settings / Integrations / Stainless. Moguri still never bundles or redistributes the Stainless browser itself. |
| Sharp 0.35.5 | Apache-2.0, with bundled libvips LGPL-2.1-or-later notices | Bounded local image validation/normalization for explicit attachments; no remote conversion or real-image test fixtures |

The managed cache's advisory source is the public OSV batch API. Its use
requires explicit approval to disclose dependency names/versions; private
metadata additionally binds the configured reviewed advisory resource and
disclosure choice. It does not receive repository source or registry
credentials. Existing board observation/import remains read-only. The separate
GitHub and Linear workflow APIs permit explicit exact user-reviewed writes
with retained account/root/revision provenance, never an automatic model grant.

No OpenCode source, branding, provider session store or OAuth implementation was
copied into Moguri. The pi-ai package owns its upstream authentication flow.
Authentication support does not grant a license to a hosted provider or imply
partnership status. Codex Agent launches the user's own Codex CLI
(<https://github.com/openai/codex>, Apache-2.0) and speaks its documented
app-server protocol; no Codex code or binary is bundled. Sign in with ChatGPT
follows OpenAI's terms for open-source, locally hosted apps; Claude.ai
subscription sign-in is not offered.
