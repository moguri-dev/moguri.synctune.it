# General

Technical reference for **Settings / General**. The app shows a short summary;
this page keeps the full detail.

## Application

- Application preferences belong to the encrypted store as a whole (not to one profile) and apply across
  every profile. Profile appearance and voice settings are stored separately per profile.

## Show Moguri in the menu bar

- The menu-bar menu follows the active profile:
  - a count of open chats, then each project's top-level chats in sidebar order and project-free chats under
    **Chats** (archived, Kanban and nested subsession chats are left out);
  - a status after busy chats: "Working", "Needs you" or "Failed". Over 25 chats, working and waiting ones
    stay and a "more in Moguri" item opens the window;
  - per chat: its status (and linked PR), **Open**, **Stop** while it works, and **Archive…** otherwise;
  - **Create Session…** (one entry per project), **New Chat**, **New Project** (opens New at Import local
    folder), **Open Moguri** with its shortcut, **Settings…** and **Quit**.
- Archive, new chats and new projects run through the window's own flows, so archive confirmations and the
  unsaved-edit guard still apply. Stop sends the same stop as the chat's Stop button.
- The menu refreshes at most a few times a second. Hidden test runs never create a real menu-bar item.

## Keep agents running when the last window closes

- Closing the last window quits the desktop client but leaves the same local service, active agent work and
  user terminals running. Reopening the desktop reconnects to that same service.
- An explicit Quit always stops the service and its known terminal groups. Turning this setting off also
  stops them when the last window closes.
- Keeping the service running does not send drafts, resume held queues or grant permissions.

## Automatic update checks

- Automatic checks run at app startup and every four hours, and successful checks download and stage
  (verify) the update. Previous label: "Automatically check and stage updates at app startup and every four
  hours".
- Checks read the public `mbianchidev/moguri` GitHub Releases without a token. They contact only
  `api.github.com` and GitHub's release download host, and send no account, project or usage data. When an
  optional update token is saved, checks use it instead. Checks never use a provider login.
- Installation and restart always require explicit user confirmation.
- Turning automatic checks off affects future checks only; a download that is already in progress continues
  under its existing operation.

## Command line

- The command is the bundled CLI and TUI launcher. It is installed for the current macOS user and is shared
  across profiles.
- It runs on the desktop app's own Node runtime, needs no administrator access and does not edit shell
  startup files.
- The app must stay at the location it was installed from. If you move the app, remove this managed command
  and install it again from the new location.
- Run `export PATH="$HOME/.local/bin:$PATH"` to add the command to the current shell's PATH; add that line
  once to `~/.zshrc` for future zsh shells.
- Existing commands at the destination path, including manual workarounds, are never replaced or removed.
  Removal only deletes the exact managed command Moguri installed (matched by digest).

## OpenTelemetry export

- Export is off by default and configured per profile; each profile has its own collector settings.
- What leaves the Local control plane: reviewed traces, current accounting/operation gauges (metrics) and,
  if you tick **Also send diagnostic logs**, fixed-text records for failed, stopped or denied work linked to
  their trace. Accepted Remote and Sandbox records are included, but SSH peers and Sandbox guests are not
  instrumented themselves. The export is metadata only: no prompts, responses, tool data, terminal data, raw
  diagnostics, paths or private names are exported.
- No credentials or `OTEL_*` environment settings are borrowed from the environment.
- Collector URL: an HTTPS origin, or plain HTTP only on a literal loopback address (`127.0.0.1` or `[::1]`;
  the hostname `localhost` is not accepted). Moguri posts OTLP/HTTP JSON to `/v1/traces`, `/v1/metrics` and,
  with logs on, `/v1/logs`. The origin may not contain a custom path, query, fragment or credentials;
  redirects are not followed.
- Credential headers: list header names (for example `authorization, x-api-key`), review and apply, then
  enter each value in its password field and choose **Save NAME value**. Values live in the keychain for this
  profile and this exact collector; changing the collector needs them again. Transport headers such as
  `content-type` or `host` can't be used. If a value is missing, export stops with `credential` instead of
  sending without it.
- Trace sampling ratio: a number from 0 to 1. A ratio of 0 disables trace sampling but does not stop the
  gauge (metrics) export. Logs are not sampled; each says whether its trace was. Sampled traces are never
  billing data or complete execution totals.
- Review step: shows the profile, collector, signals, credential header names, enabled state and trace
  ratio, plus the metadata-only disclosure version (1 for traces and metrics only, 2 when logs or credential headers are included). The export
  is best effort and bounded, with no retries and no history backfill. Metadata already sent cannot be unsent.
- Status line fields: "sent" is the number of spans the receiver acknowledged. Receiver acceptance does not
  prove the backend ingested the data. "dropped" counts dropped or unconfirmed spans; "sampled out" counts
  spans skipped by sampling; "failed requests" counts failed export requests; "queue" is queued spans over the
  queue limit (128); with logs on, "logs sent" and "logs dropped" count log records. Each export request has a
  1500 ms deadline and a single attempt.
- If the status cannot be read from the owning service, no other destination or provider is substituted.

## GitHub updates

Previously titled "Private GitHub updates".

- The update source is fixed to the upstream `mbianchidev/moguri` repository, also for builds from a fork.
- No token is needed for public releases: without one, the updater reads releases anonymously and applies the
  same manifest, size, SHA-512 and bundle checks.
- **Release access token (optional)**, previously "Private release PAT": needed only while the repository is
  private, or to raise GitHub's anonymous rate limit of 60 requests an hour (one check uses four). It is
  stored in the secure updater credential backend and owned by the whole store (shared by all profiles). It
  never uses Copilot sign-in or the GitHub CLI account, and no credential read is inferred from a provider
  login.
- A saved token is always used. If it can't be read, or GitHub rejects it, the check fails rather than
  silently retrying without it. Remove the token to go back to public releases.
- Anonymous checks of a private repository fail with "Public Moguri releases aren't reachable without a
  token"; a rate-limited check says so and downloads nothing.
- Prefer a fine-grained token limited to this repository with Contents read-only access.
- "Set up read-only update access" opens GitHub only when clicked. The link prefills resource owner
  `mbianchidev`, Contents: Read-only and a 30-day expiration. GitHub cannot preselect the repository: choose
  Only select repositories, then `moguri`. You review repository access and generate the token yourself.
  Never select or grant access to all repositories for updates.
- Status line: "Running build" is the current app version; "Update token" is the credential state
  (`unobserved`, `configured`, `missing` or `failed`). `missing` is shown as "none, using public releases".
- macOS trust: updates do not require Apple signing. The integrity and repository checks Moguri performs are
  not notarization and not an independent signing trust root. Moguri keeps the quarantine attribute and never
  bypasses Gatekeeper or other OS warnings. Downloading and staging an update does not execute new code.
- "Verified download" (previously "Retained verified stage") is the path of the staged, verified update
  bundle.
- An unpackaged or source runtime can inspect and stage releases, but cannot replace the checkout.
  Installation needs the packaged Moguri app.
- Install review shows the new version, install destination, backup location of the previous app, and the
  SHA-512 digests of the current and new app bundles.
- Confirming installation stops all work in every profile and restarts the app. Unknown accounting stays
  held, and authenticated user terminals survive the restart without any input replay. A trusted helper from
  the current code preserves the old bundle as a backup and verifies the exact candidate on the same
  filesystem before swapping. Interrupted installation work never installs itself again.
- If an update action cannot be confirmed, no alternate account, installation or retry is used.

## Profiles

- Creating or renaming a profile saves only its metadata (name and accent color). It does not switch to the
  new profile; choose a profile explicitly in the Profile menu. Accounts and project data are never copied
  between profiles.
- While a new profile is being set up, Moguri prepares that profile's own resources. Setup does not sign in to
  a provider or copy data from another profile.
- If profile setup fails, Retry requires you to confirm that you inspected that profile's own data directory
  ("I inspected NAME's profile folder").
- If the profile list cannot be read, Moguri does not fall back to the Default profile.
