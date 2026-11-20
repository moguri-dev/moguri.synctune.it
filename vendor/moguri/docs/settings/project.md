# Project

Technical reference for **Settings / Project**. The app shows a short summary;
this page keeps the full detail.

## User guidance overrides (was "Project instruction overrides")

- Unselected fields inherit this profile's global User guidance. An empty explicit override disables that inherited field for the project.
- Saving one field preserves other pending (unsaved) text in the panel.
- Guidance overrides grant no tools or permissions.

## Repository (Git remote, main branch, branch pattern)

- Moguri does not store a Git upstream. Every Git and GitHub read uses the remote this folder's own Git configuration designates: the `gh repo set-default` choice, then `origin`, then the only remote. The checked-out branch does not change it. If several remotes exist without a default or `origin`, none is guessed. Changing the folder's remotes or `gh repo set-default` takes effect on the next read.
- The panel runs a bounded Local inspection of the repository layout. Directory links are not followed. It shows the single repository found and its current Git remote, or why none applies (none found, more than one, denied folders, or the inspection limit was reached).
- Older saved settings may still contain an `upstream` value. It is ignored and dropped on the next save.
- Branch name pattern placeholders are `{slug}` and `{id}`. Binding a PR or creating a session never silently changes this folder's checkout.
- Contract: `docs/architecture/repository-management.md`, `docs/architecture/chat-repository-binding.md`.

## New Local Git tasks / After code changes

- Default workspace mode is a managed worktree: new Local Git tasks create Moguri-owned worktrees before they run. "This folder's checkout" (formerly "Original checkout (explicit opt-out)") is an explicit opt-out.
- Projects added from a workspace folder are read-only sources. The choice is locked to "A new worktree (always)", the Repository section names the source folder, and remote changes are not offered. Contract: `docs/architecture/workspace-folders.md`.
- Existing sessions keep their exact root.
- The draft PR default is workflow guidance only. It never grants publication (push), authentication or merge permission; ordinary approvals still apply.
- Contract: `docs/architecture/repository-workflow-defaults.md`, `docs/architecture/managed-workspaces.md`, `docs/setup.md` (New Local Git tasks section).

## Fix broken CI / Automatic conflict resolution

- Each select offers "Use the global default (on/off)", "On for this repository" and "Off for this repository", and
  saves immediately. "Now:" shows the effective value and whether it comes from the global default or this override.
- Changing the global default keeps this override. Choosing the global default again removes it from the global
  **Repository exceptions** list.
- Fix broken CI also needs "My signed-in GitHub CLI account" under GitHub read access.
- Contract: `docs/architecture/pr-automation.md`.

## Screenshots of UI changes / Installer when session work is done

- **Screenshots of UI changes** (default: take them as the UI changes) tells the agent to capture affected screens
  with its browser or Playwright tools while it works and include them in its final response. "Only when asked"
  turns that off.
- **Installer when session work is done:** "Ask me" (default), "Build it" or "Don't build". With "Build it", the agent
  runs **Installer command** once as the last step of a task that changed the repository, after checks pass, and
  reports where the installer is. Commands still need your normal approvals.
- Moguri lists installer-like commands it finds in the project's root `package.json` scripts and `Makefile`. While the
  choice is "Ask me", a finished session in this project shows a one-time card offering **Build at the end**,
  **Don't build** or **Not now**. Contract: `docs/architecture/repository-workflow-defaults.md`.

## GitHub read access

- Repository attribution uses the selected session's Local account (public API or signed-in GitHub CLI, per this setting) or, for Remote sessions, the pinned SSH host's account.
- The review shows the actual host before any lookup.
- Linked-PR observation and client attachments remain control-plane reads (they run on this Mac's local service); they are not moved to the SSH host.
- Contract: `docs/architecture/remote-github-metadata.md` (Project settings disclosure paragraph).

## New-session defaults

- Overrides profile and global preferences for new sessions only.
- Existing sessions keep their saved controls and their source snapshot.
- Hard policy still wins over these defaults.

## Folder access (was "Agent folder policy")

- Read-only and denied folders are deterministic agent rules, not OS containment.
- Host command and MCP tools are disabled when they cannot enforce these restrictions.
- A manually opened user console still runs host code without these restrictions.
- Contract: `docs/architecture/file-access.md`, `docs/architecture/session-workspace.md`.

## Sandbox

- Saving a project SendBox configuration does not make an unqualified SendBox backend ready.
- There is no Local fallback for Sandbox chats.
- Contract: `docs/architecture/managed-sandbox.md`.

## Remote SSH workspace (label was "Canonical remote path")

- The path is an explicit path on the configured SSH host. It is not this local folder, not a synchronization setting and not a home-directory mount.
- Remote project chats cannot run until the path is approved and canonical (resolved and verified on the host; a symlink alias or changed root blocks execution).
- Contract: `docs/architecture/execution-transports.md`, `docs/setup.md` (Remote SSH section).

## Scripts

- Entries use `id`, `name` and an exact `command`. Typical names: start, stop, dev, config.
- Nothing runs when settings are saved; scripts run only from the buttons, in an open session of this project.

## Preview port and Porto

- "Enable Porto inventory" was "Enable optional Porto inventory access". Porto is optional.
- Read Porto inventory reads the installed Porto CLI's inventory without starting or stopping daemons or killing processes.
- Save the intended preview port explicitly; Porto-owned services stay Porto-owned (Moguri never stops or reconfigures existing Porto workloads).
- Contract: `docs/architecture/runtime-foundation.md`, `docs/architecture/session-workspace.md`.

## Repository instructions and MCP

- Repository instructions are untrusted guidance. They cannot grant permissions or override read-only mode.
- MCP import shows the file's SHA-256 digest; the import is bound to that reviewed digest. Only supported entries are imported, and they are imported disabled.
- Creating missing defaults: Moguri creates only the missing instructions and MCP files, commits them on the selected branch and pushes it. The branch must be non-protected (not `main`, `master` or the configured main branch). The current branch, index and unrelated changes are preserved. A missing default that is still tracked in HEAD is not overwritten.

## Repository script trust

- Trust is an explicit, Local, per-repository decision recorded against the current HEAD.
- Trusted existing tests and script entrypoints can skip the model (agent) assessment, but not execution approval.
- New packages, generated helpers and changed dependency inputs are outside the trusted baseline.
- Trust is not a transitive-code audit and not OS isolation.
- The review lists each script with its SHA-256 digest (the "baseline"), excluded paths and dependency inputs.
- Contract: `docs/architecture/repository-workflow-defaults.md`.

## Change remote URL

- The change writes the actual shared Git configuration of the Local checkout, which also changes every listed linked worktree.
- It never changes an SSH or Sandbox binding, never authenticates, fetches or pushes.
- Historical PR and candidate sources stay attached to their original repository.
- If the acknowledgement of a change is lost, the URL change is not retried; inspect the retained history (the "Remote change details" record, formerly "Original remote change and retained outcome").
- Acknowledging a partial change confirms you inspected the original shared config and possible effects. It does not prove cleanup, restore the old URL or declare success.
- Contract: `docs/architecture/repository-management.md`.

## Project Kanban (board settings)

- Each project has a special Kanban chat.
- Continue work takes one item in an isolated managed Local worktree, uses the Kanban chat's selected model and budget, then stops at its draft PR. It never merges and never drains the backlog.
- GitHub access uses this Mac's signed-in GitHub CLI account, not the Copilot login or SSH credentials.
- Eligible phases are tried in their saved order; In progress precedes Backlog by default.
- Hiding Kanban preserves its cards, chat and ongoing tasks.
- "Sync from GitHub (read-only)" was "Sync with GitHub, read-only into Kanban": GitHub data flows read-only into Kanban.
- Contract: `docs/architecture/project-kanban.md`, `docs/architecture/alerts-kanban-sync.md`.

## Optional Linear team

- Authentication lives in Settings / Integrations / Linear.
- Save the exact team UUID before enabling import.
- Importing is explicit and read-only; enabling a team never exports local tickets or starts a scan.
- Contract: `docs/architecture/linear-workflows.md`.

## Configuration project picker

Only registered projects in this profile are listed. Choosing a configuration target never moves running
work or changes a session's captured folder.

## Unavailable project warning

This project is no longer available in this profile; no replacement was selected. Pending edits remain
read-only until you explicitly discard them.
