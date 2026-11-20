# Repositories

Technical reference for **Settings / Repositories**. The app shows a short summary;
this page keeps the full detail.

## Workspace folders

Contract: `docs/architecture/workspace-folders.md`.

- Type the folder path (absolute or starting with `~/`) and click "Find repositories", or use "Choose
  folder…" for the macOS picker. Moguri lists the Git repositories it finds, up to
  three levels down. It skips links, dot folders, `node_modules`, linked worktrees and repositories nested
  inside another repository. Large folders stop at 20,000 entries, 10 seconds or 500 repositories, and the
  review says so.
- Every new repository starts checked. Unchecked ones are remembered as left out, so sync never adds them.
  Repositories that are already projects are listed and left unchanged.
- "I trust this folder and allow Moguri to read it" is required. It lets Moguri read and list the folder;
  it does not trust repository scripts, which keep their own review.
- **Keep in sync** (default) checks the folder at startup, every five minutes and on **Check now**, and adds
  new repositories automatically. **Import once** adds only what you pick; later checks just report how many
  new repositories are available, with **Review new repositories** to add them.
- Sync never removes a project. Missing repositories are reported so you can remove them from Project
  settings; removing a folder project leaves it out of future syncs. A missing or replaced folder pauses
  sync.
- **Stop tracking** removes the folder record only. Its projects stay, and stay read-only.
- Projects from a workspace folder are read-only sources. Every Local session works in its own worktree in
  Moguri's storage. Moguri refuses to work in the original checkout and refuses project-level writes there
  (Git writes, remote changes, default files, artifact copies, Sandbox publication, dependency installs).
- CLI: `moguri project folders | folder-preview FOLDER | folder-import FOLDER --digest SHA --trust-folder
  [--include JSON] [--once] | folder-sync FOLDER_ID on|off | folder-check FOLDER_ID | folder-remove FOLDER_ID`.

## Clone from URLs (repository import)

- Import adds repositories to this profile's Local projects. The preview shows every normalized URL and its
  destination before anything is cloned.
- Existing project registrations stay intact. Failures never delete partially cloned folders and never undo
  imports that already succeeded.
- If execution policy does not allow Local, import is blocked. No SSH or Sandbox root, and no other account,
  is substituted.
- Accepted URLs: credential-free HTTPS or SSH only, up to 100 repositories per batch. The preview shows the
  canonical parent folder.
- Clones run one at a time with your existing SSH keys and known-hosts file, without Git hooks, filters,
  submodules, model calls or interactive login. Private-repository and authentication failures, and moved
  URLs, are reported explicitly. URL redirects are not followed; they require a new reviewed URL.
- Import history keeps every batch and its per-entry results across client reloads.
- A cancelled or interrupted clone is recorded as partial. Acknowledging a partial entry records only that you
  inspected its files and possible processes; it is not proof of cleanup. The clone is not replayed and the
  partial outcome is not relabeled.
- If the service does not acknowledge an import request, check the retained batches before starting new
  work; nothing is retried automatically.

## Registered projects

- Shows how many projects this profile has. **Manage projects** opens **Settings / Project** for the
  currently selected project, or its project chooser when none is selected; it no longer lists one button per
  project.
- Change an existing repository's remote in its Project settings. That review shows every affected linked
  worktree, not just the project's display name.
