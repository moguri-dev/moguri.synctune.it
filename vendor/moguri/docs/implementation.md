# Moguri implementation specification

> A local-first control plane for AI-assisted software development.

Moguri gives developers one place to run, inspect, steer, stop, resume, and understand AI software work across a terminal UI and desktop application.

The [2026-11-06 merged-code audit](remaining-milestone-gaps.md#merged-code-audit-2026-11-06)
reconciles protocol 92 / #51 with the live [roadmap #39](https://github.com/mbianchidev/moguri/issues/39).
Runtime readiness, pooled Kupo controls, candidate transports and the final
implementation-owned source checks are delivered, not pending draft work.
Exact native physical acceptance and the current GitHub CI account-eligibility
gate remain open. The criteria below are unchanged; future workflows and
distribution do not silently become milestone requirements.

Protocol 88's [session-controls and interactive-tool slice](architecture/session-controls-and-tools.md)
exposes actual IDs and reviewed context mentions, exact success-only task
dependencies, scoped peer messages, project-local priority/pinning/bulk actions,
multiple verified PR associations and actual CI/review panes. Explicit voice
enable/disable owns the sole pinned model; the factory shortcut taps to start
and finish, with optional held push-to-talk and separately consented standby.
Actual JS/TS semantic and deterministic array tools, isolated interactive HTML
and owned Local Electron/Chromium screenshot delivery reuse the same SDK,
worker, approvals and encrypted events. Other semantic languages, arbitrary
native OS control, non-Local app interaction and general-purpose automations
remain unavailable. This does not complete the first milestone.

The owner-requested [shared theme and TUI navigation slice](architecture/themes-and-tui.md)
adds missing preset palettes through the existing SDK settings, plus original
JRPG-style terminal menus with genuine mouse tabs, a focus-safe arrow sidebar
and primary slash discovery. Code requests reuses existing session-linked PR
and diff capabilities, not the deferred global inbox. This independent
protocol-78 source does not include the separate protocol-77 model-continuity
workstream and does not complete the first milestone.

Protocol 72 adds [Home-backed ordinary Local chats](architecture/project-free-execution.md):
their real null project identity is separate from captured canonical
Home/device/inode and ordinary approved file/command tools. All clients share
that binding and independently retained actual-writer recovery. No previous
project, replacement root, credentials, permissions or non-Local fallback is
inferred; private roles remain root-less/tool-less and repository publication
still requires an explicit real project.

Protocol 57 makes [candidate retention](architecture/candidate-cleanup.md)
session-owned: permanent origin-session deletion, including archived expiry,
deletes its candidates and fixed-model proposal reports after owned work settles.
Archiving alone preserves them. Fresh authoritative verification of each exact
associated repository/PR merge also deletes those proposals, without following
session relinks or deleting newer work. Ordinary artifacts, required accounting,
applied code and Git resources keep their existing lifecycle. Candidate creation
requires an explicit project backed by the exact Git root in every client and
the service; project-free chats and plain folders never inherit another root.

It is built from zero: Moguri owns its domain model, event store, protocol, local service and clients, and borrows maintained libraries for providers, MCP, terminals, diffs and storage. The [architecture decisions](architecture/decisions.md) record the stack. Moguri is inspired by [OpenCode](https://github.com/anomalyco/opencode) and [Pi](https://pi.dev/), forks neither, and is not affiliated with either project.

> [!WARNING]
> Moguri is pre-alpha. An [initial executable macOS checkpoint](setup.md) now exists for Local/Manual Copilot sessions in TUI and desktop. Its [engagement slice](architecture/engagement.md) adds project-free chats, MCP OAuth, scoped suggestions, reviewed settings chats and attention indicators. This document still defines the wider product direction, architectural constraints, first milestone and working agreement; it does not claim completion of every described capability. [Phase 0 evidence](architecture/phase-zero.md) records passes and unresolved release blockers.

> The [protocol-58 lean tooling slice](architecture/lean-tooling.md) adds lazy
> typed native discovery, deterministic compact/recoverable outputs, structured
> documents and SQL, explicit watches/DAP and browser-free search. Scoped
> parent/child messages, public context/progress and delegated work share the
> existing policy, writer and all-role ledger. Side chats stay read-only.
> Lowercase review/security/performance/debug workflows use the selected
> session's existing controls. No universal token-saving/quality claim,
> automatic summarization, new agent framework or wider milestone completion
> follows from this slice.

> The user-requested [SDK platform slice](architecture/sdk-platform.md) adds
> default-dark branding, shared prompt/permission settings, opt-in local memory,
> approved extension proposals, optional read-only subagents, a native MCP
> gateway and local Nemotron dictation. These use one importable SDK, not
> client-only implementations. They do not complete the later unattended
> self-evolution, routing or execution-backend roadmap. The separately
> owner-requested [protocol-41 platform extension](architecture/platform-workflows.md)
> now adds reviewed memory tiers, lifecycle hooks, repository-backed catalogs,
> explicit Git/GitHub and Linear writes, and private/workspace/broader caching.
> This is not permission to enable unrelated deferred work or claim first-release
> acceptance from version numbers.

> The additional [workspace platform slice](architecture/workspace-platform.md)
> implements integrity/advisory-gated shared npm/pnpm caching, script-free
> managed installs and a local project Kanban with verified merge transitions
> and optional read-only Linear imports. Lifecycle execution remains blocked
> without real SendBox qualification. These features share the SDK and event
> authority; they do not create a second hosted issue system.

> The owner-requested [project Kanban/pricing follow-up](architecture/project-kanban.md)
> adds one project board chat, shared visibility/source preferences, same-panel
> GitHub/Linear work, card binding and one actual-user delegated Local task through
> its draft PR. Project context menus and drag ordering share SDK authority.
> Named models can use originating-provider API-equivalent estimates through
> Copilot/resellers, with captured sources and separate finite-limit consent.
> This is not an invoice, a backlog scheduler, a merge grant, qualified fork-head
> publication or Remote/Sandbox continuation.

> The [session workspace slice](architecture/session-workspace.md) implements
> held prompts, shared slash actions, enforced read-only/side sessions,
> session/project organization, independent plan artifacts and explicit
> retention/deletion. Desktop uses actual Ghostty WASM, an isolated web preview
> with optional [user-toggled Local agent control](architecture/agent-browser.md)
> and SDK-backed diff/plan panels. The optional [Stainless integration](architecture/stainless.md)
> (protocol 111) is Moguri-owned headless automation plus open-with; Stainless MCP
> (#80) and the rest of the first-release acceptance gates are not implied complete.

> The [runtime/input foundation](architecture/runtime-foundation.md) adds
> explicit local generative endpoints, snapshotted control inheritance and
> [typed context](architecture/context-inputs.md). The [core SSH slice](architecture/execution-transports.md)
> runs the same worker/model/file loop remotely with pinned identity and
> no-replay recovery. Read-only files/Git/plan views now share that SSH transport;
> Remote console/extension/memory transport, native Sandbox
> and routing are not implied complete by that foundation.
> Protocol-24 reviewed Remote MCP and protocol-25
> [owned Remote user consoles](architecture/remote-user-consoles.md) extend
> that foundation through the same SDK and actual clients. Their pinned-peer
> state, exact approvals/ownership and no-replay lifecycle do not qualify
> native Sandbox, Remote repository memory or later routing/orchestration.

> The [managed Local workspace slice](architecture/managed-workspaces.md) adds
> explicit worktree creation/discovery/removal, change-set context, per-root
> writer leases and consistent worker/files/plan/terminal/memory/cache roots.
> Remote/Sandbox mappings, external adoption and compound orchestration remain
> separate first-release work. The independent-artifact slice now adds the five
> text classes, exact source actors, revisions and reviewed retain/export/delete
> choices. Structured clarifications now record actual user answers with
> opt-out independent retention. Folder/work-item associations and reviewed
> repository history copies with optional new local commits are now wired across
> clients. Delegated decision answers remain open; no routing or containment
> qualification is inferred from this artifact slice.

> The [budget/telemetry slice](architecture/budgets.md) now adds explicitly
> estimate-based session caps, separate cumulative profile/global policy,
> atomic all-role reservations, held unknowns, exact reported-total settlement,
> late SSH metering and a shared aggregate dashboard. No exact billing claim,
> automatic refund, routed kupo wind-down or authorized checkpoint commit is
> inferred. A budget stop retains a diagnostic artifact without an extra model.

> [Chat activity](architecture/chat-activity.md) adds compact operation rows,
> session-scoped original arguments/results, observed timing/output quantities,
> public-response copy and original turn information. The compact usage view
> keeps all-role accounting and hard policy; it does not expose hidden reasoning,
> invent AI credits or change execution/approval authority.

> The [separate Agent terminal](architecture/agent-terminal.md) exposes actual
> approved command requests/results and bounded original rereads through the
> same SDK/worker. User and Global consoles stay private. Each command owns its
> existing PTY; interactive stdin or persistent shared shell state is not added.

> The [shared command/tool-preference slice](architecture/command-tool-preferences.md)
> adds original UI-design, continuation, collaboration and constructive critique
> presets, atomic Manual child assignment and user-requested owned orchestration
> on the existing queue/worker/coordination path. Suggestions default to the
> actual project while retaining source review. Profile-owned method ranking
> defaults to Gateway MCP, direct MCP, REST, then CLI; exact direct MCP schemas
> retain the existing service-owned gateway approval, account/root and transport
> boundaries. None of these commands answers questions, enables optional
> tool-less subagents globally or authorizes unknown-effect replay.

> [Reviewed context compaction](architecture/context-compaction.md) now adds an
> explicit preview/generate/review/apply/restore workflow through the same SDK,
> Local/SSH worker and all-role ledger. Original history, complete recent turns
> and drafts stay retained. Source/model/policy-bound text proposals never become
> user answers, permissions or automatic memory. Images, automatic compaction
> and implicit kupo compactor selection remain unsupported. Fresh current-input
> estimates preserve finite admission without rewriting real reported usage.

> The [profile slice](architecture/profiles.md) adds immutable SDK/store/
> controller scopes, isolated accounts/data/editors and root-owned global
> environment policy, startup preferences and budget capacity. Actual CLI/TUI
> and packaged desktop switching preserve old owned work; migration 14
> preserves Default identity/keys/receipts. Profile deletion/merge, native
> Sandbox and routed decisions are not implied.

> Protocol 96 adds [original-owner startup continuation and window-close
> background work](architecture/startup-responsiveness.md#protocol-96-original-owner-readiness-and-background-window-close).
> An unconfirmed readiness deadline preserves service-owned saved drafts and requires
> explicit reconnect to its captured authenticated owner; it never starts a
> substitute service. The root-owned default-on window-close preference keeps
> the same agent work and user terminals running after the desktop window
> closes. Explicit Quit still stops the service, and an opt-out restores stop
> on window close. Genuine protocol-95 inbox history, permissions and accounting
> remain retained. This does not claim the original unreproduced 90-second
> initialization delay or wider native/milestone gates are resolved.

> Protocol104 removes startup drafting, keeps only the flight/progress/recovery
> opening, and indexes exact event-header metadata to avoid repeated full-body
> JSON scans without skipping validation or payload authentication. Kupo has no
> manual effort level: Balanced/Savings/Performance are routing preferences and
> the classifier owns thinking. Retained overrides require explicit clearing.
> Imported skills use toggles plus project-scoped Enable all, never implicit
> source admission or permissions. See the [change and measured startup contract](architecture/startup-responsiveness.md#simplified-opening-and-classifier-owned-kupo-thinking).

> Protocol99 adds the [session Inbox and explicit skill-load activity](architecture/session-inbox.md).
> Inbox follows Dashboard and opens the exact source conversation for actual
> answers/approvals. Notification read/deletion is independent from that work;
> session deletion removes its notifications. Successful complete loads retain
> named, source-bound book indicators across the shared SDK and clients.
> Genuine98 ciphertext, checkpoint/source authority and accounting are preserved.

> Guided questions may now carry a bounded recommendation from the already
> metered current solver response. It retains model provenance and still waits
> for the actual user, who may choose differently. Tool advice binds the current
> step rather than older narration. This does not enable System One/Jev,
> Autopilot Max, automated steering or a hidden extra model call.

> [Experimental kupo Single](architecture/routing.md) now uses one explicitly
> approved scoped pool and the existing owned worker, approvals and all-role
> ledger. It is off by default, requires separate hosted-data consent, records
> actual router/solver provenance and pauses without fallback on invalid or
> stale advice. Any finite inherited cap, images or model-specific tuning block
> this alpha. Cascade, independent critique/revision, compound candidate application,
> calibrated thresholds and reserved wind-down remain first-release work.

> The qualified protocol-29 [manual Local candidate workflow](architecture/candidate-workflows.md)
> adds model-free exact staging and separately reviewed source application to
> SDK, CLI, native TUI and desktop. It preserves raw index/HEAD, independent
> workflow history and honest cancellation/crash outcomes. Its byte/base checks
> do not enable compound model roles, finite kupo budgets or automatic commits.

> The protocol-30 [planned-budget foundation](architecture/budget-plans.md)
> separates held future capacity from actual calls in the same ledger. Exact
> transfers and safe unused release survive stop/restart/source deletion, with
> shared SDK/CLI/TUI/desktop inspection. This is not public finite kupo,
> automatic Git authority or a claim of real-model quality.

> Protocol 31 adds [owned reviewed generation](architecture/candidate-generations.md):
> one explicitly cost-reviewed fixed-model Local draft through the existing
> worker and ledger, original selected snapshots and independently retained
> model provenance/results. All clients expose the same API. Generation cannot
> stage, apply, execute a tool or turn advice into acceptance; those file
> reviews stay separate. Compound routing, finite kupo wind-down and real-model
> quality qualification remain open.

> Protocols 32/33 add independently retained actual role observations and
> [canonical final-role proposal origin](architecture/role-proposals.md)
> through separate staging/application reviews. Qualified protocol 34 adds
> [explicit provider-declared model inspection](architecture/model-evidence.md),
> not inferred family independence, quality or permission.
> Development [owned role contracts](architecture/owned-role-contracts.md) add
> exact response checks and selected prior-result context to that same worker;
> public compound admission, conditional pattern
> policy, finite kupo and Max remain unqualified.

> Issue-17 development source now adds shared model windows/scoped paste,
> reviewed native SendBox execution/publication, Local Cascade/Critique,
> finite Local wind-down and [owned bounded decisions](architecture/owned-decisions.md).
> Local Max uses an explicitly configured compatible alternative with fixed
> or Single-routed solvers; actual user delegation/acceptance remains final.
> The final generated source/native and packed-consumer sweep passes.
> Jev's missing output bound, Remote/native compound/Max/wind-down and live
> quality remain explicit gates. Historical qualified archives and their
> protocol versions are unchanged.

> Protocol 52 adds [app-managed Sandbox](architecture/managed-sandbox.md):
> bundled SendBox (now pinned to 0.2.7, the minimum supported release) plus
> compatible Linux worker/runtime dependencies, exact in-app setup/update
> review, automatic private workspaces and scoped selected-provider DNS aliases.
> A saved older selection is blocked until the user explicitly reviews the
> bundled setup; it is never silently upgraded or replaced by Local. The default
> GitHub grant includes explicitly disclosed GitHub Meta domains and
> shared-cloud CIDRs, cached on the SendBox host and seeded into each guest;
> exact-host-only egress is not claimed. Legacy manual grants, actual tool
> approvals, original guest ownership, source publication and budget
> accounting remain separate.
> This is the supported macOS slice, not Linux or the completed roadmap.

> Protocol84 adds owner-requested
> [current-profile model recovery, scheduled prompts and Kupo modes](architecture/recovery-scheduling-kupo.md)
> through the same service/SDK/worker. Recovery uses the exact 30/90/120/180
> deadline sequence, reset only by a complete metered recovered response.
> Scheduling owns unsent ghost input and one-at-most queue admission. Automatic
> Kupo selects supported effort/max context for Balanced/Savings/Performance;
> frontier/cost/evaluation classes need actual source review. Bounded
> re-review, explicitly enabled text compaction and complete finite Local role
> holds preserve originals, unknown charges and ordinary permissions.
> Fixed-model controls and previous explicit selections remain independent.
> Missing System One and Remote/native wind-down qualification stays blocked;
> no source review, classifier advice or generated fixture is a quality,
> independence, permission or whole-milestone guarantee.

> Protocol85 adds [owned model transports](architecture/owned-model-transports.md)
> to the same draft/source authority. Idle native scheduling can prepare complete
> owned source model-free before ghost admission under the existing explicit
> managed policy. Bounded-model technical/steering decisions and finite metadata
> finishing execute inside the actual selected SSH/native parent, with exact
> role/transport receipts, holds, cancellation and terminal late-data recovery.
> They cannot replay effects, transfer roots, grant source acceptance or adopt
> Local Git. This is the protocol85 boundary, not a whole-milestone completion.
>
> Protocol86's [snapshot retries and transport checkpoints](architecture/native-retry-checkpoints.md)
> implement the user's confirmed off-by-default original-snapshot restaging
> policy and separate accepted-work reviews. Remote Git executes on the original
> pinned peer. Native-model output needs its existing separate source acceptance
> followed by a disclosed new Local branch at the original repository, subject
> to Local policy. Partial publication retains its writer/report until fresh
> actual-user effect inspection; its job, cancellation and charges do not become
> successful or free. Jev's unavailable output/accounting wire remains distinct.
>
> Protocol98 adds [per-turn checkpoints and reviewed rewind](architecture/skills-and-rewind.md)
> as a separate capability, not a renaming of native retry or wind-down Git
> checkpoints. It restores an exact active context branch and optionally
> reviewed Local, pinned Remote or private Sandbox regular files, preserving
> external edits, current Git intent, later history and spent/unknown budgets.
> The same Local source-admission contract binds metadata, static dependencies,
> publisher evidence, least privilege and actual-user revocation across clients.
> Rewind never reactivates a revoked grant or obsolete policy. Native workspace
> qualification does not qualify reviewed-script execution; that wider
> skills-safety gate remains unavailable.

## Why Moguri

Current coding agents optimize individual conversations. Real software work spans repositories, worktrees, issues, pull requests, background processes, CI runs, decisions, and many resumable agent sessions.

Moguri treats that complete lifecycle as the product.

The goal is not another chat interface. The goal is an inspectable and durable workspace where:

- users own their data and credentials;
- terminal and desktop clients operate on the same state;
- every session, message, tool call, process, artifact, and cost event is traceable;
- every running action can be stopped;
- work can survive application restarts and session deletion;
- model providers, policies, tools, and integrations remain replaceable;
- automation remains bounded by explicit permissions, budgets, and stop conditions.

## Product principles

1. **Local first** — Core operation must not require a Moguri cloud service. State is stored locally and can be exported.
2. **User controlled** — Network access, destructive commands, background execution, and autonomous continuation are governed by visible policies.
3. **Interruptible** — Model requests, tools, subprocess trees, MCP calls, subagents, and workflows expose cancellation wherever the underlying provider permits it.
4. **Durable** — Drafts, queued messages, sessions, work items, and artifacts survive restarts.
5. **Observable** — Moguri exposes available prompts, reasoning summaries, tool activity, timing, token usage, compactions, errors, and costs. It must never promise access to hidden chain-of-thought.
6. **Honest accounting** — Estimated cost, provider-reported usage, and billed cost are stored separately.
7. **Portable** — Clients depend on Moguri protocols and domain types, not directly on one model provider.
8. **Profile isolated** — Credentials, projects, policies, integrations, budgets, and memory do not leak between profiles.
9. **No silent autonomy** — Self-modification, scheduled work, merges, pushes, and other consequential actions require explicit policy.

## Core concepts

| Concept | Meaning |
| --- | --- |
| **Profile** | An isolated identity and policy context with its own credential references—including different API keys for the same provider—plus projects, provider configuration, budgets, integrations, and memory boundaries. |
| **Folder** | A collection of related projects or repositories that may participate in one stream of work. |
| **Project** | A repository or local directory managed by Moguri. |
| **Work item** | A durable objective such as an issue, pull request, maintenance task, or user-defined goal. |
| **Change set** | The branch, worktree, commits, diffs, and optional pull request produced for a work item. |
| **Session** | A resumable execution context for one agent. Sessions are replaceable; project knowledge is not. |
| **Turn** | Work initiated by one admitted user or system message. A turn may contain several model steps. |
| **Step** | One model request and the tool activity caused by its response. |
| **Artifact** | Durable knowledge such as a decision, plan, answer, research note, or report. Artifacts outlive sessions. |
| **Workflow** | A declarative combination of a trigger, goal, profile, permissions, budget, stop conditions, and outputs. |

The durable hierarchy is:

```text
Profile
└── Folder
    └── Project
        └── Work item
            ├── Change set
            ├── Sessions
            └── Artifacts
```

A session contains an append-only stream:

```text
Session → Turn → Step → model, message, tool, MCP, process, compaction, and cost events
```

## Target architecture

```text
┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│ Terminal UI  │  │ Desktop app  │  │ VSX extension  │
└──────┬───────┘  └──────┬───────┘  └───────┬────────┘
       └─────────────────┴───────────────────┘
                   typed local API
                  + event stream
                         │
             ┌───────────▼───────────┐
             │ Moguri control plane  │
             ├───────────────────────┤
             │ session lifecycle     │
             │ message queue         │
             │ cancellation          │
             │ worktrees/change sets │
             │ artifacts             │
             │ profiles/policies     │
             │ telemetry/budgets     │
             │ plugins/workflows     │
             └───────────┬───────────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼───────┐
│ agent loop  │  │ provider/model│  │ capabilities │
│ + context   │  │ adapters      │  │ tools/MCP/FS │
└─────────────┘  └───────────────┘  └──────────────┘
```

A Moguri-owned agent loop, using `pi-ai` for providers and authentication, is the first runtime behind the local API. New Moguri code should preserve clear seams so clients, telemetry, artifacts, and policies do not depend on provider-specific payloads.

The optional VSX extension initially targets [`vslocal`](https://github.com/mbianchidev/vslocal) and may support other compatible editors. It is a thin client over the same typed local API and must not become a second control plane.

### One source of truth

Durable state is represented by typed, append-only events. Current state, dashboards, transcripts, and model context are projections of that event stream.

Every durable event must contain at least:

```text
id, schema_version, timestamp, profile_id, project_id,
work_item_id?, session_id?, turn_id?, step_id?,
parent_event_id?, correlation_id?, event_type, payload
```

Events must be versioned and migratable. Large or binary payloads should be content-addressed outside ordinary event rows and referenced by digest.

No client may keep authoritative session state that is absent from the control plane.

### Persistence

Use SQLite for structured local state and define migration conventions before persisting user data. Store large transcripts, attachments, process output, and snapshots as content-addressed blobs when placing them directly in SQLite would harm reliability or performance.

Required properties:

- atomic queue and lifecycle transitions;
- crash-safe writes;
- explicit schema migrations;
- tombstones or trash before destructive deletion;
- configurable retention by maximum age in days and/or storage size in GB, with automatic deletion disabled by default;
- archived sessions that remain visible, searchable, restorable, and individually deletable;
- pinned artifacts excluded from session garbage collection;
- export and backup paths that do not require internal database knowledge.

### Credentials and privacy

Profiles store references to credentials held by the operating-system keychain or another explicit secret backend. Each profile can use a different account or API key for the same provider. Credentials are shared between profiles only through explicit user configuration. Secrets must not be written to config files, events, logs, artifacts, prompts, or analytics.

Moguri must disclose every remote connection it initiates. Product telemetry is opt-in. Local usage analytics remain local unless the user deliberately exports or shares them.

## First milestone: local session control plane

The first milestone proves that Moguri can own the complete local session lifecycle through both the desktop and terminal clients.

### 1. Hybrid desktop and terminal experience

The desktop app and TUI use the same protocol, commands, domain types, and event stream. Core controls must have behavior parity even when presentation differs.

Initial surfaces:

- project and work-item navigation;
- active, idle, blocked, completed, failed, and archived sessions;
- split-panel workflows;
- command palette;
- session detail and event trace;
- compact and detailed rendering modes for messages, steering events, tools, MCP calls, and subagents;
- message composer with persistent drafts;
- editable message queue;
- visible running processes and stop controls;
- basic analytics dashboard.

The desktop app additionally reserves a persistent, main-session-aware sidebar for Changes, Terminal, Files, a Stainless-backed Browser, Side chat, Insights, and Extensions. This is a desktop presentation, not a TUI requirement. Panel capabilities follow the build order; Side chat and the Stainless browser integration remain later work and show a clear unavailable state until implemented. Its data and actions still use the shared local control plane. See [`specs/desktop-sidebar.md`](specs/desktop-sidebar.md).

Desktop stop controls cover the active agent, its subagents, and every command or background process Moguri owns.

#### Composer contract

The [estimated completion bar](architecture/task-progress.md) always shows
available bound-plan checklist progress, periodically rechecked through the
shared API. Long tasks may also expose separately labeled owning-model advice.
Neither percentage replaces actual task results, user acceptance or policy.

Keep the prompt and attached context together, with session controls in this order: **Env**, **Model**, **Autonomy level**, **Budget**. Desktop adds an **Attach** button; the TUI and CLI provide the same attachment and configuration capabilities through text pickers and explicit structured inputs, not a desktop-only button.

| Control | Choices | Factory starting value |
| --- | --- | --- |
| **Env** (Execution environment) | Local, Sandbox via SendBox, Remote via SSH | Local |
| **Model** | kupo, configured local models, authenticated provider models grouped by provider | Unset; unavailable until at least one generative provider login/API key or local model is configured |
| **Autonomy level** | Manual, Guided, Autopilot, Autopilot Max | Manual |
| **Budget** | Unlimited, token cap, USD cap, or both when supported | Unlimited |

The Model control always lists **Kupo**, with setup guidance and an unavailable
reason when no configured generative model is eligible. A configured
decision-only provider such as Jev does not unlock inference. Distinguish
configured, available, loading, expired-auth, incompatible, and unreachable
states. Concrete models stay scoped to the active profile and selected env;
discovery never scans arbitrary hosts or starts paid inference. Recheck
availability at dispatch, and never replace an unavailable saved model silently.

Working-context presets use the exact model maximum and its integer-floored
half, excluding values below the shared 8,192-token working minimum. Without
provider-declared restrictions, exact integer ceilings within that range are
also valid. Genuine provider-declared supported windows remain an exact allowed
set. `/context-window TOKENS|min|half|max` preserves effort; min/max use actual
allowed endpoints and an unsupported floored half fails without substitution.
`/thinking LEVEL` and `/effort LEVEL` preserve context; `default` clears only
effort, using the same actual supported levels as the model control. SDK, CLI,
TUI and desktop share the contract; model changes and stale/default overrides
cannot silently clamp a window or discard history. Request sizing and output
headroom remain explicitly estimated and are rechecked against actual prepared
capabilities, including generation previews and future-role admission.

**Attachments and shortcuts:**

| Attachment | Trigger | Scope |
| --- | --- | --- |
| Single local file | `^` | An explicitly selected client-side file |
| PDF, Word `.docx`, Excel `.xlsx`, image | Attach > Local file or explicitly selected `^` file | Validated local extraction/normalization and encrypted snapshots; bounded approved document inspection, not whole-document model injection |
| Local folder | `^/absolute/folder` | An explicitly selected client-side folder with a bounded, reviewable file set |
| GitHub issue | `#` | An issue accessible through the active profile's authorized GitHub integration |
| GitHub pull request | `#` | A PR accessible through the same integration; label issue and PR results distinctly |
| GitHub file | `@owner/repo/path` | Exact public or explicitly authenticated CLI-readable UTF-8 file snapshot |
| Moguri session | `:session-name`, `:session-ID` or a known full ID | Same-profile reviewed public transcript, including retained archived sources; never another execution root or private console |
| Local project file or folder | `@project-name/path` | Explicit named Local source; the current session's bound Local worktree is used when applicable, never silently replaced by its base checkout |

The desktop Attach menu has five entries: Project file or folder, Issue or pull
request, Session, Local file and Local folder. The local-file picker accepts
source/text, documents and images without duplicate menu entries. Local project
names contain only ASCII letters, digits, hyphens and underscores. `#137` uses
the current project's GitHub upstream; project-free chats specify
`owner/repo#137`. A leading `!` is not an attachment trigger: `!COMMAND` runs
that one line in the chat's own user console (see [shell lines](architecture/terminal-reattachment.md#shell-lines-from-the-composer)). Workspace reads on SSH or
native execution retain their separate exact-root APIs and never become a Local
fallback. Users can paste clipboard images directly into the desktop composer.
TUI image paste depends on terminal/clipboard capabilities; where unsupported,
expose explicit file/path attachment instead of pretending pasted text is an image.

[Document attachments](architecture/document-attachments.md) preserve PDF page,
DOCX body paragraph/heading/table and XLSX sheet/cell/cached-value/inert-formula
provenance. Parse in resource-bounded workers, retain both encrypted source and
extraction, and disclose unsupported OCR/visual content. Models use bounded
descriptor list/read/search tools; never recalculate formulas, fetch embedded
links or grant permission from document instructions. Failed, oversized,
encrypted or unsupported selections preserve the draft. Existing source/text
files such as `.java` and image attachments keep their established behavior.

Text pastes over 50 logical lines become exact scoped text-file attachments,
not whole-paste prompt expansions. Preserve UTF-8 bytes and CRLF/CR/LF endings,
source/profile/session ownership, and unsent text on persistence failure or
concurrent edits. SDK send/queue paths enforce the rule as well as clipboard
handlers. The actual execution boundary must expose bounded, approved file
read/search access, including for project-free chats, without writing an
unexpected source file or injecting the entire body through another route.
Disclose a controller-snapshot broker rather than claiming a filesystem mount;
unsupported tool-less/env combinations retain the data and fail explicitly.
Retention, child copies, queue/restart and exactly 50/51 lines need coverage.

Pickers produce typed, inspectable, removable references or content snapshots, not ambiguous plain-text expansions. `#` results identify repository, number, and issue/PR type. Session attachments retain source/profile permissions and do not resume or control the source session. Preserve file revisions, source links, and snapshot provenance. Bare prefixes in code, URLs, email addresses, or pasted text remain literal unless the user explicitly selects an attachment. Future `@` agent mentions must be typed and disambiguated from project files.

Show folder contents, exclusions, size, and transfer destination before admitting them. Respect protected paths, symlink boundaries, profile permissions, and context limits. An attachment grants access to the approved content, not the entire host filesystem. Sandbox and Remote receive only approved snapshots or workspace references, not arbitrary client paths or home-directory mounts. Filter model candidates for image/file capabilities; do not silently drop context or send it to an unapproved conversion service.

Drafts persist their attachments and control values. Missing files, expired GitHub access, incomplete uploads, unsupported models, or an unreachable remote leave an actionable state and preserve the draft; do not silently send without the selected context. Keyboard navigation, labels, and status announcements must work without relying on icons or pointer input.

**Startup defaults:** resolve explicit session values over repo/project defaults, then active-profile defaults, global defaults, and finally the factory values above. These are user-controlled settings, not permission grants from an untrusted repository file. Show each value's source and effective constraints. New defaults affect new sessions, not an already-running turn; changes to an existing session require an explicit, recorded action at a safe boundary. Policy limits always take precedence over preferences, and an invalid default prompts setup or correction rather than hidden fallback.

The global model picker also offers the current profile's last explicitly
selected model and thinking effort as the no-fixed-model fallback. It does not
mean the last inference, navigation or sent prompt, and does not copy a working
window/draft or cross profile boundaries. Explicit no-model/model-option
overrides remain authoritative. Retain this preference independently of its
source session/project, with atomic actual-user selection and restart/migration
coverage; never infer it from a model role or substitute an unavailable provider.

### 2. Projects, work items, and worktrees

New single-project Local Git sessions default to a service-owned isolated
worktree, unless the actual user explicitly chooses the original checkout or
configures that project preference. Existing conversations keep their root.
Non-Git folders and unqualified multi-repository/transport boundaries cannot
invent worktrees or silently fall back to another checkout. Moguri records the
relationship between work item, branch, worktree, commits and PR without treating
Git as the session database. Code changes normally target a draft PR unless the
user opts out or a PR is clearly inapplicable; permissions remain separate.
See [repository trust and workflow defaults](architecture/repository-workflow-defaults.md)
for exact existing-script baseline trust, Inbox filters and honest partial-result
continuation. Trust never grants execution approval or covers new/package code.

Projects can also come from a trusted [workspace folder](architecture/workspace-folders.md):
Moguri reads the folder, registers the Git repositories the user picks and can
keep that list in sync. These projects are permanent read-only sources. They
always use service-owned worktrees, and project-level writes to the original
checkout are refused. Sync adds projects but never removes them.

Creating work items or sessions from GitHub issues or pull requests requires an installed and authorized GitHub integration or MCP. Linear and Jira entry points follow the same explicit connector model.

Initial behavior:

- create, discover, open, and remove managed worktrees safely;
- detect dirty or externally modified worktrees;
- prevent accidental reuse by incompatible active sessions;
- preserve a worktree when deleting or archiving its session;
- never push, merge, rebase, or delete branches without explicit policy or user action.

The protocol-81 [reviewed Git built-ins](architecture/github-workflows.md#git-operations)
reuse this exact authority for status/history/diff, branch creation/switch/rename,
exact stage/unstage, selected staged commits, new-branch pushes and
history-preserving rollback of the current single-parent commit. Agents discover
typed `git_read`/`git_write` instead of manufacturing scripts for covered work.
Rollback creates a new revert commit, never an implicit reset. Selected commits
preserve the original index and unrelated staged/dirty bytes. This executable
adapter is Local-project/worktree only; unqualified transports do not fall back.

### 3. Session lifecycle

Initial session states:

```text
created → idle → queued → running → waiting_input
                         ↘ stopping → stopped
                         ↘ completed
                         ↘ failed
any terminal state → archived → restored
```

Transitions must be explicit, persisted, observable, and idempotent. Restarting Moguri must reconcile interrupted sessions and processes without reporting false success.

#### Execution environments

The first release includes built-in Local, [SendBox](https://github.com/mbianchidev/sendbox), and SSH execution backends. The user-facing setting is **Execution environment**, shortened to **Env**.

| Env | Execution boundary |
| --- | --- |
| **Local** | The agent worker and its tools run directly on the user's local machine. This is the out-of-box default, not a promise of isolation or unrestricted approvals. |
| **Sandbox** | The agent worker and its executable tools run in a local SendBox Linux VM with explicitly scoped workspace mounts, network destinations, credentials, and MCP access. |
| **Remote** | The agent task, tool execution, and model calls run on a reachable, user-configured SSH machine. It separates execution from the local machine, but does not itself apply SendBox containment on the remote host. |

The local control plane remains the authoritative event writer in all three envs. Env selection does not disable Git approvals, budgets, or other Moguri policies. See [D10](architecture/decisions.md#d10-native-sendbox-execution-and-global-enforcement) and [D13](architecture/decisions.md#d13-remote-ssh-execution) for the backend boundaries.

- Resolve Env defaults using the composer precedence. A saved choice is not an available backend until its prerequisites are ready.
- Global user-only **allowed envs** policy initially permits all three envs, subject to readiness. It can restrict new execution to Sandbox or Remote. Remote satisfies that policy without requiring SendBox on the target; display its actual SSH-host boundary rather than a SendBox badge. A stricter Sandbox-only policy remains possible. Agents, autonomy levels, and repo/project defaults cannot widen the allowed set.
- Excluding Local blocks new Local turns, including queued messages, new child-agent turns, and recovery after a restart. Turns already running at the policy-change boundary may finish under their recorded prior policy. Persist that boundary atomically with turn admission, and show these turns as **Local finishing**, not sandboxed. Changing a default alone does not move a running turn between backends.
- SendBox execution starts only after runtime, workload image, guest artifacts, policy, credentials, and workspace checks succeed. Missing or unsupported capabilities produce actionable diagnostics; never retry on the host or issue model requests while sandbox readiness is unconfirmed.
- The macOS app distributes a compatible pinned worker image with Linux Node/native dependencies and a reviewed versioned SendBox installer. Managed setup prepares private project/worktree or root-less workspaces automatically; per-turn text previews are not a prerequisite. Resolve only actual admitted provider endpoints and their bounded public DNS aliases under the explicit managed policy. The default GitHub grant delegates Meta domains and shared-cloud CIDRs, fetched into one SendBox host cache and seeded into each guest (guests never contact GitHub Meta), explicitly disclosed before setup approval; do not claim exact-host-only network access. That delegation does not grant provider substitution, private destinations, tool permission or source writes. Automatic/manual public-release checks never activate an unreviewed version or overwrite an active installation.
- Remote requires verified SSH host identity, usable credentials, a reachable machine, a compatible worker/toolchain, an approved workspace, and model connectivity from that machine. Never copy SSH private keys or the local secret store into the worker. A connection failure is not permission to run locally.
- TUI, desktop, CLI, and the later VS Code extension expose the selected and effective env, target host, default/policy source, runtime health, and launch or cleanup failures through the same API. Terminals, subagents, MCP calls, and executable extensions cannot bypass the selected boundary.

The finish-current-turn exception applies only to env policy, not to other permissions, budgets, or manual stop controls. Existing Local processes remain visibly unsandboxed and cannot be reused to execute a new turn whose policy excludes Local.

Phase 1 schemas must record requested/effective env, target and workspace identity, default and policy revision, grandfathered turn identifiers, readiness, and launch, failure, cancellation, and teardown events. Restart recovery rechecks policy and reconciles the actual backend before admitting work; it never treats missing env or readiness data as permission to run locally. An SSH disconnect leaves remote completion/cancellation unconfirmed until reconciled; do not claim success, lose late usage, or start a duplicate worker. Future durable changes require migrations and restart-recovery coverage.

#### Autonomy levels

Model selection (**fixed model** or **kupo**), **Env**, **Autonomy level**, and **Budget** are separate controls. Every supported combination uses the same control-plane authorization and events.

| Autonomy level | Who handles questions and approval requests |
| --- | --- |
| **Manual** | The user answers agent questions and approves tool/action requests. This is the out-of-box default; only explicitly preapproved operations may proceed without a prompt. |
| **Guided** | The current generative model recommends an answer or approval with an explanation; the user still confirms. In kupo, this is the active solver model, not the hidden router or critic. |
| **Autopilot** | Explicit selection delegates automatic approval of all declared, qualified tools and commands for subsequent session turns. The solver still asks for genuinely missing user-only facts rather than fabricating answers. |
| **Autopilot Max** | The same automatic tool approvals, plus a configured qualified System One-compatible decision provider for explicitly delegated technical choices and bounded steering. It also works with a fixed solver and does not require kupo. |

Use the shared global/profile/repo/project/session defaults. Selecting an Autopilot mode explicitly delegates tool approvals, not additional capabilities, authentication, roots or budget. Hard denials, read-only mode, user-only settings, secret boundaries, Git policies and allowed-env policy remain authoritative. Protocol 61 records explicit `automaticApprovals` consent. Saved Autopilot/Max defaults and unmarked older sessions count as automatic (owner decision); only an explicit `automaticApprovals: false` keeps the bounded legacy path.

Protocol 81 gives that explicit selection its own revision-bound SDK/service
command, so reselecting the same legacy value persists consent for later turns.
An actual generic autonomy change cannot carry Manual's false marker into
Autopilot; unrelated edits and loading old history still cannot broaden consent.

The current Max decision layer handles delegated technical questions with explicit alternatives and typed steering choices. It does not introduce another permission gate for automatically approved tools. Legacy bounded-Max tool review remains only for retained configurations without the new consent marker. No layer may invent user-only facts or turn an open-ended question into a fabricated user answer. Unclear questions, insufficient confidence, unavailable providers and decisions outside delegation go to the user or leave the operation visibly blocked. Actual automatic approvals have an autonomy actor, never a fabricated human or model approval.

Manual and Guided can remember approvals in session, project or current-profile global scope. Exact commands, conservative simple command families and exact configuration/schema-bound MCP tools are distinct targets. The service derives the target from the actual pending call and atomically appends the grant with the user answer. Denials still win. See [session approvals and GitHub workflows](architecture/session-github-workflows.md) for migration, discovery, source review and cross-client behavior.

Decisions bind to one request, exact arguments and context, policy revision, and session/turn/step. Recheck authorization before applying an answer, executing a tool, or admitting a steer. A user response, changed request, revoked delegation, cancellation, or newer policy invalidates an outstanding model decision. Recovery cannot replay side effects or reuse an approval for different arguments.

### 4. Message queue

Message state is durable:

```text
draft → queued → claimed → admitted → completed
             ↘ edited
             ↘ cancelled
```

Users can edit, reorder, or remove only messages that have not been claimed. Claiming and queue mutation must be atomic.

Delivery modes:

- **Queue** — deliver after the current turn reaches a terminal boundary.
- **Steer** — inject the message at the next safe boundary in the current turn.
- **Interrupt** — request cancellation of the active turn, then admit the message after cancellation is acknowledged or explicitly fails.

The UI must distinguish requested, acknowledged, and completed cancellation.

### 5. Cancellation and process control

Cancellation propagates from workflows to sessions, subagents, tools, terminals, subprocess trees, and provider requests. Persist requested, acknowledged, completed, failed, and partial outcomes. Every component must report whether cancellation is supported and whether it succeeded.

A stopped action must never be recorded as successful. Errors and partial cleanup remain visible in the event trace.

Both clients must provide a manual stop control for every active command or agent-owned background process.

### 6. Durable artifacts

Initial artifact types:

- decision;
- plan;
- answer;
- research note;
- report.

Artifacts include scope, provenance, source-event references, creation time, status, and revision history. They may attach to a work item, project, folder, or profile, but not only to a session.

When an agent asks a structured question, Moguri records the question and answer as source events and can materialize the answer as a durable artifact according to user or profile policy.

Retain whether the answer came from the user, the generative model, or a delegated decision provider. Automated answers are not user instructions and cannot be promoted into user-only Core memory.

Deleting a session does not delete its artifacts. Deleting a project containing artifacts requires a preview and an explicit choice to retain, export, materialize them into an `artifacts/` directory in the repository, optionally commit that directory, or delete the artifacts.

Protocol 114 adds a read-only per-project [artifact library](architecture/skills-tools-artifacts.md#artifacts-tab): metadata of build outputs in the checkout and session worktrees and of agent-written files, shown with chat images, links and retained documents, each linked to its session. It never reads file contents or opens a file.

### 7. Telemetry, cost control, and dashboard

The bounded [protocol-97 OTLP slice](architecture/otlp-export.md) adds explicit
profile-owned, metadata-only traces and canonical gauge export over existing
records, off by default. SDK, CLI/TUI and desktop share exact destination/revision
review and service-owned failure status. Protocol 112 adds opt-in
fixed-template diagnostic logs correlated with trace/span IDs, finite failure
outcomes and secret-backend credential headers bound to the collector origin.
No separate accounting authority, content capture, automatic instrumentation,
hosted destination or hidden credential/environment inheritance is introduced.
Provider-internal and SSH-peer/Sandbox-guest instrumentation remain an explicit,
documented coverage gap.

Capture enough data to answer:

- what is running;
- how long it has run;
- what model and provider were used;
- how many input, output, cached, system-prompt, message, tool-schema, tool-call, MCP-call, and compaction tokens were reported or derived;
- which tools and MCP servers were called;
- which calls failed, retried, or were cancelled;
- which router/classifier, solver, critic, revision, escalation, approval, or steering role made each model call;
- how much the session is estimated to cost;
- which unit prices, pricing source, currency, and effective date were used for that estimate;
- whether a provider-reported or billed amount is available;
- how much budget remains.

The graphic dashboard has four pages:

- **My work:** the configured cross-repository GitHub attention inbox plus current open, in-progress and completed sessions, grouped by project with observed activity and session statistics. PR/review/CI/thread state, original heads, source freshness/failures and exact related session navigation share the service/SDK event authority. Explicit refresh and notification read acknowledgement are read-only; scoped follow-up, GitHub writes and permissions remain separate.
- **Usage:** token/call graphs with per-project and per-model breakdowns, retaining unknown reports and all model roles.
- **Cost:** USD estimate graphs by project/model, keeping captured estimates, holds, provider reports and bills distinct.
- **Velocity:** experimental observed completions, timing and actual user interventions, with comparisons to a previous equal window, never invented productivity gains.

Graphs default to seven UTC days, with 30/60/90-day presets and inclusive custom
dates initialized to the trailing year. Original detailed accounting remains
available behind disclosure controls. The executable slice is documented in
[workspace experience](architecture/workspace-experience.md); the broader
detail inventory below does not claim every metric is qualified.
The [My Work contract](architecture/my-work.md) defines protocol95's explicit
configured-source refresh, count-checked pagination, retained CI watch reuse,
partial/no-replay recovery and independent account/profile/root boundaries.
It does not depend on a recurring scheduler.

Detailed dashboard inventory:

- current session detail;
- sessions over 7, 30, 60, 90, and 365 days;
- selectable year, custom range, and all time;
- usage and cost grouped by day, week, month, custom period, and all time;
- global filtering by folder, project, repository, GitHub organization, repository visibility—including open-source, public, internal, and private repositories—profile, provider, model, and session;
- wall time versus active model/tool time;
- elapsed time for each command, subagent, session group, and complete session, with token usage where available;
- token usage and elapsed time for each turn and applied steer;
- measured output-token generation throughput per generation, turn, and session, with estimates labeled;
- compaction history;
- tool and MCP failure rates;
- archived sessions, deletion controls, and storage usage;
- session metadata including profile, project, repository, worktree, branch, work item, parent or orchestrator, provider, model, state, tags, timestamps, duration, storage, and archive status.

Cost controls support warning and hard-stop thresholds at profile and session scope. Hard stops occur before another model request whenever possible; Moguri must not pretend it can recover already consumed provider cost.

#### Session budget and kupo wind-down

The composer Budget defaults to **Unlimited** tokens and spend, subject to any stricter profile or global policy cap. A user can set a cumulative session token cap, USD cap, or both; the first reached limit blocks further chargeable work. Resuming the session, adding a turn, switching models/envs, or changing a default does not reset the ledger.

Only offer enforceable units for the selected model or kupo pool. Preserve whether usage is provider-reported, estimated, or unavailable, and whether prices are current enough for a traceable USD estimate. Unknown usage or pricing is never zero. Explain disabled budget choices or excluded kupo candidates; using an estimate requires an explicit, labeled estimate-based policy. Token totals include all model roles and input/output usage without double-counting cached/category breakdowns. Spend estimates remain distinct from billed amounts.

Warn before a finite cap is applied: **Budgets can interrupt a session mid-task. Usage reporting can lag, and a clean final commit is not guaranteed.** Show remaining budget and effective inherited caps. Reserve budget atomically for concurrent legs, decision calls, retries, and wind-down, then reconcile actual usage. Never admit a new call using already-reserved budget or silently raise a cap; in-flight provider charges cannot be undone.

kupo starts winding down before exhaustion and reserves room for final validation, a durable checkpoint, and an attempted commit of accepted work. Commits use the selected env's Git path and must obey Git policy and the autonomy level: Manual/Guided still require confirmation unless explicitly preapproved. Do not publish an unaccepted candidate, push automatically, or run an extra decision/model call past the cap to approve finishing. If a commit is denied, fails, or cannot fit, preserve the work, pending diff, artifacts, and diagnostic checkpoint without claiming it was committed.

Charge every kupo leg and decision-provider call to its owning turn and profile, including failed attempts, retries, and fallbacks. Show both the selected synthetic model and the actual provider/model/version for each call. Decision latency and non-generative output are distinct from text-generation throughput; nothing is free merely because it is an internal routing or approval step.

Token attribution below the provider-request level is derived unless the provider reports it directly. Moguri must label derived attribution and its limitations rather than present estimates as exact measurements.

Velocity metrics are experimental. Prefer time-to-green, successful work-item completion, intervention count, review cycles, and rework over raw commits or lines changed.

### 8. Profiles, policies, plugins, and providers

A profile combines:

- project and folder bindings;
- profile-specific accounts, secret references, and API keys;
- fixed-model or kupo selection, approved routing pools, and decision-provider configuration;
- default Env, subject to global allowed-env policy and more specific repo/project preferences;
- policy packs, autonomy-level defaults, and bounded delegation rules;
- session and workflow budgets;
- enabled plugins and integrations;
- isolated artifact and memory namespaces;
- optional presentation, language, accent, and voice settings.

Typical profiles include **Work** and **Open Source**, each with independent projects, provider accounts, API keys, policies, budgets, integrations, accents, and memory boundaries.

Plugins declare capabilities, configuration schema, required permissions, hooks, and version compatibility. Installation and updates are explicit. A plugin cannot silently expand its permissions.

Provider support must expose normalized model capabilities while retaining raw provider metadata for diagnostics. [Simon Willison's `llm`](https://github.com/simonw/llm) may be implemented as an optional adapter; it must not become the only provider abstraction.

For local models, the first milestone discovers installed runtimes and reports compatibility and capacity checks for the operating system, architecture, drivers, accelerators, RAM, VRAM, disk, and model. Automatic model installation from Hugging Face is deferred.

#### Model selection: fixed or kupo

Users can always pin a single provider/model or select **kupo**, Moguri's synthetic auto model. A fixed selection is not silently replaced by a router. kupo combines a classifier with a versioned execution policy to select an eligible model/workflow for each request or safe model-step boundary, using a user-configured mix of local and third-party hosted models.

The factory automatic policy uses all eligible configured models unless the
user narrows its explicit subset or privacy policy. With none it cannot run;
with exactly one it always uses that model in Single without a classifier call.
With multiple models it chooses an eligible pattern for task complexity. Pools
of three through twenty retain per-model declared capability categories rather
than silently dropping entries. Categories are routing hints, not measured
quality or independent-family proof.

Discover the active profile's authenticated provider catalog and configured local endpoints before constructing the pool, and validate reachability/capabilities from the selected env. In Remote, inference calls originate on the SSH machine; a local-model endpoint there refers to that machine unless an explicit, approved tunnel is configured. Do not silently execute inference on the user's local machine or enumerate unconfigured networks.

| kupo pattern | Behavior |
| --- | --- |
| **Single** | One selected model solves the request through the normal permission-aware agent loop. |
| **Cascade** | An efficient model drafts first. Explicit validation and quality gates accept the candidate or escalate to a stronger eligible model within the configured limits. |
| **Critique/revision** | A model drafts; an independent, read-only, tool-less critic from a different model family reviews; the solver performs a bounded revision. |

These are HydraFusion-inspired execution patterns, not a dependency on a private HydraFusion implementation or an assumed public API. The router may use a configured local or hosted classifier, including an optional System One backend. Deterministic policy filters models and data destinations before classification and rechecks every dispatch. Context size, tools, output format, provider availability, privacy restrictions, budgets, and cancellation support constrain the plan. No model may invent an eligible endpoint or send local-only data to a hosted classifier or critic.

Every leg has explicit ownership, limits, cancellation, context provenance, and
cost accounting. Automatic normal-composer orchestration first selects an
original response/tool intent; only then can normal permissions authorize its
tools. Unselected drafts and reviews never become executable actions or
ordinary history. The separate reviewed worktree workflow stages actual patch
candidates in owned workspaces and applies only separately accepted, validated
bytes against their recorded bases. Neither path replays external side effects
on escalation or hides already-performed effects and incomplete cleanup.

Fallback models and workflow limits are user-configured and policy-constrained, not silent provider substitutions. Insufficient eligible models, classifier failure, invalid plans, low confidence, and exhausted budgets produce a visible fallback decision or a blocked request. See [D11](architecture/decisions.md#d11-kupo-synthetic-model-and-routing).

#### System One decision providers

An optional typed decision-provider interface serves kupo classification and delegated decisions with fixed models alike. **Jev by TypeSafe AI** is an initial hosted adapter target; compatible local or hosted decision providers can implement the same contract. Text-generation providers remain behind the existing Moguri provider interface; a decision-only API is not presented as a chat model.

[Laya is an evaluated optional System 1 candidate](architecture/decisions.md#laya-optional-provider-evaluation),
not an implemented adapter or a replacement for Jev. The user would choose
Jev or a separately installed Laya service, on the same laptop or at an
explicitly approved endpoint. Moguri must not install it or fetch its weights.
Its short input/head windows, different confidence semantics, exact checkpoint
provenance and non-generative accounting require qualification before exposure.
Existing Jev restrictions and disabled decision-provider defaults are unchanged.

System One calls return structured predicates, choices, or scores, with probabilities and confidence where supported. Validate the response schema and permitted alternatives; absence of confidence is not certainty, a high score is not authorization, and vendor speed/calibration claims are not Moguri guarantees. Measure thresholds on generated task fixtures before relying on them.

Hosted decision calls need their own approved data destination, scoped secret reference, budget, and network path from the selected env. Treat task content and tool arguments as data, not instructions that can rewrite the decision policy. Persist the question, alternatives, provider/model version, values, confidence semantics, actor, delegation, and applied or rejected outcome. Autopilot Max requires a compatible configured decision provider; it never silently falls back to self-approval by the generative model. See [D12](architecture/decisions.md#d12-system-one-decisions-and-autonomy-levels).

## Milestone acceptance criteria

The protocol102 native candidate identity repair binds new v3 roots to their
actual controller-private stage, with separately retained per-VM inode grants.
Historical native v2 receipts remain inspectable, never silently relabeled or
authorized for new effects. See the [versioned candidate transport contract](architecture/candidate-transports.md#versioned-native-identity-repair).
The earlier protocol101 physical receipts do not qualify these changed workers.

The first milestone is complete only when all of the following hold:

- A session created in the TUI appears and can be controlled in the desktop app, and vice versa.
- Restarting Moguri loses no admitted messages, queued messages, drafts, artifacts, or terminal session state that was promised as durable.
- A session can be bound to a managed worktree without coupling worktree deletion to session deletion.
- Queue editing and claiming remain correct under concurrent client actions.
- Interrupt, steer, and queue have distinct tested semantics.
- Cancelling a command terminates or reports failure to terminate its complete owned process tree.
- Artifacts survive archival and deletion of their source session.
- Profile boundaries prevent credentials, projects, policies, and artifacts from leaking across profiles.
- Dashboard totals can be traced back to individual immutable events.
- Estimated, provider-reported, and billed costs are never conflated.
- Every state transition and failure produces a useful diagnostic event.
- Core behavior is covered by unit, integration, migration, restart-recovery, and cross-client contract tests.
- New sessions default to Local, no model until generative provider/local-model configuration, Manual, and Unlimited. Global/profile/repo/project/session defaults resolve identically across clients without weakening policy.
- Allowed-env enforcement accepts Sandbox or Remote and rejects new Local turns when Local is excluded. Only Local turns already running at the recorded policy boundary may finish, including when clients race with the setting change.
- Missing SendBox prerequisites, launch failure, lost guest readiness, or restart cannot cause host fallback, unprotected model requests, or a falsely successful cleanup.
- Fixed-model and kupo selection work independently of every autonomy level, env, and budget. Manual is the default; Guided cannot approve without the user, and Autopilot Max works with a fixed model and a configured decision provider.
- kupo exercises single, cascade, and critique/revision patterns across generated local/hosted fixtures without violating privacy, capability, budget, workspace, or sandbox constraints. Rejected candidates cannot overwrite the user's worktree.
- Router, critic, and decision calls are fully accounted for and cancellable. Outages, invalid output, stale decisions, duplicate recovery, or low confidence cannot fabricate approval, replay a side effect, or hide a paid call.
- Automatic answers and steers retain their real actor and delegation. Human intervention or a policy change wins a race with an outstanding decision, and no model can override a hard denial or a user-only setting.
- All six attachment types work through typed references with the specified triggers, desktop image paste, durable drafts, and source permissions. Prefix collisions or unavailable context cannot silently attach, execute, or drop data.
- Remote runs both agent work and model calls on the configured SSH host. Host-key/auth failures, disconnects, cancellation failure, and restart preserve truthful state and do not trigger Local fallback or duplicate remote execution.
- Token and USD caps handle concurrent calls, missing/late telemetry, and all kupo/System One roles. Wind-down can attempt an authorized commit before the cap; denied or failed commits preserve work and never become false success.

## Implementation order

Implement vertical slices in this order. Do not attempt the entire vision in one change.

### Phase 0 — Validate the decisions

1. Run the validation spikes in the [architecture decisions](architecture/decisions.md): providers with Copilot and ds4, the Rust supervisor, the event store, the desktop shell, the TUI, the native addon, packaging, SendBox, kupo, System One decisions, Remote SSH, and the composer/default/budget contracts.
2. Record each pass or fail result with its measurements, and update a decision before building on a failed spike.
3. Settle the open items Phase 1 needs, such as the protocol schema tool and SQLite driver.
4. Establish the toolchain, test harness and migration framework before adding durable state.

Expected documents: spike results under `docs/` and an up-to-date `architecture/decisions.md`.

### Phase 1 — Domain protocol and event foundation

1. Define stable IDs, entity schemas, lifecycle states, commands, events, errors, and protocol versioning, including typed attachments, default snapshots, env/SSH identity and readiness, allowed-env enforcement, budgets/reservations/checkpoints, routing plans and legs, autonomy levels, approval requests, delegation, decision actors, and steers.
2. Add append-only persistence and projection interfaces.
3. Add restart reconciliation and migration tests.
4. Expose the same typed API and event stream to both clients.

Expected documents:

- `docs/architecture/overview.md`
- `docs/architecture/domain-model.md`
- `docs/architecture/event-catalog.md`

### Phase 2 — Session operations

Implement session lifecycle, persistent drafts and attachments, queue mutation, delivery modes, Manual/Guided controls, cancellation propagation, process ownership, Local/Sandbox/Remote execution, model discovery, configurable defaults, allowed-env enforcement, and shared composer/TUI/CLI controls as one end-to-end slice.

### Phase 3 — Work items, worktrees, and artifacts

Bind sessions to durable work items and change sets. Add safe worktree management and artifacts that remain independent from session retention.

### Phase 4 — Telemetry and dashboard

Instrument the event pipeline, normalize usage and cost records, add token/USD caps, atomic reservations, warnings and checkpoint wind-down, and build session/project/profile dashboard projections with per-leg and decision-role attribution.

### Phase 5 — Profiles and extension management

Add profile isolation, secret backends, policy evaluation, profile/repo/project default overrides, plugin manifests, provider management, and runtime health checks. Complete kupo's single/cascade/critique workflows, System One adapters, and delegated Autopilot/Autopilot Max over the same loop, budgets, and cancellation tree. Defaults and model decisions cannot weaken global allowed-env enforcement.

### Phase 6 — Hardening

Test crash recovery, concurrent clients, queue and approval races, stale or adversarial decision output, attachment scope/transfer failures, routing/candidate isolation, env/default/enforcement races, SSH disconnects and peer identity changes, SendBox loss and cleanup, budget reservation/exhaustion, cancellation failure, schema migration, corrupted state, storage pressure, profile isolation, provider outages, and plugin incompatibility.

## Deferred work

These ideas remain part of the long-term vision but are not first-milestone requirements:

### Interaction and productivity

- configurable productivity shortcuts;
- global `Option+Space` or `Ctrl+Space` voice dictation, initially evaluating NVIDIA Nemotron speech models;
- automatic detection of repeated prompts and proposals for reusable slash commands such as `/fix-rebase`;
- compact and detailed views with collapsible provider-exposed reasoning, tool activity, steering events, and subagent traces;
- configurable session deletion policies based on maximum age, maximum storage, or both.

### Local models

- guided installation of compatible models from Hugging Face;
- preflight checks for operating system, architecture, runtime, drivers, accelerators, RAM, VRAM, disk, and model compatibility;
- explicit download size, expected resource usage, license, and trust information before installation.

### Sessions and orchestration

- session groups within one project, with or without an orchestrator;
- attaching or replacing an orchestrator after a group already exists;
- detaching a session from a group without deleting the session, its worktree, or its artifacts;
- taggable `@` agents and group-level task, timing, token, and cancellation views;
- folders containing multiple repositories that participate in one work stream;
- coordinated pull-request ordering and merging, optionally using GitHub stacked pull requests;
- managed cloud provisioning and hosted orchestration beyond the first-release, user-configured Remote SSH env; see the [cloud fleet on Agent Substrate analysis](architecture/cloud-fleet-substrate.md).

### Skills, hooks, plugins, and policies

- a gallery or marketplace for versioned plugins, skills, hooks, workflows, and policy packs;
- structured, inspectable manifests for harness plugins, instructions, hooks, and skills; skills are always visible and directly invocable, with slash commands added where feasible;
- optional self-evolving skills and hooks powered by the Sky, Terra, and Glacier memory tiers, with review, evaluation, approval, versioning, and rollback;
- policy packs for GitHub operations, vulnerability remediation, conflict-resolution strategy, logging, observability, linted commit-message conventions, commit frequency, signing, attribution, token-saving modes, documentation layout, technology preferences, and general coding rules;
- configurable secure SSH commit signing and commit-attribution rules, including suppression of automatic tool co-author trailers;
- token-saving execution modes such as a standard `--silent` convention, output truncation, and an intentionally terse “caveman” communication mode;
- documentation policies that keep durable documentation under `docs/` rather than scattering temporary summary Markdown files through repositories;
- policy import and synchronization from sources such as a maintainer's private `copilot-instructions.md`, subject to repository access;
- deterministic first-party utilities—Python-backed where appropriate—for diffing, parsing, splitting, searching, and structured data manipulation so agents do not repeatedly generate disposable scripts.

### First-party integrations

- a GitHub plugin for creating, editing, closing, and querying issues and pull requests; checking CI and Actions logs; handling dependency bot pull requests; and reading, writing, and resolving review conversations;
- vulnerability-resolution workflows with ecosystem-specific remediation strategies;
- explicit merge-versus-rebase conflict-resolution policies for default branches and stacked pull requests;
- GitHub, Linear, and Jira entry points for creating sessions from issues or pull requests;
- `porto`, when installed, for local development servers and container stacks through its CLI;
- `sql-not-so-lite`, when installed, for local database operations through its CLI;
- `stainless` for privacy-preserving browser previews and Playwright: open-with and Moguri-owned headless automation now ([contract](architecture/stainless.md)); its MCP once Stainless ships one (#80).

### Metachat and scheduled actions

- a Moguri metachat for changing settings, inspecting state, explaining failures, and troubleshooting the harness itself;
- scheduled CI watching;
- dependency roundups covering Dependabot, Renovate, and other update bots;
- a **My work** workflow for open pull requests, pending reviews, broken CI, and unresolved comments;
- scheduled prompts (one-time prompts, and recurring [automations](architecture/automations.md) since protocol 115);
- agentic workflows combining prompts and explicit scripts through a readable workflow syntax (delivered as [automations](architecture/automations.md));
- optional delegation of scheduled workflows to a server while retaining the same policy, budget, event, and artifact model.

### Continuous modes and taggable agent personas

Continuous modes run as named agent personas with stable, configurable `@` handles. Users and other agents can tag a persona in messages, queued work, session groups, or workflows to request work, provide context, steer execution, or transfer ownership. Each mention resolves through the active profile and project so permissions, budgets, integrations, memory, and repository scope remain explicit.

The personas below are examples, not a closed set. Users, projects, profiles, and plugins can define additional personas with custom names, `@` handles, prompts, skills, tools, models, policies, schedules, triggers, budgets, and memory scopes.

- **`@product-manager` — Continuous Product Manager** — installs or configures product analytics such as PostHog, gains insights from usage, identifies metrics and missing capabilities to improve, performs market research, creates issues and explicit assumptions, measures results after implementation, and reports findings back to the user;
- **`@maintenance` — Continuous Maintenance** — a per-repository toggle that keeps Dependabot and other dependency or security update pull requests moving through remediation and policy-gated merging, handles breaking changes, and runs additional user-defined maintenance actions;
- **`@docs` — Continuous Docs** — a per-repository documentation persona that can be tagged for targeted work or run continuously under repository policy.

### Agent and team modes

The first-release autonomy levels apply independently to these later specialized workflows; they are not separate permission authorities.

- **Deep Search** — source-driven, scientific-oriented research that continues until the stated question is resolved or bounded;
- **SRE** — combines an error report with read-only infrastructure MCPs, architecture diagrams, telemetry, and source code to produce and validate a resolution;
- **Long-running Autopilot** — supports giant greenfield systems such as a browser and major rewrites such as C-to-Rust migrations, using durable plans, checkpoints, recovery, and budgets;
- **Stabilize** — evaluates repository health, attempts policy-gated integration of pending pull requests, remediates security issues, installs or repairs Dependabot, enhances and hardens Actions, and installs agentic issue-triage workflows;
- **Swarm** — analyzes all open issues, proposes a coherent roadmap and rationalized target state, reports for approval, then coordinates implementation toward resolving the complete approved issue set;
- **Team** — supports persona-based agents, councils, and patterns inspired by [Squad](https://github.com/bradygaster/squad) and [Paperclip](https://github.com/paperclipai/paperclip).

### Research tracks

- **Virtualized worktrees** — evaluate Delta DB-style copy-on-write persistent structures such as B-trees and hash array mapped tries for fast agent branches, while measuring them against ordinary Git worktrees and filesystem snapshots;
- **Conflict-free replicated worktrees** — evaluate CRDT-backed concurrent editing by humans and agents without claiming that textual convergence removes semantic conflicts;
- **Model provenance** — evaluate patch- and line-level history for which model or agent proposed, applied, modified, reviewed, and verified code, without adding unwanted Git attribution or overstating certainty.

Deferred features must be expressed later through the same event, policy, capability, workflow, and artifact primitives. Avoid adding one-off agent modes to the core.

## Explicit non-goals

Moguri will not:

- claim access to provider-hidden chain-of-thought;
- silently send source code or telemetry to a Moguri service;
- store plaintext API keys in profiles;
- treat a cancelled operation as successful;
- delete artifacts merely because a session expired;
- perform automatic pushes, merges, rebases, or branch deletion without policy;
- use raw token count, commit count, or lines changed as proof of productivity;
- represent estimated provider cost as an invoice;
- guarantee that textual conflict avoidance prevents semantic code conflicts.
- treat a router, critic, or decision-model score as a permission grant or record its choice as a human answer.

## Working agreement for implementation agents

When using this implementation specification:

1. Read the existing code and tests before proposing new packages or abstractions.
2. Reuse maintained libraries when they satisfy the required invariant, and record their licenses.
3. Preserve working behavior until an intentional replacement is tested and documented.
4. Start with the smallest complete vertical slice that reaches both TUI and desktop.
5. Keep authoritative state in the control plane, never in one client.
6. Use explicit typed errors and lifecycle events; do not silently recover into success-shaped state.
7. Add migrations for durable schema changes. Never require users to delete local state to upgrade.
8. Test cancellation, restart recovery, concurrency, and failure paths—not only happy paths.
9. Keep secrets and customer data out of tests. Use generated fixtures.
10. Update the relevant file under `docs/` whenever architecture, setup, configuration, or protocol behavior changes.
11. Avoid speculative work from the deferred list until the milestone acceptance criteria are met.
12. Leave the repository buildable and the supported client surfaces behaviorally consistent.

Before implementing a phase, the agent should state:

- the existing components and libraries it will reuse;
- the invariant being introduced;
- the affected durable schemas and migrations;
- the cross-client behavior;
- the failure and cancellation behavior;
- the tests that will prove completion.

## Long-term direction

After the local control plane is trustworthy, Moguri can add declarative workflows shaped as:

```text
trigger + profile + goal + permissions + budget + stop conditions + outputs
```

CI watching, dependency maintenance, documentation updates, research, stabilization, and autonomous development should become workflow templates over shared primitives rather than separate hardcoded agent loops.

Experimental memory can use three retention tiers:

- **Sky** - ephemeral turn and session context;
- **Terra** - durable project and work-item knowledge;
- **Glacier** - compressed, explicitly promoted long-term knowledge.
- **Core** - user written instructiions.

Promotion between tiers must preserve provenance, confidence, scope, expiry, and profile isolation.

## Related projects

- [OpenCode](https://github.com/anomalyco/opencode) — primary inspiration
- [Pi](https://pi.dev/) — `pi-ai` provider and authentication library
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — plugin-oriented harness architecture
- [LLM](https://github.com/simonw/llm) — optional model and plugin ecosystem
- [vslocal](https://github.com/mbianchidev/vslocal) — optional IDE integration through a VSX extension
- [sendbox](https://github.com/mbianchidev/sendbox) — native local VM-sandboxed session execution
- [porto](https://github.com/mbianchidev/porto) — optional local service and container orchestration
- [sql-not-so-lite](https://github.com/mbianchidev/sql-not-so-lite) — optional local database management
- [stainless](https://github.com/mbianchidev/stainless) — optional browser, preview, and Playwright integration
