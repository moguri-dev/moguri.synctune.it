# Retention

Technical reference for **Settings / Retention**. The app shows a short summary;
this page keeps the full detail.

## Change storage location

- The entire encrypted store moves together: all profiles, sessions, independent artifacts, credential
  references and budget holds. Project files, managed worktrees, model and cache files, and terminal owners
  stay at the resource roots captured when they were created.
- If the launch set `MOGURI_STATE_DIR` explicitly, the storage location cannot be changed from Settings.
  Restart without the override before changing the default storage. An explicit override is never silently
  cleared or rewritten.
- Review fields: current encrypted source, new data directory, the resource base that stays in place, and
  the number of profiles and active owners.
- Confirming the move stops owned model and tool work and closes every SQLite writer before copying. Unknown
  accounting remains held. Authenticated user terminals survive this explicit restart without input replay.
  The old encrypted database remains as a retired backup, not a second writer. Neither the source nor a
  partial destination is deleted automatically.
- After the copy, Moguri publishes the new location for discovery and restarts (the hidden test window
  suppresses the restart).
- If the move cannot be confirmed, the original data is preserved and the copy is not retried.

## Session disk

- Off by default. The switch creates a fixed-size macOS disk image (APFS sparse
  bundle) for new session worktrees, so session work can't fill your Mac. The
  size select (5 to 500 GB) saves immediately.
- The encrypted store, dependency cache and model files stay outside the disk.
  Existing worktrees stay where they were created.
- When free space drops below 5% of the size (at least 512 MB), Moguri first
  removes the oldest archived worktrees that are clean and fully pushed, then
  pauses chats that work on the disk: queued turns wait and running turns wait
  before their next model call. Work resumes by itself once there's room.
  Uncommitted or unpushed work is never removed.
- Resizing unmounts the disk briefly, so it needs no running work on it.
  Turning it off needs no worktrees on it; archive their sessions (clean,
  pushed worktrees are removed) or remove the worktrees first.
- The disk stays mounted when Moguri's service stops, so terminals in its
  worktrees keep working. Moguri mounts it again after a restart.
- Details: [virtual disk](../architecture/virtual-disk.md).

## Manage stored sessions

- Permanent session deletion (including archived-session expiry) also deletes every candidate and generation
  proposal that originated in that session. Archiving alone preserves them.
- Ordinary artifacts, applied code, worktrees, connected PRs and other profiles are always preserved by deletion.
- **Remove pushed worktrees and branches when archiving** (on by default): when an archived session's
  worktree is clean and every commit is on a remote branch, Moguri removes the worktree and deletes its
  local branch. Uncommitted, untracked or unpushed work keeps both, as do ignored files that may not be
  rebuildable (like `.env`; dependency folders, build output and caches don't count). The reason shows for the session
  under Manage stored sessions. Restoring the session recreates the worktree from the remote branch; a
  different local branch with the same name blocks that instead of being replaced.
- Candidate cleanup status: while owned work is still settling, deletion is not complete. For a session
  deletion, reconcile (settle) the session's owned resources, then retry the deletion. For cleanup triggered
  by a verified PR merge, Moguri retries automatically; no code or Git resources are removed.
- A session with a running turn cannot be deleted from storage until you open it and stop that turn. Owned
  work is not replayed after sleep or reconnection.
- If a session action fails, unconfirmed content and independent artifacts are preserved.
- Archiving or deleting a session (one at a time or in bulk) and removing a project always warn first when
  a session in the selection, or one of its subsessions, is running, waiting for you or owns a running job.
  This warning ignores the "Do not ask again" choices; confirming it stops that work. The CLI needs
  `--confirm-running`.

## Archived-session retention (page help)

Off by default. Permanent session deletion, including archived-session expiry, also deletes every
originating candidate and generation proposal, including their proposal records and retention grants.
Archiving alone preserves candidates. Ordinary artifacts, applied code, remaining worktrees and external
PRs survive deletion. Usage and required accounting remain.

Fresh authoritative verification that the exact linked repository/PR merged also deletes its associated
candidates, including archived-session candidates, under the configured metadata-access policy. Closed
or unverified PRs do not trigger deletion.

## Encrypted storage

While loading, the panel reads the authoritative data directory from the runtime.

## Keep awake

The switch was previously labeled "Prevent idle sleep while this profile owns work", and the minutes
field "Minutes after owned work finishes". Only work this profile owns keeps the Mac awake. The
idle-sleep helper does not override manual sleep, lid closure or a remote host's sleep policy.

## Automatic cleanup

Three rules, each off by default with a seven-day age. The switch and the age select save immediately;
ages are 1, 7, 30, 60 or 90 days (an older custom value stays listed).

- **Archive completed sessions:** counts from the session's actual completion time.
- **Archive sessions whose pull request merged:** counts from when Moguri first saw the session's pull
  request as merged (the persisted observation time; unchanged checks don't move it). Completed, stopped,
  failed and idle sessions qualify; partial or running ones don't.
- **Delete archived sessions:** counts from the archive time. Deletion is permanent, as described above.

The cleanup runs every minute and on **Run cleanup**. Unsent drafts, queues, pending input, active
descendants, live consoles and uncertain effects keep a session open. Subsession choices below apply to
automatic archive and deletion too.

## Subsession choices

Cascade choices (archive or delete all attached subsessions) include nested descendants. Detaching
preserves direct children and keeps their nested hierarchy intact; model-owned subagents cannot be
detached. These choices do not bypass owned-work cleanup checks.

## Warning

Save explicitly to delegate session and candidate deletion. Failed or unconfirmed owned work keeps
cleanup visibly pending, never successful. This does not erase external backups, revert applied code or
close a PR.

## Structured answers

The switch was previously labeled "Retain actual answers as independent artifacts". On by default.
Source question/answer events remain canonical; model or delegated answers never become user
instructions or tool permission.
