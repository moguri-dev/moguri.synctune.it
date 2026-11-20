# Moguri SDK and CLI

Moguri is one importable SDK, with terminal and desktop clients on top. The
service is the only durable writer; the SDK exposes its typed commands,
queries, sequenced events, optimistic revisions and cancellation. Electron does
not own a second agent loop, settings store or provider connection.

Current source uses protocol **103** for
[owned reviewed-script Sandbox execution](architecture/content-review.md#reviewed-sandbox-script-change-contract),
preserving protocol102's exact native candidate/private-root identities and
protocol **101** for
[reviewed repository trust, isolated task defaults and recoverable output](architecture/repository-workflow-defaults.md).
It preserves protocol100 script Inbox approval and protocol99
[session Inbox and explicit skill-load evidence](architecture/session-inbox.md),
on top of genuine98 [Local source admission and full-Env per-turn rewind](architecture/skills-and-rewind.md).
The additive upgrade preserves the actual95/96/97/98 lineage, ciphertext, owners,
receipts and all-role accounting. Root/React entrypoints remain browser-safe;
service startup and execution stay in the explicit lazy Node entrypoint.
Protocol **95** introduced the
[unified My Work inbox](architecture/my-work.md). Its source/refresh/job/attention
state is profile-owned and retained by the existing event authority.
Genuine94 adds the inbox marker atomically; older healthy services require
reviewed upgrade rather than silently omitting this API. Root/React imports
remain browser-safe and Node GitHub execution stays explicit.

## Repository trust and workflow defaults

```ts
const { preview } = await sdk.repositoryTrust.preview(projectId);
// Actual user reviews the exact Local root, existing source digests and exclusions.
await sdk.repositoryTrust.trust(preview);
const trust = sdk.repositoryTrust.get(projectId);
if (trust?.status === "trusted") await sdk.repositoryTrust.revoke(projectId, trust.revision);

const task = await sdk.sessions.create(projectId, "Isolated task");
const session = sdk.sessions.get(task.id!);
if (session?.workspaceId) await sdk.workspaces.wait(session.workspaceId);
// Explicit user opt-out for this new task only; never moves an existing session.
await sdk.sessions.create(projectId, "Attached checkout", undefined, undefined, "checkout");
```

Trust is actual-user authority over exact existing tracked script entrypoints,
not model advice or execution permission. Its project-owned encrypted baseline
survives session deletion. `repository.trust_recorded` stores monotonic
approval/revocation; `repository.script_reserved` atomically retains each
original source-bound model attempt before effects. New/changed/generated/
downloaded/package scripts and changed dependency inputs cannot inherit trust.
Live validation binds the exact Local root/worktree, original Git common
identity, profile/project, source bytes, dependency inputs and current policy.
`run_script({path, interpreter, args?})` is the trusted variant; callers cannot
provide trust authority. The ordinary reviewed variant retains its original
`reviewId`, digest/revision and one-attempt semantics. Both use the existing
private-pipe source executor and normal approvals. Unsupported transports fail
without fallback; entrypoint authority is not transitive-code confinement.

For new single-project Local Git tasks, worktree/change-set/job/session intent
commits atomically. `workspaceOrigin: "default-worktree"` identifies that actual
choice; explicit bindings/checkout opt-outs have their distinct origins.
Never dispatch files, tools or consoles until the retained workspace is ready.
Legacy sessions are not moved or relabelled; non-Git folders have no invented
managed-worktree origin. Automatic multi-repository worktrees are not qualified:
new Local Git groups refuse an implicit base-root fallback.
Project preferences `repo.workspaceMode` and `repo.pullRequests` default to
`"worktree"`/`"draft"` when absent. CLI `session create --workspace-mode checkout`
opts out explicitly. First-party draft-PR guidance enters capture/sizing before
admission; it does not grant GitHub writes, authentication or merge.

`turn.recovery_entered` binds one original unconfirmed partial result to its
actual turn/step/call. The service restricts subsequent model tools and dispatch
to read-only inspection; uncertainty and root quarantine remain retained.
Only actual started Local command/script process ownership can carry
`tool.completed.cleanupConfirmed: true`. Opaque MCP output cannot provide that
proof. Confirmed recoverable command failures can continue without replay;
actual Stop and unknown accounting still prevent continuation.

## Source admission and checkpoints

`sdk.skills.find` and `sdk.skills.read` are discovery/diagnostic previews.
`inspect(sessionId, skillId, expectedDigest)` returns complete supported source,
dependency/provenance inventory and an exact review digest. Only an actual-user
`admit` command can retain scoped, expiring publisher evidence and restrictions:

```ts
const { inspection } = await sdk.skills.inspect(sessionId, skill.id, skill.digest);
const grant = await sdk.skills.admit({
  sessionId, skillId: skill.id, expectedDigest: skill.digest,
  expectedInspectionDigest: inspection.digest,
  publisher: { kind: "unverified-local", acknowledge: "publisher-not-verified" },
  access: "read-only", paths: ["."], validHours: 24,
});
const source = await sdk.skills.consume(sessionId, skill.id, skill.digest);
// source.body is complete untrusted guidance, not permission.
await sdk.skills.revoke(sessionId, grant.id!, 0, "Reviewed source revocation");
```

`sdk.capabilities.delete(capabilityId, expectedRevision, true)` removes one
standalone imported skill from its project's registry after an exact revision
check. Plugin-owned skills (`capability_plugin_owned`) and other capability kinds
(`capability_delete_kind`) are refused. Admissions of a deleted skill fail closed
on their next check; earlier versions remain in the encrypted event history.

Use the unverified option only after reviewing a Local/registry publisher
acknowledgement. Archives require `publisher.kind: "pinned-ed25519"`, an explicit
identity label, public key and signature of `skillSignaturePayload(origin)`.
The signature covers exact version/artifact/file hashes, not an external PKI or
automatic trust in the identity label. Protocol 112 adds
`sdk.skills.savePublisher(identity, publicKeyPem)` (returns the SPKI SHA-256
fingerprint as `id`) and `publisher: { kind: "saved-ed25519", fingerprint,
signature }`, plus `sdk.skills.block("key" | "artifact", sha256, reason)` for
permanent per-profile blocks; the snapshot exposes `skillPublishers` and
`skillTrustBlocks`. `inspection.scan` carries the deterministic
`SourceIndicatorReport` (also exported as `scanSourceIndicators` for previews),
and `scriptReviews.read` returns `indicators`. Findings are advice, never grants. `audit(sessionId)` returns original
admissions and monotonic revocations. `use` inserts the complete selected source
into an exact current draft; it fails rather than truncating an oversized draft.
`consume` records model delivery and is also used by the outward MCP gateway.
Every later model/tool admission rechecks source authority. Inherited context
retains its original source owner and can only narrow the consumer's current
permissions at the same actual Local root.

`sdk.checkpoints.list(sessionId)` returns real checkpoints, abandoned/current
capture metadata, retained rewinds and an honest count of uncaptured historical
turns. `read` exposes the before/terminal manifests and informational state.
`settle` explicitly stops owned work. `preview` requires one exact target and
`"conversation"` or `"workspace"`; it reports exclusions, blockers, conflicts
and preserved state. After actual-user review:

```ts
const { preview } = await sdk.checkpoints.preview(sessionId, checkpointId, "workspace");
await sdk.checkpoints.apply(sessionId, checkpointId, "workspace", preview.digest, [
  { root: preview.files[0]!.root, path: preview.files[0]!.path, choice: "keep-current" },
]);
```

Supply a decision for every conflict, never infer user confirmation from a
model verdict. Fresh root/profile/store/peer, policy, context, bytes and revision
checks run at effect time. Local, pinned Remote and private Sandbox share this
API, but retain their distinct execution/backup/publication boundaries.
`inspect`, `stop` and `acknowledge` bind the original operation and exact
inspection digest; partial work never becomes completed through acknowledgement.
`prune` and `pruneCapture` revoke only reviewed snapshot compartments, preserving
history witnesses, actual filesystem backups, independent artifacts and costs.
Restart never fabricates old captures or replays tools/model calls.
See [CLI/TUI/desktop usage](setup.md#local-skill-admission-and-per-turn-rewind).

Protocol **94** added authenticated exact-project GitHub
search/read tools and native single-Enter input. The metadata-only upgrade
preserves encrypted events, grants, receipts and saved provider source; fresh
tool-ID normalization happens before the first new completion, not on replay.
The [follow-up contract](architecture/session-github-workflows.md#protocol94-github-and-input-follow-up)
retains original protocol93 qualification and its separate native gates.
It preserves protocol93 PR-bound CI watches and protocol92 integrated
model/control/candidate paths. Protocol **91** added
[reviewed URL-list imports and actual-user shared-config remote changes](architecture/repository-management.md),
preserving protocol90 naming/live input and protocol89
[indexed event reads, responsive startup/lifecycle and counted session navigation](architecture/startup-responsiveness.md).
The atomic read-index migration preserves genuine 88 ciphertext, keys, grants,
receipts, budget holds and saved input. Its root-owned global capacity reuse
never caches speculative transactions or treats unknown usage as free.
It retains protocol **85**
[owned SSH/native decisions, metadata finishing and model-free scheduled preparation](architecture/owned-model-transports.md).
It preserves protocol84
[retained model recovery, scheduled input and evidence-qualified Kupo modes](architecture/recovery-scheduling-kupo.md),
preserving protocol83 content/script safeguards and protocol82
[shared workflow commands, ranked methods and direct MCP schemas](architecture/command-tool-preferences.md).
It retains protocol81
[exact session request recovery](architecture/session-reliability.md#explicit-selection-and-retained-request-follow-up)
and [built-in reviewed Git](architecture/github-workflows.md#git-operations).
It preserves the genuinely combined80 model-continuity, theme, queued-command,
project-folder and grouped-Sandbox lineages and their original encrypted history.
Its distinct workflow-command and tool-preference migration markers are appended
atomically alongside the preserved81 markers; earlier native/package
receipts qualify only their original bytes. Existing features include
[direct effort and exact context-window shortcuts](architecture/model-controls.md#direct-tuning-slash-commands),
[cascading model controls and complete slash discovery](architecture/model-controls.md#cascading-menus-and-complete-slash-discovery),
[per-question refreshed side context](architecture/session-reliability.md#per-question-side-context),
[saved turn, cache and live usage telemetry](architecture/chat-activity.md#retained-telemetry-follow-up-contract),
[session reliability, streaming dictation and shared controls](architecture/session-reliability.md),
[automatic Kupo and its shared capability inventory](architecture/automatic-kupo.md),
[project Kanban continuation and provider-equivalent prices](architecture/project-kanban.md),
[remembered approvals and repository-aware GitHub workflows](architecture/session-github-workflows.md),
[skill gateway and graphic workspace dashboards](architecture/workspace-experience.md),
[lean tools and coordinated sessions](architecture/lean-tooling.md),
[session-owned candidate cleanup](architecture/candidate-cleanup.md),
shared-global/last-selected model defaults and
[ephemeral browser control](architecture/agent-browser.md).
Schema 57 rekeys only exactly recorded generation output and retains required
accounting; the earlier schema-55 model-default upgrade is metadata-only.
Schema 58 strictly converges the candidate-retention and earlier development
lean-tooling lineages using their actual markers, preserving both guarantees.
Older running services require reviewed restart.
`ToolPreferencesSchema`, `toolMethods`, `defaultToolPreferences` and
`effectiveToolPreferences` are browser-safe exports. Set the complete four-ID
`settings.values.toolPreferences.order` with an exact settings revision, or
reset the `toolPreferences` section. Ranking is model advice, not permission.
`sdk.workflows.start(sessionId, kind, prompt?, expectedDraftRevision?)` shares
the new presets; `sdk.sessions.spawnPrompt(sessionId, prompt, expectedDraftRevision?)`
atomically assigns an actual Manual child. `/continue` takes no prompt.
Direct MCP aliases are model-facing discoveries, not user-supplied permission
metadata or a new credential API.

## Unified My Work

`sdk.myWork` owns one explicit cross-repository attention workflow. Sources start
empty; discovery/configuration selects one actual Local project/workspace root,
upstream and numeric controller `gh` account. It never scans other repositories,
switches credentials, inherits an SSH account or starts a scheduler/model.

```ts
const { preview } = await sdk.myWork.previewSource({
  env: "Local", projectId: "explicit-project",
});
// Display the exact account/root/upstream review and get actual user consent.
const source = await sdk.myWork.configure(preview, true);
const admitted = await sdk.myWork.refresh([source.id!]);
const { refresh } = await sdk.myWork.wait(admitted.id!);
const inbox = await sdk.myWork.query({ category: "pending-review", state: "open" });
// refresh.status describes the read, never CI success or merge clearance.
```

`query(filters,{offset?,limit?,signal?})` reads retained observations only.
Filters include exact `itemId`, category (`open-pr`, `pending-review`, `failed-ci`,
`unresolved-thread`), repository, numeric account ID, project/source ID, PR state,
freshness and text. Canonical item IDs are stable across category/head/state
changes. Each `MyWorkEntry` retains separate account/root associations, exact
related session IDs, original/current-head CI watches and prior complete
evidence. Incompatible heads are not combined; missing/failed sources remain
visible even when no item matches the selected filter.

`status()` returns original sources/refresh ownership. `read(id,{sourceId?,
metadataOnly?,signal?})` inspects immutable original observations without resolving
a replacement root. `wait` uses metadata-only reads and never retries dispatch.
Responses are bounded to 8 MiB; select an original source or refine page size/
filters instead of accepting a truncated response. A refresh covers at most
100 configured sources, 1,000 tracked PRs per source, 1,000 requests/threads per
PR and the existing count-checked CI bounds. Complete within five minutes means
an observed collection, not atomic provider state or continuously watched CI.

`refresh(sourceIds?,{timeoutMs?,commandId?})` admits one retained read job.
Identical concurrent requests reuse its original identity; competing sets fail.
`cancel(id)` stops only that inbox reader, never a retained CI watch or GitHub
job. Stopped/failed/partial reports preserve earlier observations.
Unconfirmed cleanup blocks overlapping reads until
`inspect(id,revision,originalInputDigest,true)` records actual user inspection.
The original remains partial/unconfirmed; inspection is not cleanup proof,
permission or replay. Missing receipts cannot authorize another reader.
`toggle(sourceId,revision,enabled)` changes only explicit source configuration.
Changed root/upstream/policy/account needs a new review.

`navigate(itemId,sourceId)` returns exact retained session associations, without
provider reads or writes. `previewFollowup(itemId,sourceId)` separately rereads
that exact source, and `start(preview,sourceId,true)` reuses `session.from-work` to
create one idle session with an unsent draft and ordinary project controls.
It does not check out a branch, send a prompt or approve tools. `markRead(itemId)`
only acknowledges existing attention. User/team/bot/mannequin/enterprise-team
review requests and unresolved/outdated threads come from actual provider state;
team membership and model answers are never inferred.

CLI: `moguri my-work query --filters JSON`, `source PROJECT_ID`, `configure
PROJECT_ID --digest SHA --confirm-review`, `status`, `refresh [SOURCE_IDS]`,
`read REFRESH [SOURCE]`, `wait REFRESH`, `stop REFRESH`, `navigate ITEM SOURCE`,
`followup ITEM SOURCE`, `start ITEM SOURCE --digest SHA --confirm-review`, and
`inspect REFRESH --revision N --digest INPUT_SHA --confirm-review`.
TUI's **My Work** tab and `/my-work` share these APIs; slash commands stay
ordered user commands, not model prompts. Desktop's Dashboard / My work keeps
the active-session dashboard and adds the inbox, filters, original reports,
read acknowledgement and explicit scoped follow-up.

## Repository import and remote relocation

`projects.imports.preview({text,parent})` accepts up to 100 URL/bullet lines and
returns a `RepositoryImportPreview` with every normalized source, canonical
destination and clone/register/duplicate/conflict decision. Preview does not
clone or authenticate. Submit the unchanged review with
`projects.imports.start(preview,true,commandId?)`; retain that canonical command
ID if its acknowledgement is lost. The result ID names a profile-owned batch,
not a completed import.

`projects.imports.list()` reads the shared snapshot;
`read(batchId)` returns the original encrypted review and live per-item results.
`wait(batchId,{signal?,timeoutMs?})` waits for the existing job, never retries it;
`cancel(batchId)` cancels only that original owner. Earlier successes and partial
directories survive. A partial batch is not whole-batch success. Unknown effects
retain their writer boundary even when a destination is missing. Only after
actual inspection may
`acknowledge(batchId,line,expectedRevision,true,commandId?)` release that exact
terminal partial item's hold. It neither asserts cleanup nor starts another clone.

```ts
const { preview } = await sdk.projects.imports.preview({
  text: "- https://github.com/generated-owner/one\n- git@github.com:generated-org/two.git",
  parent: "/absolute/existing/parent",
});
// Present all entries and obtain actual user review before this call.
const started = await sdk.projects.imports.start(preview, true);
const { batch } = await sdk.projects.imports.wait(started.id!);
if (batch.status !== "completed") {
  console.error(batch.status, batch.items);
}
```

`projects.remotePreview(projectId,remote,url,workspaceId?)` explicitly reviews a
Local checkout and every linked worktree sharing its common config.
`projects.setRemote(preview,exactConfirmations,true,commandId?)` reuses the
independently retained Git operation API; read/wait/cancel/acknowledge through
`sdk.github`. It atomically changes only the reviewed remote URL fields without
fetch/push/authentication or changes to branches, index and working bytes.
The review includes Git's actual expanded fetch/push URLs for each worktree;
safe same-repository HTTPS-to-SSH rewrites do not become an undocumented fallback.
Current metadata/reviews and scoped remembered Local Git/command approvals are
invalidated; immutable PR/candidate sources and accounting remain unchanged.

`git.remote.set` is an actual-user action in `GithubActionSchema`, deliberately
excluded from model-facing `GitActionSchema`/`git_write`. Remote/Sandbox sessions
cannot borrow a Local scope. Browser and React exports contain these typed APIs,
not Node filesystem/process code. Protocol91's paired import/remote markers
preserve original 88/89/90 ciphertext, receipts, grants and unknown holds.

## Recovery, scheduled input and Kupo

These methods use the same authenticated immutable-profile SDK and existing
`/v1/commands`, snapshot and event authority. A command result identifies retained
intent/admission, not successful model work. Preserve an uncertain command ID
and inspect its original receipt rather than sending a replacement.

| Surface | Contract |
|---|---|
| `sessions.retry(sessionId, failureId?, revision?)` | Retry the original last eligible model failure; preserve draft/context/queue and earlier effects. Read `Snapshot.modelFailures` and `modelRecoveryCycle` for actual state. |
| `scheduledPrompts.create(sessionId, timing, draftRevision?)` | Capture and consume only the exact saved draft/attachments/controls into a durable unsent record. |
| `scheduledPrompts.list(sessionId?)` | Read this profile's original scheduled records. `scheduled`/`blocked` stay outside model history; `queued` is claimed but not a sent prompt until `admitted`. |
| `scheduledPrompts.sendNow(id, revision?)` / `cancel(id, revision?)` | Share one-at-most timer ownership; cancel only undispatched original input, not an unrelated turn. |
| `routing.modes(sessionId)` | Read mode readiness and genuine unmet gates. No classification or model call. |
| `routing.options(sessionId, proposedOptions?)` | Review exact shared working-window/thinking eligibility for automatic, explicit Single or reviewed Compound Kupo in the owning Env. Compound includes its classifier and every eligible route role's real output bound. Returns eligible model IDs, genuine common presets/efforts and an explicit unavailable reason, without changing controls or calling a model. |
| `sessions.kupoMode(sessionId, mode, revision?)` | Explicitly select `balanced`, `savings` or `performance` for automatic Kupo without changing autonomy/Env. |
| `routing.profileDraft(input)` | Prepare an unpersisted source-review assertion; explicitly save its exact profile in the full Kupo policy after reviewing it. |
| `tools.history(sessionId, input?)` | Page retained original public prompt/model/tool/answer sources, including after compaction; no private roles, console data, hidden thinking, drafts or queued input. |

### Interrupted chats (protocol 115)

| Surface | Contract |
|---|---|
| `sessions.interrupted()` | Chats with a recorded `Session.interruption` (`cause`, `turnId`, `queuedItemIds`, `at`) that are not archived. |
| `sessions.continueInterrupted(sessionId)` | Release the recorded waiting prompts and, when a turn was running, queue the continue workflow ahead of them. Rechecks policy, Env and model. |
| `sessions.continueAllInterrupted()` | Continue each interrupted chat; returns `{ sessionId, error }` per chat so one failure doesn't stop the rest. |
| `sessions.dismissInterruption(sessionId)` | Forget the record without continuing; held prompts stay held. |

`settings.interactions.continueInterrupted` (`ask` or `always`) controls
whether the service continues interrupted chats automatically after a restart.
`executeInterruptedCommand` is the shared `/interrupted` helper. See the
[contract](architecture/interrupted-sessions.md).

### Automations (protocol 115)

| Surface | Contract |
|---|---|
| `automations.list(projectId?)` / `runs(automationId?)` | Read `Snapshot.automations` (deleted ones omitted) and recent `automationRuns` (latest 50 per automation plus every active run). |
| `automations.create(projectId, definition, { enabled, controls? })` | Capture full controls from the project defaults plus explicit overrides. `enabled` is the explicit activation; nothing runs while paused. |
| `automations.update(id, definition, controls?, revision?)` | Replace name, schedule and steps; overrides apply on top of the captured controls. Active automations re-anchor at the edit. |
| `automations.enable(id)` / `pause(id)` | Turn scheduling on from now, or stop future occurrences (an active run continues). |
| `automations.runNow(id)` | Start one run now in a new chat; refused while a run is active. |
| `automations.stopRun(runId)` / `delete(id, { stopRunning? })` | Stop a run's chat so later steps never run; delete refuses an active run unless `stopRunning`. |

`AutomationDefinition` is `{ name, schedule, steps }`; `parseAutomationWorkflow`
reads the readable YAML/JSON workflow syntax after parsing, and
`executeAutomationsCommand` is the shared `/automations` helper. Semantics for
DST, missed and overlapping occurrences, script steps and restart are in the
[automations contract](architecture/automations.md).

`ScheduledTiming` is `{kind:"delay",minutes,timeZone}` or
`{kind:"at",at,timeZone,localTime,offsetMinutes}`. Use
`scheduleLocalChoices("2030-10-27T02:30","Europe/Rome")` to review both DST
occurrences, not guess one. Timings must be future and within one year.
Service-owned deadlines survive UI disconnect. Overdue schedules are checked
once after restart; no timer runs inside the client.

History defaults to twenty messages and 12,000 UTF-8 bytes per page. Retain the
returned `throughSequence`, `messageOffset`, `limitMessages` and `digest` for byte
continuation with `nextOffset`. Only after that window ends, advance to
`nextMessageOffset` with a new digest. Its boundary is explicitly
`scoped-controller-public-history` in every Env, not authority to read a
workstation/remote filesystem. Model access still needs ordinary tool policy.

Common errors include `revision_conflict`, `model_retry_*`, `schedule_changed`,
`schedule_dst`, `schedule_terminal`, `routing_effort`, `routing_frontier`,
`routing_evaluation`, `routing_context_bound` and `budget_*`. These retain
original input and distinguish changed authorization, unsupported transport,
source review, unknown accounting and exhausted capacity. Do not repair/clamp
a request, infer zero cost or treat model confidence as permission.

Pooled tuning uses the existing revision-bound
`sessions.modelOptions(sessionId, options, revision)` command. Review with
`routing.options` first, then save an explicit choice. Unsupported pool members
are excluded before classification; the exact actual prepared role is checked
again before dispatch. A configured classifier is never silently replaced.
The model's advertised binding remains unchanged even when its admitted working
ceiling is smaller. Kupo routing preference, Env, autonomy and cumulative budget
remain distinct. Its classifier and qualified per-model mapping select actual
thinking automatically; manual Kupo effort commands return `routing_effort`
without mutation or inference. Old overrides remain retained and blocked until
explicitly cleared; context and budgets are not silently changed. Performance
still requires its qualified maximum context and xhigh/max. Complete future
reviews/revisions and finite holds use the same
selected ceiling.

Reviewed Compound additionally binds these options into its immutable
`policyJson`, checks every complete future role/test envelope before admission
and rechecks actual options/metadata at dispatch. The source/staging/test
review remains mandatory; ordinary chat does not start a compound implicitly.

The desktop model menu exposes Kupo **Routing** and **Context window**, with
automatic thinking, and no role-effort override. `routing.options.thinkingLevels`
remains an empty compatibility field, not user-selectable pooled thinking.
SDK, CLI and actual TUI share `/thinking`,
`/effort`, `/context-window` and `/model-settings`; none sends a model prompt.
Thinking levels apply only to fixed models. Default clears only the selected
override, and rejected/stale changes preserve
the draft, history and original controls.

```ts
const sdk = await connectMoguri({ autoStart: false });
const session = sdk.getState().snapshot!.sessions[0]!;
const scheduled = await sdk.scheduledPrompts.create(session.id, {
  kind: "delay", minutes: 10,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}, session.draft.revision);
const prompt = sdk.scheduledPrompts.list(session.id).find(p => p.id === scheduled.id)!;
await sdk.scheduledPrompts.sendNow(prompt.id, prompt.revision);
```

Creation above requires a nonempty saved ordinary draft; it never writes replacement
text or grants permissions. Native TUI and hidden desktop consume these same APIs.
The independent packed consumer exercises actual installed worker retry,
scheduling, mode readiness, history and restart alongside browser/React/Node
imports/types and its own dependency audit.

Schema 59 adds an independent transactional metadata marker. Older source
settings normalize to no configured skill sources; ciphertext, receipts,
identities and existing accounting are unchanged.
Schema 60 retains reviewed child-session detachment and schema 61 adds session
approval/GitHub metadata without rewriting encrypted history. The exact private
approval-development schema-59 lineage also converges by its own retained
marker, atomically adding the workspace/navigation markers. Missing or
ambiguous provenance is rejected rather than guessed.
Schema 64 adds card ordering, per-request continuation choices and captured
read-only GitHub board sources. `issues.reorder` binds the complete source and
destination structure; `kanban.choose` binds the actual profile and exact saved
draft revision. `/continue-work` returns a typed route review before dispatch.
`BoardConfig.githubSync` controls optional issue import and explicit column
mapping, while `IssueBoard.githubSource` is service-owned provenance, never
client-supplied authority. Older encrypted history and consent remain intact.
Schema 66 adds the transactional `retained_telemetry_schema` marker and requires
`Snapshot.sessionTelemetry`. Original events, encrypted grants and receipts are
preserved. Exact original provider results may append same-call cache-category
corrections using only the captured rate; unknown work and holds are not refunded.
Schema 63 explicitly converges the independent automatic-Kupo schema 61 and
session/GitHub schema 61, plus Kanban/pricing schema 62. Exact original markers,
approvals, selected responses, encrypted history, receipts and held accounting
survive failure and reopen; a missing current marker is never silently repaired.
It retains protocol-54 exact-scoped session PR observations
and [shared session-status indicators](architecture/session-interactions.md#session-status-and-linked-pr-indicators), and combining
[the separate Agent terminal](architecture/agent-terminal.md),
[chat activity and compact usage](architecture/chat-activity.md),
[desktop interactions](setup.md#desktop-interactions),
protocol-52 [managed Sandbox](architecture/managed-sandbox.md), protocol-51
[session interactions](architecture/session-interactions.md), and the
protocol-44 through 50 settings/native lifecycle slices. It retains protocol-43
[document attachments](architecture/document-attachments.md), including
protocol-42 [task completion estimates](architecture/task-progress.md), extending the
protocol-41 owner-requested
[platform workflow extension](architecture/platform-workflows.md).
The prior issue-17 source used protocol **40** for shared model windows/scoped
paste, native execution, reviewed Local compound workflows, finite Local
wind-down and owned bounded decisions. It does not replace the immutable qualified archives listed below.
See [native source qualification](setup.md#native-servicesdk-development-checkpoint)
for the actual generated VM evidence and remaining client/environment gates.

`sdk.browser.state(sessionId)` reports the actual desktop-owned pane and its
current control identity. The user enables/disables access with the pane's
**Agent control** switch. `mcp.tools` with `serverId: "builtin"` and query
`"navigate"` discovers `browser_navigate`; query `"browser"` discovers all six
tools, including `browser_status` and `browser_snapshot`. Invoke through the
existing `mcp.call`/`mcp_gateway` policy/approval flow, supplying its discovered
schema digest and fresh control/element identities. Reads/interactions also
copy the exact `expectedUrl` from status/snapshot. Protocol 73 carries the
service-admitted website scope to the actual host, including redirects,
subresources and WebSockets; clients cannot invent a substitute grant.
Results keep the normal
encrypted session/job retention and bounded `result.read` paging. Native input
acknowledgement is not verification of a website's business action.

The browser-safe `sdk.browser.host` methods attach, poll, reply, detach and
monotonically change control for an explicitly authenticated native host.
Its private lease belongs only to that original profile/session/view; never put
it in model context or configuration. Browser availability and control are
ephemeral and are not restored by command-receipt replay or service restart.
CLI/TUI agents use the same builtin tools when the actual desktop pane is
open and enabled; without it they report unavailable rather than launch a
browser. Only Local is qualified for this capability.

`sessions.progress(sessionId)` reads the explicit current model plan when present,
otherwise the separately bound workspace-file checklist, and compares it with
optional owning-model advice. `useTaskProgress` in `moguri/react` refreshes
every 15 seconds without overlapping polls or model calls. CLI
`moguri progress --session ID` and `/progress` expose the same typed observation.
Unknown, stale and disagreeing estimates never change actual lifecycle outcomes.

`sessionIndicator(session, snapshot)` is a browser-safe selector for actual
work/input/completion and separately verified linked-PR state. It includes
labels, `prState` and `prLabel`; optional heuristic questions are explicitly
not structured answer requests. `sessionPullRequestUrl`, `sessionPrScope` and
`sessionPullRequest` resolve the same direct, work-item or exact managed-change
source in SDK/desktop/TUI commands. Reading these selectors performs no network,
filesystem, model or Git action.

`sessionBackgroundWork(session, snapshot, activity)` is a browser-safe selector
for background display. `agentSessions` retains inspectable nonarchived original
subagents/coordinated children; `agents` contains only their active turns.
`commands`, `jobs` and `count` combine current running command/script activity
with actual command/watch jobs, deduplicating by owning turn and call ID.
Visual nesting, pending approval, finished/archived work and another session's
activity do not count as running. `complete` is false for missing/foreign/bounded
activity; callers must disclose a lower bound rather than invent an exact zero.
It reads only supplied observations and grants no child control or PID authority.

`sessionNavigationStatus(session, snapshot)` uses the same canonical indicators
for Finished/Error/Needs attention/In progress filtering. Idle, held and stopped
states are not relabeled successful or active. `compareSessionPrompts(a, b,
"newest" | "oldest")` compares each session's latest acknowledged user message,
falling back to its real creation time only when unsent. These are pure view
selectors: they do not rewrite stored order, group/pin ownership or lifecycle.

`sessionLocalFolder(session, snapshot)` returns `{ path, identity }` for the
session's actual Local root (ready managed worktree with its recorded
device/inode, project checkout, or a project-free chat's captured Home), or
`{ diagnostic }` for Remote/Sandbox Env, several captured repositories and
unready, removed or foreign worktrees. It never falls back to the base checkout.
It is a pure view selector; clients that open the folder must re-verify the
canonical directory and identity before delivery.

`workspaceDiffSummary(diff)` returns `additions`, `deletions` and `binaryFiles`
from a complete ordinary unified diff, validating text-hunk lengths and treating
binary changes separately. Unsupported/incomplete input throws `workspace_diff`,
never a partial-looking successful total. Apply it only to the actual bound-root
`workspaces.git` response; its HEAD-relative, protected-path-filtered tracked
scope is not an untracked-file or whole-PR summary.

`Session.prObservation` is optional for older history. A new
`session.pr_observed` event retains profile/session/URL/project/workspace/root/revision,
access mode and configuration revision with actual GitHub state/draft/checked
time or diagnostic. It does not increment the session revision, activity time,
unread state or lifecycle. Metadata is not a user answer, PR-write permission
or evidence that the session's work succeeded. Legacy missing draft remains
unknown; project-free scope cannot inherit a root or authenticated account.
The schema-54 marker upgrades transactionally without rewriting ciphertext.

## Execution-machine model readiness

`models.readinessTarget(sessionId, modelId, signal?)` resolves an exact configured
model's profile/session/Env/root/peer/build binding. `models.readiness(sessionId,
modelId, mode?, signal?)` returns bounded observations and explicit source,
unknown and requirement checks. Informational is the default; `required`
rejects missing/incompatible/unknown required runtime/model evidence.
Neither method selects/enables a model, starts a server/guest, downloads weights
or calls inference. Network/proxied endpoints cannot borrow execution-host
hardware as server-capacity proof.

`configuredReadinessModels(catalogue, env)` includes explicit unavailable or
unselected configured endpoint models for inspection, not inference admission.
Configuration uses optional endpoint `runtime` and model `requirements` fields.
The complete provenance, bounds and actual-Env restrictions are in the
[runtime-readiness contract](architecture/model-readiness.md).

`models.runtimePreview(sessionId, modelId, signal?)` returns an exact
llama.cpp version-command review; observed immutability is still required
at dispatch. Only after actual-user confirmation call
`models.reviewRuntime(sessionId, modelId, expectedDigest)`, then
`models.readinessWithRuntimeReview(sessionId, modelId, reviewId, mode?, signal?)`.
The original review is consumed before I/O and cannot replay after failure,
cancellation or restart. The generic delegated platform cannot issue or consume
that review; neither a literal actor field nor model/autonomy advice approves it.
Ordinary refresh never reuses it. Report freshness remains ephemeral and does
not become a model-availability, quality or permission decision.

## Captured folder sessions, side chats and streamed speech

`projects.group(name, [{ projectId, revision }, ...])` atomically creates a named
navigation folder and moves the exact reviewed projects into it, without moving
files. `sessions.createFolder(folderId, title?, overrides?)` captures the current
member IDs/revisions and canonical path/device/inode identities. Its
`Session.projectId` is null, with immutable paired `projectFolderId` and
`repositories`. Null without those explicit fields remains project-free;
ordinary Local chats may separately retain `homeRoot`, never a synthetic project.

Local and qualified managed Sandbox filesystem/command tools require an explicit `repository` ID or
captured name for folder sessions. `workspaces.files(sessionId, path, repository)`,
`file(sessionId, path, repository)` and `git(sessionId, diff, repository)` resolve the
same bound root; `terminal.open` requires a captured member's exact root.
Replaced directories, unknown/ambiguous selectors and unqualified transports
fail without selecting a first member, common parent or HOME. All captured
roots participate in writer admission, cancellation and uncertain-work
quarantine, including across profiles. Per-member folder restrictions and
project-scoped approval grants bind the actual selected repository.

CLI/TUI/desktop share `/folder-group {"name":"Folder","projectIds":["ID","ID"]}`
and `/folder-chat [FOLDER_ID] [Local|Sandbox]`; without an argument it lists
visible folders. Env defaults to Local; explicit Sandbox requires a ready
reviewed native runtime and managed automatic workspaces. Hard allowed-env
policy still applies, with no fallback. Each member gets a private copy and
tools keep explicit selection; any member's folder restrictions block all group
shells. Per-project GitHub/plan, MCP, memory, hooks, background and managed-worktree
surfaces are not implicitly combined. Group source publication separately chooses
one original member; native user consoles and SSH groups remain unqualified.

`sessions.side(parentId)` atomically opens the original side conversation or
creates one with inherited controls and captured full parent context. It never
runs inference or grants write/coordination authority. The root set is inherited
unchanged for folder sides. Navigation nesting alone does not grant context.
Before each new side turn, the service refreshes from its actual
`createdParentSessionId`, atomically retaining `turn.started.sideContext` and
child-owned source grants. `Session.sideContext` exposes the original source
watermark/digest and owning turn/time; it is retained provenance, not model
authority. Later main work appears in the next side question, while earlier
side exchanges and in-progress continuations keep their exact previous inputs.
Fresh inherited images/documents require actual selected-model support and
full input/window/budget admission. Private roles, unsent drafts and held main
queues are excluded; no paid retry, truncation or alternate parent is used.
The same behavior applies to SDK, TUI and desktop callers. Protocol/schema 67
adds its atomic metadata marker without rewriting legacy captures or receipts.

`sessions.askSide(parentId, prompt, expectedDraftRevision?)` atomically reuses or
creates that read-only side and enqueues the original question without replacing
its saved draft. When a main `/side ...` draft is consumed, the exact revision,
prompt and attachments are bound in the same transaction. Retained queue command
origin prevents a lost receipt from replaying admitted work. The slash result
opens the side panel; ordinary model/budget/Env/permission gates still apply.

`commands.list(sessionId, signal?)` returns complete `SlashSuggestion` values,
built-ins before fresh enabled gateway skills, paging one exact catalog digest.
`skills.use(sessionId, id, digest, expectedDraftRevision, replacementText?)`
loads only the exact fresh source and retains actual-user `skill.loaded` provenance
and encrypted grants. It is guidance, never a tool permission or paid call. The
loaded body becomes a `skill` attachment on the draft (text = `replacementText`
or the current draft, never the body); sending the draft delivers the body to the
model as `<user-selected-skill>` context while chat shows the prompt and a skill
chip. User-selected loads add no separate activity row.
Installed and configured skills share the same bounded selection path.
Model/native and outward MCP consumption use the same explicit successful-load
event, bound to the exact source and native call when present. Discovery and
diagnostic reads never emit it. Historical `skill.used` records stay inspectable.

Desktop dictation uses `voice.startCapture(sessionId, id?, { streaming: true })`,
ordered `appendCapture(..., sequence, pcmBytes)`, volatile
`readCapture(...): { text, revision }`, then `finishCapture(..., finalSequence)`.
The microphone button toggles record/confirm on separate clicks. The factory
Ctrl+Space shortcut is held press/release. `voice.shortcutMode:"toggle"` is an
explicit independent shortcut choice; `"hold"` or an absent mode keeps PTT.
The obsolete `voice.pushToTalk` button preference is retained unchanged and
never determines shortcut mode. Protocol 88 migrates existing stores without
inventing a user choice. Renderer gesture ownership prevents an old
shortcut release from finishing a newer click-owned capture.
Finish acknowledges flush intent; await the original job separately for the
exact completed transcript. Frames are mono 16-kHz PCM16, bounded per frame and
capture, authenticated with the transient original nonce, never journaled.
`DraftEditor.startDictation` guards the provisional insertion span against
concurrent/foreign edits. Batch WAV upload and reviewed transcript insertion
remain separate APIs. Reconnect/restart cannot replay PCM, and cancelling a
retained partial job never acknowledges uncertain cleanup as successful.

`voice.enable(true, expectedSettingsRevision?)` reviews the pinned license,
enables voice and downloads its sole managed model through an owned job.
`voice.disable(true, expectedSettingsRevision?)` joins this profile's voice
work, closes its recognizer and removes only the exact managed model/staging.
`voice.prepare()` warms the qualified recognizer without microphone access.
`voice.inspectModel(absolutePath)` starts a read-only `voice.inspect` job that
reads the header, confirms streaming support and hashes the file;
`voice.inspection(jobId)` returns its `VoiceModelInspection`.
`voice.trustModel(jobId, expectedSettingsRevision?)` locks that exact reviewed
path, size and SHA-256 as `settings.voice.model` and enables dictation; it fails
with `speech_model_changed` if the file changed after review.
`voice.useManagedModel(expectedSettingsRevision?)` clears the selection without
touching the file. `settings.update` cannot select or alter `voice.model`
(`speech_model_review`). `voice.status()` reports `model.source`, `runtime` and
`trust` (`trusted`, `unverified`, `changed` with `observedSha256`, `missing`);
a changed digest blocks preparation and capture with `speech_model_changed`.
`voice.enabled` defaults true for the dictation feature; explicitly saved
disabled choices remain disabled. This neither opens a microphone nor downloads
weights. Runtime/model preparation checks configured readiness first rather
than creating failed jobs on unconfigured chats. `voice.standby` is separate
user consent for the focused desktop composer's visible, scoped microphone
standby. External model directories are never deletion authority.
The standby-ready state is a scoped microphone icon/accessible description,
not a repeated paragraph in every chat. An acquired capture recorder exposes
its readiness acknowledgement separately from physical ownership: release can
flush already captured PCM while that acknowledgement is pending. Release
before hardware acquisition still cannot start a late microphone or invent
spoken audio. Streaming partial/final text stays in the exact owning draft;
buffers are wiped, and any batch WAV spool is removed after its owned use.

## Session IDs, dependencies and interactive outputs

`sessions.get(id).id` and `/session-id` expose the real stable identity;
`/session-id` also reports its git-style short ID (`sessionShortId(id)`, the
first eight hex digits). `resolveSessionReference(sessions, reference)` accepts
a full ID or a `:short` prefix of at least eight hex digits and returns every
match: more than one is ambiguous and clients attach nothing. Desktop shows
the short ID in Insights and offers Copy session ID in the session context
menu; the chat header shows only the title. The TUI header shows the short ID. A typed
`:short` mention and `/attach-session SHORT_ID` resolve through the same
reviewed attachment flow. Service log lines for failed requests name the
request type and short session ID.
`attachments.sessionPreview(destinationId, sourceId)` and
`attachments.session(destinationId, sourceId, digest, true)` retain reviewed
public context, including archived sources. ID matching never grants execution
or private transcript/console access.

`sessions.waitPreview(sourceId, targetId)` captures one current target turn or
already queued task. `sessions.waitFor(preview, true)` saves that exact
success-only dependency; `sessions.cancelWait(sourceId, waitId, revision)` removes
only the observed wait. Stop cancels a user's wait and holds undispatched input.
Failure, stop, deletion, archive, changed scope or unknown completion never
releases it. `/wait-session` uses the normal command queue; unheld `/stop` stays
the existing live escape hatch.

`sessions.bulkPreview({action, sessionIds, targetSessionId?, children?})` and
`sessions.bulk(preview, true)` atomically apply reviewed same-project homogeneous
attach/detach or settled whole-set archive/delete. `children` is `cascade` or
`detach` for unselected descendants. `sessions.prStatus(sessionId, url)`
(protocol 112) reads one linked PR's reviews, merge state, head checks and the
Local checkout branch without retaining anything; `prStatus`, `prActionPrompt`
and `PR_ACTION_LABELS` are browser-safe, and `workflows.start` accepts the
`address-review`, `fix-conflicts` and `fix-ci` presets. Profile-scoped
`retention.confirmBulkArchive`/`confirmBulkDelete` skip only UI confirmation,
never the running-session warning (`confirmRunning`).
`coordination.preview`/`grant` enable explicit same-profile public peer messages,
not parent-style dispatch/stop permission. `sessions.associatePr(id, source)`
requires the exact verified `github.source` plus `expectedDigest`; selecting an
additional PR never changes first-association cleanup provenance.

Built-ins `goto_definition` and `find_references` use the pinned TypeScript 7
native semantic API over an approved JS/TS corpus: 200 files, 128 KiB each,
2 MiB total, 1-based UTF-16 positions. Returned `snapshotDigest` binds the root,
complete query and exact source set for continuation. Standard libraries,
installed dependency types, custom config/plugins and other languages are
not silently replaced by regex results. `find_in_array`, `order_asc`,
`order_desc`, `find_bigger` and `find_smaller` accept bounded typed values with
stable, non-coercing comparisons. Discover schemas through `tools.catalog`.

`chatOutputs.renderHtml(sessionId, title, html)` and `render_html` deliver exact
retained HTML up to 128 KiB. Desktop opens an isolated interactive document,
without Node, Moguri access, network, file input or navigation. CLI/TUI expose
the original source and a truthful non-rendering boundary.

`click`, `type`, `wait` and `take_screenshot` use the exact user-enabled Local
Browser pane, `controlId`, expected URL and fresh element refs. The matching
MCP primitives remain available. `apps.run(sessionId, {launch, actions})` is a
bounded `playwright` batch for a newly owned Electron or headless Chromium
instance, never a personal app/browser. Launch selects an exact installed
regular executable and relative Electron entry or approved website URL.
Chromium denies out-of-scope HTTP/WebSocket traffic, service workers,
WebTransport, WebRTC and new workers. Password/file/hidden inputs are refused.
Normal Local host execution is not SendBox containment; non-Local and
restricted-folder/read-only app launches stay blocked. No browser is downloaded
automatically. Known target closure does not prove detached-descendant cleanup.

Screenshot bytes are normalized and retained as typed chat attachments under
their original user/model tool actor, not implicitly added to provider image
context. `attachments.read(sessionId, attachmentId)` retrieves their genuine
bytes. Partial/cancelled/lost work is not replayed or called successful.
`github.browse` resources `files` and `jobs` bind exact PR/run IDs and head SHA;
the PR pane's Files/Actions/Reviews and reviewed watch use the same account/root
and expose stale/unavailable data without acquiring GitHub write authority.
Protocol 116 adds bounded resources `tags`, `release-latest`, `release-tag {tag}`,
`annotations {checkRunId, headSha}`, `contents {path, ref?}`, `settings`,
`rulesets` and `branch-rules {branch}`, and the reviewed
`github.repo.settings` action. `GithubModelActionSchema`/`isGithubModelAction`
name the subset the `github_write` agent tool may preview and execute.

`capabilities.propose(projectId | null, kind, name, content)` accepts `null`
(protocol 116) for skills and scripts that apply to every chat;
`scriptEntries(registry, projectId)` returns the scripts a chat in that scope
sees, with project scripts shadowing every-chat scripts of the same name.

### Retained PR CI lifecycle

Protocol93 adds `github.ci(scope, pullSource, signal?, expectedBinding?)` for a
freshly verified PR source plus its independently retained watch history.
`currentWatchId` is only a head/source association, not proof of green CI.
The browser-safe `githubCiOperationMatches` helper uses actual profile,
project/workspace, canonical root device/inode, numeric account, repository
and PR number; it never attaches an older head-only watch by SHA.

`github.previewCi(scope, pullSource, {headSha?, timeoutMs?, pollMs?, signal?,
binding?})` previews a PR-bound `github.ci.watch` with `prNumber` and
`accountId`. The pair is required together; legacy head-only actions retain
their original meaning. Changed account/root/head invalidates review.
`ciForSession(sessionId, prNumber?)` and
`previewCiForSession(sessionId, prNumber?)` share selection with CLI/TUI,
using a unique linked PR only when no number is supplied.

After actual-user review, `github.execute` retains original admission before
dispatch. Concurrent starts for that exact source return its original watch,
not another poller or a transferred owner. Missing original receipts do not
authorize another start. `github.read(watchId, signal?)` works independently
of source retention and adds `ciObservation`: the original normalized,
credential-redacted complete collection, source target, time and state.
Its encrypted grant belongs to the operation, not the source session.

The operation's optional `ci` metadata holds its immutable target, observation
digest, latest actual observation time, state/count, completeness/deadline and
unconfirmed-cleanup fact. All declared check/status/run pages must agree
before publication. Failure annotations are separately verified against their
original check/head. There is no prefix-as-green, unreported account fallback
or model call. New granular states do not reinterpret historical legacy
results.

Stop and controller-loss recovery preserve partial/unconfirmed evidence
without replay. A new independent watch after lost ownership has a separate
original intent and actual-user inspection confirmation. CI attention uses
the existing event stream with reason `ci` and the real terminal operation
revision, never a solver completion, answer or approval. See
[the complete contract](architecture/github-workflows.md#pr-bound-retained-watches-protocol-93)
and [usage](setup.md#retained-pull-request-ci-watches).

## Remembered approvals and GitHub entry points

Native file/data/readback operations are factory-policy approved rather than
fake human decisions. Stricter explicit review/deny rules still win. Scripts
and external MCPs require normal approval/delegation. Explicit Autopilot/Max
remains automatic; this policy does not bypass hard environment or budget gates.

`webAllowlist.list(sessionId?)` returns effective Local entries for that exact
session or all entries in the connected profile. `add(site, scope,
expectedSettingsRevision?)` and `remove(id, expectedSettingsRevision?)` use the
existing atomic settings revision and validate original profile-owned sources:

```ts
await sdk.webAllowlist.add("docs.example.com", {
  kind: "session", sessionId: session.id,
});
await sdk.webAllowlist.add("https://example.com:8443", { kind: "global" });
const effective = sdk.webAllowlist.list(session.id);
await sdk.webAllowlist.remove(effective[0]!.id);
```

Project scope is `{ kind: "project", projectId }`; global means this profile,
not shared cross-profile policy. Exact hostnames permit default-port HTTPS;
exact origins preserve scheme/port. Rules do not confine approved Local shell
scripts, broaden Sandbox's actual firewall, authorize Remote, or enable browser
control. Model tools cannot apply these settings. `/firewall` exposes the same
user-only API in CLI/TUI and desktop.

Protocol/schema 73 adds an optional `permissions.webAllowlist` with a strict
atomic migration marker. No older record gains grants or changes ciphertext,
receipts or accounting. Ordinary `read_file` refreshes a stale optional digest
with explicit `sourceVersion` provenance and a fresh `sourceRef`; stale byte
continuations restart at zero. `requireExactVersion: true` retains intentional
pinning. Exact write/edit CAS and immutable original tool results are unchanged.

`approvals.respond(sessionId, approvalId, allow, remember?)` atomically records
the actual pending answer and optional `{ scope: "session" | "project" | "global",
match: "exact" | "family" | "tool" }` grant. Global means all projects in this profile,
not another profile or execution environment. `approvals.list()` and
`approvals.revoke(id, expectedSettingsRevision?)` share settings revisions.
Family grants accept only conservative simple commands; MCP grants bind the
actual server configuration and schema. Callers cannot replace the pending
command or supply a different grant target. Explicit `tool` matching permits new
arguments to that same named tool only inside the chosen scope and environment.
Execution requires an exact command or conservative family rather than a blanket
execution-tool grant. `/approve project tool` uses the actual selected folder
member, and `approvalProject(session, call.arguments.repository)` exposes that
same unambiguous project identity for client choice controls.

`sessions.autonomy(id, "Autopilot")` explicitly sets
`controls.automaticApprovals: true`; Max does the same while requiring its
qualified decision provider. `automaticApprovalsEnabled(controls)` is the shared
check: Autopilot/Max approve automatically unless `automaticApprovals` is
explicitly `false` (the bounded opt-out). Unmarked legacy sessions and saved
global/profile/project Autopilot defaults count as automatic; new sessions
resolve the marker to `true`. Original events are not rewritten.
Manual/Guided never gain automatic approval through an inherited marker.

```ts
await sdk.approvals.respond(session.id, approval.id, true, {
  scope: "project", match: "family",
});
const repositories = await sdk.github.repositories();
const next = repositories.nextPage && await sdk.github.repositories({
  account: repositories.account, accountId: repositories.accountId,
  page: repositories.nextPage,
});
const scope = { env: "Local" as const, projectId: session.projectId!, sessionId: session.id };
const project = await sdk.github.project(scope);
const abort = new AbortController();
const matches = await sdk.github.search(scope, project.repository, project.account,
  "is:issue is:open (UI OR UX OR redesign OR polish)", 1, 30, abort.signal);
const source = {
  kind: "issue" as const, repository: project.repository,
  account: project.account, accountId: project.accountId, number: 7,
};
const reviewed = await sdk.github.source(scope, source);
// Display reviewed.item in full and obtain the user's explicit start action.
const created = await sdk.github.startSession(scope, source, reviewed.digest);
```

`github.repositories({ source: "public", query })` explicitly searches public
repositories. Public visibility is not an open-source license claim.
Discovery uses only the current controller GitHub CLI account. No Copilot login,
secret-backend updater token, rootless filesystem access or SSH fallback is
introduced. `github.project` derives the remote the folder's Git configuration selects, actual
default branch, local branch and account; clients do not guess `main` or an
account name.

`github.search(scope, repository, account, query, page?, perPage?, signal?)`
uses typed `resource: "search"` through `github.browse`. Terms must not contain
`repo:`, `org:` or `user:` replacements or escape the selected repository with
unbalanced parentheses/quotes. The complete page must agree with its reported
count/next-page receipt, remain inside that repository and fit the 1,000-result
search bound. Refine an oversized/incomplete query; missing results are not zero.
`github.browse` also accepts an optional AbortSignal. Cancellation belongs to
the original read, never a replacement call.

The discovered model tool `github_read` accepts `{action: "project"}` or
`{action: "browse", input: GithubBrowse}`. It pins the actual Local
project/worktree's discovered repository, login, numeric account, profile and
canonical root; it cannot substitute another repository/account or run in a
project-free chat, group, Remote or Sandbox. `/github search TERMS` uses the
same SDK/service read in CLI, actual TUI and desktop. Public `fetch_page`
remains anonymous; no ambient credential forwarding or login API is added.

`github.source` and `startSession` bind canonical repository/item identity,
numeric account identity, actual profile/root inode and reviewed complete
title/body. The returned `binding` is not a filesystem or permission grant. `Session.githubSource`
retains original provenance; relinking that source clears the current
attribution without rewriting history. `Session.workItemUrl` is the separately
typed GitHub issue binding, independent of local `workItemId`. New sessions
contain an unsent draft, not a claimed prompt or changed checkout.
Existing `github.preview`, `execute`, `read`, `wait` and cancellation retain the
original exact-review/no-replay write lifecycle.

## Lean tools and session coordination

The Node-only `globalSkillSources(homeDirectory?)` returns disabled Local source
presets for `.agents/skills` and `.moguri/skills` beneath an explicit home or the
current OS user's home. It performs no directory scan or source admission.
Review the returned absolute paths, explicitly enable the intended entries,
and save through the existing profile-owned settings API before discovery.
The desktop confirmation uses these same presets; CLI/TUI consumers can use
them without giving the model source-configuration or approval authority.
`createGlobalSkillFolder(id, homeDirectory?)` creates only the exact preset
folder for `global-agents` or `global-moguri` (desktop calls it on
confirmation) and rejects any other id. An enabled Local source whose folder
doesn't exist offers no skills instead of failing the combined catalog.

`skills.install(projectId | null, skillId, expectedDigest)` (protocol 114)
re-reads one source skill and installs those exact bytes disabled in a project
or, with `null`, every project. `tools.toolsets()` returns the built-in tools
grouped into toolsets plus the foundational scripts; listing grants nothing.
`artifacts.library(projectId | null)` returns metadata of build outputs and
agent-written files with their linked session. `suggestions.preview` results
include `tools`, repeated requests a script could handle. Contract:
[skills, tools and artifacts](architecture/skills-tools-artifacts.md).

`skills.find(query, { sessionId?, sourceId?, offset?, expectedCatalogDigest?, signal? })`
refreshes enabled registered skills and explicit `settings.skillSources` folders
or HTTPS archives. It returns eight bounded metadata entries, source/path,
SHA-256, `catalogDigest` and `nextOffset`. Supply the catalog digest for later
pages: they are served from that first page's metadata snapshot (kept for five
minutes per profile, session and source filter), so a listing stays consistent
while files change. If that snapshot is gone or the scope changed, the result
has `restarted: true` and begins again at offset 0 of the fresh catalog; restart
your listing. `skills.read(id, expectedDigest, sessionId?, signal?)` always
refreshes and returns the whole checked body only when it still matches.
Configuration changes, removal, source failure and changed bytes never return a
cached substitute body.
The optional session binds actual profile/project/Local scope; omitting it is
an explicit user control-plane preview, not an inherited project. Configured
source discovery on Remote/Sandbox agents remains unqualified.

The `moguri/mcp` entrypoint adds `moguri_find_skills` and `moguri_read_skill` to
the existing single stdio gateway. It binds its own session, rejects foreign
authority fields and exposes no source-configuration or self-approval tools.
SDK/MCP cancellation propagates through the authenticated request into the
source download and discards the pending reply. Downloads also have a
15-second deadline and abort on shutdown. No source lookup creates durable
capabilities or model calls.

`dashboard.overview({ range?, projectId? })` returns all four pages' shared
projection: `work`, `days`, `projects`, `models`, `totals` and `velocity`. The
default is seven UTC calendar days. Use the existing `BudgetRange` presets or
inclusive custom dates; all-time remains in detailed budget accounting.
Unknown dated reports and cost estimates preserve existing provenance.
`velocity.productivityIncrease` remains null: only retained normal agent-turn
outcomes, valid timing and actual user approval/answer events are measured.
Control/role turns and stopped/partial work cannot become successful tasks.

`suggestions.preview(null, true)` is a global local-only preview, including
deterministic `gaps` and the actual generation `modelId`, without session
creation. `suggestions.generate(null, digest, true, true)` creates a settings
chat only after exact source/model review and ordinary model admission.
Non-null session IDs retain explicit scoped behavior.

`tools.catalog(sessionId, query, offset)` returns scoped native schemas and
digests. Normal model solver turns use the same catalogue through
`discover_tools`, exposing only the loaded native functions at the next
boundary. The complete service capability set remains authoritative; schema
discovery is not permission. Model-turn-only functions require their actual
owner and cannot be called as standalone user jobs.

`tools.execute(sessionId, name, arguments, schemaDigest)` admits a Local user
tool job under exact normal approval, without a model call or Env fallback.
Its returned ID is admission, not success: inspect `jobs.wait` and the original
result. `tools.results(sessionId, { before?, limit? })` discovers original
public sources. `tools.resultById(sessionId, operationId,
{ offset?, expectedDigest?, expectedRevision? })` pages the exact retained source
with UTF-8 byte offsets, including after paging, source edits and restart.
Pin its digest/revision for continuations. Every public model-tool context
includes its actual `retainedSource`; models need not invent opaque step IDs.
The older `tools.result(sessionId, stepId, callId, offset)` also accepts that
call's exact activity operation ID in place of `stepId`, never a heuristic
cross-session lookup. Both preserve outcome/`rawComplete`; private controls,
hooks and other/deleted sessions are excluded. `tools.state` queries the
canonical in-memory todo/memory projection, not persistent internal tables.

`sessions.autonomy(sessionId, autonomy, expectedRevision?)` is an explicit
selection, including reselecting a legacy Autopilot value. It retains actual-user
command provenance and automatic-approval consent across later turns/restarts.
Loading old values or changing an unrelated setting cannot broaden old consent.
An actual generic autonomy change also discards a copied Manual false marker.

`commandReceipt(command, commandId)` only inspects that original exact
profile-owned command: `committed` includes its canonical result; `pending`
and `unknown` are not success or permission to resend. Lost mutation replies
are reconciled once against the original authenticated service/store, without
re-executing the command. Local edits remain intact.

For a cold native compound start, capture the immutable command and an explicit
command ID before dispatch. If its HTTP acknowledgement remains pending while
the service performs the existing bounded native source revalidation, inspect
only that original receipt within the same operation bound. Do not send another
start, use a later input or interpret `unknown` as a committed workflow.
This does not extend mutation, VM, script or model timeouts.

Reads use the service's
30-second deadline plus a separate two-second delivery allowance, rather than
an unrelated shorter transport cutoff. An expired read cancels/discards its
original source and returns `query_timeout`; it does not disconnect healthy
editing or silently rerun a tool. Electron forwards the same deadline and receipt
route. `DraftEditor` resumes only canonically undispatched autosaves after
checking the original fresh revision; peer changes remain conflicts and
unknown dispatched saves or input submissions are not replayed. Dispose editors
to release their reconnect subscription. Late SSH original-result grants survive
restart without converting their original partial turn into success.

`git.status/branches/log/show/diff(sessionId, ...)` and
`git.preview(sessionId, action)` resolve the actual Local project/worktree.
`git.execute(preview, confirmations, true)` uses the existing independently
retained Git job pipeline; inspect `git.wait/operation` rather than treating
admission as success. The finite `GitAction` union includes branch creation,
current-branch rename, clean switch, exact-file stage/unstage, selected staged
commits, a new current-tip revert commit, push, rebase and tags. Selected commits
reuse the existing private-index pattern and preserve the real index, unrelated
staged files and unstaged bytes; they do not borrow the artifact helper's
different new-branch publication semantics. Normal pushes also compare the
captured destination SHA/absence, without granting non-fast-forward writes.
Managed rename binds `document.managedBranch` and atomically updates the original
workspace/change-set name without changing root/base identity. Existing managed
roots cannot be switched to another change set. A partial metadata
acknowledgement requires separate exact user inspection and metadata-only
`workspaces.reconcile`; it never reruns Git or relabels the operation successful.
`git_read` and `git_write` expose the same capabilities to the actual model
catalogue; ordinary `/git` commands execute through the original service queue.
Unsupported Remote/Sandbox/group/Home execution never borrows a Local checkout.

`tools.command(sessionId, jobId, offset, targetSessionId?)` reads the original
watch job. Another session needs an actual coordination grant. Its typed
`data.source` distinguishes live owned tail, retained result and unavailable;
missing wall time/output stays null. `tools.acknowledgeCommand` requires the
exact returned inspection digest and actual-user confirmation; partial work
does not become successful. Resume stays separate.

`coordination.read(sessionId, input)` selects list, inspect, transcript, inbox
or the child's original captured parent snapshot. The discriminated
`data.action` carries actual public state/plan/question or a UTF-8 page/digest.
Use that digest for continuations. No hidden reasoning, private consoles,
credentials or unbounded history expansion is authorized.

```ts
const review = await sdk.coordination.preview(parentId, childId);
// Display both actual bindings before an explicit user grant/revocation.
console.log(review.parentBinding, review.childBinding);
await sdk.coordination.grant(parentId, childId, review.digest, true, true);
await sdk.coordination.message(childId, parentId, "An advisory observation.");
await sdk.coordination.control(parentId, {
  action: "dispatch", targetSessionId: childId, text: "The explicitly selected task.",
});
```

Messages retain actual user/model/service origin. Advisory delivery does not
consume drafts, answer/approve or launch paid work. Fresh delivery and queued
task admission require the original grant/root proof; stale messages remain
inspectable with a diagnostic. Dispatch is explicitly metered work under the
child's current controls; stop binds `expectedTurnId`, including null before
admission. Actual question/approval actions use their original owning APIs.
Live native coordination is unqualified, never a Local fallback.

`workflows.start(sessionId, "review" | "security" | "performance" | "debug",
prompt, expectedDraftRevision?)` uses the existing prompt admission path.
Draft consumption is an exact optional CAS; unrelated drafts stay intact.
The four lowercase shared slash presets investigate/fix within current policy.
Shared `/tools`, `/tool`, `/tool-result`, `/state`, `/watch` and `/coordinate`
also reach CLI/TUI/desktop; CLI accepts the corresponding non-slash names with
`--session ID`. See [setup usage](setup.md#lean-tools-and-coordinated-work).

## Agent command output

`agentTerminals.list(sessionId, { before?, limit? })` returns original
`run_command` requests/results for that exact profile/session, not User or
Global consoles, other tools, workflow jobs or private model context.
`agentTerminals.read(sessionId, commandId, { offset?, limit?, tail? })` returns
up to 16,384 retained UTF-8 bytes. Follow `nextOffset`, or request `tail: true`
without an offset. The tail starts on a complete code point; null output is
unavailable, never empty successful execution. Original environment and outcome
stay attached to the command, regardless of current settings.

The model executes through `run_command` and can request the separately
approved read-only `read_agent_terminal` list/read capability. It has no access
to private console input/output and no interactive stdin route. Each command
owns its existing bounded PTY; this is not a persistent shell or new executor.
Policy changes and cancellation invalidate held reads before source return.

CLI `agent-terminal list [SEQUENCE ID] --session ID` and
`agent-terminal read COMMAND_ID [UTF8_OFFSET|tail] --session ID` share
`/agent-terminal list/read` in desktop/TUI. Opening or reading the Agent view
never starts a process/model or adopts a saved PID. Schema 46 changes no SQL
layout and preserves original retained bytes/receipts on upgrade.

## Retained chat activity

`activity.list(sessionId, { before?, limit?, toolName? })` returns up to 100 exact source
entries and public-message positions. `sequence` places an operation in the
conversation; `updatedSequence` follows its latest observed event. Pagination
uses the returned `nextBefore` sequence/ID cursor, so a late result for an old operation
returns in the recent page without moving its original transcript position.
The ID disambiguates operations updated by the same cancellation event.
`current` separately returns up to 100 running/waiting entries with an exact
`currentCount`, so history pagination cannot hide an old still-running call.

`activity.read(sessionId, activityId, "arguments" | "output", { offset?, limit?, toolName?, tail? })`
reads the original session-scoped source, up to 16,384 UTF-8 bytes per page.
Follow `content.nextOffset`; null content means unavailable, not empty success.
Output size is retained response bytes, not total process/network I/O.
Before a final result, `outputBasis: "retained-tail"` explicitly labels bounded
captured output; it cannot become complete process output or a success receipt.
`activity.turn(sessionId, turnId)` returns original timing, outcome, models,
context evidence and all-role owning-turn budget totals. `activity.response`
copies public assistant text only from the authenticated snapshot.

`conversationNavigation(snapshot, sessionId)` derives chronological
`ConversationNavigationEntry` values from already retained public prompts and
actual-user structured answers, without a query or mutation. Each opaque ID
binds profile/session/source identity; `messageId` and `messageIndex` locate the
original source, and answer entries retain `questionId`, question text and exact
user answer. Original model `turnId` values are preserved. Missing sessions are
explicit errors; tool approvals, queued prompts and model/decision-provider
answers are excluded. The same browser-safe selector serves main/side desktop
navigation and other SDK clients without another service endpoint. The current
runtime still requires its matching service protocol for per-question side
refresh and the other shared APIs.

`Snapshot.sessionTelemetry[sessionId]` already contains original `turns`, current
`budget` or its explicit `budgetDiagnostic`, live `estimate`, and recorded
`context`. These service-owned views are reconstructed from retained events,
messages and original budget entries, updated through normal sequenced snapshot
refresh, and scoped to the SDK profile. Opening a display needs no `activity.turn`,
`budget.status` or `session.context` query. `activity.turn` reuses the saved view.
Deleting a session removes this view; independently retained accounting survives.

`UsageEstimate` separates estimated input/visible output and captured-rate USD
from reported quantities and held capacity. Original turn windows do not change
when the next working window is edited. Context uses the last visible model's
retained input estimate plus its visible output; unsent draft text is excluded.
`knownCacheReadTokens`/`knownCacheWriteTokens` and the corresponding unknown-call
counts preserve partial totals without treating missing reports as zero.
Explicit zero needs presence evidence; positive normalized counts do not depend
on transport presence flags. No private role prompts or reasoning are exposed.

`useSessionActivity` in `moguri/react` provides scoped, non-overlapping refresh,
earlier-page loading and stale-response isolation. No refresh runs a model,
tool, provider metadata lookup or terminal. Thought sources are already-public
provider reasoning only; request time is not separate thinking time.
Its optional fourth `toolName` argument narrows the service-owned view and its
scope key; it is not an execution grant.
Successful unchanged activity reads also survive a chat/dashboard remount in a
bounded 16-scope cache owned by the exact SDK client/profile/connection.
Draft edits and title-only changes do not invalidate retained operations.
Relevant turn/message/usage/operation changes still refresh, and active pending
work keeps its existing bounded polling. Earlier loaded pages stay with their
own scope. Disconnect, connection replacement and session deletion evict their
cache entries; errors never become empty successful histories. This is a
transient read cache, not model context, execution authority or durable history.

CLI `activity list [SEQUENCE ID]`, `activity turn TURN_ID`, and
`activity read ACTIVITY_ID arguments|output [UTF8_OFFSET]` require `--session ID`.
Shared desktop/TUI `/activity`, `/activity before SEQUENCE ID`,
`/activity turn TURN_ID` and `/activity read ACTIVITY_ID output [UTF8_OFFSET]`
use the same API. Schema 45 adds only the atomic, actual-user `skill.used`
event/source grant and a transactional version upgrade; existing SQL layouts,
ciphertext, receipts and sanitized independent telemetry remain unchanged.

## Shared interaction APIs

`settings.values.interactions` contains `confirmSessionAttachments` and
`confirmTerminalClose`, both defaulting to `true`. Use the existing optimistic
`settings.update` or `settings.reset("interactions", revision)`; these settings
are profile-scoped presentation preferences, never tool or environment grants.

`sessions.reorder(sessionIds)` atomically saves one complete current sibling set.
Project, group, parent, pin and archive scope must match, with every captured
revision still current. `compareSessionOrder` gives the same stable order used
by both clients. CLI `session reorder ID...` and shared `/reorder-sessions ID...`
call this operation, without reparenting or resuming anything.
The explicit main-line form
`sessions.reorder(projectId, parentSessionId, groupId, archived, entries)` also
remains supported, with exact caller-captured revisions for its complete sibling
set. Direct valid `sessions.organize(id, { order })` updates remain available.

`attachments.projectPath(sessionId, projectId, relativePath)` resolves an
explicit Local project source and the current session's bound Local worktree
when applicable. `attachments.localPath(sessionId, absolutePath)` distinguishes
regular files from folders without granting model filesystem access. Capture a
file with `attachments.file`; folders retain preview/digest/confirmation.
Protected paths, stale managed roots and project denials are not bypassed.

`githubPreview` / `github` additionally accept `#137`, `owner/repo#137` and
`@owner/repo/path`. The first needs the current project's GitHub upstream.
`access: "auto"` selects the Local controller's CLI or disclosed public-only
access; the existing default remains `"public"` for SDK callers. Exact remote
text bytes, base64, Git blob hash and GitHub provenance are checked before
retention. Files are UTF-8 only, up to 128 KiB. The review digest binds actual
access provenance as well as source content and destination. This is a disclosed
client-attachment boundary, not a substitute for pinned-SSH metadata reads.

The low-level compatibility method `terminal.openGlobal(cols?, rows?)` opens a
Local console in configured canonical HOME. Its binding has null session,
project and workspace IDs and the active profile's authenticated Local owner.
It neither inherits a selected project's root nor depends on its retention.
Protocol 60 retires Global Terminal UI and CLI/slash creation with an explicit
error. Existing null-session consoles remain in `terminal list` and
`/terminals list` for exact inspection/reconciliation/close.
`terminal.openGlobal(root, cols?, rows?)` retains the explicit-root SDK
compatibility overload. Its binding retains the actual
captured root; it does not substitute a project, session or configured SSH root.
Existing `terminal.open(sessionId)` keeps its exact project/worktree/SSH root.
Closing/hiding the desktop pane detaches; `terminal.close(id)` terminates.
Reconnection/restoration never creates a replacement or replays input.

`terminal.run(sessionId, command, signal?)` is the `!COMMAND` composer shortcut:
it types one line plus Return into the chat's running user console (project
folder, managed worktree or captured Home), opening one only when none is
running, and returns `{ terminalId, root, opened }`. It never creates a message,
steer, queue item or model call. `parseShellCommand(text)` returns the command
for a draft that starts with `!`, or null. Details:
[shell lines](architecture/terminal-reattachment.md#shell-lines-from-the-composer).

`sessions.organize(id, changes, expectedRevision?, confirmDetach?)` requires
the final `true` acknowledgement when removing an existing parent and this
profile's `interactions.confirmSessionDetach` is not false. It does not bypass
revision, same-project, active-work, cycle or model-owned-subagent guards.
Desktop drag/menu/parent-selector detachment uses the same native review;
remembered opt-out is a profile-owned settings edit, not an approval grant.
Missing legacy preferences normalize to true and reset with
`settings.reset("interactions", revision)`. Schema 60 adds the transactional
`session_navigation_schema` marker without rewriting retained payloads.

The original desktop schema-44 marker is additive; legacy confirmations default to asking,
legacy session order derives from creation, and historical data/grants retain
their original encryption and identities. Local project names are safe unique
identifiers; normalization never renames filesystem directories.

### Retained-state upgrades

Protocol/database 68 requires `composer_workflows_schema` and exact retained
side-prompt command origin. Marker/version insertion is atomic; failure leaves
the old state reopenable, current corruption is not repaired, and original
ciphertext, grants, receipts and accounting are unchanged.

Protocol/database 67 atomically adds `side_context_schema` and rejects missing,
corrupt or prematurely relabelled markers. Older ciphertext, receipts, creation
snapshots and accounting remain unchanged. The first new side question captures
its actual original main source under the child's grants; old turns are not
replayed, rewritten or granted another paid call.

Protocol/database 66 atomically inserts `retained_telemetry_schema` and advances
the version. Missing/corrupt current markers and premature older-lineage markers
are rejected without repair or partial writes. The upgrade preserves original
ciphertext, grants, receipts, totals and unknown holds. Startup recovery may
append existing `budget.recorded` events for the same settled call only when
its retained original model identity and token totals match exactly. It never
infers absent zero counts, reprices with new rates or repeats a completed repair.
Unqualified historical result formats are diagnosed without blocking recovery
or inventing counts. Stopped runtime snapshots preserve final root-owned
capacity without reading closed stores; they cannot authorize another call.

Protocol/database 56 adds the strict transactional `browser_control_schema`
marker and reviewed upgrade from an older running service. Native browser
leases/control never persist or replay. The genuine schema-55 migration,
interrupted insertion and corrupt-marker cases preserve exact encrypted
events, keys, receipts and remembered model selections. Protocol 55's
profile-root preference ownership remains unchanged.

Protocol/database 54 adds the versioned session PR observation marker after
the converged 53 history. Marker insertion/version advance are transactional;
insertion failure rolls back and current missing/corrupt markers refuse reopen.
Legacy links keep missing draft state unknown. No ciphertext, keys, grants,
drafts, command receipts or historical lifecycle outcomes are rewritten.

Protocol/database 53 converges main-line versions 44-52 and the independently
numbered desktop versions 44-46. It identifies desktop provenance by the retained
`desktop_interaction_schema` marker, not by guessing from the version. Its one
transaction validates or adds the required entry, preferences, browser capture,
sounds, application, storage, updates, session interaction and managed Sandbox
markers and advances the version only after all succeed. A known desktop store
previously opened by main also retains that original provenance.

Migration never rewrites encrypted history, keys, source grants or receipts,
replays commands, starts a model or changes retained approval/accounting actors.
Missing markers in a main-line store and invalid provenance/marker values fail
without partial writes. Generated coverage includes both lineages, the known
partial crossing, insertion failure, corruption and an actual service reopen.
Restart matching clients and service while retaining the original state root
and encryption backend; never delete state to make an upgrade succeed.

The repository's warning-free `npm ci` uses root-level compatibility overrides.
npm does not inherit a dependency's overrides, so a minimal external SDK host
can still report the upstream whatwg-encoding/node-domexception deprecations.
To apply the same verified Node 26 policy without changing unrelated host
dependencies, the embedding application's root manifest can use:

```json
{
  "overrides": {
    "moguri": {
      "encoding-sniffer": "1.0.2",
      "node-fetch": "npm:node-fetch-native@1.6.7"
    }
  }
}
```

## Session interaction contract

`sessions.reorder(projectId, parentSessionId, groupId, archived, sessions)`
requires the complete sibling set as `{sessionId, revision}` entries. It checks
all revisions before appending the existing `session.organized` events atomically.
`Session.order` and the browser-safe `compareSessions` helper provide shared
presentation order with pin priority; they do not change worker admission
priority. Existing `sessions.organize(id, {parentSessionId}, revision)` keeps
same-project, no-active-reparenting, model-subagent and cycle/depth boundaries.
No move transfers model context, roots, Env or permissions.

`settings.values.retention.confirmArchive` and `confirmDelete` default to true
and scope to the current profile. They are routine client-confirmation
preferences, not CP permission grants or automatic retention policy. Actual
session deletion still requires its existing explicit confirmation/revision and
successful owned cleanup.

Protocol 112 adds an optional `confirmRunning: true` to `session.archive`,
`session.delete`, `sessions.bulk` and `project.remove` (SDK:
`sessions.delete(id, true, revision, children, { confirmRunning: true })`,
`sessions.bulk(preview, true, { confirmRunning: true })` and
`projects.remove(id, true, revision, artifacts, { confirmRunning: true })`).
When the selected trees hold a running session (an active or waiting turn, or a
running owned job), the service refuses without it with `session_running` (409)
and changes nothing, whatever confirmation preferences are saved. Clients send
it only after showing the user the browser-safe `runningSessions(sessions, jobs,
rootIds)` warning; `runningSessionNames` formats it.

`questions.skip(questionId, revision)` records the actual user's explicit skip
(`answer.skipped: true`, text `Skipped`, schema 107). The model receives
`{ answer: null, skipped: true }` with guidance that a skip is not consent, and
no answer artifact is retained.

`questions.answerOther(questionId, text, revision)` explicitly records a real
user's alternative, including for a strict-choice question. It does not add a
model-offered choice, expand automatic technical-choice delegation or consume
the chat draft. `questions.answerDraft(id, revision, true)` is the separate
explicit Other path that atomically consumes only the exact saved text revision.
Ordinary `answer`/`answerDraft` retain their original validation. CLI
`moguri question answer-other ID ANSWER_FILE --revision N` and shared
`/question other ID REV TEXT` use the same endpoint. Neither operation grants
tool/Git permission.

The owning worker's existing `task_progress` tool accepts `action: "plan"` with
a title and two to fifty distinct `{text, status}` steps (`pending`,
`in_progress`, `done`). `task.plan_updated` and `Session.taskPlan` retain its
actual model/step/call, binding hash, revision and turn. `progress.plan` is null
for another task/root; polling and ordinary messages cannot create a plan or
start another inference. The desktop shows this checklist only in Plan.

Resume admits one queued prompt per settled owned turn. New explicit stop intent
uses `turn.stop_requested.payload.holdQueue` to retain undispatched prompts
through restart without changing legacy event interpretation. Explicit Interrupt
keeps its own next-turn semantics; cancellation and unknown accounting never
become completed work or authorization for a replay.

## Document attachments

`attachments.file(sessionId, path)` automatically extends existing source/text
and image selection with content-validated `.pdf`, `.docx` and `.xlsx`.
`attachments.document(sessionId, path, { captureId, expectedRevision? })`
requires a supported document format; `cancelDocument(sessionId, captureId)`
stops that exact active capture, not a turn or another client's work.
The service owns admission, extraction and the optimistic draft transaction.

```ts
const captureId = crypto.randomUUID();
const captured = await sdk.attachments.document(sessionId, "/explicit/report.xlsx", { captureId });
const descriptor = await sdk.attachments.read(sessionId, captured.id!);
const page = await sdk.attachments.readDocument(sessionId, captured.id!, {
  sheet: "Sheet1", range: "A1:D20", limit: 4096,
});
const matches = await sdk.attachments.searchDocument(sessionId, captured.id!, {
  query: "literal text", limit: 5,
});
```

Reads accept a PDF `page`, extracted `section`, or exact XLSX `sheet` with an
optional ascending A1 `range`. Their UTF-8 `offset` / `nextOffset` applies only
to that exact selection's JSON-lines view. `firstLocation` / `lastLocation`
preserve provenance even across a split line. Search `cursor` / `nextCursor`
and inventory `offset` / `nextOffset` are independent. Reset pagination when
changing the selection/query.

`listDocuments(sessionId, { offset?, limit? })` returns bounded descriptors,
without bodies or workstation paths. The model's separately approved
`list_documents` sees admitted documents only, including after compaction.
User preview APIs can inspect retained draft/queue documents. `original()`
explicitly returns the bounded original as canonical base64; ordinary `read()`
returns a document descriptor/status, never its full extraction or original.

All these schemas, types and calls remain browser-safe. Only explicit Node
runtime creation loads the parser supervisor; its compiled worker and libraries
are included in packed consumers. The [document contract](architecture/document-attachments.md)
defines licenses, resource bounds, encrypted grants, cancellation and migration.

## Reviewed platform workflow surface

All commands/queries below use the same authenticated loopback API, immutable
profile, optimistic review/revision checks and sequenced events. No new public
network API or credential fallback is added. Root/React imports remain
browser-safe; Node runtime loading stays explicit.

| SDK surface | Authority and result |
| --- | --- |
| `knowledge.save/list/read/history/version` | Exact Sky session/lifetime or Terra project/work item; profile-wide Glacier only after reviewed promotion |
| `knowledge.promote(id, revision, digest, summary, true)` | Independent user-reviewed compressed copy, never model acceptance or automatic source mutation |
| `knowledge.rollback/forget` | Exact original note revisions; per-note encryption grants and non-replayable creation intent survive source expiry without retaining its text |
| `hooks.import(projectId, definition)` | Bounded `turn.start`/`turn.end` definitions, imported disabled |
| `capabilities.history/version/rollback/useSkill` | Review retained actual bytes, restore disabled content or append a selected skill to an optimistic saved draft without sending it |
| `marketplace.catalog/preview/install` | Registered repository, full commit and catalog path; complete exact bundle review; atomic disabled install/update/rollback |
| `github.browse/preview/execute/read/history/wait/cancel` | Explicit Local root and actual selected controller `gh` account; protected Git/GitHub confirmations and independent original effects |
| `linear.catalog/issue/preview/execute/accept/read/history/wait/cancel` | Explicit enabled board/team, exact account/entity/revision review, two-way local ticket mapping and retained original results |
| `cache.inspect/prepare/install` | npm/pnpm/python/cargo/go; exact manifests/locks, resource authorization, advisories and verified immutable bytes; executable builds are not implied |
| `cache.registries.list/save/remove/setToken/clearToken` | Profile-scoped private resources; secrets stay in the explicit keychain and never enter metadata/receipts |
| `containment.status/requireSandbox(true)` | Truthful process-group limitation or explicit global qualified-SendBox requirement; no launch, inferred PID ownership or Env substitution |

`memory.useTieredContext` defaults off even in older state that already enabled
source-index context. Imports/enabling cannot grant tools, answer a question,
authenticate, start paid work, or weaken policy. Session-owned workflow stop
propagates to its original job while independently retained operation documents
survive source deletion. Unknown remote writes remain partial, never retried
from lost receipts or restart.

Desktop Settings, the dedicated CLI and shared TUI/CLI/desktop slash handlers
all call these APIs. Examples and exact errors/lifecycle limits are in
[platform workflows](architecture/platform-workflows.md),
[GitHub](architecture/github-workflows.md),
[Linear](architecture/linear-workflows.md) and
[dependency cache scopes](architecture/dependency-cache-scopes.md).

### Shared preference maintenance

Protocol 78 adds the transactional `theme_catalog_schema=1` marker and the
Rose, Terminal, Aubergine, Ember, Monochrome, Vaporwave and Crystal palette IDs.
Existing Moguri/Ocean/Orchid IDs, saved Custom values and factory Dark are
unchanged. `themePalettes`, `ThemePaletteSchema` and `appearanceColors` expose
one browser-safe catalogue; `sdk.slash(sessionId, "/theme crystal dark")` uses
the existing revision-bound settings API, without inference. `/theme list`
inspects the catalogue and palette-only changes preserve the selected mode.
Desktop and TUI render those same tokens. No new event kind or preference store
is introduced; rollback/restart and strict lineage checks preserve retained data.

Protocol 45 preserves old event/control bytes and explicitly saved retention
values while filling new nested defaults. `settings.update/reset` includes
typed `guidance`, named/custom `appearance`, default `permissions.defaultDecision`,
optional session `verbosity`, `lifecycle` and existing-daemon integration settings.
Global/project guidance is recorded in actual future prompt snapshots.
`runtime.status()` reports the encrypted directory and real owned idle-sleep
state; `runtime.retryPower()` retries only that original helper, never a model.

`projects.repositories(id)` is a bounded, explicitly Local, non-link-following
inspection. With one completely verified repository, including a nested root,
its `upstream` is the remote that repository's live Git configuration selects
(`gh repo set-default` choice, then `origin`, then the only remote; never the
checked-out branch's tracking remote), or `null`. Project
settings never store an upstream; a legacy `repo.upstream` is ignored and
dropped. Incomplete/denied/multi-repository layouts do not guess or rebind the
session's workspace.

`integrations.githubConnection()` explicitly verifies the controller GitHub CLI
account without Copilot/update credentials. `linear.connection(false)` reads only
credential presence; `linear.connection(true)` verifies the actual account and
workspace without inventing a project/team. `integrations.sqlStatus()` makes
only the enabled, explicitly configured existing daemon's bounded health read.
These observations do not grant files, tools, repository writes or model access.

## Decision-provider development surface

`decisions.status(sessionId)` reports actual compatible provider readiness,
privacy and output limits without inference. `decisions.list(sessionId?)`
reads independently retained requests; `decisions.read(id)` returns the exact
original rubric/state/policy, real model actor/step, raw result and validated
advice. `decisions.stop(id)` stops only that original one-shot owner, not
another parent turn. There is deliberately no public `evaluate`, `answer`,
`approve`, retry or permission-grant endpoint.

`settings.decisions` defaults disabled with no selected model. Save an explicit
`bounded-model` policy and available canonical model ID, then separately choose
Autopilot Max in session controls. Fixed and kupo Single model selection stays
independent. Hosted inputs require separate consent; the root-less Local worker
uses actual all-role token/USD admission and existing finishing holds.
Protocol85 additionally binds tool-less subcalls to the original SSH/native
parent using version-2 `DecisionRecord`/`DecisionDocument` and
`OwnedModelTransport`. Their `env`, exact execution/worker/peer or guest/root
identity and `owned-role-acknowledged` cleanup cannot become a Local record or
proof of parent exit. An unchanged readiness read starts no inference.
The dedicated Jev contract remains unqualified because the current API cannot
enforce a positive output-token bound. Remote/native Max never executes on the
Local controller as a fallback.

Existing `scheduledPrompts.create` can perform model-free native source
preparation under the explicitly enabled managed policy before its atomic
ghost/draft admission. `SandboxWorkspace.preparation.version === 2` binds the
original scheduling command/digest and saved draft revision/digest; it never
claims a model turn or restores a failed stage.

Version-2 `WinddownRecord`/`WinddownDocument` keeps planned scope separate from
the actual transport bound once at hold transfer/model start. `winddown.read`
returns its original aggregate-only model input/result. SSH/native reports
cannot acquire Local Git fields or `completed` publication state. A changed
current session Env cannot adopt them through `commitPreview`.
Exact late inspection may fill an admitted partial step's raw observation and
settle its original charge, but cannot change terminal outcome/cleanup, validate
advice or restart the parent. Deleted reports are not reconstructed.

| Error | Meaning and recovery |
| --- | --- |
| `decision_transport` | No exact active pinned parent or qualified provider scope; review the selected Env, never substitute a controller worker. |
| `decision_late_owner` | Original model/role/peer/root or settled owner does not match inspection; preserve the original unknown hold and inspect its actual owner. |
| `winddown_late_owner` | Original complete finishing hold/start/transport is absent or changed; no new hold, model or Git effect is inferred. |

These use the existing authenticated, immutable-profile query/command and
receipt surface; no public paid-evaluate, replay or authority-grant endpoint is
added. See [owned model transports](architecture/owned-model-transports.md).

Shared `/decisions status|list|read ID|stop ID confirm-stop|set POLICY_JSON`
and CLI `moguri decisions status --session ID`, `list`, `read ID`, `stop ID`,
or `set POLICY.json --confirm-review` use the same authority. Configuration
starts no inference and grants no tool authority. Desktop exposes
**Decision providers** settings, service-derived composer readiness and
**Artifacts / Decision-provider history**; TUI edits report metadata only.
Automated technical answers retain actual provider provenance and independent
original evidence even when the decision report/source session is deleted.
Unknown charges stay held; scores/confidence are not calibrated permission.
See [the owned decision contract](architecture/owned-decisions.md).

## Native SDK development surface

The primary managed flow uses `sandbox.setup.status()` and
`sandbox.setup.review(version?)` to inspect the actual supplied runtime/image,
network/workspace policy and exact installer location. After actual user review,
call `sandbox.setup.apply(review)` and observe its original ID with
`sandbox.setup.operation(id)` or `sandbox.setup.wait(id)`. Administrator approval
is requested only when the exact root-owned release is not already installed.
`sandbox.setup.cancel(id)` targets only that owned operation. No setup call
starts a model or silently selects a provider, Env or new runtime version.

`sandbox.setup.check()` observes the fixed public SendBox release feed;
`sandbox.setup.prepare(version)` downloads and verifies that exact eligible
archive (0.2.7 or newer) and prepares a no-script package for a separate review.
The app bundles 0.2.7 and a current-protocol worker OCI archive with Linux
Node/native dependencies.
Source/Node embeddings may pass `platform.sandbox.distribution` explicitly.
An accepted retained distribution is reused only with its original digest;
there is no app-directory scan or mutable image pull.
Factory defaults do not rewrite an explicitly retained older version. Releases
older than 0.2.7 are unsupported: such a saved selection still loads but is
blocked before native execution. `sandbox.setup.status()` says so in its
diagnostic and `sandbox.setup.review()` without a version reviews the bundled
release, disclosing the replacement; `review("0.2.6")` is refused. Nothing
changes until that review is applied, and there is no Local fallback. A changed
bundled vendor or any of its exact pins invalidates the producer cache even when
the worker payload is identical; actual artifact hashes are still reverified.

After managed setup approval and explicit Env selection, ordinary Send prepares
the bound project/worktree privately and automatically. Engine-only qualification
has no dependency on an unselected Copilot account or endpoint; turn admission
resolves only the actual selected provider. Root-less chats require
no empty preview. Complete regular-file snapshots support 20,000 files, 256 MiB
total and 32 MiB per file, including binary/large sources, without expanding
model context or silently choosing a subset. Protected, ignored and denied paths
stay out. Successful private changes persist; verified after-state restoration
creates a new owned stage after rollback. Source publication remains separate.
Selected-provider HTTPS endpoints and bounded public CNAME chains are captured
per original execution; `fetch_page` reads only approved public pages inside the
guest without controller credentials or a Local fetch.

`sandbox.status()` reports actual configuration-bound readiness.
Explicit advanced `sandbox.probe()` verifies the configured root-owned release,
immutable workload and real guest controls/cleanup. Configure `settings.sandbox`
only with independently reviewed executable/bundle/key paths, SHA-256 pins,
release/trust-root/sequence, workload/worker/bridge digests, resource caps and
canonical DNS hosts or explicit `*.domain.com` tool rules. Wildcards match
subdomains at any depth, not the apex or suffix lookalikes; exact entries remain
exact except `github.com`, which delegates GitHub Meta domains and IPv4/IPv6
ranges including shared-cloud addresses. The SendBox host fetches them into one
machine-wide cache, revalidates it at most hourly and seeds each guest before
readiness; guests never contact GitHub Meta. The service binds that broader
delegation into setup review's
diagnostic/digest, and activation requires the existing explicit user/network
acknowledgement. These rules never substitute for actual provider URL/CNAME admission or grant
provider credentials. The captured scope retains literal reviewed rules alongside
exact provider/alias hosts, with a 32-entry limit on Moguri's logical rules.
That limit is not a claim about the size of the upstream Meta expansion.
`configPath` must be null to select the managed deny-first
policy; legacy policies are never silently replaced. Copilot access is opt-in,
with a separate actual cold guest networking check. An observed alias is not
a grant. Automatic aliases require the separately approved managed policy.

For optional advanced exact-file staging after selecting Sandbox, use
`sandbox.preview(sessionId, paths)` to inspect an exact source set, then
`sandbox.prepare(sessionId, paths, preview.digest, session.revision)` only after
user review. A project-free chat uses `[]` and retains a null model root. The
physical stage is private and independent of the source checkout; this review
is not required by managed automatic staging. Ordinary
SDK send/queue/stop/approval APIs retain their shared authority. Qualified native
`read_file` calls can page scoped pasted files through the controller broker.

`sandbox.execution(id)` and `sandbox.result(id)` inspect the independently
retained original owner and bounded signed after-state. `sandbox.reconcile(id)`
explicitly stops/inspects only that original signed guest and reconciles
authenticated late receipts; it never launches a VM, repeats a model/tool call,
adds completed solver context or upgrades a partial turn. Unknown telemetry
continues holding capacity. Private output files are capped at 200/2 MiB;
excluded, protected, binary and oversized paths remain disclosed, not truncated.
`sandbox.stop(executionId)` stops only that exact currently owned native turn;
it cannot cancel a later turn merely sharing a session. Native project-file
capture reads the actual private stage, never the Local source checkout.

`sandbox.publicationPreview(executionId, paths, repository?)` reviews up to 20 selected
text outputs with a 32-KiB patch and 64-KiB complete document against original
Local source bases. Its `limits` exposes both exact byte boundaries. Separately confirmed
`sandbox.publish(executionId, paths, preview.digest, execution.revision, repository?)` starts
an independently owned user copy job. Inspect it with
`sandbox.publication(id)`/`sandbox.waitPublication(id)`; stop its actual job
with `jobs.cancel(jobId)`. This is explicit user text publication, not a Local
agent fallback or a model acceptance/permission decision. Current root, branch,
HEAD, folder rules, hard write denials and leases win races; index/HEAD and
unrelated edits are preserved. Partial writes remain inspectable and cannot be
replayed. Publication snapshots survive original session/report deletion.
There is no implicit commit, branch, source deletion or binary/deleted-file
publication. Native console/MCP/memory/subagent/evolution and plan-write
transports remain unqualified rather than falling back to Local.
For captured groups, `repository` is mandatory and chooses an exact original
ID or unique captured name, never a first member. Paths stay member-relative.
Every original root/policy/HEAD/file set is rechecked and leased. Version-3
input and version-2 result/publication records preserve the map; original v1/v2
single-root inputs and v1 results/publications are not reinterpreted.

CLI `sandbox preview/prepare PATHS.json --session ID` reads an explicit bounded
JSON path array. Preparation needs its exact `--digest`, session `--revision`
and `--confirm-review`. Publication uses `sandbox publish-preview RUN_ID
PATHS.json`, followed separately by `sandbox publish RUN_ID PATHS.json
--digest SHA --revision EXECUTION_REV --confirm-write`; Ctrl+C requests the
original copy job's stop. `publication`, `publication-stop` and
`publication-wait` inspect/cancel that retained owner. Shared CLI/TUI/desktop
`/sandbox` commands print exact `confirm-stage`/`confirm-publish` commands after
preview. No text prefix or model answer is treated as confirmation.
Group CLI publication adds `--repository ID` to preview and publish. Shared
`/sandbox publish-preview RUN_ID {"paths":["file"],"repository":"ID"}` includes
that exact original ID in its generated confirm command; the legacy paths-array
syntax remains valid for single-project results.

This is an alpha API. Qualified **0.29.0-alpha.1 uses protocol 35**. Qualified
**0.28.0-alpha.1 uses protocol 34**; the frozen qualified
**0.27.0-alpha.1 uses protocol 33**. Both deliberately reject incompatible
running services. Remote execution requires
the matching SSH worker for exact user plan operations, reviewed compaction,
model telemetry, explicitly granted MCP and owned user consoles.
The 0.21 delivery implements session-bound Local/SSH memory through the same
SDK. Its exact independently installed archive and actual packaged runtime
pass index/search/MCP/original-intent/restart/CLI/TUI qualification.
The qualified 0.22 delivery uses protocol/database **29** for the shared
[Local reviewed-candidate workflow](architecture/candidate-workflows.md),
following the protocol-28 event/retention foundation and private compound/file
prerequisites. Its exact SDK and actual packaged app are independently
qualified; [setup](setup.md#current-qualified-0220-alpha1-checkpoint) preserves
immutable delivery identities. Public kupo remains the qualified Single subset.
The qualified 0.23 delivery uses protocol/database **31** for independent planned
capacity and one bounded Local [owned draft](architecture/candidate-generations.md)
with shared generation/review/stop inspection, without enabling public finite kupo.
Its exact installed SDK and actual native runtime pass independent
generation/staging/application/restart qualification, including missing
original receipts; [setup](setup.md#current-qualified-0230-alpha1-checkpoint)
records its immutable identities.
Qualified 0.25 uses protocol **32** for independently retained
[role observations](architecture/role-sequences.md), read-only SDK/CLI/native
inspection and version-4 history. This adds no model-start, acceptance or
public compound workflow command. Its exact installed archive and actual
bundled runtime pass role inspection, source deletion/reopen, version-4 export
and deletion-intent qualification without inference;
[setup](setup.md#current-qualified-0250-alpha1-checkpoint) records immutable
identities. Restart old running services explicitly; do not delete their state.
The 0.26 source reuses protocol 32 for an internal actual owned-role executor
over complete source/model/policy/input envelopes. Its Node controller primitive
is privileged and not a public SDK/HTTP/MCP workflow creator. Client
`roleSequences` remains read-only; family/quality/acceptance and finite kupo
stay separately gated. Qualification status is recorded in setup.
Qualified **0.27 uses protocol 33** for canonical final-role proposal
inspection and review-bound candidate origin. `candidates.roleProposal(id)`
reads the exact final proposer without a model/root lookup.
`candidates.preview(session, stage, patch, {roleSequenceId:id})` binds its
origin into the review digest; pass that same reference to `stage` as its
optional fifth argument. Existing generation-ID strings remain compatible.
Candidate copies retain sequence/role input and raw-result grants independently;
their exports use version 5. Editing loses verified attribution, and applying
still needs a separate actual-user review. This does not expose a public
compound workflow creator. Restart incompatible services explicitly, never
delete their state. Its exact installed SDK and bundled runtime are independently
qualified; [setup](setup.md#current-qualified-0270-alpha1-checkpoint) records
immutable identities. Frozen qualified 0.25 remains protocol 32.
The qualified 0.28 delivery adds explicit `models.evidence(modelId)` inspection. Its
version-1 provider-declared report is ephemeral and does not rewrite ModelInfo,
select a model or grant lineage/quality/approval. The additive schema-34 marker
preserves actual schema-33 candidate origins and independent raw-copy grants.
Its exact installed SDK and actual bundled default Copilot adapter use the
same generated, memory-only keyring/catalogue qualification, not a substituted
adapter or a personal account. [Setup](setup.md#current-qualified-0280-alpha1-checkpoint)
records frozen native/SDK identities and limits.
The 0.29 delivery adds optional exact output/context contracts to the
internal owned executor, version-2 retained inputs and immutable input-version
binding. `roleSequences.contract(sequenceId,index)`, CLI `roles contract ID N`,
shared/native TUI `/roles contract ID N` and desktop Artifacts inspect derived
declared checks without inference, approval or public workflow scheduling.
Original version-1 data is not retrofitted. See
[the contract](architecture/owned-role-contracts.md). Its exact installed SDK
executes four actually metered contracted roles; actual native readers derive
their original checks with model preparation forbidden. This does not enable
public conditional pattern scheduling or attest model quality.
Current state migrations preserve schema-1 through schema-33 history, sessions, drafts,
receipts, blobs, indexes and retention compartments. Migration 5 adds optional
model controls without resetting prior defaults. Migration 6 adds nullable project
scope, reviewed configuration and OAuth/attention state. Restart a previously running alpha service explicitly with
`node bin/moguri.mjs service restart`; do not delete its state.

The issue-17 source uses protocol/database **36** for scoped pasted-text file
descriptors and optional queue-edit attachments. Schema 35 upgrades without
rewriting historical events, receipts, encrypted grants or arbitrary legacy
working-window settings. Unsupported legacy windows remain visible and block
inference until explicitly corrected. `modelContextWindows(model)` and
`sessions.context(id).context.windows` share maximum/half or genuine declared
choices. `attachments.paste(id,text,selection?,draftRevision?)` atomically
captures exact pasted text into the current draft; `DraftEditor.paste` also
preserves unsent/conflicting local edits. The existing authenticated worker
`read_file` broker exposes bounded pages/search without injecting the whole
file into model context. These are source capabilities, not a claim that any
earlier immutable SDK/app archive was rebuilt or that issue 17 is complete.
The 0.18 source adds [authoritative Remote MCP](architecture/remote-mcp.md).
Explicit peer/resource grants are deny-by-default.
Source SDK model/external calls now use the owned SSH worker, encrypted
intent/result retention and no-replay crash reconciliation; shared native
clients share the same review and inspection APIs. Exact archive identities
and qualification are recorded in [setup](setup.md); older immutable
deliveries are not repacked.
The qualified 0.19 delivery extends this with protocol-25 immutable Remote
owner/binding state, schema-preserving migration and original-PTY recovery
across service/SDK/CLI/OpenTUI/Ghostty. Its exact independently installed SDK
and actual packaged runtime pass the same Remote lifecycle, no-replay and
ordinary-stop contracts. Prior qualified archives remain immutable.
Qualified 0.20 adds explicit Remote GitHub repository metadata through the
captured SSH account, with peer/root/build provenance and no controller
account fallback. Its exact installed SDK and actual packaged clients pass
separate account/restart/CLI/TUI and native qualification.

## Build and consume

```bash
npm ci
npm run build
npm pack
```

Install the resulting `moguri-<package-version>.tgz` in a Node 26 consumer with
npm. Exact delivered filenames/checksums and qualification records live in
[setup](setup.md). A newer development manifest is not another qualified
archive until its exact bytes are independently checked.
The package is private and is not published to the npm registry. It includes
compiled SDK modules, declarations, CLI, workers, clients and the pinned local
speech runtime, but no speech weights. Native dependencies must match the
consumer's platform. Use npm's normal dependency installation, not
`--ignore-scripts`, for an operational CLI.
With npm's script allowlist enabled, review `npm install-scripts ls` and approve
this known Moguri package plus its pinned Node/node-pty native installation
steps. A file-tarball dependency is approved by package name rather than a
registry-version selector. Do not approve unused provider lifecycle scripts.

For an installed file tarball, complete its reviewed native-helper setup with
`npm install-scripts approve moguri` then `npm rebuild moguri`.
The approval command resolves the package name to that exact file dependency;
an unapproved install notice is not proof that its postinstall ran.

| Import | Surface |
| --- | --- |
| `moguri` | Browser-safe `MoguriSdk`, typed protocol, defaults, `DraftEditor`, ASCII identity |
| `moguri/node` | `connectMoguri`, `createRuntime`, private service discovery and explicit owned-service shutdown |
| `moguri/react` | Renderer-independent `useMoguri` subscription hook |
| `moguri/mcp` | The single outward native MCP server, bound to one session |

`npm run verify:sdk` packs and installs into a separate temporary consumer,
type-checks all four entrypoints without the repository's tsconfig, and runs an
embedded service with real vector retrieval and native MCP discovery. It also
exercises the packed package's actual PTY transport on macOS after explicit
script approval and an independent consumer audit. It does
not authorize a personal account, record audio or download model weights.

Pass an existing archive to qualify the exact delivered bytes rather than
repacking: `npm run verify:sdk -- release/moguri-0.17.0-alpha.1.tgz`.
Current verification also exercises actual installed-worker SSH files,
Git/plan reads, dated/per-call telemetry and actual metered compaction with the
installed CLI/worker. Historical archives retain their separately
recorded qualification; protocol-16/17/18/19/20/21 SSH receipts remain inspectable without
reattaching or continuing an old worker.

## Connect to the shared service

```ts
import { connectMoguri } from "moguri/node";

const sdk = await connectMoguri();
try {
  const settings = sdk.settings.get();
  if (!settings) throw new Error("Moguri is not connected.");
  console.log(settings.values.appearance.theme); // dark by default
  const projects = sdk.getState().snapshot?.projects;
  console.log(projects?.map(({ id, name }) => ({ id, name })));
} finally {
  sdk.disconnect();
}
```

Connection metadata contains a private token. Never print it, put it in URLs,
send it to a model or pass it to plugins. Disconnecting a client does not stop
the shared service or its owned work. SDK command IDs are idempotent; a lost
response does not authorize an automatic resend.

Embedding is explicit:

```ts
import { createRuntime, connectMoguri } from "moguri/node";

const stateDir = "/absolute/private/moguri-state";
const runtime = await createRuntime({ stateDir });
const sdk = await connectMoguri({ stateDir, autoStart: false });
try {
  console.log((await sdk.voice.status()).voice.diagnostic);
} finally {
  sdk.disconnect();
  await runtime.close();
}
```

Only embed when no other service owns that directory. Importing the SDK alone
does not start a service or read credentials. Node discovery does not load the
provider/MCP/native PTY runtime; `createRuntime` explicitly loads its packaged
`runtime.mjs` entry. Default provider initialization
uses Moguri's OS-keychain backend; generated providers are injected only in tests.

## Shared capability APIs

| Facade | Operations and boundaries |
| --- | --- |
| `profiles` | Root catalog/create/revisioned name-color update/explicit retry-stop/wait, shared global defaults/caps and `open(id)` returning a new immutable scoped client. No account/data copy or automatic selection. |
| `settings` / `prompt` | Get, revision-checked update/reset, effective prompt preview. Prompt edits require explicit risk acknowledgement; running turns retain their prompt digest. |
| `tools` | Scoped typed catalogue, exact Local user-job admission, public original-result pages, canonical state SQL reads and captured watch inspection. Discovery grants nothing; no model-owner or Env fallback. |
| `coordination` | Exact original-parent/root grant preview, actual sender messages, bounded public context/progress and explicitly owned child tasks/stop. Navigation nesting and read acknowledgement are not authority. |
| `workflows` | Lowercase review/security/performance/debug prompt admission under the existing session controls, with optional exact draft consumption. |
| `memory` | Opt-in index, lexical-vector search, import/symbol graph, explicit project-style facts. Context injection has a separate opt-in. |
| `capabilities` | Import disabled standard skills/plugins, inspect source, toggle with revision, propose, review and decide against an exact SHA-256. |
| `mcp` | Paged tool discovery, non-secret auth status, explicit OAuth begin/status/cancel/clear/registered-client setup, user-only keychain credentials, exact approval-bound call and retained result pages. |
| `subagents` | Explicit opt-in, depth-one tool-less child using the inherited selected model policy and approved parent context. Every role charges its real owner. |
| `voice` | Local status, explicit licensed download, record/transcribe, stop/finalize, bounded session-owned transcript reading and revision-safe draft insertion. |
| `jobs` | Wait or explicitly cancel. A wait timeout/disconnection does not cancel or retry the service's job. |
| `sandbox` | Truthful readiness/configuration diagnostics. Configuration is not proof of a qualified SendBox transport. |
| `issues` | Local feature/bug/misc board, create/update/move/archive, revision-checked phases and read-only linked-PR refresh. |
| `kanban` | One special project chat, shared source/visibility preferences, paged local/GitHub work, one actual-user delegated Local task to its PR, retained read/wait/cancel and exact settled-task inspection. |
| `prices` | Originating-provider API-equivalent references, exact model/name matches and explicit official public refresh; no inference, authentication, historical repricing or billed-cost claim. |
| `cache` | Local plan inspection, explicit metadata-sharing consent, integrity-verified archive preparation and script-free managed install. |
| `linear` | Optional team-scoped read-only page import, status and user-only OS-keychain credential setup. |
| `sessions` | Revisioned controls/modelOptions, local context preview, rename/mode/pin/unread/group/attach/delete, explicit side/agent children and work-item/verified-PR context. Side sessions cannot acquire write authority. |
| `projects` | Configuration, ordered folders/color, atomic reorder, relocation/removal, scoped Git/source reads, reviewed MCP imports and explicit default-file publication. |
| `prompts` / `DraftEditor` | Copy queued/sent text, revisioned editing and explicit held release. `send("queue", true)` returns the admitted queue ID without starting work. |
| `commands` | Service-owned slash intake through `submit`; archived `restore` preserves its saved draft. `read/claim/choose/complete` bind original input, root and private client ownership. `attach` supplies real UI handlers; `detachAll` awaits teardown without replay. |
| `plans` | Digest-checked Local/Remote plan read/save and independent snapshots. Remote writes require the reviewed binding and an owned no-model operation; actual saves/info/exact-stop expose partial/recovery outcomes without replay. |
| `artifacts` | Independent typed text documents, exact source preview/promotion, revisions, optimistic edits/archive/delete and reviewed project retain/export/delete. No automatic instruction or memory promotion. |
| `candidates` | Model-free Local preview/stage/read/wait and separately reviewed apply/reject/stop; optional one-call fixed-model generation has its own cost/source review, actual draft ledger/provenance and retained wait/stop. Neither generation nor staging approves application or Git publication. |
| `roleSequences` | Read exact independently retained role intent, original input and one selected raw role input/result; never start a model, grant acceptance or resume partial work. |
| `compound` | Exact selected-Env source/cost preview/start/read, actual-user stage/test review/deny and exact stop. Local roles remain root-less; non-Local roles retain their actual rooted peer/native parent and zero model tools. Runtime/physical qualification still gates admission. `lineageDraft` is an unpersisted source claim, never provider inspection, quality or permission. Source application stays separate in `candidates`. |
| `winddown` | Canonical readiness and independent selected-boundary finishing holds/input/results/stop. Separate accepted-source/new-branch Git review preserves the original Local or SSH root; native-model work discloses its separately accepted original Local-Git boundary. Exact effect inspection/acknowledgement never completes or replays a partial job. All roles share one ledger; summaries grant no source/Git authority or ordinary continuation. |
| `decisions` | Exact request/model/rubric/raw evidence, actual Local or original SSH/native parent transport, all-role accounting and one-shot stop. No public evaluate, paid retry, answer or approval endpoint. Only separate explicit delegation can use the real decision-provider actor. |
| `questions` | Exact owning-turn/revision-bound actual user answers, choice/freeform validation and optional atomic saved-draft consumption. Question routing never grants tool/Git authority. |
| `budgets` | Cumulative owning-session/profile status, revision-bound hard policy, UTC-filtered/paged role/model/turn dashboard, planned non-call holds, captured rates and retained calls/stream observations. Filters never change admission; unknown usage remains held. |
| `telemetry` | Independently retained, sanitized tool/MCP outcomes with scoped UTC filters and a known-result failure rate; current-profile key-backed ciphertext sizes, never physical/freed disk usage. |
| `activity` | Exact session-scoped operation metadata and lazy original arguments/results; public response copy and original owning-turn information. No private reasoning, terminal buffers or recovery from a deleted source. |
| `agentTerminals` | Original agent `run_command` requests/results and bounded UTF-8 output/tails. No private User/Global console access, stdin, new execution or implicit persistent shell. |
| `repositories` | Explicit actual-root preview/refresh/state/revision-bound clear, with displayed GitHub access and immutable future model/tool attribution. No automatic lookup, backfill or permission grant. |
| `compactions` | Source/model-bound reviewed generation/apply/restore, `compact()` for `/compact`, and default-on smart compaction (`settings.compaction`) through the same worker/ledger. Originals/images remain retained; no history deletion or answer/permission promotion. |
| `routing` | Actual mode/capability/profile readiness, revision-bound policy and original classifier/role/selected-response history. Explicit Single/Compound stays separate. Finite automatic work requires complete selected-boundary holds/finishing; unsupported image/effort/model combinations stay blocked. |
| `workspaces` | Explicit Local create/discover/inspect/bind/remove/reconcile/wait and session-bound Git/files reads. Owned directory identity is not a process-containment claim. |
| `terminal` | Exact Local/pinned-SSH PTY open/read/resize/input/close, one independent Local `openGlobal(root)` per profile, disclosed `defaultRoot()`, terminal/owner reconciliation and explicit inspection acknowledgements. Captured env/peer/root survives restart; input/resize bypass durable receipts. |
| `slash` / `slashCommands` | One browser-safe low-level dispatcher/catalogue. Frontend text uses `commands.submit`, not eager `slash` dispatch. `commands.control(sessionId, name, argument)` queues one session control (`model`, `effort`, `context-window`, `model-settings`, `kupo-mode`, `env`, `autonomy`, `budget`) as its exact single-line slash command without touching the draft, so clients can change controls during a turn. Results are typed session/native-panel/copy/text actions, not client-owned domain state. |
| `suggestions` | Local scoped preview, exact source digest and explicit generation consent. Analysis uses a normal cancellable/accounted metachat turn. |
| `metachat` / `configuration` | Explicit settings chat, non-secret exact proposals, review and human risk/base-bound apply/reject. No model application or automatic enablement. |
| `attention` | Shared Inbox list/read/delete; questions/approvals remain unresolved until an actual answer/decision, and deleting a notification never deletes its session. |
| `models` | Profile-owned `catalogue()`, `setProviderEnabled`, `setEnabled` and exclusive `selectSource`, plus explicit refresh, informational `evidence(modelId)`, always-visible Kupo and resource-bound endpoint keys. Selection and admission use only enabled, available, chosen sources; disabled inventory remains inspectable. No sign-in, inference, host scan, automatic evidence read or substitution. |
| `attachments` | Explicit local text/images, exact folder/reference/session previews and confirmation, private snapshot reads. Unsupported models preserve context rather than silently dropping images. |
| `remote` | Explicit pinned-target probe/status, resource-bound endpoint keys and existing-run reconciliation/inspection acknowledgement. No provisioning, key forwarding, Local fallback or side-effect replay. |

### Native snapshot retries and transport checkpoint review

Protocol86 adds `settings.values.interactions.nativeRetryRestaging`, factory
off. `sessions.retry` still admits only the last exact retained failure;
enabled native retries restore its signed private snapshot and cannot capture
new live-source bytes, change Env/model/profile, replay effects or refund
unknown calls.

`winddown.sourcePreview(id, paths)` reads complete exact SSH source: at most
20 distinct paths, each up to 4,096 characters, subject to the actual host's
filesystem limits and the complete 128-KiB source/Git review bound. It never
uses the shorter artifact-ID bound for file paths or truncates a review.
`acceptSource(id, paths, revision, digest, true)` binds actual-user source
acceptance, not Git permission. `commitPreview`/`commit` use `remoteAccepted:true`
for that peer or exact `nativePublicationIds` for already separately accepted
native output. The former performs Git only on the captured peer; the latter
explicitly uses Local Git at the original source repository and requires current
Local policy. New branch, base, bytes/modes and message are separately reviewed.

`inspectCommit(id)` is read-only and returns exact current source/ref/receipt
review data. `reconcileCommit(id, revision, digest, true)` is separate actual-user
acknowledgement of an ended original writer, never an answer, approval, effect
replay or partial-to-success transition. `read(id).commitInspection` retains that
observation independently of the session. Unknown or changed source/ref/cleanup
cannot release its quarantine or erase its report.

CLI uses `winddown source-preview/source-accept`, `preview/commit`,
`inspect/reconcile`; acceptance/reconciliation require exact `--revision`,
`--digest` and `--confirm-review`, while Git requires `--confirm-git`.
The shared TUI commands are `/winddown source-preview ID PATHS_JSON`, the
returned `source-accept ... confirm-source` command, `commit-preview JSON` and
its exact Git command, then `inspect ID` and its `reconcile ... confirm-inspection`
command when partial. All surfaces use this SDK authority.
See the [retry/checkpoint contract](architecture/native-retry-checkpoints.md).

### Owned Local and Remote user consoles

`terminal.open(sessionId)` is an explicit user action, not an agent tool.
`terminal.defaultRoot()` discloses the canonical home directory without starting
a process. `terminal.openGlobal(root)` explicitly opens one profile-owned Local
console with actual null session/project fields. It does not create a fake chat,
inherit a repository or grant workspace access to a model. Concurrent opens
reuse the same exact live root/intent rather than creating another global PTY.
`terminal.open(sessionId, cols, rows, undefined, root)` supports a project-free
Local user console only when that root is explicitly supplied. A project-bound
console still uses the exact selected project/worktree, never an alternate root.

`terminal.read(id, offset, limit)` returns the exact Local or Remote binding, actual
attachment generation, bounded volatile data and base/next offsets. A missing
prefix or expired buffer is not reconstructed as a transcript.

```ts
const opened = await sdk.terminal.open(sessionId);
if (!opened.id) throw new Error("No terminal was admitted.");
const page = await sdk.terminal.read(opened.id);
console.log(page.terminal.status, page.terminal.binding?.root);
await sdk.terminal.reconcile(opened.id); // Inspect, never launch or resend.
```

`terminal.input(id, text, signal?)` splits bounded input without splitting a
surrogate pair, and checks cancellation/current `attachmentId` between chunks.
An error can mean some bytes arrived: inspect before typing again, never retry
the same input automatically. Neither input nor resize uses durable command
receipts. Reconciliation and input require the original profile/root identity;
policy can block new input in either captured env without preventing inspection
or exact close. Remote metadata never becomes a Local filesystem path or PID.

For Remote, explicitly configure/probe the installed worker and mapped project
before a new `terminal.open`. Probe metadata separates optional console helper
availability from core-agent readiness. The technical owner key is independent
of provider/MCP credentials. The actual SSH host chooses the default shell;
controller-side shell preferences are not substituted. No model is required.
`TerminalOwner.env === "Remote"` and `owner.remote` expose the immutable peer/
helper boundary; `preparing` can retain null paths/PID before remote resources.
Consumers must handle that state, not cast it to a prepared Local owner.
Existing recovered Remote input needs its current allowed peer/root and
authenticated attachment, not another core-agent probe. See the
[Remote lifecycle contract](architecture/remote-user-consoles.md).

`terminal.reconcileOwner(ownerId)` also inspects an empty pending owner.
`acknowledge(id, true)` and `acknowledgeOwner(ownerId, true)` require actual user
process inspection and do not prove historical cleanup or delete an unverified
capability. Owner acknowledgement cannot hide unconfirmed terminals.

`stopMoguriService(stateDir, { preserveTerminals: true })` requests an
authenticated **service-wide** restart detach; ordinary stop/default embedded
`runtime.close()` closes known groups across its loaded/recovered profiles.
An explicit embedded `runtime.close({ preserveTerminals: true })` also preserves
them. Failed private cleanup keeps the registry and writer lock, blocks new
work and permits an explicit cleanup retry. No saved PID is blindly signalled.
See [Local ownership, secret backend and cancellation](architecture/terminal-reattachment.md).

### Smart compaction and `/compact`

Automatic compaction is on by default. Read or change it through
`settings.values.compaction` (absent means `defaultCompactionSettings()`);
`automaticCompactionPolicy(values, isKupo)` and `compactionTrigger(policy,
window)` from the SDK root describe the exact policy the service applies.
Reset it with `sdk.settings.reset("compaction", revision)`.

```ts
// /compact: one explicit metered summary, applied only if complete and smaller.
const { id, preview } = await sdk.compactions.compact(sessionId);
// Kupo chats name a real model: sdk.compactions.compact(sessionId, { modelId })
```

Automatic and `/compact` entries carry their origin: `automatic.actor` is
`default-policy` or `user-policy` (with `automatic.scope: "session-model"` for
fixed-model chats), and `/compact` entries set `applyOnSuccess: true`.

### Built-in slash precedence

`builtinSlashClash(name)` returns the built-in command (shared or TUI-local)
that a skill name collides with, and `builtinClashNotice(skill, builtin)` the
user-facing rename notice. Gateway skills carry `shadowedBy`, the catalog from
`sdk.commands.list(sessionId)` returns such skills as `kind: "shadowed"`
entries that clients must not select, and `capabilities.importSkill` returns a
`notice` when the imported name clashes.

### Optional Stainless browser

Protocol 111 adds `sdk.stainless.status()`, `check()` and `open(sessionId, url)`,
plus `executeStainlessCommand(sdk, "status|check|open [URL]", sessionId?, fallbackUrl?)`
shared by `/stainless` and `moguri stainless`. Status reports `enabled`,
`availability` (`missing`/`invalid`/`found`), the detected installation, whether
the build is tested, the last in-memory check and `automation`
(`off`/`unavailable`/`needs_check`/`incompatible`/`ready`). The `playwright` tool
accepts `launch: { kind: "stainless", url }` and a `diagnostics` action. See the
[Stainless contract](architecture/stainless.md).

### Reviewed context compaction

`sdk.compactions.state(sessionId)` returns actual retained history, active ID,
current source digest and labeled active/original conversation estimates.
Preview is free of inference:

```ts
const { preview } = await sdk.compactions.preview(sessionId, {
  keepRecentTurns: 2,
  modelId: actualAvailableModelId,
});
const requested = await sdk.compactions.generate(sessionId, preview, true);
// Inspect state after actual settlement, then read the exact proposal.
const { compaction, text } = await sdk.compactions.read(sessionId, requested.id!);
// Only after the actual user reviewed text and compaction.status is proposed:
await sdk.compactions.apply(sessionId, compaction.id, compaction.revision);
```

Generation owns one read-only control turn, not a fake user prompt or optional
subagent. It uses an actual selected model, at most 1,024 output tokens (or its
stricter model/budget bound), normal cancellation and all-role admission.
`sdk.compactions.stop(sessionId, compactionId)` targets only that exact running
operation; a stale request cannot stop newer solver work.
Synthetic kupo requires an explicit real compactor. Missing usage stays held;
tools, incomplete/expanding output and changed source/model/policy cannot be
applied. Text-only support rejects image history without dropping it.

Original encrypted history, complete recent turns and drafts remain retained.
The synthetic context-only summary has no usage anchor; it never replaces the
actual compactor report or ledger charges. Read/discard/restoration do not make
paid calls. Restore with the current state's `activeId` and `sourceDigest`:
`sdk.compactions.restore(sessionId, activeId, sourceDigest, true)`.
Restoring may exceed the working window; normal admission still fails closed.
See [the compaction contract](architecture/context-compaction.md).

### Explicit provider-declared metadata

`(await sdk.models.evidence(actualModelId)).evidence` returns a
`ModelEvidenceReport` for one currently available concrete Copilot API ID.
It copies only explicit `capabilities.family`, optional vendor/version, exact
provider/model/source field, observation time, digest and the limitations.
`status:"unknown"` and null claims mean the provider did not declare a family;
no name prefix, model alias or local endpoint is treated as lineage.

CLI `moguri models evidence MODEL_ID`, shared/native TUI
`/model-evidence [MODEL_ID]` and desktop **Model / Provider-declared model
metadata / Read Copilot model declarations** use this same read. Omitting the
slash argument requires the current fixed model; unset/kupo selection is an
explicit error. This never selects/configures a model or changes the draft.

The service uses current profile-scoped short-lived request access and an exact
HTTPS Copilot API root, with no redirect, alternate URL or ambient credential.
Reads are bounded to four concurrent requests, ten seconds, 256 KiB and 512
distinct model IDs. Invalid fields, credential echoes, stale account/model
bindings, logout and cancellation cannot return a successful old report.
Remote sessions disclose that this metadata read is on the local control plane,
not evidence about a different SSH account's model implementation.

Reports are not signed attestations, independent-family proof, cost/quality
measurements, user answers or permission. They add no model call, durable
evidence event, automatic cache, pool widening, compound mode or Max.
Ordinary Copilot login/discovery/inference is unchanged. See
[the exact source/digest and qualification contract](architecture/model-evidence.md).

### Automatic Kupo

`sdk.routing.policy()` defaults to `workflow: "auto"`, enabled, with no explicit
classifier and an empty approved-ID list meaning all eligible configured models.
Selecting `KUPO_MODEL_ID` is still an explicit session action; saving/resetting
policy never starts inference or grants tool permissions. Existing explicit
Single/Compound policies survive upgrade.

`sdk.routing.capabilities(env?)` returns the service-owned declared capability
inventory without inference or extra provider inspection. General, reasoning,
tools, vision and long-context categories describe declared support, not
calibrated quality or billing; absent tool support is `null`. An optional env
filter does not change the service's dispatch authority.

The shared catalogue always includes **Kupo**, even with no eligible environment.
Zero eligible models blocks admission. One uses that model directly with no
classifier step; its retained plan has `basis: "only-model"` and null confidence.
With multiple models the bounded router selects an exact Single, Cascade or
eligible Critique binding based on the task and inventory. Critique needs a
current exact-model reviewed lineage claim; provider names cannot create it.

Each response proposal and read-only review is recorded with actual role/model
usage. `routing.response_selected` points to the exact original result before
the normal worker may process its tools. Rejected responses never become
ordinary context or artifact sources. Selected responses preserve their actual
model actor in conversation, activity and artifact promotion, including after
restart. Manual approvals remain separate. Unknown usage, stale state, output
limits, failed receipts and cancellation halt continuation without paid replay.

Finite automatic budgets, images, synthetic tuning and Sandbox remain blocked.
See [the automatic response contract](architecture/automatic-kupo.md).

### Explicit Single routing

Use `defaultSingleKupoSettings()` to construct a disabled explicit Single policy.
Configure exact discovered model IDs
with `sdk.routing.configure(policy, observedSettingsRevision)`; the policy has
`workflow: "single"`, an actual `classifierModelId`, explicit
`approvedModelIds`, separate `allowHosted` data consent and a
`minimumConfidence` threshold. `ModelInfo.endpointBoundary` is derived from
validated configured URLs; network/unknown destinations require consent even
when their provider is named local. Loopback is the execution host's HTTP
boundary, not proof against forwarding by a configured proxy. Configured-model
inference rejects redirects. Copilot metadata retains the maintained model's
actual output bound rather than a fixture-only or invented value.
This is uncalibrated model advice, never an
actual user answer or permission.

Only after saving, explicitly select `modelId: KUPO_MODEL_ID` through normal
session controls, the picker or `/model kupo`. `/kupo status`,
`/kupo set POLICY_JSON` and `/kupo history` use the same shared dispatcher.
The session stays labeled `kupo`; `snapshot.routings`, `session.usage` and
`budgetEntries` retain actual roles/models, plans, outcomes and charges.
Classifier output never enters solver context. Invalid, stale, unreported or
over-limit classifier results pause without fallback or another paid attempt.

This policy uses the same Local/pinned-SSH worker and exact approvals. Finite
Local admission needs its separately qualified reserved wind-down policy;
images and per-model tuning remain unavailable. Restoring
`settings.reset("kupo", revision)` returns to automatic routing without
deleting retained accounting or provenance or starting inference. See the
[durable routing contract](architecture/routing.md).

In Guided mode `ask_user` may include a bounded offered-choice recommendation.
`UserQuestion.recommendation` contains the exact choice/reason and service-stamped
`model` actor/model/provider/step/call provenance. It is not `question.answer`.
Only an actual `questions.answer`/`answerDraft` user action resolves the wait,
and the user can select a different choice. Approval recommendations similarly
require exact-step `recommendationSource`; no old narration is substituted.
Advice comes from the original metered solver response, not another model
request. Retained documents label model advice separately from the user's
answer. No public command can supply a forged answer actor.

`sessions.create(projectId?, title?, overrides?)` resolves explicit controls
over `project.values.defaults`, `settings.startup.profile`,
`settings.startup.global` and factory values. `session.defaults` records sources
and observed revisions. Existing sessions do not inherit later changes. These
preferences do not weaken policy. Global preferences are intentionally shared;
profile/project/session values remain isolated.

Protocol/database 55 adds a last-selected fallback when no model default is
explicitly set. In **Settings / Startup defaults**, **Global default model**
chooses a fixed model/effort shared across profiles, the last explicitly selected
model/effort within each profile, or no selected model. Omitted `modelId` permits
the remembered fallback; `modelId: null` explicitly prevents it. Higher-priority
profile/project/session model settings still win, and existing chats are not
rewritten.

`sessions.selectModel(sessionId, modelId, revision?)` records an explicit choice
and clears the old working-window override. Since protocol 77 it preserves the
thinking preference, uses an exact/next-higher supported effort or the highest
supported effort if none is higher, and never changes the requested model.
Optional `controls.preferredThinkingEffort` retains the original effort only
when it differs from the actual `modelOptions.thinkingEffort`; switching back
to a supporting model restores it. Kupo and provider-controlled models keep
that informational preference without receiving a fixed-model override.
`sessions.modelOptions` records actual
effort changes; its optional fourth `true` also marks an explicit same-value
effort selection and replaces any retained preference. An explicit default or
`/model-settings reset` clears it. `sessions.configure` normally remembers model/effort deltas;
its fourth `false` performs configuration without recording a new selection.
Raw `session.configure` commands opt in with `rememberModelSelection: true`.
Window-only/autonomy/env changes, session creation and model/role calls do not
become selections.
Resetting tuning on a session with no selected model also preserves the
remembered choice; `sessions.selectModel(sessionId, null)` explicitly clears it.

`snapshot.lastModelSelection` contains the profile's model/effort pair and its
optional retained effort preference, never a provider payload.
The independent profile event survives source-session/project deletion and
restart. Startup provenance labels the fallback `last-used`. Working-window
settings are not copied from the source session; explicit model-option defaults
remain authoritative. An unavailable saved model/effort stays visible and
fails normal admission rather than substituting a provider or dropping context.

### Immutable profiles

```ts
const created = await sdk.profiles.create("Work", "#557799");
const profile = await sdk.profiles.wait(created.id!);
const work = await sdk.profiles.open(profile.id);
try {
  const chat = await work.sessions.create();
  console.log(work.profileId, chat.id);
} finally {
  work.disconnect();
}
```

The original `sdk` and every existing `DraftEditor` keep their original
destination. `profileId` is also non-writable at runtime. Clients switching
scope must flush old draft editors, preserve/block unsaved local forms and
owned dictation, then explicitly dispose the old client. Switching does not
stop service-owned work or move model context, artifacts, accounts or approval
authority.

`connectMoguri({profileId})` selects an explicit scope; omission means actual
Default. HTTP uses `X-Moguri-Profile`; WebSocket authentication carries the same
immutable identity. Unknown/unready profiles fail explicitly, never fall back.
The CLI/TUI accept `--profile ID`, overriding the explicit
`MOGURI_PROFILE_ID` launch environment. One-shot CLI commands do not mutate
another client's active selection.

Global environment policy and configured global caps remain authoritative
across profile switching, source deletion and restart. `profiles.defaults(values, revision)`
and `profiles.globalBudget(limitOrNull, revision, true)` use root revisions from
`profiles.list()`. Profile `settings.reset` preserves shared global preferences
and hard policies. Restore global preferences explicitly with an empty
`profiles.defaults({}, revision)` action. Global accounting invalidation
contains an opaque sequence, never foreign ledger rows or prompt content.
See the [profile contract](architecture/profiles.md).

Writable Remote turns serialize by captured pinned SSH peer plus canonical
workspace, including across profiles with different Local mappings. A
foreign failed-root quarantine survives unloaded-profile restart until the
actual owner explicitly resumes after inspection. Distinct SSH roots remain
independent; pending read-only changes are not acknowledged lease release.

`settings.localModels` contains explicit endpoint IDs/names/URLs/auth methods
and declared model limits. Metadata discovery lists only configured advertised
IDs. Use `models.setToken`/`clearToken` for bearer credentials; no token belongs
in settings. `provider.connections` keeps Copilot and local status independent;
each model/call has actual provider/API-model provenance.

`models.catalogue()` returns the actual profile's provider list plus one model
group per exact upstream `apiModelId`. It includes disabled and configured-but-
unready offerings; `snapshot.provider.models` is the authoritative selectable
set, plus the synthetic Kupo entry with its actual readiness.
`models.setProviderEnabled(providerId, enabled, expectedRevision?)`,
`models.setEnabled(apiModelId, enabled, expectedRevision?)`, and
`models.selectSource(apiModelId, concreteModelId, expectedRevision?)` use the
current profile settings revision when omitted. Concurrent edits fail rather
than overwrite another client.

Multiple offerings require one explicit selected source. Disabled models,
providers and unselected offerings fail raw session selection and every new
model admission, not only `/model`. Disabling preserves credentials, source
choices, current session/default IDs, original results and ledger charges.
Reenabling Copilot explicitly refreshes its configured metadata; a refresh
failure reports that the preference was saved without claiming connection or
inference. Local/SSH changes reuse their exact configured endpoint flags.
`settings.modelPreferences` and protocol-70 migration metadata persist this
contract without rewriting old history. See
[provider/model availability](architecture/model-controls.md#provider-and-model-availability).

`settings.remote` holds a non-secret explicit SSH target, pinned public host key,
selected local identity path, private remote state directory, installed worker
argv, scoped-Copilot grant and remote-local endpoints. Projects separately set
`remotePath`. `remote.probe()` verifies the actual worker digest/runtime;
`remote.status()` reports current qualification. Model IDs carry their eligible
environments. `sessions.env()` preserves an eligible selection and clears an
incompatible model/options, never substitutes another provider.

`snapshot.executions` records owned run/target/root, cancellation, cursor and
actual/unconfirmed cleanup. `remote.reconcile(id)` reads existing receipts and
late accounting without replay. `remote.acknowledge(id, true)` records actual
user inspection, not proof of cleanup. Remote endpoint keys use
`remote.setToken`/`clearToken`, distinct from host-local keys. The installed
`moguri worker --stdio` entrypoint exposes the versioned SSH bridge; it never
starts a second local service. See the [transport contract](architecture/execution-transports.md)
for still-unqualified side-panel/extension capabilities.

`workspaces.files(sessionId, path)`, `workspaces.file(sessionId, path)`,
`workspaces.git(sessionId)` and `plans.read(sessionId)` resolve Remote sessions
through that pinned SSH worker and the project's explicit `remotePath`, not
through any Local path. Protected/denied paths, file bounds and Git filter/hook
suppression apply on the execution host. Target, root, env or policy changes
invalidate pending results; disconnects are errors, not empty views or fallback.
These are explicit user views, not implicit attachments or model context.
Remote `/plan` returns text in CLI/TUI, never a Local file-opener action.
Remote plan writes use the same owned worker without a model request.
Pass the exact reviewed binding as the fourth argument:

```ts
const plan = await sdk.plans.read(sessionId);
const saved = await sdk.plans.save(sessionId, editedText, plan.digest, plan.bindingDigest);
const retained = await sdk.artifacts.read(saved.id!);
```

`plans.saves(sessionId)`, `saveInfo(sessionId, saveId)` and
`stopSave(sessionId, saveId)` inspect/control actual operations. A thrown
partial error can mean bytes already changed; inspect before a new explicit
save. A repeated original command never replays its recorded intent after
restart. Local callers retain the three-argument form. See
[Remote plan saves](architecture/remote-plan-saves.md).

`attachments.file`/`image` capture selected content. `folderPreview`,
`githubPreview` and `sessionPreview` return exact source/size/exclusion/digest
data; the matching `folder`/`github`/`session` method needs the reviewed digest
and literal user confirmation. `attachments.read` checks the destination
session's grant before returning text or private image bytes. Source changes
require new preview; source-session deletion does not erase an independently
approved destination snapshot.

Use `sdk.command` for project/session creation, draft/queue changes, controls,
human approvals, archive/resume and allowed-env policy. These are the same
validated commands used by both clients.

### Project-free chats and reviewed configuration

`sessions.create()` or `sessions.create(null)` creates a real project-free chat.
Raw `session.create` also permits an omitted/null `projectId`. Protocol 72
captures `Session.homeRoot` (canonical path/device/inode) for ordinary Local
chats, matching their private console default without creating a project.
`sessions.home(sessionId, expectedRevision?)` explicitly binds a legacy chat
once; the SDK prepares legacy Home on explicit file/catalogue/MCP use. Reopening,
changing defaults or navigating never moves the binding. Files and commands
use existing scoped executors and approval policy, not another checkout or a
state-directory fallback. Private role owners and non-Local transports do not
adopt controller Home.

`workspaces.home(sessionId)` reads the captured binding and current independently
retained writers; `Snapshot.chatWriters` retains original profile/session/turn,
root, revision, background jobs and actual active/settled/unconfirmed/acknowledged
states. `workspaces.acknowledgeHomeWriter(sessionId, writerId, expectedRevision,
true)` is an actual-user inspection action for that exact original Home.
Acknowledgement is risk acceptance, not process cleanup, a tool grant or queue
resumption. Unknown ownership survives source deletion and unloaded-profile
recovery. Model-only chats stay parallel; actual overlapping writes serialize.

`workspaces.files/file`, `tools.catalog/execute`, `agentTerminals.list/read`
and shared `/home` work across SDK/CLI/TUI/desktop. Commands start fresh PTYs
in Home, never private User-console state. Browser control still needs its
actual attached native host/user toggle and normal exact tool approval.
Explicitly targeted `gh --repo owner/repo` or `git -C /selected/checkout` commands
can perform repository work; native project pickers/publication, repository
memory and project-file capture still require real project ownership.
No account/login or project association is inferred. Home-dependent MCP grants
bind the new exact directory identity and require fresh review rather than
reusing an older null-root resource grant. Explicit automatic approval remains
separate from hard denials, read-only modes, allowed environments and budgets.

Protocol 105 adds chat repository binding (`docs/architecture/chat-repository-binding.md`).
`Session.repositoryProposal` (`{ root, turnId, observedAt, status: "pending" | "dismissed" }`)
records a Git repository nested below Home that this chat tree actually wrote
into. The pure helper `sessionRepositoryProposal(session, snapshot)` returns
`{ root, project, confirm }` only for a pending proposal; `project` is the
existing project at that exact path or `null`, and `confirm` is
`settings.values.interactions.confirmRepositoryImport !== false`.
`sessions.importRepository(sessionId, path, true, expectedRevision?)` imports the
exact proposed root (reusing a matching project) and moves the chat tree
atomically. `sessions.dismissRepository(sessionId, expectedRevision?)` records
"not now"; the same root is not proposed again. `sessions.bindProject(sessionId,
projectId, expectedRevision?)` explicitly moves a Home chat tree into any
existing project. All three require a settled root chat without a parent. The
service moves chats automatically when the project already exists, or when the
profile saved `interactions.confirmRepositoryImport: false`.

```ts
const general = await sdk.sessions.create(null);
const { preview } = await sdk.suggestions.preview(general.id!);
// Present preview.scope, sources and digest. No inference has occurred.
// After explicit source consent and selection of a model:
const analysis = await sdk.suggestions.generate(general.id!, preview.digest, false, true);
const settingsChat = await sdk.metachat.create(null, general.id, "Discuss Moguri settings.");
```

Project-free previews exclude project chats by default. Passing `allProjects:
true` requires an explicitly project-free source and matching reviewed digest;
generation does not silently widen scope. Metachat can read non-secret config
or create proposals through `moguri_config`, never apply, authenticate or grant
permissions. Optional ordinary evolution still starts off.

`configuration.propose(sessionId, spec)` creates a user-authored proposal;
model-created ones retain `actor: model`. Specs identify `global`, `project`,
`policy`, `repo-instructions` or `skill`, section/value/reason and optional
verified evidence IDs. `configuration.review(id)` returns the exact before/
after value and warning. Only after actual human review/risk acknowledgement,
call `configuration.decide(id, true, reviewed.proposal.contentDigest, true)`.
Reject with `false`. Status, base revision/digest and target validity are
rechecked at apply. Skills install disabled; repo writes are local and report
partial effects if their durable decision fails. Proposals survive origin-session
deletion in their independent target compartment.

`attention.list({query?, type?, state?})` returns the actual profile's visible
Inbox notifications using the shared `filterInboxAttention` selector. Queries
are case-insensitive, NFKC-normalized, at most 200 characters and require every
whitespace-separated term to match. Types include `"question"`, `"failed"` and
`"script-review"`; state is `"all"`, `"read"` or `"unread"`. Search resolves
the notification's original public source, never an unrelated latest message.
Filtering neither reads nor resolves items and desktop filter state resets
across profiles. CLI: `inbox list --filters JSON`; TUI: `/inbox list JSON`.
`attention.acknowledge(ids)` marks shared items read; it never answers/approves.
`attention.delete(ids)` atomically removes the exact notifications from Inbox,
not their sessions, questions, approvals or budgets. An inactive deletion
witness prevents replay; session deletion removes its notifications and witnesses.
Stale/foreign/deleted IDs fail without removing a valid prefix.
Preferences are `settings.values.notifications`: `inApp: true`, `os: false`,
`previewContent: false` by default. Native OS delivery/navigation is an Electron
binding of service events, not a second notification state store.

Root application configuration is separate from profile settings:
`application.status()` returns the current root `configuration`;
`application.configure({menuBar: false}, observedRevision)` saves only that leaf.
Competing profiles share one revision and do not copy native preferences into
their own configuration.

Protocol 96 also exposes the default-on root preference
`configuration.values.keepServiceOnWindowClose`.
`application.configure({keepServiceOnWindowClose: false}, observedRevision)`
opts out without changing other preferences. It governs desktop window close,
not explicit Quit, tool permissions, held queues or model budgets. Legacy
application flags retain their values through the genuine-95 migration.

Node `ensureConnection` and `connectMoguri` accept an optional
`confirmUpgrade(review)` callback. Discovery validates private loopback metadata
and authenticated health before classifying a responsive older service as
`ServiceProtocolMismatch`, rather than calling every version mismatch corrupt.
The review exposes only root/PID/protocol/fingerprint facts, not its connection
token. A true result allows one exact fingerprint-rechecked authenticated
terminal-preserving restart; a false result raises `ServiceUpgradeCancelled`
without stopping anything. Newer/unverified owners are never offered as an
automatic downgrade/restart. Without a callback, callers receive the actionable
mismatch and may choose an explicit lifecycle operation themselves.
`autoStart: false` stays strict and never invokes upgrade/launch effects.

`restartMoguriService({stateDir, expectedConnection?, runtime?, servicePath?})`
performs an explicit service-wide terminal-preserving restart and returns the
new authenticated ready `Connection`. It captures one root for the whole
operation and verifies the selected service entrypoint/executable **before**
requesting shutdown. Missing/incomplete installations cannot first interrupt a
healthy service. Omit runtime/path overrides to use this SDK's actual installed
layout and current Node executable; no development checkout, different app or
ambient Node is substituted. Ordinary `stopMoguriService` remains separate and
does not launch a replacement.

Cold auto-start waits up to 60 seconds for matching authenticated health rather
than timing out after ten seconds during encrypted-history recovery. A process
that exits without another retained writer reports its exit code/signal and
exact private log path promptly. Competing launch clients may still connect only
to the verified owner; a writer-lock file alone is not authentication. A deadline
leaves the original initializing owner and all state intact, with no automatic
retry, force-stop or replacement. Health reporting stopping/unconfirmed lifecycle
work is not accepted as ready. Lost lifecycle acknowledgement may mean the
original owner is already stopping; it never authorizes another launch.

An unconfirmed readiness deadline now raises Node
`ServiceStartupUnconfirmed`, whose `.review` getter returns an independent
`ServiceStartupReview` copy. The original canonical root/device/inode, private
writer-file fingerprint, PID and available connection fingerprint are captured
before health inspection, not rediscovered as a new owner after failure.
After an explicit user reconnect, `ensureConnection({startupReview: review})`
retries only that captured owner and still requires a matching protocol. It
cannot launch a process, create another root or choose a different installation.
`reviewServiceStartup(stateDir)` is read-only inspection;
`waitForStartupService(review, {signal?})` authenticates that original owner
without the caller-version gate for explicit lifecycle handling. These helpers
do not approve a restart. `ensureConnection` also accepts `signal`; cancellation
ends this caller's wait without stopping the shared service or replaying work.

### Profile-owned metadata-only OTLP export

Protocol 97 adds `sdk.telemetry.export.status()`,
`review({enabled, endpoint, samplingRatio})`, and `apply(originalReview)`.
The Node service owns one bounded sender per enabled loaded profile. Root and
React entrypoints expose only browser-safe DTOs/API calls; official OTLP codecs
load lazily in the service, never in ordinary Node SDK discovery.

Review is offline and binds the actual immutable profile, configuration
revision, collector origin and metadata disclosure. Apply requires that exact
review; it does not select a model, grant tools or alter accounting. An absent
configuration is disabled. OTEL environment configuration and raw content
export are unsupported. Service-owned health counters do not
become retained billing or backend-delivery receipts.

```ts
const reviewed = await sdk.telemetry.export.review({
  enabled: true, endpoint: "http://127.0.0.1:4318", samplingRatio: 1,
});
// Present the exact review and privacy disclosure to the actual user first.
await sdk.telemetry.export.apply(reviewed.review);
const health = await sdk.telemetry.export.status();
```

Protocol 112 adds optional `logs` and `headers` review input, and
`setCredential(endpoint, name, value)` / `removeCredential(endpoint, name)`.
Credential values go only to the profile's secret backend, bound to that origin
and header name; status reports `headers: [{ name, stored }]` and log counters,
never values.

The shared `executeOtlpCommand(sdk, argument)` parser implements CLI/TUI
`status`, `review INPUT_JSON`, `apply REVIEW_JSON confirm-reviewed` and
`credential remove ENDPOINT NAME`. It refuses `credential set`, because values
must come from a masked TUI input or piped CLI stdin, never a command line.
The [export contract](architecture/otlp-export.md) defines privacy, traces,
canonical gauge semantics, finite bounds and restart/no-backfill behavior.

`sdk.analytics.overview()` and `sdk.analytics.session(sessionId)` read the
service's in-memory [live session analytics](architecture/session-analytics.md):
lane events for running and recent sessions only. The service never persists
or exports them, and returns `null` for a session that is gone, archived or
quiet for longer than the window.

After accepting a same-connection, exact-profile HTTP snapshot, the client uses
its validated sequence as the event resume cursor. It does not replay the full
retained history from zero before authenticating. Events committed after that
snapshot, including the HTTP-to-WebSocket gap, remain delivered. A late ready
frame cannot roll back newer snapshot data or cursor progress. This avoids
large-history replay/backpressure consuming the unchanged ten-second event
negotiation window; it does not truncate service history or resend a mutation.
`ClientState.events` is the bounded live delivery window, not retained history;
use the authoritative snapshot/activity/source-result APIs for earlier state.
If negotiation still fails, its error retains the observed event close
diagnostic (authentication/protocol/profile or replay recovery), not arbitrary
server-supplied frame contents.

CLI, TUI and desktop builds import the actual `dist/sdk/node.mjs` rather than
inlining its location-sensitive runtime paths. Packed SDKs retain the same
explicit `dist/service.mjs`/`dist/runtime.mjs` layout. Private connection/lock
reads are bounded and inode-checked through no-follow handles. Stale-lock
reclamation is serialized by a private `service.lock.recovery` claim; a retained
unconfirmed claim is not deleted or replayed automatically.

Explicit native Quit, and window close with the background opt-out, call `stopMoguriService(capturedStateDir,
{expectedConnection: capturedConnection})`, not a freshly inferred default root.
The private registry fingerprint and authenticated PID/protocol must still match
that captured owner before sending the existing ordinary-stop lifecycle request.
A missing registry is considered already stopped only with no writer lock or
recovery claim and a refused captured endpoint. Without a captured owner,
stopping a never-started/already-stopped root is idempotent only when all three
metadata paths are absent. A missing connection with a retained lock fails
explicitly; it is not permission to signal a PID, delete state or start another
writer. A rotated/new owner is never stopped implicitly.
Those stop paths wait for completed shutdown, not merely request acceptance.
With the default-on preference, accepted last-window close reads the actual
root configuration, verifies the original owner and quits Electron while the
service, agent work and user terminals continue. Unsaved-edit cancellation
does not begin shutdown or latch a later window close into the cancelled Quit
intent. Explicit terminal-preserving restart remains separate.
An established desktop's reconnect after an explicit same-root/store restart
authenticates the new current private connection without launch effects,
preserving its immutable profile and original store identity. Startup timeout
and cancelled-quit continuations keep their stricter captured-owner review.
The current authenticated operational owner, not an obsolete pre-restart
token, is used for a later ordinary Quit.

`application.storage.status()` and `application.storage.preview(path)` expose the
actual runtime authority and exact review. After actual all-profile review,
`application.storage.relocate(path, review.digest, true, optionalOriginalId)`
uses transient authenticated intake, retains intent and closes every writer.
It does not refresh/reconnect a profile after requesting that shutdown. Node
consumers can use `waitForStorageRelocation(actualLocatorDirectory, id, keyId)`;
the directory comes from actual storage status, not a guessed Home path.
`readDefaultStateLocation`, `readStateLocation` and `stateLocationDirectory`
are explicit Node exports. Source receipts, master-key identity, independent
retention grants, unknown budgets and original resource roots remain intact.
No original move ID can redispatch a copy, even after a missing receipt.
Embedded `createRuntime` consumers must explicitly configure `storage` authority
to enable a first move. Once a store records that authority, later views cannot
discard it or substitute another locator to open a stale copy.

`application.disk.status()` returns the optional virtual disk for new session
worktrees (`supported`, the `disk` record with `status` and `pressure`, live
`usage` and the number of worktrees on it).
`application.disk.configure(sizeGiB, expectedRevision)` creates or resizes it;
`configure(null, expectedRevision)` turns it off. Changes finish asynchronously:
read `status()` until `disk.status` is `ready` or `off`. Resizing refuses
running work on the disk and turning off refuses worktrees still on it. See
[virtual disk](architecture/virtual-disk.md).

`application.updates.status()`, `history()`, `read(id)`, `credential()`,
`setToken(tokenOrNull)`, `check(automatic?, optionalOriginalCommandId)` and
`cancel(id)` use root-owned update state and a purpose-specific secure PAT.
Credential intake is transient; normal provider/CLI credentials are not read.
No raw token enters durable commands, receipts, event diagnostics or model
history. Inspection and staging do not execute downloaded code.

After actual human review, `application.updates.installPreview(id)` binds fresh
old/new tree digests and the canonical owned packaged destination/backup.
`install(id, review.digest, actualDesktopPid, true)` is a transient shutdown
request, not a normal command followed by automatic reconnect. Its acknowledgement
identifies one private journal and immutable intent digest. Node
`waitForUpdateInstallArm(journal, id, intentDigest)` waits for the original
durable shutdown/arm acknowledgement before the native owner exits. It never
replaces a missing helper or retries filesystem effects. Root configuration,
update and store-relocation intents remain separate from per-profile settings
and session retention; a pending installation blocks store relocation.
Source/embedded runtimes need explicit `updates` authority to check releases;
production derives the packaged installation root from the actual pinned Node
runtime, never a user-selected arbitrary application path.

`needsInputSound` and `completedSound` each default to
`{enabled: true, id: "default"}`; `soundWhileFocused` defaults true. Saved explicit
mute/focus choices remain unchanged. Attention audio covers actual unanswered
questions, pending approvals and failed/partial work, never a heuristic badge.
Sounds do not depend on the banner flag. `notifications.importSound(name, pcmWav,
optionalCommandId)`, `notifications.list()`, `notifications.sound(id)` and
`notifications.removeSound(id, observedContentDigest, true)` use immutable,
profile-owned encrypted snapshots. Imports require canonical mono 16-kHz PCM16
WAV up to ten seconds and at most 32 retained sounds. Removal rejects currently
selected resources, even when the corresponding alert is disabled. An original
import command cannot recreate removed audio after receipt loss. File loading
is explicit Node client delivery through `loadNotificationSoundFile(path)`;
the browser-safe SDK never gains arbitrary filesystem authority. No TUI/CLI
operation automatically plays audio.

Streaming desktop dictation uses
`voice.startCapture(sessionId, optionalOriginalId, { streaming: true })`,
ordered `voice.appendCapture(sessionId, id, token, sequence, pcmBytes)`,
`voice.readCapture(sessionId, id, token)` and
`voice.finishCapture(sessionId, id, token, finalSequence)`.
The original intake acknowledges frames without waiting for model startup;
read returns the current transcript/revision, and the final capability job
retains the acknowledged complete transcript. Duplicate/out-of-order frames,
late audio after revocation and incomplete flushes are rejected, never replayed.
`startCapture` resolves with the exact service lease acknowledgement, without
waiting for a full conversation snapshot. Observe its job through the shared
event stream or `jobs.wait`; no second capture queue or admission retry is used.
`DraftEditor.startDictation(start, end)` replaces only its original provisional
span, preserving surrounding typing and refusing foreign/overlapping changes.
An ordinary autosave does not delay this local span; pending input intake and
attachment capture are refused rather than arming a later recording.
Insertion never sends a prompt.

The retained batch API uses `voice.startCapture(sessionId, optionalOriginalId)`,
`voice.uploadCapture(sessionId, id, token, wavBytes)` and
`voice.cancelCapture(sessionId, id, token)`. These use transient authenticated
`/v1/voice` requests, not durable commands. The original profile/session/job and
one-use nonce stay bound through cancellation and disconnect. The maximum
normalized clip is 120 seconds / 3,840,044 bytes; malformed rates/channels,
noncanonical base64, duplicate upload and reused job identity are rejected.
Audio and upload nonces are never retained in events/receipts. Actual ASR jobs
and explicit transcript insertion still use existing shared APIs. Root exports
`encodeSpeechPcm`, `encodeSpeechWav`, `validateSpeechWav`, shortcut parsing/matching helpers and
typed preferences without importing native/provider runtime.

`await sdk.voice.transcript(sessionId, jobId)` returns the complete recognized
text from a completed local speech job owned by that exact session/profile.
It reads bounded result pages, including JSON escaping, without truncating them
or opening a microphone. Pending/cancelled/foreign-session results are rejected.
`voice.insert(sessionId, jobId, expectedDraftRevision)` remains a separate
explicit write and never submits a prompt.

`sessions.side(parentSessionId)` atomically opens an existing original side chat
or creates one with the parent's model, thinking/window, autonomy and budget,
capturing its real effective context. It remains permanently read-only.
Navigation attachment alone never grants another parent's context.

### Held prompts, modes and retained plans

```ts
import { DraftEditor } from "moguri";

const session = sdk.getState().snapshot?.sessions.find((item) => item.id === sessionId);
if (!session) throw new Error("Choose a session.");
const editor = new DraftEditor(sdk, session.id, session.draft);
try {
  editor.edit("Review the generated change.");
  const held = await editor.send("queue", true); // No model call, even when idle.
  console.log(held.id);
  editor.edit("/read-only");
  await editor.submit((expectedDraftRevision) =>
    sdk.commands.submit(sessionId, { client: "cli", expectedDraftRevision }));
} finally {
  editor.dispose();
}
const side = await sdk.sessions.spawn(sessionId, "side");
const plan = await sdk.plans.read(sessionId);
// A read-only session cannot save a plan or promote a question-only child.
// Actual UI results require a compatible commands.attach handler and acknowledgement.
```

`prompts.sendNow(sessionId, messageId)` steers a queued prompt into the live
solver turn, or runs it next when idle. `prompts.edit(sessionId, messageId,
text, attachments?)` saves a queued prompt; pass the complete attachment list,
using kept entries plus captures from `attachments.queued.file|document|image|
folder|github|session(sessionId, messageId, ...)`, which return `{ id,
attachment }` for the staged capture without touching the draft;
`attachments.queued.list(sessionId, messageId)` lists what's staged. See
[queued prompt editing](architecture/session-workspace.md#queued-prompt-editing-and-send-now).

Release a held prompt with `prompts.release(sessionId, messageId,
observedQueueRevision)` only after explicit user admission. A selected available
model, ready environment and policy are required then, not when holding text.
`/run ID` uses this same operation. Returning to agent mode is a safe-boundary
request; immediate restriction and model-declared tools are service-enforced.

`DraftEditor.submit(intake)` fences its original acknowledgement and buffers
later input. Only canonical queued-command draft provenance may merge an owned
delayed context capture; foreign draft edits still require explicit conflict
resolution. Submission, context capture and clipboard success are not inferred
from matching text. A lost acknowledgement never triggers a paid retry.

Ordinary `DraftEditor.send` exposes its captured local input through
`getState().pendingInput` while the composer is cleared and the original
request is awaiting acknowledgement. Desktop and TUI label it as Sending,
Holding, Steer or Interrupt, never as a committed message or model start.
It is not a durable event, model context, receipt or permission. Newer edits
remain independent; refusal or unknown acknowledgement restores the existing
draft/conflict recovery without automatically resending. Generic
`submit(intake)` does not turn a question answer or slash action into a
provisional ordinary message.

`DraftEditor.send("auto")` asks the service to choose ordinary Queue when idle
or Steer at the actual active solver's next safe boundary. It does not cancel
the current operation, answer a structured question or target a private control
turn. Held auto input and slash commands remain ordered queue intake. Only a
marked automatic live item can become the next turn if its owning solver
finishes before consuming it; stop/partial recovery never performs that transfer.

`sessions.create(projectId)` records factory-title provenance. Supplying a
title, including an old placeholder string, does not infer automatic naming.
The optional profile setting is `chatTitles: { enabled: true, modelId: null }`;
`null` means the qualified original-Env selection described in
[First-topic chat names](architecture/chat-titles.md). Saving settings does not
send inference. `sessions.titles(id)` reads actual optional `Snapshot.chatTitles`
records, including original source/request/result digests and rejected/partial
outcomes. The extra `title` role appears in shared all-role usage and budget
filters, never ordinary solver context or model-owned acceptance.

`sdk.getRequestTimings()` returns copies of the last 50 settled SDK request
observations: allowlisted operation, connection generation, HTTP status,
headers/body/total milliseconds and whether delivery completed. These are
client transport observations, not server CPU, inference, billing or readiness
proof. They retain no input, identifier, path, endpoint, credential, model name
or request/response payload and are not persisted. Desktop Insights and TUI
`/trace` expose the same diagnostics without issuing new model requests.
Current responses add optional numeric `response` spans: `serviceMs`,
`proxyBodyMs`, `proxyHeadersMs`, and each process's `LoopMs`/`WindowMs`.
Absent headers/samples are null, not zero. Loop maxima describe lag above
nominal 20-ms sampling in the reported window; they are not correlated CPU,
lock or network causes for that request. The copy retains no raw HTTP header.

`commands.attach(client, handlers, {canApply?, onError?})` returns
`{clientId, wake, dispose}`. Handlers receive the original SDK/session, execution,
input/result, private claim and AbortSignal. They return an explicit completed,
cancelled, failed or partial outcome after actual application. A set-state
callback or printed unavailable action is not successful native UI delivery.
`commands.choose(clientId, claim, choice)` atomically binds an actual original
queued continuation choice and its admission; it never consumes a newer draft.
Only cancelled, non-mutating continuation reviews may request `restoreInput`,
and restoration requires an unchanged empty original composer. UI instances
should await their attachment disposal, or `commands.detachAll()`, before
closing their test/runtime resources. Service-capable commands do not depend on
these clients remaining connected.

Project settings use `projects.configuration` and
`projects.configure(projectId, settings, observedRevision)`.
`projects.add(absolutePath)` registers an existing canonical directory.
`projects.clone(repositoryUrl, newAbsolutePath, true)` returns an independently
retained `project.clone` capability job, not a completed project. Wait with
`jobs.wait(id)` and inspect its actual status before using
`job.projectClone.projectId`. Successful project registration and `job.finished`
commit atomically. The intent retains canonical destination/parent identity,
containing-root leases and original command ID/digest. Cancel, restart or a lost
receipt never repeats the original Git operation or deletes partial files.
Cloning does not run hooks/checkout filters/submodules, initiate personal login
or start inference. Existing destinations and embedded URL credentials fail
before effects.

`projects.sources` returns the actual instruction/MCP source and `mcpDigest`;
`projects.importMcp(projectId, observedRevision, true, reviewedDigest)` rejects
file changes after review and installs supported entries disabled.
Project MCP auth/token operations must include their bound session ID.
`projects.initialize` is an explicitly confirmed non-protected-branch push job,
not an implicit effect of reading settings. Inspect its terminal result:
partial or cancelled publication is not success.

Artifacts are independently encrypted in project/profile scope.
`plans.save`/`capture` retain a plan snapshot with unknown file authorship;
`plans.artifact` remains readable after session deletion. Source-session
deletion requires confirmation and an observed session revision.
Project removal refuses retained managed worktrees; remove them explicitly first.
It requires a reviewed artifact choice before forgetting project content/derived indexes and project
MCP credentials, never source files, external PRs or shared caches/models.
Archived retention is opt-in `settings.values.retention`; `retention.run`
honors that policy. Production retention uses the explicit OS-keychain backend;
generated embedders/tests may inject a 32-byte `retentionKey`, never hardcode a
real key or silently derive one from a path.

### Independent artifacts

```ts
const created = await sdk.artifacts.create(null, {
  projectId, kind: "decision", name: "Generated decision", text: "Explicit text.",
});
await sdk.artifacts.update(created.id!, { text: "Explicit revised text." }, 0);
const old = await sdk.artifacts.read(created.id!, 0);
const revisions = await sdk.artifacts.history(created.id!, 0, 20);
const source = await sdk.artifacts.source(sessionId, "message", messageId);
const answer = await sdk.artifacts.promote(sessionId, {
  sourceKind: "message", sourceId: messageId, kind: "answer",
  name: "Reviewed answer", expectedDigest: source.preview.digest,
});
const exported = await sdk.artifacts.export(answer.id!);
```

`create(sessionIdOrNull, document)` uses that session's explicit scope, or the
supplied project/profile scope with no invented conversation/filesystem root.
Promotion copies the exact canonical completed user/model message or terminal
tool result, preserving its real actor, source event, digest and outcome.
Later edits set `edited`, never relabel model text as a user answer.
Archive is `update(id, {status: "archived"}, observedRevision)`; restore uses
`active`. `delete(id, observedRevision, true)` forgets that artifact's grants
and all revisions, not other copies or source files. Reads/history reject deleted
IDs even when another artifact contains identical text.

`projectPreview(projectId)` binds the exact current set to a digest.
`projects.remove(projectId, true, observedRevision, choice)` accepts
`{action: "retain"|"delete"|"export", expectedDigest, exportedDigest?}`.
Export requires the exact `projectExport` digest and explicit client saving
before deletion; retain creates a new profile-owned revision. Concurrent edits
invalidate the choice. The explicit Node entrypoint exports
`saveArtifactExport(absoluteNewPath, export)`: private atomic new-file delivery,
digest verification and fsync, no overwrite or automatic app opening.

Text is bounded to 128 KiB UTF-8, history pages to 100 records, JSON exports to
8 MiB with no truncation.

Artifact create/update accepts nullable `folderId` and `workItemId`. Folders
belong to this profile; a work item must belong to the artifact's project.
These are versioned associations, not a filesystem path or model permission.

`artifacts.materializePreview(projectId, {workspaceId?, commitBranch?})` returns
the exact source-set/file/review digests, canonical root identity, destination,
policy revision and optional new local branch/base. Explicit
`artifacts.materialize(projectId, reviewDigest, sameOptions)` durably starts an
owned job before effects. Wait with `jobs.wait`, inspect the typed
`artifacts.materialization(jobId)` and request stop through `jobs.cancel`.
A timeout is not cancellation. Partial/interrupted jobs preserve source grants
and their original destination intent; restart never replays publication.

Copying writes one exact private history bundle under that selected Local
root's `artifacts/`. Optional commit uses a temporary index and a new
non-protected local branch, preserving checkout, index and unrelated edits,
with no push/signing/hooks/filters. `projects.remove` may use
`{action:"materialize", expectedDigest:setDigest, materializationId:completedJobId}`.
The service rechecks real bytes and any requested local commit before
forgetting source grants. Changed source/file/root/branch rejects deletion.
Remote/Sandbox publication is unavailable, not mapped to Local.

### Actual structured answers

`snapshot.questions` contains typed model clarifications and their real
status/provenance; `session.pendingQuestionId` identifies an active owner.
`questions.answer(id, text, observedRevision)` accepts only actual user input
for that live question/turn. It cannot set an actor, approve tools or answer
another turn. `questions.answerDraft(id, observedRevision)` consumes the exact
saved owning-session text atomically; flush a `DraftEditor` first. Attached
context is preserved and stale draft/question revisions reject the entire
operation.

Question routing respects explicit tool denials but does not ask for redundant
permission to ask a clarification. Worker cancellation stays non-blocking;
stop/restart cancels pending questions without manufacturing an answer.
`settings.values.artifacts.retainAnswers` defaults true as requested.
Answer event, independent artifact with model-question/user-answer sources,
draft clearing and command receipt commit together; failure rolls back all.
Disabling retention preserves canonical source events until their session
retention applies. Model/delegated-decision answers require their own future
policy/call provenance, never this actual-user endpoint.

### Estimated limits and independent accounting

Session controls accept `{kind:"limited", basis:"estimate", tokens?, usd?}` with
at least one positive limit. A finite control without explicit estimate policy
is rejected. `budgets.status(sessionId)` returns actual/held/incomplete totals,
effective session/profile caps and unavailable-unit diagnostics.
`budgets.policy(limitOrNull, observedRevision, true)` is a separate explicit
profile-policy action; settings/default resets never lift it.

USD admission requires either a fresh model-specific
`settings.values.budgets.rates` entry with canonical `modelId`,
`inputUsdPerMillion`, `outputUsdPerMillion`, UTC `effectiveAt` date and
`source:"user-estimate"`, or explicit
`settings.values.budgets.useProviderRatesForLimits: true` consent for fresh
originating-provider references. `providerEstimates` defaults on; finite-limit
consent defaults off. An existing stale manual override is not replaced.
`prices.catalog()` exposes reference dates, canonical source/digest, model
matches and unknown-price diagnostics. `prices.refresh(providers?, revision?)`
returns an original `pricing.refresh` job. Wait/cancel through `jobs`; failed
refresh preserves the prior catalog. Calls capture their historical
`provider-api-equivalent` or `user-estimate` rate. Unknowns remain unpriced;
`providerReportedUsd` and `billedUsd` remain separate/null.

Reference prices deliberately assume the named originating model's API cost
through Copilot/resellers, not their invoices. Known cache subsets are priced
once, long-context thresholds are explicit, and unspecified write TTL uses the
maximum listed write rate. The manual conservative input override still covers
every input category. No provider total is inflated by adding cache twice.

Reservation and `model.started` commit before the real worker is authorized.
The actual reduced output limit reaches maintained pi-ai. Complete reports
settle once; stop, lost frames and restart retain full unknown reservations.
Authenticated late SSH receipts can improve accounting without replaying work
or completing partial turns. Profile-owned entries survive session/project
retention. Historical unknown bounds/prices block affected finite units.

`budgets.dashboard({projectId?,folderId?,sessionId?,turnId?,providerId?,modelId?,role?,env?,range?,bucket?,offset?,limit?})`
returns complete matching totals, UTC periods/captured price history and paged
actual role/model groups. `range` is `{kind:"days",days:7|30|60|90|365}`,
`{kind:"year",year}`, `{kind:"custom",from:"YYYY-MM-DD",to:"YYYY-MM-DD"}`
(inclusive UTC dates), or `{kind:"all"}`/omitted. `bucket` is `day`, `week`
(Monday), `month` or `all`. Unknown historical request times are disclosed and
excluded from dated views, not treated as zero; All time includes them.

`budgets.calls({...sameScopeFilters,offset?,limit?})` returns bounded retained
current-accounting call pages, actual/owning turn, nullable categories, captured
rate and observed stream metadata. New/late reports can reorder pages; do not
sum pages to derive totals. Observed delivery rates exclude unqualified and
non-generative observations and are not GPU benchmarks. Absent cache details or
single-chunk timing stay unknown. Use the same filters via `/dashboard JSON`,
`/dashboard calls JSON` or CLI `budget dashboard|calls --filters JSON`.
Estimates, provider reports and bills are separate; no billed USD is invented.
Input reservation is estimated and provider charges can lag or exceed it.
A provider exceeding its forwarded output bound is partial/unqualified for
finite retry. A blocked request creates a deterministic retained checkpoint,
not a model answer or successful commit. Kupo wind-down and committed checkpoints
remain separate scheduler/Git qualification.

Protocol 30 additionally exposes `budgets.plans({sessionId?,projectId?,folderId?,
turnId?,modelId?,providerId?,role?,env?,range?,status?,offset?,limit?})`.
Read-only held/consumed/released pages are distinct from actual calls:
`plannedHolds`, `plannedHeldTokens` and `plannedHeldUsd` disclose reserved future
capacity in status/dashboard totals. Use `/dashboard plans JSON` or CLI
`budget plans --filters JSON`. Plans have no call-time repository attribution,
so that query rejects repository filters rather than silently ignoring them.
Only still-held plans release on the canonical owner's termination; consumed
or unknown calls stay charged/held through source deletion/restart.
Creation/transfer remain internal prerequisites, not a public finite kupo
feature or client-side refund authority. See [the contract](architecture/budget-plans.md).
The 0.24 internal planner can calculate a complete same-turn batch before one
atomic append, so future roles cannot independently reserve overlapping
capacity. This adds no client write API or finite kupo readiness; existing
inspection still returns the individual version-1 plans.

### Tool outcomes and retained size

`telemetry.operations({...sameScopeFilters,family?,actor?,name?,serverId?,outcome?,offset?,limit?})`
returns all matching totals/groups and a bounded attempt page. Families are
`tool` and `mcp`; actual actors are `model`, `external` or `unknown`.
MCP attempts are not added a second time as gateway/result jobs. The failure
rate denominator is completed + failed; denial, pending/running, stopped,
partial, unconfirmed and unknown outcomes have independent counts. No known
results means a null rate, not zero-percent failure.

The allowlisted ledger retains no arguments, paths, commands, prompts, output
or error text. Source deletion does not erase sanitized metadata. Startup can
import only retained evidence; coverage explicitly discloses unavailable
pre-upgrade deleted history. Missing start time or elapsed samples are unknown,
not zero. A late result does not turn its owning partial session into success.
Explicit user plan saves remain their own control-operation history.

`telemetry.storage()` returns current-profile sealed event-payload, encrypted
blob-grant and encrypted key bytes/counts in one read transaction. One content
digest can have multiple real encrypted grants. Physical/freed disk remain
null, and key presence is not a decryption/integrity audit. Structural payload
copies, metadata/receipts/tombstones, SQLite overhead/WAL, forgotten ciphertext,
worktrees/repositories, caches, weights, memory indexes and terminal buffers
are excluded. It accepts no date/project/model filters.

Use CLI `telemetry operations --filters JSON`, `telemetry storage`, or shared
`/dashboard operations JSON` and `/dashboard storage`. F7 and desktop Dashboard
expose the same SDK projections. See [the exact contract and prerequisite
measurements](architecture/operation-telemetry.md).

### Verified repository filters

`repositories.preview(sessionId)` reads the actual Local/worktree or pinned SSH
origin without GitHub access. Review its root, `lookupBoundary`, repository,
`bindingDigest` and observation `revision`.
`repositories.refresh(sessionId, bindingDigest, revision, true)` starts one
owned job; inspect `jobs.wait(id)` and `repositories.state(sessionId)`.
`repositories.clear(sessionId, revision, true)` affects future attribution,
not historical names, metadata or charges.

Public metadata uses the control-plane API without credentials; Local
`gh-cli` requires explicitly selected project access. Protocol 26
uses the selected SSH account for Remote `gh-cli`, never a Local account
fallback. Review `preview.remote` host/port/login/key fingerprint/root/build
and `lookupBoundary: "remote-gh-cli"` before explicit refresh. The retained
observation keeps that proof across restart. Missing tools/accounts and
unconfirmed cancellation fail visibly without another request. Copilot
credentials are not reused. Exact 0.20 delivery identities are recorded in setup.
No network lookup occurs at model admission: configured calls recheck
their actual Git identity and capture previously verified metadata or remain
unassigned.

Budget/call/tool queries accept `repositoryId`, `organization` and
`visibility:"public"|"private"|"internal"|"open-source"`. Each result discloses
`repositoryCoverage` before those filters. `open-source` is only the documented
public-plus-detected-OSI category; missing license evidence stays unknown.
`entry.repository` is an immutable admission snapshot, not today's GitHub
state. Never sum filtered pages to infer cumulative charges.

CLI `repository` and shared `/repository` review/refresh/state/clear/stop
commands expose the same API; `/dashboard JSON` accepts the new filters.
See [repository attribution](architecture/repository-telemetry.md) for exact
scope, cancellation, privacy, licensing and recovery semantics.

### Managed Local roots

```ts
const intent = await sdk.workspaces.create(projectId, "moguri/generated-work", {
  baseRef: "main",
  // Optional issueId and verified-format prUrl retain change-set association.
});
const workspace = await sdk.workspaces.wait(intent.id!);
const created = await sdk.sessions.create(
  projectId, "Generated isolated work", { env: "Local" }, workspace.id,
);
const files = await sdk.workspaces.files(created.id!);
const file = await sdk.workspaces.file(created.id!, files.entries[0]!);
const changes = await sdk.workspaces.git(created.id!);
const registered = await sdk.workspaces.discover(projectId);
```

`snapshot.managedWorkspaces` and `changeSets` are authoritative projections.
`sessions.create` accepts an optional fourth workspace ID; `sessions.fromWork`
accepts an optional third ID. A fresh idle session may explicitly bind/unbind
with `workspaces.bind(sessionId, workspaceIdOrNull, observedRevision?)`.
No mapping from a Local checkout to a Remote/Sandbox path is inferred.

Worker tools, repository instructions, plans, terminals, context, MCP cwd,
cache installs and memory use the same root. Pass the optional workspace ID to
`memory.index/search/graph` and `cache.inspect/install` when operating outside a
session facade. Ordinary base-project callers retain their existing behavior.
Deletion never removes a worktree or branch. Archiving removes only a clean,
fully pushed worktree and its local branch when `retention.archiveBranchCleanup`
isn't `false`, recording `parked` so restoring recreates it
([D46](architecture/decisions.md#d46-clean-pushed-worktrees-when-archiving)).
Explicit removal requires
a clean, idle, unbound owned root and `remove(id, observedRevision, true)`.
Wait observes its job; aborting a wait is not cancelling the job. Use
`jobs.cancel(workspace.jobId)` for cancellation, then inspect partial outcomes.
`reconcile` verifies existing identity/absence without re-executing Git.
Discovery reports Git registrations, not new ownership or filesystem authority.
External worktree adoption and multi-candidate orchestration remain unavailable.

### Local reviewed repository candidates

Use an explicitly Local agent-mode source session with an explicit **Git-backed
project** and a separate **clean
owned worktree at the same HEAD**. Creating/selecting that worktree is a
separate user action. Optional indexing, models and inference are not needed.
`candidates.eligibility(sessionId)` exposes the service's current eligibility and
diagnostic without creating a job, artifact or model call. It never borrows a
previous project. Direct manual/generated/compound commands enforce this too.

```ts
import type { CandidatePatch } from "moguri";

const base = await sdk.workspaces.file(sourceSessionId, "src/example.ts");
const patch: CandidatePatch = {
  kind: "patch", summary: "Explicit reviewed edit",
  edits: [{ path: base.path, baseDigest: base.digest, text: replacementText }],
};
const preview = (await sdk.candidates.preview(sourceSessionId, stageWorkspaceId, patch)).preview;
const created = await sdk.candidates.stage(sourceSessionId, stageWorkspaceId, patch, preview.digest);
const staged = await sdk.candidates.wait(created.id!);
if (staged.candidate.status !== "staged") throw new Error("Inspect the actual retained outcome.");
const review = (await sdk.candidates.applyPreview(created.id!, sourceSessionId)).preview;
await sdk.candidates.apply(created.id!, sourceSessionId, staged.candidate.revision, review.digest);
const result = await sdk.candidates.wait(created.id!);
```

`read(id)` exposes the immutable document, exact roots, real stage/apply jobs
and observed/attempted paths while its session-owned proposal remains retained.
`wait` returns actual settled metadata, not a success-shaped retry. Inspect
`candidate.status` and the original job; stop through `candidates.stop(id)`.
A wait timeout or client abort does not cancel work. A partial result never
rolls back or retries newer user files; explicit existing root recovery is
still required.

Permanent origin-session deletion, including archived-session expiry, deletes
the candidate and its proposal/job/blob grants. Archiving alone preserves it.
Fresh authoritative metadata for its exact first associated repository/PR can
also delete it after a verified merge, including for archived sessions. Current
metadata-access policy applies; no stale observation, closed PR or later session
relink can authorize another candidate's deletion. Pending/failed cleanup is in
`snapshot.candidateCleanups`; owner/PR bindings are in `candidateOwners`.
Ordinary artifacts, shared grants, actual/unknown accounting and Git/filesystem
resources are not erased or reverted. See the [retention contract](architecture/candidate-cleanup.md).

New files use `baseDigest: "absent"` and need existing allowed parent
directories. The slice accepts at most 20 portable distinct paths, 32-KiB
patch JSON and a 64-KiB document. It does not create directories, delete/rename
files, change modes or run code-quality validators. Byte/base checks and critic
advice are not user acceptance or a project-test result. No commit/push occurs.

CLI:
`moguri candidate preview PATCH.json --session SOURCE --workspace STAGE`,
then `stage PATCH.json` with the same selectors, `--digest` and
`--confirm-write`. Use `apply-preview ID --session SOURCE`, then `apply ID`
with `--session`, observed `--revision`, fresh `--digest` and
`--confirm-write`. `read`, `wait`, `stop` and explicitly reviewed `reject`
expose the same SDK data. Shared `/candidate` JSON commands and the desktop
Candidates panel perform the same two separate reviews. Source Env/mode/policy
changes invalidate stale results; no Remote/Sandbox-to-Local fallback.

### Reviewed peer/native staging resources

The [protocol-92 Env contract](architecture/candidate-transports.md) preserves
Local v1 behavior and adds explicit independent resources for selected Remote
and Sandbox sources. Remote creates a detached Git worktree on the actual
pinned peer. Sandbox creates a bounded copy of its original private snapshot,
**not** a Git checkout or the live Local repository. Native physical admission
remains unqualified while the documented pinned SendBox DNS issue blocks the
factory workload. No fallback or automatic upstream repair is attempted.

```ts
const reviewed = (await sdk.candidates.workspacePreview(sessionId, "Reviewed draft")).preview;
// Display reviewed.source, stageParent, diagnostic and digest to the actual user.
const created = await sdk.candidates.createWorkspace(sessionId, reviewed.name, reviewed.digest, true);
const workspace = await sdk.candidates.waitWorkspace(created.id!);
if (workspace.status !== "ready") throw new Error(workspace.diagnostic ?? "Inspect original creation.");
const original = await sdk.candidates.source(sessionId, ["src/example.ts"]);
// Build a bounded patch using only these original path/baseDigest values.
// Existing preview/stage/apply APIs still require their separate exact reviews.
```

`workspaces(sessionId)` lists compatible original resources. `workspace(id)`
reads independent retained metadata, including the planned path when creation
is partial; `stopWorkspace(id)` targets only its original creation.
`waitWorkspace` does not replay or delete resources and never implies success.
Unknown worker cleanup blocks deletion of original ownership and proposal
grants. Read-only source query receipts are scoped to their exact originating
session, not another project/profile-level blob store.

CLI uses `candidate workspace-preview NAME --session ID`, then
`workspace-create NAME --session ID --digest SHA --confirm-write`.
`candidate source PATH... --session ID`, `workspaces --session ID`,
`workspace-read ID` and `workspace-stop ID` inspect the exact selected Env.
Shared native TUI commands use `/candidate workspace-preview {"name":"Draft"}`,
`workspace-create {"name":"Draft","expectedDigest":"SHA"} confirm-create`,
`source PATH`, `workspaces`, `workspace-read ID` and `workspace-stop ID`.
Desktop displays the same root/base/build semantics and readiness errors.
Native private application never supplies the separate native-to-Local
publication/checkpoint acceptance.

For an interrupted standalone transport, `candidates.transports({sessionId?,
ownerId?})` lists up to 100 retained records, `transport(id)` reads its exact
metadata, and `reconcileTransport(id, expectedRevision)` performs bounded
read-only inspection against its original account/root/build/keyed journal.
Reconciliation accepts no force/risk-ack option and never replays files, Git,
VMs, scripts or models. Exact recovered receipts may confirm cleanup and retain
the original result, but the operation/candidate/job/resource stays partial;
original controller ACK and peer ACK evidence remain distinct. Missing or
unverifiable receipts stay quarantined. No unknown charge is refunded.

CLI uses `candidate transport-reconcile ID --revision N`; shared TUI slash
uses `/candidate transport-reconcile ID N`, with `transports` and
`transport-read ID` for original metadata. Desktop exposes the same read-only
receipt action. Attached compound-parent operations are not standalone
recovery targets, and physical native recovery is still gated by the documented
SendBox dependency.

### Owned fixed-model proposal generation

Protocol 31 additionally supports one bounded, tool-less Local draft from
original selected source files, not unsaved client edits. Select an available
fixed model in the source session first. The stage remains an explicitly
created clean managed worktree at the same HEAD.

```ts
const file = await sdk.workspaces.file(sourceSessionId, "src/example.ts");
const input = { task: "Describe the requested change", files: [{ path: file.path, baseDigest: file.digest }] };
const preview = (await sdk.candidates.generatePreview(sourceSessionId, stageWorkspaceId, input)).preview;
// The user reviews source/model/cost and session-owned proposal retention.
const started = await sdk.candidates.generate(sourceSessionId, stageWorkspaceId, input, preview.digest, true);
const generated = await sdk.candidates.waitGeneration(started.id!);
if (generated.generation.status !== "proposed" || !generated.proposal) throw new Error("Inspect the retained partial/stopped/failed outcome.");
const staging = (await sdk.candidates.preview(sourceSessionId, stageWorkspaceId, generated.proposal.patch)).preview;
const staged = await sdk.candidates.stage(sourceSessionId, stageWorkspaceId, generated.proposal.patch, staging.digest, generated.generation.id);
```

Application is still the separate review/application shown above. Inspect
`generation(id)` and stop the owned call with `stopGeneration(id)`.
Wait abort/timeout never cancels inference. Missing usage remains held and
raw invalid/stale output/actual charges remain inspectable. No retries or model
fallbacks. A changed patch cannot retain the `generationId` assertion.

The report has separate encrypted grants for original input, raw output and
canonical model provenance, but its lifecycle is owned by its originating
session and exact first PR association as described above. New candidate and
generation exports use version 10 with exact ownership/PR events; ordinary and
historical exports keep their prior formats. Bytes are immutable; metadata
edits remain available. Deleting the report prevents its
original command from calling a model again, even without its old receipt.
These retained data are not automatically promoted to solver context.

CLI: `candidate generate-preview INPUT.json --session SOURCE --workspace STAGE`,
then `generate INPUT.json` with the same selectors, `--digest` and
`--confirm-cost`. `generated|generation-wait|generation-stop ID` inspect the
same record. Stage accepts `--generation ID` only for unchanged verified model
output. SIGINT stops the exact generation and exits unsuccessfully for a
non-proposed outcome.

Shared examples:

```text
/candidate generate-preview {"stageWorkspaceId":"STAGE","input":{"task":"Requested change","files":[{"path":"src/example.ts","baseDigest":"FILE_SHA"}]}}
/candidate generate {"stageWorkspaceId":"STAGE","input":{"task":"Requested change","files":[{"path":"src/example.ts","baseDigest":"FILE_SHA"}]},"expectedDigest":"REVIEW_SHA"} confirm-cost
/candidate generation GENERATION_ID
/candidate generation-stop GENERATION_ID
```

Use actual IDs/digests. Desktop Candidates exposes source/model review,
independent-retention/cost confirmation, actual usage/stop and local proposal
loading before the two file reviews. TUI uses the same commands and
metadata-only artifact editor. Limits and actual recovery/migration semantics
are in [the generation contract](architecture/candidate-generations.md).
No compound kupo, quality calibration, Remote generation or Sandbox is enabled.

### Model context and thinking

`sessions.modelOptions(sessionId, options, observedRevision?)` stores optional
`contextWindow` and `thinkingEffort` alongside the session controls. Without
provider-declared discrete restrictions, the working window accepts exact
integer token ceilings from 8,192 through the selected model's fixed maximum.
An actual `supportedContextWindows` list remains an exact allowed set.
`supportsModelContextWindow(model, tokens)` is the shared browser-safe validator;
`modelContextWindows(model).values` gives menu presets or the actual declared
set, not an exhaustive list for unrestricted models. The window is enforced against
the maintained library's labeled context estimate and output/headroom sizing,
not represented as exact tokenization or a finite spend cap. Oversized estimates
stop before inference without silently dropping or compacting history.

Use the selected `provider.models[].thinkingLevels`, not a hardcoded effort
list. A transport may have reasoning but not expose configurable effort;
unsupported options fail explicitly. Omitting effort uses the model default.
`supportedThinkingEffort(preferred, supported)` and
`selectModelControls(controls, model)` are shared browser-safe selection helpers.
Fallback applies to an explicit model switch, not an unsupported same-model
effort request or permission to substitute a provider. The control plane
revalidates the resulting actual option before persistence/admission.
Disabling a selected model/provider atomically clears affected session
selections through existing `session.configured` events. Re-enable does not
reselect; drafts, held queues, actual admitted accounting and retained effort
remain independent. Registry availability and the shared
`routingModelReady`/`routingWorkingWindow` capability checks keep unavailable
models out of actual Kupo admissions.
Protocol 77 requires the explicit `model_selection_continuity_schema = '1'`
store marker; missing/corrupt or prematurely retained provenance is not repaired
from a numeric version. Standalone 77 still refuses future state. A separate
themes marker is not evidence that the model migration ran.
`sessions.context(sessionId)` reads an estimate including saved draft,
instructions, tools and conversation without calling a model. The normalized
provider payload stays service-side.

Desktop puts these settings in the model-name popover. TUI uses
`/model-settings` to inspect, `/model-settings JSON` to apply and
`/model-settings reset` to restore defaults. CLI uses
`session model-settings options.json --session ID --revision N` and
`session context --session ID`. Changes require an idle session; running turns
retain their selected settings and every step records effective provenance.

Shared `sdk.slash`, desktop and TUI also accept `/thinking LEVEL` and
`/effort LEVEL`; `default` clears only effort. `/context-window TOKENS|min|half|max`
preserves effort without changing the remembered model choice. `min` is 8,192
for an unrestricted model or its smallest declared window; `max` is its largest
supported window; `half` floors half that maximum and rejects an unsupported
result instead of rounding or clamping. Invalid/stale/running-turn changes
preserve controls and history, never infer or substitute another model, and
use the existing revision-bound `session.configure` transaction. Protocol 69
advances metadata only; no new event format or retained-content rewrite is
required.

To enable memory, clone `sdk.settings.get().values`, set `memory.enabled`, then
call `settings.update` with the observed revision. `memory.index(projectId)`
returns a job ID. Wait for a terminal job, inspect its status, and use
`mcp.readResult(jobId)` for the retained bounded result. Failure, partial work
and cancellation must not be interpreted as completion.

Project/worktree `memory.index/search/graph` are explicitly **Local**, never
an active-session env guess. Protocol 27 adds `memory.indexSession(sessionId)`,
`searchSession(sessionId, text, limit)`, `graphSession(sessionId, path)` and
`state(sessionId)` for the service-resolved actual Local/Remote root.
State/results expose typed env/profile/peer/path/device/inode/build and source
digest; unindexed Remote scope fails `memory_missing`, not a Local substitute.
Source validation uses the actual host's mtime/size/ignore policy; this is cheap
freshness, not a hostile timestamp-preserving content proof. Stale hit text
is empty, stale graph paths are omitted, and retrieved text stays untrusted.
Metadata and vector/chunk/graph rows publish atomically. Original canonical
index intent/receipt is event-first; restart or a missing receipt cannot
recapture the job. A stop/result-retention failure after publication remains
partial and inspectable through `memory.state`.

Optional `memory.useInContext` uses that same session binding and whole bounded
hits, never truncated JSON/history. Direct model search and builtin MCP
`search_memory`/`memory_graph` share current source/policy checks. The expanded
builtin Remote resource needs a new explicit grant; old two-tool grants do not
widen. The worker validates prepared scope/query/tool/root before echoing
approved cache data through its owned connector. No provider/refresh/private
SSH credential is copied for memory. See [the memory contract](architecture/remote-repository-memory.md).

## Repository script assessments

The owning model uses `review_script` to receive the entire exact Local file,
qualified Sandbox private-stage file or approved public raw URL before recording
an explicit safe/unsafe assessment. Native URL reads stay in the actual guest,
behind its approved website scope and enforced proxy, never a controller fetch.
Findings may be descriptive; a nonempty list does not imply an unsafe verdict.
`run_script` still needs the original source/root, owning attempt and normal
execution policy. Model advice never grants permission.

Actual user clients share:

```ts
const { review, text } = await sdk.scriptReviews.read(sessionId, reviewId);
await sdk.scriptReviews.approve(
  sessionId, review.id, review.source.digest, review.revision,
  sdk.sessions.get(sessionId)!.revision,
);
```

Approval accepts only the current exact safe assessment and records
`script.review_approved` with the actual user, command, digest and source
revision. It does not advance the model review revision, execute code, grant
permission or resume inference. Unsafe assessments instead retain the separate
explicit `scriptReviews.force(...)` API and normal execution approvals.
Concurrent/stale decisions and changed source/policy fail explicitly.

Protocol103's native path requires a separately reviewed current worker image;
pre-103 native receipts do not qualify it. A native force uses one new model-free
owned guest over the same verified private stage. It never inherits Local
repository trust, copies a source checkout, changes hard policy or calls a model.
`review.nativeExecution` retains the exact execution/workspace/turn/step and
distinct private/guest root digests. The same read response's optional
`executionResult` exposes a retained original observation, including after
restart; it is not permission, successful VM cleanup or authority to replay.
Missing/interrupted completion remains partial/unknown. Remote and genuinely
root-less native script execution remain unsupported.

Inbox exposes one `script-review` attention entry per pending assessment;
desktop groups entries by their original session. Reading/deleting attention
never approves a source. Restart exposes retained pending assessments without
reinspection or inference. CLI/TUI share `/script-review approve ID REVIEW_REV
SHA SESSION_REV confirm-reviewed`, plus `list`, `read` and explicit unsafe
`force`. See the [source/approval contract](architecture/content-review.md).

## Skills, scripts and plugins

Standard skills are `SKILL.md` files with YAML `name` and `description`, followed
by Markdown instructions. Imports start disabled and grant no permissions.
Enabled skills contribute identified metadata/digests; `use_skill` loads one
selected complete body on demand. Neither metadata nor body grants permission.
Model proposals retain their model actor and base digest. Human approval
installs disabled content; enabling it is a separate explicit action.

A version-1 plugin is a declarative skill bundle:

```json
{
  "schemaVersion": 1,
  "name": "example-conventions",
  "version": "1.0.0",
  "description": "Project conventions",
  "skills": [
    "---\nname: example-style\ndescription: Explicit result types\n---\nPrefer explicit result types at public boundaries."
  ]
}
```

Enable the plugin before any bundled skill. Disabling the owner prevents its
contents from entering context. Arbitrary JavaScript entrypoints, dependency
installation and unattended self-modification are not implemented. Reviewed
repository-backed marketplace updates and complete disabled bundle rollback use
the separate protocol-41 `marketplace`/`capabilities` surface above; the legacy
skill-only `plugins import` format does not silently acquire new capabilities.

Approved custom scripts are Node modules receiving JSON on stdin:
`{"arguments":{},"projectRoot":"/approved/project"}`. They emit bounded stdout,
must exit, and are exposed as `script.CAPABILITY_ID` through the internal MCP.
They are **unsandboxed Local host code**. Review the exact source, enable it,
then approve each call. The source digest is part of the discovered schema
fingerprint; an old approval cannot silently execute changed content.

## One native MCP

```bash
node bin/moguri.mjs mcp --session SESSION_ID
```

Configure that command as a stdio MCP in another client. It exposes only
`moguri_discover_mcps`, `moguri_find_tools`, `moguri_auth_status`,
`moguri_call_tool`, `moguri_read_result`, `moguri_find_skills` and
`moguri_read_skill`. It cannot change settings,
credentials, permissions or answer its own approval. Calls wait for the human
in the bound idle session, then retain a paged result.
Skill discovery/read instead uses freshly checked configured sources, without
a model call or new capability installation. Skill text is untrusted guidance,
not approval for its instructions or bundled scripts.

Protocol-24 development also exposes `mcp.servers(sessionId?)` as authoritative,
non-connecting metadata for the model gateway, outward MCP, CLI and clients.
`configured` is not entitlement or permission; Remote resources separately
report `review-required`, `access-required` or `unready`. Listing reads no
access credential and does not execute a configured MCP.

`mcp.remotePreview(sessionId, serverId)` returns the exact profile-bound
host/port/key/root/resource and revision/digest review without reading a token.
After explicit human review, `grantRemote(sessionId, serverId, digest,
settingsRevision, forwardAccess, true)` saves the peer/resource grant.
`forwardAccess` is independently false unless explicitly selected; an HTTP
bearer can be long-lived and a remote host can retain it. Refresh credentials
are never transferred. Probe the changed target and rediscover the scoped
catalog before `mcp.call`; Local or stale schema digests cannot authorize it.
The external call needs no model and still waits for its own exact approval.

`mcp.remoteCalls(sessionId)` and `remoteCall(sessionId, operationId)` expose
original actor/command/execution and retained result, including unknown access
or partial effects. Results are bounded to 2 MiB; ordinary `readResult` pages
the corresponding job. `revokeRemote(sessionId, serverId, settingsRevision,
true)` needs neither a ready host nor current permission to execute. Explicit
`remote.reconcile(executionId)` can retain an original late result without
re-reading access, replaying a connector or promoting a partial owning turn.
The same user controls are available through `/mcp-remote` and desktop's
**Remote MCP access**, never outward model settings/approval tools.

Backend MCP transports are stdio and Streamable HTTP, using no auth or a scoped
OS-keychain bearer credential or explicit OAuth. HTTPS is required except explicitly configured
loopback HTTP. Discovery
is bounded to 512 tools/64 pages, with 20 tools per SDK response. Tool schemas
and server versions are fingerprinted and rechecked at invocation. Credentials
are not forwarded through environment variables to stdio children.

Set HTTP `transport.auth` to `"oauth"`. `mcp.oauthBegin(serverId, sessionId?)`
returns the authorization ID; `mcp.oauthStatus(id)` exposes its ephemeral URL
and lifecycle. Open that URL only on explicit user action. `oauthCancel(id)`
settles a flow; `oauthClear(serverId, sessionId?)` removes its credential bundle.
`oauthClient(serverId, clientId, issuer, clientSecret?, sessionId?, redirectUri?)`
stores a registered client in the secret backend. Optional `redirectUri` must be
an exact fixed loopback callback registered with the issuer; no silent port
fallback. Do not put client secrets in settings or command-line arguments.

The official SDK performs S256 PKCE, issuer/resource discovery, registration,
exchange and refresh. Resource changes do not reuse another resource's key.
New grants require a durable connected decision before use. Cancel/expiry/
restart never replays a callback; revoked/failed refresh never retries a tool
or changes to anonymous/bearer auth. Project operations must include the bound
session ID, including outward auth-status queries.

The curated internal MCP exposes `grep_logs`, `fetch_page`, `search_memory` and
`memory_graph`. `grep_logs` searches a literal string in one UTF-8 source up to
1 MiB, returning at most 100 matching lines and 1,000 characters per line,
within 12,000 bytes of complete serialized MCP output rather than cut JSON.
Results disclose original byte offsets, clipped excerpts, omitted rows and
coverage; no match is a successful empty result. Native `read_file` pages exact
source, while `search_files` supports regex/larger sources. Selective
`read_file` arguments take precedence over `mode: "full"`: the 128-KiB source
cap applies only to actual unpaged full reads. Protocol 75 also returns
actionable, value-free schema diagnostics for invalid native-tool arguments.
The changed Remote builtin resource requires fresh user review; older resource
grants are preserved, not silently broadened.
Page fetching requires approved HTTPS, pins the resolved public
destination, rejects private networks/unsafe redirects and bounds extraction.
Tool descriptions, annotations, output and model recommendations remain
untrusted data, never permission grants.
Project-free discovery/calls exclude workspace tools and approved project scripts.

## CLI entrypoints

`moguri --help` lists the session/project/queue/plan commands.
Examples: `moguri slash "/read-only" --session ID`,
`moguri session rename NAME --session ID`,
`moguri queue hold prompt.txt --session ID`,
`moguri project get ID`, and
`moguri project set ID settings.json --revision N`.
Project-free/engagement commands include `moguri session create`,
`moguri metachat [REQUEST] --session ID`,
`moguri suggestions preview --session ID`,
`moguri suggestions generate --session ID --digest SHA256`,
`moguri configuration review ID`,
`moguri configuration apply ID --digest SHA256 --acknowledge-config-risk`,
`moguri inbox list`, `moguri inbox read ID` and `moguri inbox delete ID`.
The original `attention` spelling remains compatible.
Use `--all-projects` only after explicitly reviewing that wider source scope.
Destructive removal requires `--confirm-remove`; default publication requires
`--confirm-push`; repo MCP import requires `--confirm-review --digest SHA256`.
Queue mutations use their observed queue revision, not the session revision.

### Dependency cache and project tickets

```ts
const { plan } = await sdk.cache.inspect(projectId, "npm");
// Only after the user reviews the plan and accepts OSV metadata disclosure:
const preparation = await sdk.cache.prepare(projectId, "npm", plan.digest, true);
const result = await sdk.jobs.wait(preparation.id!);
if (result.status !== "completed") throw new Error(result.error ?? result.status);

const ticket = await sdk.issues.create(projectId, {
  title: "Add a generated feature", body: "", kind: "feature",
  phaseId: "backlog", pullRequestUrl: null,
});
await sdk.issues.move(ticket.id!, "in-progress", 0);
```

`cache.install` is a separate explicit action replacing `node_modules`, never
an automatic consequence of inspection/preparation. It repeats advisory checks,
uses private clean staging without project hooks/configuration, and rechecks the
lock before replacing the tree. npm requires an installed npm CLI; pnpm's native
launcher is pinned with Moguri. Only single-project npm lockfile 2/3 and pnpm
lockfile 9/public SHA-512 npm artifacts are qualified. Unsupported managers,
workspaces, Git/custom/private resolutions and required lifecycle scripts fail
explicitly. A clean advisory result is not a malware-free guarantee.

Boards are local, project-scoped and have no assignee. `issues.configure`
accepts `BoardConfig` plus its observed revision; occupied phases cannot be
removed. Linking a canonical GitHub PR permits bounded read-only observation
while Moguri runs, unless the board disables it. Choose the public API or an
explicit signed-in GitHub CLI account. A verified merge advances to
`mergedColumnId`; closed/unknown/failed checks and stale responses never do.

Protocol 62 adds optional
`kanban: {visible, source:"kanban"|"github-issues"|"github-prs", phaseIds}`.
Boards without a saved preference default hidden, with in-progress/backlog
eligible; explicit saved visibility is preserved.
`kanban.open(projectId)` opens/returns the one special idle chat, without
inference. `sessions.organize(id,{workItemId}, revision?)` links only a card from
that same project; set `workItemUrl:null` when replacing a GitHub item.

`kanban.continue(originSessionId, issueId?, expectedDraftRevision?)` is explicit
actual-user delegation for one Local task, isolated worktree, branch push and
draft PR. Optional draft consumption accepts only the exact continuation text
and revision, never unrelated edits/attachments. `kanban.work(runId)` reads the
independent source/report; `kanban.wait(runId)` waits only for preparation to
settle, not for the PR. `kanban.cancel(runId)` requests actual owned stop.
`kanban.inspect(runId,revision,true)` releases a terminal interrupted source
claim only after jobs/turns settle; it neither resumes nor deletes work.
Model/owner/caps, numeric account and source/root bindings are retained. An
exact `continue work` user submission uses this same path; held/recovered or
model-authored text cannot acquire it. Failed/restarted work never replays.
The model-only `project_work` tool reads paged board sources and publishes only
its already retained exact task. Publication ends the turn without another
paid call or executing remaining same-response tools.

Linear is off by default. Enable one team in the board, store the user's
personal API key with `linear.setToken` and explicitly call `linear.import`.
Each page imports at most 50 tickets, preserves provenance and existing local
edits, and returns a retained `nextCursor`. No local issue is exported and no
assignee/person data is requested. OAuth/two-way unattended synchronization is
not implemented. Credentials are never event payloads, draft text or model input.

CLI examples:

```bash
moguri issues list PROJECT_ID
moguri issues create PROJECT_ID issue.json
moguri issues move ISSUE_ID in-progress --revision 0
moguri issues configure PROJECT_ID board.json --revision 0
moguri kanban open PROJECT_ID
moguri kanban items PROJECT_ID github-issues 1
moguri kanban continue ORIGIN_SESSION_ID
moguri kanban work RUN_ID
moguri kanban stop RUN_ID
moguri kanban inspect RUN_ID --revision N --confirm-review
moguri prices
moguri prices refresh anthropic
moguri cache inspect PROJECT_ID npm
moguri cache prepare PROJECT_ID npm PLAN_SHA256 --accept-dependency-metadata
moguri cache install PROJECT_ID npm PLAN_SHA256 --accept-dependency-metadata
moguri linear import PROJECT_ID
```

`issue.json` has exactly `title`, `body`, `kind`, `phaseId` and nullable
`pullRequestUrl`. `board.json` has `columns`, `mergedColumnId`, `autoRefreshPrs`,
`githubAccess`, `linear: { enabled, teamId }` and optional `kanban`.
Update/move/archive/configure
require the observed `--revision`. `linear token` reads piped stdin instead of
shell arguments; TUI `/linear token` uses a dedicated masked editor.

### Client lifecycle

`node bin/moguri.mjs --help` lists supported commands. A normally installed
package also supplies the `moguri` executable. `moguri status` exposes project
and session IDs without printing transcripts or connection credentials.
`config`, `prompt`, `memory`, `skills`, `plugins`, `mcp`, `agents`, `dictate`
and `service` are SDK adapters. A published desktop binary is supplied separately;
starting desktop from source requires the development Electron dependency.

The TUI's **Ctrl+G** exposes shared settings. Its JSON editor includes all
sections and rejects stale revisions. **Ctrl+Enter** explicitly acknowledges
prompt risk and saves; **Ctrl+R** restores; **Esc** discards that local editor.
See [setup](setup.md) for terminal commands, dictation and supported limitations.
