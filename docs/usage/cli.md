# CLI and shortcuts

Run `moguri --help` for the exact syntax in your installed build. These references describe the current development CLI. A listed operation still needs its policy, source review, model capability, and runtime readiness.

## Choose a launcher

For an installed managed command:

```sh
moguri
moguri desktop
moguri --help
moguri status
```

From a built source checkout:

```sh
node bin/moguri.mjs --help
node bin/moguri.mjs status
npm start
npm run desktop
```

`moguri` defaults to the TUI. One-shot capability commands connect to the shared service and do not need the desktop UI. Importing the SDK or asking for help does not itself start model inference.

## Global options and review values

| Option | Use |
| --- | --- |
| `--help` | Print CLI help before connecting to the service. |
| `--profile PROFILE_ID` | Use one immutable profile. Overrides `MOGURI_PROFILE_ID`. |
| `--session SESSION_ID` | Bind an operation to the actual session. |
| `--project PROJECT_ID` | Bind a capability to a project. For TUI startup this option takes a project path instead. |
| `--workspace WORKSPACE_ID` | Select a registered workspace where the operation supports it. |
| `--revision N` | The revision observed in the current read or preview. |
| `--digest SHA` | The exact current source or review digest requested by that operation. |
| `--controls FILE` | Explicit new-session control overrides. |
| `--confirm-review`, `--confirm-write`, `--confirm-remove` | Separate reviewed actions. They are not interchangeable or blanket permission. |
| `--confirm-cost`, `--confirm-git`, `--confirm-stage-and-test` | Specialized cost, source-publication, and validation reviews. |
| `--children archive`, `delete`, or `detach` | The applicable child-tree action, or a saved explicit preference. |

Uppercase IDs, revisions, digests, URLs, and filenames are placeholders. Get actual IDs from `moguri status` or the relevant list/read command. Preview immediately before a write, and do not reuse a digest after the source changes.

Credentials use dedicated UI inputs or piped stdin, never secret shell arguments.

## Session and project commands

```sh
moguri project add /absolute/path/demo-app
moguri project get PROJECT_ID
moguri project clone REPOSITORY_URL /absolute/new-folder --confirm-write
moguri session create --project PROJECT_ID
moguri session create
moguri session rename 'Demo session' --session SESSION_ID
moguri session mode read-only --session SESSION_ID
moguri session mode agent --session SESSION_ID
moguri session stop --session SESSION_ID
moguri session resume --session SESSION_ID
moguri session retry --session SESSION_ID
```

Project actions also include `sources`, `diff`, `porto`, `repositories`, revisioned `set` and `relocate`, reviewed repository import/remote changes, and removal with explicit artifact disposition.

Workspace actions include `list`, `discover`, `create`, `inspect`, `reconcile`, `remove`, `session`, `files`, and `file`. They do not adopt or delete arbitrary discovered roots.

Session actions include `organize`, `model-settings`, `context`, `spawn`, `from-pr`, `from-issue`, `archive`, `restore`, and confirmed deletion.

## Prompt and schedule commands

```sh
moguri queue list --session SESSION_ID
moguri queue hold prompt.txt --session SESSION_ID
moguri queue copy QUEUE_ID --session SESSION_ID
moguri queue edit QUEUE_ID prompt.txt --session SESSION_ID
moguri queue run QUEUE_ID --session SESSION_ID
moguri queue remove QUEUE_ID --session SESSION_ID
moguri queue reorder FIRST_ID SECOND_ID --session SESSION_ID
moguri scheduled list
moguri scheduled create timing.json --session SESSION_ID
moguri scheduled send-now SCHEDULE_ID
moguri scheduled cancel SCHEDULE_ID
```

Hold does not run the prompt. Scheduled creation consumes an existing saved draft. See [drafts and prompt delivery](sessions.md#drafts-and-prompt-delivery) and [scheduling](sessions.md#schedule-a-prompt).

## Model and budget commands

```sh
moguri models list
moguri models refresh
moguri models catalogue
moguri models provider PROVIDER_ID enable
moguri models source API_MODEL_ID CONCRETE_MODEL_ID
moguri models evidence MODEL_ID
moguri models readiness MODEL_ID --session SESSION_ID
moguri session kupo-mode balanced --session SESSION_ID
moguri budget status SESSION_ID
moguri budget set SESSION_ID session-budget.json --confirm-review
moguri dashboard work
moguri dashboard usage
moguri dashboard cost
moguri dashboard velocity
```

Model commands also include enable/disable, resource-bound token management, runtime preview/review/probe, and readiness-target inspection. Budget commands include `dashboard`, `calls`, `plans`, and separate revisioned profile/global hard policy.

Prices and telemetry are distinct from model admission:

```sh
moguri prices
moguri prices refresh
moguri telemetry operations
moguri telemetry storage
```

## Context and retained-document commands

```sh
moguri context file /absolute/path/example.txt --session SESSION_ID
moguri context image /absolute/path/example.png --session SESSION_ID
moguri context document /absolute/path/example.pdf --session SESSION_ID
moguri context documents --session SESSION_ID
moguri context document-search ATTACHMENT_ID --session SESSION_ID --filters '{"query":"example","limit":5}'
moguri artifact list
moguri artifact read ARTIFACT_ID
moguri artifact history ARTIFACT_ID
moguri question list
moguri question read QUESTION_ID
moguri plan read --session SESSION_ID
moguri progress --session SESSION_ID
moguri activity list --session SESSION_ID
```

Context also supports reviewed folder, GitHub, and session captures, original-byte access, bounded document reads, and capture cancellation.

Artifacts support create, update, promote, archive, restore, confirmed delete, exact export, and reviewed project materialization. Question answers require the current question revision. Remote plan saves additionally require the current reviewed binding.

## Integration and execution commands

| Family | Available actions and purpose |
| --- | --- |
| `github` | `browse`, `preview`, `execute`, `history`, `read`, `wait`, `stop`, exact PR `ci-preview`/`ci`, and inspection acknowledgement. |
| `linear` | `status`, `import`, `catalog`, `issue`, reviewed `preview`/`execute`, original history/read/wait/stop, and key management through stdin. |
| `issues`, `kanban` | Local tickets, phases, board configuration, paged work items, and explicit continuation tasks. |
| `mcp` | Session gateway, server metadata, tool discovery, auth status, OAuth login/status/cancel/clear, tokens, and reviewed Remote grants/calls. |
| `remote` | `status`, `probe`, original-run `reconcile`, inspection acknowledgement, and resource-bound model keys. |
| `sandbox` | Readiness/runs, bundled setup, reviewed enable/probe/preparation, original execution/result/stop/reconcile, and separate source publication. |
| `worker --stdio` | Installed versioned SSH worker bridge. It is not a login or provisioning command. |
| `terminal` | Existing console list/read/reconcile/close, explicit session open, stdin input, owner inspection, and acknowledgement. |
| `firewall` | Exact Local website allowances. Not an OS firewall for approved shell commands. |
| `tools`, `tool`, `tool-result` | Scoped typed discovery, an exact approved tool job, and original-result pages. |
| `watch`, `state`, `coordinate` | Original owned jobs, canonical service-backed views, and explicit parent/child coordination. |
| `agent-terminal` | Approved agent command history, not private User-console access. |

Native Git commands use the shared slash route:

```sh
moguri slash '/git status' --session SESSION_ID
moguri slash '/git diff staged' --session SESSION_ID
```

Do not infer a standalone `moguri git` interface from the slash name.

## Settings, knowledge, and lifecycle commands

| Family | Available actions and purpose |
| --- | --- |
| `profile` | List, create, revisioned update, explicit retry/stop, and shared-default review. |
| `config`, `prompt` | Get/set/reset settings or system prompt. Prompt edits require risk acknowledgement. |
| `memory` | Index, state, search, and graph on the selected actual root. |
| `skills`, `plugins` | Fresh source discovery/read and reviewed imports. |
| `capability` | Version/history, explicit enable/disable, disabled rollback, and reviewed skill insertion. |
| `knowledge` | Sky/Terra/Glacier list/search/read/save/update/history/version, explicit promotion/rollback/forget. |
| `hooks`, `marketplace` | Reviewed disabled imports and committed catalogue/bundle operations. |
| `cache` | Exact lock inspection, integrity/advisory preparation, script-free install, registry management, and stdin credentials. |
| `repository` | Explicit root-bound metadata preview/refresh/state/clear and exact observation stop. |
| `metachat`, `suggestions`, `configuration` | Reviewed settings help, scoped suggestions, and human-approved exact proposals. |
| `attention` | Read acknowledgement, not question answering or tool approval. |
| `service` | Explicit `restart`, `stop`, or `info`. `info` can start a service. |
| `runtime`, `storage` | State and owned power status, reviewed store relocation, and explicit power retry. |
| `updates` | Separate private-release status/history/read/check/cancel and credential handling. |
| `notification-sounds` | Profile-owned sound metadata/import/removal, not implicit playback. |
| `dictate` | Status, licensed download, native recording, and local file transcription. |
| `containment` | Inspect process-group limits or explicitly require qualified Sandbox. |

Advanced proposal families are `candidate`, `roles`, `compound`, `winddown`, `decisions`, and opt-in `agents`. They have separate source, cost, stage/test, acceptance, runtime, and publication reviews. A command list is not qualification or permission.

## Submit slash commands

Use the actual queued command route:

```sh
moguri slash '/model MODEL_ID' --session SESSION_ID
moguri slash '/theme ocean dark' --session SESSION_ID
moguri slash '/read-only' --session SESSION_ID
moguri slash '/kupo status' --session SESSION_ID
moguri slash '/review inspect the current changes' --session SESSION_ID --hold
moguri commands list --session SESSION_ID
moguri commands read EXECUTION_ID
```

`--hold` keeps the command inert. Busy requests return their queue identity. UI-only results can wait for a compatible client; they are not silently marked applied.

In a composer, type `/` to view built-ins and enabled skills. Selection fills or loads the command; it does not automatically run it.

| Area | Main slash routes |
| --- | --- |
| Navigation | `/session`, `/sessions`, `/work-items`, `/code-requests`, `/sidebar`, `/settings`, `/profiles` |
| Chats | `/new`, `/open`, `/rename`, `/read-only`, `/agent`, `/side`, `/subsession` |
| Prompts | `/queue`, `/run`, `/steer`, `/interrupt`, `/resume`, `/stop`, `/copy`, `/question` |
| Models | `/connect`, `/models`, `/model`, `/model-settings`, `/thinking`, `/effort`, `/context-window`, `/kupo` |
| Review workflows | `/review`, `/security`, `/performance`, `/debug`, `/impeccable`, `/continue`, `/orchestrate`, `/spawn`, `/spar`, `/critique` |
| Files and documents | `/files`, `/file`, `/attach-file`, `/attach-image`, `/attach-folder`, `/attach-github`, `/attach-session`, `/attach-document`, `/documents`, `/document-read`, `/document-search` |
| Access | `/approve`, `/approvals`, `/firewall`, `/mcp`, `/mcp-remote`, `/containment` |
| Work and integrations | `/git`, `/github`, `/linear`, `/kanban`, `/work-item`, `/continue-work`, `/workspace`, `/candidate`, `/compound` |
| Retained information | `/plan`, `/progress`, `/activity`, `/agent-terminal`, `/artifacts`, `/artifact`, `/dashboard`, `/budget`, `/repository` |
| Optional capabilities | `/memory`, `/knowledge`, `/skills`, `/capability`, `/hooks`, `/marketplace`, `/cache`, `/compact` |

Some routes open native views only in a compatible client. `/help` is the complete catalogue for your build, including aliases and advanced argument forms.

## Desktop shortcuts

| Shortcut | Action |
| --- | --- |
| Enter | The current composer action, normally Send. Retry or Resume states act on their labeled original operation. |
| Shift+Enter | Newline. |
| Cmd/Ctrl+Enter | Hold during active work; ordinary idle text opens the scheduling/send-now choice. Slash commands remain held. |
| Shift+Cmd/Ctrl+Enter | Explicit send-now or answer from saved composer text. |
| Cmd/Ctrl+K | Command palette. |
| Shift+F10 on a name | Context menu for a project or session. |
| Alt+Up/Down on a name | Reorder within the appropriate sibling group. |
| Ctrl+Space | Default held dictation shortcut after explicit setup. |
| Left/Right on a focused resize separator | Resize the pane; Home/End choose its supported bounds. |

Settings editors have their own Save behavior. A save shortcut is not a prompt send. Protected text-editing shortcuts cannot be reassigned to conflicting actions.

## Terminal interface

| Shortcut | Action |
| --- | --- |
| Enter / Shift+Enter | Composer primary action / newline. |
| Cmd/Ctrl+Enter | Hold active input or use the idle scheduling choice. |
| Shift+Cmd/Ctrl+Enter | Send now; settings editors still use Ctrl+Enter to save. |
| Ctrl+O / Ctrl+N / Ctrl+P | Open project / new session / select session. |
| Ctrl+L / Ctrl+M | Copilot sign-in / model picker. |
| Ctrl+C | Stop active owned work without closing the TUI. |
| Ctrl+Y / Ctrl+D | Approve the exact pending tool / deny. |
| Ctrl+V | Focus full approval arguments. |
| Ctrl+R / Ctrl+S | Reload saved draft / save or keep the local draft explicitly. |
| Ctrl+G | Shared settings and prompt editor. |
| F2 / `/details` | Expand retained conversation/tool details. |
| F3 | Follow the latest output. |
| F4 | Insert the completed native dictation transcript. |
| F5 / F6 | Artifact library / actual question choices. |
| F7 / F8 / F9 | Dashboard / profiles / scheduled-prompt Automations view. |
| F10 / F11 | Retry the eligible model failure / automatic Kupo mode. |
| PgUp/PgDn | Read history without changing the draft. |
| Esc / Ctrl+Q | Return to composer / save and leave. |

Tab focuses navigation. Up/Down chooses a target and Enter opens it. Left/Right operate the sidebar only in navigation focus; composer arrows edit normally.

There is no need to leave a terminal command running just to show a view. Commands and UI actions have retained outcomes, explicit ownership, and their existing policy boundaries.
