# Security policy

## Supported versions

Only the latest published Moguri release receives security fixes. Moguri is an
alpha: fixes ship in a new release rather than as patches to older versions.
Builds from `main` or a feature branch are development builds and are not
supported releases.

| Version | Supported |
| --- | --- |
| Latest published release | Yes |
| Any earlier release | No |
| Unreleased development builds | No |

## Reporting a vulnerability

Do not open a public issue, pull request or discussion for a suspected
vulnerability.

Email [security@mb-consulting.dev](mailto:security@mb-consulting.dev) with:

- the affected Moguri version (shown under **Settings > General > Private
  GitHub updates** in the desktop app, or the release you downloaded) and your
  macOS version;
- the affected component, such as the local service, desktop app, TUI, SDK,
  updater, Sandbox or Remote environment;
- the impact you observed or expect, such as code execution, permission bypass,
  credential exposure or data loss;
- the smallest set of steps or a proof of concept that reproduces it.

Use generated data in reports. Do not send real credentials, tokens, private
repository contents or other people's personal data. If a reproduction needs a
secret, describe where it is used instead of including it.

## What to expect

- We acknowledge every report within **7 days**.
- We confirm or rule out the issue, then share a fix plan and keep you updated
  until it is resolved.
- We follow **90-day coordinated disclosure**: please keep the details private
  for 90 days after your report, or until a fixed release is published,
  whichever comes first. We may agree on a different date with you when a fix
  needs more time or is already public.
- With your permission, we credit you in the release notes for the fix.

There is no bug bounty.

## Scope

In scope: the code in this repository and the release artifacts published on
its GitHub Releases page.

Out of scope: third-party services and tools that Moguri connects to or
launches, such as model providers, GitHub, Claude Code, Codex and SendBox.
Report those to their maintainers. The [third-party component list](docs/third-party.md)
names them.

Moguri's macOS builds are ad-hoc signed and not notarized. That is a known
property of the alpha, not a vulnerability. See [releasing](docs/releasing.md).
