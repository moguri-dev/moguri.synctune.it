# Projects and sessions

A project registers a repository or folder. A session keeps its conversation, model controls, draft, queue, and execution boundary. A worktree gives a session a separate Git checkout. A profile separates accounts and private data.

## Register and import projects

Use **New** to open an existing folder or clone into a new destination. Cloning uses an account you have already configured in the GitHub CLI. Moguri does not sign you in, switch accounts, or reuse Copilot credentials.

**Settings / Repositories** accepts reviewed lists of repository URLs, including common bullet and numbered-list formats. Choose the local parent folder, preview every normalized URL and destination, correct invalid entries, then import the reviewed list.

Imports are sequential. Cancelling stops remaining dispatches but preserves completed registrations and partial destinations for inspection. Existing matching checkouts are registered without being overwritten.

```sh
moguri project add /absolute/path/demo-app
moguri project clone REPOSITORY_URL /absolute/new-folder --confirm-write
moguri project import-preview repositories.txt --root /absolute/parent
moguri project import repositories.txt --root /absolute/parent --digest REVIEW_SHA --confirm-review
moguri project imports
moguri project import-read BATCH_ID
```

Use the digest from the current preview. Reusing a stale preview or repeating an import with an unknown outcome is not recovery.

## Project settings

Open a project's context menu or focus its name and press Shift+F10. Project settings include:

- Upstream, main branch, and branch naming.
- Read-only and denied folders.
- New-session control defaults.
- Project instructions, MCP configuration, and plan-file paths.
- Canonical SSH workspace mapping and Sandbox settings.
- Reviewed scripts and preview settings.

Saving a script or a branch pattern does not execute it or create a worktree. Missing default files are reported rather than created or pushed automatically.

Repository instructions normally use `AGENTS.md`. Nested instructions and supplementary `moguri.md` files apply along the selected path. Text instructions cannot override hard policy.

Changing a remote has its own exact-root review. It does not fetch, rewrite the history of old PR sources, or silently alter another linked worktree.

## Create an isolated worktree

Choose **Project settings / Isolated worktrees**, enter a new branch, and select an existing base ref. Creation does not fetch or switch the base checkout.

```sh
moguri workspace list PROJECT_ID
moguri workspace create PROJECT_ID docs/demo-update BASE_REF
moguri workspace inspect WORKSPACE_ID
moguri workspace session WORKSPACE_ID
```

Replace `BASE_REF` with a ref that actually exists in your repository. The returned workspace ID identifies the owned checkout.

Each worktree has its own writer lease and derived indexes. Archive or session deletion does not remove the checkout. Removal refuses dirty or untracked files, active jobs, and retained sessions, including archived ones.

```sh
moguri workspace remove WORKSPACE_ID --revision OBSERVED_REVISION --confirm-remove
```

Inspection and reconciliation keep partial creation or removal visible. Do not adopt an unregistered root by guessing its folder name.

## Group repositories

Drop a project onto the center of another project and name the folder. This changes navigation, not filesystem locations.

The folder's New action creates a chat with its member repositories captured explicitly. File, Changes, and Terminal views use repository pickers. They do not choose the first member or substitute a common parent directory.

Use an individual repository session for repository-specific PR, work-item, and workspace-plan operations. Grouping does not combine MCP grants, memory, hooks, or publication permissions.

## Choose a profile

Use the desktop Profile selector, TUI F8, or CLI profile commands:

```sh
moguri profile list
moguri profile create Demo --color '#70538E'
moguri status --profile PROFILE_ID
moguri tui --profile PROFILE_ID
moguri desktop --profile PROFILE_ID
```

Creating a profile does not select it, copy another profile's data, or sign in. Accounts, settings, projects, sessions, artifacts, memory, and MCP grants remain scoped.

Omitted CLI or SDK scope means Default, not the last profile viewed in another client. `--profile` overrides `MOGURI_PROFILE_ID`.

Switching profiles preserves old work under its original owner. Global environment restrictions and hard budgets still apply. Profile deletion and merging are not available in this build.

## Drafts and prompt delivery

Drafts autosave after an editing interval. Only an acknowledged save is durable. Conflicts preserve local text and offer Reload saved draft or Keep my draft.

| Action | Behavior |
| --- | --- |
| Send | Admit the current prompt when the session can accept it. |
| Queue | Wait for the active turn before sending a new turn. |
| Hold | Save a queued prompt without starting it. |
| Steer | Deliver to the active turn at its next eligible model-step boundary. |
| Interrupt | Request cancellation, wait for settlement, then admit its prompt before ordinary queued work. |
| Stop | Stop the current owned work and hold undispatched input. It does not undo completed effects. |

A steer that misses its turn remains unapplied. Use the explicit Queue as new turn action rather than assuming it was sent.

Queue items can be edited, reordered, or removed only while unclaimed. Releasing queued work sends prompts serially. Restart does not automatically drain held queues.

```sh
moguri queue list --session SESSION_ID
moguri queue hold prompt.txt --session SESSION_ID
moguri queue edit QUEUE_ID revised-prompt.txt --session SESSION_ID
moguri queue run QUEUE_ID --session SESSION_ID
moguri queue remove QUEUE_ID --session SESSION_ID
moguri session stop --session SESSION_ID
```

Slash input has the same queue ordering. A held slash command is not executed eagerly and does not become ordinary model text.

## Schedule a prompt

In an ordinary idle chat, Cmd/Ctrl+Enter opens the send-now or scheduling choice. During active work it holds the prompt. Held slash input remains held.

Choose 5, 10, 30, or 60 minutes, or a custom local date and time. Repeated daylight-saving times show their exact occurrences; nonexistent times are rejected. Manage the result in **Automations / Scheduled prompts**.

The schedule captures the saved draft and its controls. A new draft remains independent. Send now and the timer can claim the original input only once. Stop pauses undispatched schedules; archive cancels them.

An example `timing.json` for a five-minute delay:

```json
{
  "kind": "delay",
  "minutes": 5,
  "timeZone": "UTC"
}
```

```sh
moguri scheduled create timing.json --session SESSION_ID
moguri scheduled list
moguri scheduled send-now SCHEDULE_ID
moguri scheduled cancel SCHEDULE_ID
```

Creation consumes the existing saved draft, not prompt text from the timing file. A delayed prompt can still be blocked by changed controls, unavailable models, or current policy.

General-purpose recurring Automations are not implemented. Scheduled prompts are a separate available feature.

## Answer questions

A real question shows its exact choices or a freeform answer field. A Guided recommendation is advice from the current solver, not an accepted answer.

Choosing an offered answer preserves unrelated draft text. Answer question can consume the saved text explicitly. Cmd/Ctrl+Enter still holds instead of answering.

```sh
moguri question list
moguri question read QUESTION_ID
moguri question answer QUESTION_ID answer.txt --revision OBSERVED_REVISION
moguri question answer-draft QUESTION_ID --revision OBSERVED_REVISION
```

A stale, cancelled, or interrupted question rejects input. Never put credentials in an answer. Answering a question is not a tool approval or a memory promotion.

## Attach context

Use the Attach menu or an explicit typed picker. Prefixes stay literal until you choose a source.

| Source | Selection |
| --- | --- |
| Project file or folder | `@project-name/path` |
| Local file or folder | `^/absolute/path` |
| Session text | `:session-name` |
| Issue or PR | `#NUMBER` in a project, or an explicit `owner/repo#NUMBER` |
| GitHub file | Choose the explicit repository and file through the GitHub picker. |

Captured context is immutable. Editing the original later does not change the saved attachment. Remove deletes draft context, not the original file or sent history.

Folders, GitHub references, and session-text snapshots show a source preview and require the current digest before confirmation.

```sh
moguri context file /absolute/path/example.txt --session SESSION_ID
moguri context image /absolute/path/example.png --session SESSION_ID
moguri context folder /absolute/path/examples --session SESSION_ID
moguri context folder /absolute/path/examples --session SESSION_ID --digest REVIEW_SHA --confirm-review
moguri context session SOURCE_SESSION_ID --session DESTINATION_SESSION_ID
```

Text pastes over 50 logical lines become retained `paste_file` attachments, up to 128 KiB. Models receive a descriptor and use bounded approved reads. A failed save preserves unsent text.

Images must be supported by the selected model. Unsupported image context blocks admission instead of silently dropping the image. Input images are bounded to 8 MiB and 16 million pixels. Folder capture is bounded to 200 UTF-8 files and 2 MiB, with ignore and protected-path rules.

## Read PDF, Word, and Excel files

Use **Attach / Local file** for `.pdf`, `.docx`, and `.xlsx`. Extraction is local. Models receive descriptors, then use bounded approved page, section, cell, or search reads.

```sh
moguri context document /absolute/path/example.pdf --session SESSION_ID
moguri context documents --session SESSION_ID
moguri context document-read ATTACHMENT_ID --session SESSION_ID --filters '{"page":1,"limit":4096}'
moguri context document-read ATTACHMENT_ID --session SESSION_ID --filters '{"sheet":"Sheet1","range":"A1:D20"}'
moguri context document-search ATTACHMENT_ID --session SESSION_ID --filters '{"query":"example","limit":5}'
```

Originals are limited to 8 MiB, ZIP expansion to 32 MiB, PDFs to 200 pages, and spreadsheets to 32 sheets and 50,000 actual cells. Extraction is bounded to 2 MiB. The combined context limit is 16 attachments and 12 MiB, counting original and extracted bytes.

Encrypted, malformed, or unsupported content fails explicitly. There is no OCR, external conversion, formula recalculation, or external-link fetching. Word extraction is not a full visual-layout renderer.

## Side chats and child sessions

Side chat is a separate read-only conversation. New side questions capture the parent's latest retained public context, not its unsent draft. It cannot promote itself to a write-capable agent.

User-created agent children and optional model-created tool-less subagents are different features. Navigation nesting does not grant coordination or write authority. Model-owned subagents cannot be detached into ordinary sessions.

Use `/side` to open the side conversation, or `/side QUESTION` to send that specific question. Use `/subsession` only when you want a separate attached agent session.

## Plans, artifacts, and terminal output

The Plan view shows a checklist explicitly supplied by the owning model. Checkmarks and estimates do not prove completion. A workspace plan file is a separate reviewed document.

Artifacts retain plans, decisions, answers, notes, and reports independently of the original session. They preserve source and edit history without becoming instructions or permissions.

An example `document.json`:

```json
{
  "kind": "plan",
  "name": "Demo plan",
  "text": "Read the project instructions before editing files."
}
```

```sh
moguri artifact create document.json --session SESSION_ID
moguri artifact read ARTIFACT_ID
moguri artifact export ARTIFACT_ID --output /absolute/new-export.json
```

Exports create a new private file rather than overwriting a different existing file. Review sensitive text before explicitly copying artifacts into Git.

The User terminal is your console. Agent terminal shows the agent's approved commands and output. The agent does not read private User or Global console buffers automatically.

Hiding Terminal does not close its shell. Use Close terminal to stop the owned console. A service restart can reattach an authenticated console without replaying input; ordinary service stop closes known owned groups.

## Archive, delete, and recover

Archive preserves the conversation and drafts, stops selected owned work, and holds pending prompts. Delete removes session data but preserves external PRs, repositories, worktrees, ordinary independent artifacts, and accounting.

Permanent deletion also removes candidates and generated proposals originating from that session. Child-tree actions require the configured cascade or detach choice. Unknown effects block deletion until inspection.

```sh
moguri session archive --session SESSION_ID --children detach
moguri session restore --session SESSION_ID
moguri session resume --session SESSION_ID
```

Resume authorizes continuation after inspection. It does not prove that every child process was cleaned up. Interrupted tools and unknown command outcomes are not replayed.

Automatic archive and delete start off. Their ages differ, and drafts, pending input, active descendants, consoles, or unconfirmed effects prevent automatic cleanup.

For execution boundaries, use [permissions and execution](execution.md). For errors, use [troubleshooting](troubleshooting.md).
