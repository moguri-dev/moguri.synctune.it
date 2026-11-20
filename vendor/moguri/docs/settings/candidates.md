# Candidates

Technical reference for **Settings / Candidates**. The app shows a short summary;
this page keeps the full detail.

## Repository candidates

Contracts: `docs/architecture/candidate-workflows.md`, `docs/architecture/candidate-primitives.md`,
retention in `docs/architecture/candidate-cleanup.md`.

- Proposals are staged in a separate owned worktree (or, for Remote/Sandbox, a separately reviewed owned
  Env resource). The user reviews the exact bytes before publishing to the source. Manual staging and
  application use no model; optional generation is explicit and metered. No commit or push happens.
- Checks cover roots, bases and exact bytes. No project tests or code-quality validation is implied.
- Candidates and generation proposals are permanently deleted with their originating session or after
  fresh verification that their exact linked PR merged. Archiving alone preserves them. Ordinary
  artifacts, applied code, worktrees and PRs keep their own lifecycle.
- While eligibility is checked, the panel verifies the exact selected Env, source and readiness. No
  previous root, controller Git or Local fallback is inherited. Retained proposals remain readable even
  when creation is disabled.
- Candidate cleanup settles exact owned work before deletion. Until deletion completes, retained
  proposals remain inspectable.
- Editing requires an agent-mode session with no owned work running. Read-only and side-session
  restrictions stay enforced by the service.
- When the source scope changes (project, Env, workspace, mode, policy), the unsaved proposal is preserved
  but cannot be staged into another root. The user copies it or explicitly discards and reloads.
- Loading a model proposal requires the exact compatible Local source (same root, project and
  workspace) and no unsaved edits. Loaded bytes are local only; staging and source application remain
  separate actual-user actions, and no model or file write starts on load. Changing the summary or files
  clears verified model attribution.
- Staging requires a clean worktree and the exact original Env and base. Local worktrees are created or
  selected explicitly in Project settings or with `/workspace create BRANCH`; Remote and Sandbox use the
  separately reviewed owned Env resources. No branch is silently created or adopted.
- The staging preview shows the source root, the owned stage root and the exact base; staging does not
  accept or apply the files.
- A failed or partial stage reports its diagnostic; the user inspects the retained roots and original
  job. No success or rollback is inferred.
- For Sandbox candidates, application changes only the original owned private native snapshot. It does
  not accept or publish into the live Local repository; that remains a separate native-publication
  review in Settings > Sandbox.
- Legacy proposals with unknown origin ownership are not assigned to the current session; their report can
  be deleted explicitly in Artifacts.
- Provenance lines: a candidate derived from a public compound role points to the separate retained
  workflow for actual tests and critic observations; one derived from a final model role or a canonical
  model generation records that origin. Imported proposals have unverified authorship. In every case
  provenance is independent of quality and of source acceptance. Accepted proposals record the actual
  user as the accepting actor; no commit or push is performed.
- Counters: staged paths, source attempts and confirmed source publications. A partial application may
  already have published files; no rollback or retry occurs. Inspect both captured roots before an
  explicit existing workspace or session recovery action.
- The apply review is a fresh source/base/policy check with its own digest. Applying is a separate
  actual-user action, not a validator or model decision.
- Export saves the exact candidate and history; stored copies and source files are unchanged.
- A successful stage remains separate from the source until an exact apply review.

## Remote and Sandbox staging areas

Contract: `docs/architecture/candidate-transports.md`.

- Each resource is created explicitly after a review. Remote uses a detached peer Git worktree; Sandbox
  uses only its original private snapshot. No branch, live Local source, source acceptance or
  native-to-Local publication is implied.
- Resources are retained independently when a proposal or session is removed.
- If creation is unconfirmed, the resource is preserved; no resource is replayed, adopted or removed.
- While working, the panel waits for the original owned operation and its exact receipt. No model is
  called.

## Interrupted Remote and Sandbox operations

Previously titled "Original transport receipts". Contract: `docs/architecture/candidate-transports.md`.

- Read-only reconciliation reads only the original pinned worker, root, journal and retained key. It
  never reruns files, Git, models or tests, never starts or stops a guest, never switches Env, never
  accepts source and never upgrades a partial operation into success. Missing cleanup proof stays
  quarantined ("cleanup unconfirmed; ownership remains quarantined").
- Status fields (old labels in parentheses): whether the controller recorded the terminal-ACK event
  ("Original controller terminal-ACK event"), the peer journal status ("Original peer status"), the peer
  ACK cursor as acknowledged/sequence ("Peer ACK cursor") and the retained terminal frame sequence
  ("Retained terminal frame").
- A transport owned by a public compound parent cannot be reconciled standalone, because standalone
  reconciliation cannot adopt its model, test or cleanup authority.
- Reading status involves no operation replay and no risk acknowledgement.

## Generate a proposal with a model

Contract: `docs/architecture/candidate-generations.md`.

- Generation uses the selected fixed model (not kupo or a synthetic model). There is no provider or Env
  fallback.
- Generation sends the original reviewed source files, not unsaved proposed edits, and never stages,
  applies or executes its output.
- If the source scope changes, the task belongs to an older scope; the user copies or discards it before
  reviewing another root.
- The review shows selected files, estimated input tokens and the maximum output tokens.
- Consent previously read: "I approve one model call and proposal retention until explicit report
  deletion, originating-session deletion or verified exact linked-PR merge. No file write is approved
  here."
- The generation report survives the panel; source and staging remain unchanged.
- Usage: when usage is unreported, the reserved tokens remain held. No provider bill is inferred.
- Generation output is untrusted model output, not a user answer, file approval or quality claim.
- Loading requires the original compatible Local source and the ready captured staging worktree. The
  service rechecks current bases before staging. Unsaved drafts are never silently replaced.
- Saving settings or selecting a report never calls a model.

## Load a proposal from a model role

Contract: `docs/architecture/role-proposals.md`.

- Inspects the final actual draft, revision or escalation of a completed retained role sequence. No
  workflow or model call starts here; provenance is not quality or user acceptance.
- Staging retains this origin and its input and raw result separately. Editing clears verified
  attribution; source application still needs its own review.
- Loading requires a compatible original Local source and a ready captured staging worktree. Retained data
  stays readable; the service rechecks current policy and exact bases before staging. Retained model
  bytes never silently replace an unsaved draft or task.

## Cascade / Critique

Previously titled "Reviewed Cascade / Critique". Contracts: `docs/architecture/compound-workflows.md`,
`docs/architecture/compound-routing-primitives.md`, `docs/architecture/owned-role-contracts.md`.

- Roles and reviewed project scripts execute on the selected Env. Local and SSH commands do not imply OS
  isolation. Sandbox uses its original owned private snapshot, never controller Git. Exact project-test
  approval and source application are separate decisions.
- The panel previously showed the full `COMPOUND_EVIDENCE_WARNING` (packages/protocol/src/compound.ts):
  "Lineage eligibility is an actual-user-reviewed source claim, not proof about unobservable training or
  model quality. Provider declarations, aliases and matching output contracts are not that review.
  Passing project tests covers only those commands and exact bytes; critics do not grant permissions or
  accept source changes."
- Readiness: running requires an explicitly reviewed Compound routing policy, qualified owned stages on
  the selected Env, a Git-backed project, an allowed Env and kupo as the chat's model. Readiness failures
  block execution; the panel never changes Env, model, autonomy or budgets.
- If the source owner (profile, chat, project, workspace or Env) changes, the unsaved task stays visible
  but cannot be sent into another project; copy it or explicitly discard it before a new review.
- Input limits: at most 20 paths. Selected bases must match the exact clean reviewed stage base. Original
  composer drafts, attachments and held prompts are not consumed or implicitly included. Env resources
  and project scripts must be created and configured explicitly.
- An existing path that is absent on the selected Env must be reviewed as a new file explicitly; no
  different root is read.
- Role bounds: 8 KiB role results and 16 KiB complete validation context. All-role usage is metered;
  estimates are not exact billing. Starting approves no file, test or source application.
- Consent previously read: "I reviewed this exact source/context, eligible models, privacy policy and
  possible model cost. Staging, tests and source acceptance stay separate."
- Outcome line previously: "Classifier selected PATTERN" or "No route accepted"; no source acceptance or
  Git operation is implied by a workflow outcome.
- Role output is untrusted role data, never a user answer, permission or quality proof.
- Validation fields: decision actor, whether the test was dispatched, exit code, and whether the candidate
  bytes were unchanged by the test run.
- Test review warning per Env: Sandbox runs on the actual native guest's private candidate snapshot, not
  the live Local repository; Remote runs on the original pinned SSH peer, not the controller, and SSH is
  not OS isolation; Local runs on the Local host, not in Sandbox. No automatic dependency install. Hard
  denials and folder restrictions still win.
- Only the reviewed bytes and the exact configured command are proposed. Passing tests and critic advice
  do not accept source changes.
- Test consent previously read: "I reviewed the exact candidate bytes, owned root and host command.
  Approve this staging/test only, not source application."

## Budget wind-down checkpoints

Contracts: `docs/architecture/budget-winddown.md`, `docs/architecture/winddown-primitives.md`,
`docs/architecture/owned-model-transports.md`.

- Reserved capacity is not a model call. The bounded, metadata-only finishing role cannot accept code or
  approve Git. Checkpoint branches require source bytes accepted by the actual user plus a separate
  exact review. No checkout, push, merge or branch deletion happens.
- Status fields (old labels): "Actual finishing model", "Env", "Observation" (step state), "Original
  turn", and for v2+ records "Original owned execution" and worker digest.
- The finishing model input and result are untrusted model data, not a user answer, validation proof or
  Git authority.
- Commit fields: the actual user's Git intent (branch and base), prepared commit, published commit ("not
  acknowledged" when unconfirmed), whether publication was attempted and whether cancellation was
  requested. A partial job is never replayed or rolled back.
- Partial publication: the original writer remains quarantined. The user reads its exact source/ref and
  retained effects, then separately acknowledges that inspection. This cannot complete or replay the
  interrupted job. After acknowledgement the original partial job and its charges remain unchanged, and
  current policy and any other inspection gates remain authoritative.
- Inspection consent previously read: "I reviewed only this original settled writer and exact current
  source/ref. Keep the job partial and all charges; no replay, rollback or PID cleanup claim."
- Inspection fields: publication Env, root, current exact ref ("absent" when missing), prepared commit and
  published receipt.
- For Remote and Sandbox records, finishing metadata comes from the original worker. It is not task
  completion, source acceptance or Git authority, and Local checkpoint helpers cannot publish to a
  different root.
- The user must use the exact original restored Local source agent after owned work ends (agent mode, not
  read-only, not archived, no running turn, allowed Env). A deleted, moved or project-free source cannot
  inherit another checkout.
- Sandbox: first publish exact native output through its separate actual-user source review (Settings >
  Sandbox). The checkpoint then creates a new Local Git branch only in that original source repository.
  It never runs Git in the guest or substitutes a checkout.
- Remote: the user separately accepts exact peer bytes (not Git permission or task completion); Git then
  needs its own new-branch review on the peer.
- Local: only retained candidates applied and accepted by the actual user are selectable, never a merely
  staged or model/critic-approved proposal. The commit implies no new project tests or code-quality proof.
- Commit consent previously read: "I reviewed these exact accepted bytes, execution boundary, root, base,
  new branch and Git message. Preserve source index/HEAD; no push or merge."
- After admission, the actual user's Git intent is recorded; inspect its verified result or partial
  publication. No second model is called.
