# Dependency cache

Technical reference for **Settings / Dependency cache**. The app shows a short summary;
this page keeps the full detail.

## Dependency cache overview

- Verified archives are shared across projects and branches. Public content may be shared; private registry content stays within the profile and its exact authorization.
- Installed trees stay local to each worktree.
- Supported inputs: npm lockfile v2/v3 with workspaces, pnpm lockfile v9 with workspaces, Python hash-pinned binary-wheel cache, Rust/Cargo locked archive cache, Go `go.mod`/`go.sum` cache.
- Contract: `docs/architecture/workspace-platform.md`, `docs/architecture/dependency-cache-scopes.md`.

## Dependency plan (was "Exact dependency plan")

- Every exact version needs a fresh advisory check before download or reuse.
- Unknown status, advisory outages and known vulnerabilities block preparation.
- A clean advisory result is not a guarantee against malicious code.
- The plan lists the exact install and cache source root, root and member manifest inputs with digests, and each package's pinned integrity.
- Crates are cached as archives only; their build scripts are not evaluated (run).
- Lifecycle code, Python source builds, Cargo build scripts and proc macros, and Go builds need a separately qualified execution boundary. Native executable presence is not containment. No host-build fallback is allowed.
- The native offline cache recipe (shown after a successful Prepare) only prepares and downloads dependencies. It does not authorize executing package code or a build.
- Prepare and Install start jobs; their progress, cancellation and terminal outcome are retained by the service. A failed operation records no successful install.

## Private npm/pnpm registries (was "Private npm/pnpm registry authorizations")

- No `.npmrc`, environment token or personal package-manager configuration is imported.
- Each registry is reviewed as an HTTPS registry resource plus exact packages or `@scope/*` resources.
- Credentials (bearer tokens) stay in this profile's keychain and are shown masked.
- Sending private dependency names and versions to the advisory batch destination requires a separate explicit authorization per registry; leaving it off blocks preparation for plans that use that registry.
- Saving a registry replaces its credential authorization (a new credential revision), so the token must be entered again.

## Non-Local session warning

This panel explicitly manages the Local project/worktree cache, not packages on the selected Sandbox or
Remote agent. No remote or Sandbox install is implied.
