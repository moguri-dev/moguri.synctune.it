# First-milestone acceptance and roadmap

## Milestone 1 accepted, 2026-11-15

<a id="remaining-first-milestone-acceptance"></a>
<a id="merged-code-audit-2026-11-06"></a>
<a id="merged-code-audit-2026-11-10"></a>

Milestone 1 is accepted on draft
[#68](https://github.com/mbianchidev/moguri/pull/68) at final cut `18e3f78`
(protocol 106, `0.32.0-alpha.1`, SendBox 0.2.7), with native runs at
`e67faf5` whose runtime and native harness bytes are identical. Every required
nominal cell, native gate and milestone criterion passes.
[#39](https://github.com/mbianchidev/moguri/issues/39) owns this acceptance;
#17 was consolidated into it. Merging #68 delivers it to `main`.

### User-directed scope revision

Hosted-main CI stayed blocked before any job step by account billing (latest
run [43652897223](https://github.com/mbianchidev/moguri/actions/runs/43652897223)).
On 2026-11-15 the user explicitly chose to **accept full local
source/desktop/native evidence instead of hosted CI** for Milestone 1. The
former "fresh authorized hosted-main CI pass" gate is therefore replaced by
the complete local runs below; it was not silently dropped. CI remains
main-push-only, and a future hosted run is ordinary regression evidence, not
a Milestone 1 prerequisite.

### Acceptance gates

- [x] Criterion-by-criterion integrated qualification against the unchanged
  specification, with exact source/builds, cross-client ownership,
  failure/restart/migration and supported/unavailable outcomes (table below).
- [x] All 6,720 required Local/SSH source cells and the full source suite at
  the final cut.
- [x] All 3,360 native Sandbox cells in one whole-matrix run on the current
  approved worker image, plus every native control/role/input, loss, cleanup,
  candidate, finishing, client and concurrency case, and the previously
  deferred native desktop paths.
- [x] Full hidden desktop suite, packed external SDK consumer and dependency
  audit at the final cut.
- [x] Local evidence in place of hosted CI, per the user-directed revision above.

Exact identities, results and retained report hashes are in the
[final qualification record](architecture/milestone-combination-matrix.md#final-qualification-2026-11-15).

| Run | Result |
| --- | --- |
| Ten physical native gates | 10/10 pass |
| Native nominal matrix | 3,360/3,360 pass in one run (1,056 guest executions with owned-guest teardown, 2,304 pre-admission refusals) |
| Native combination file | 3,483/3,483 pass |
| Native SDK/TUI/script/loss cases | all pass (one test-isolation defect fixed and retained) |
| Native hidden desktop | 26/26 pass |
| Full source suite (incl. 6,720 Local/SSH cells) | 10,908 pass, 66 native-gated skips, 2 load-timing failures that pass on rerun (6,720/6,720 Local/SSH cells PASS) |
| Full hidden desktop suite | 433 pass, 12 skips (11 native-gated pass natively; packaged CLI passes), 0 failures |
| Packed SDK consumer, audit | PASS; 0 vulnerabilities; packaged app verified |

### Criterion-by-criterion record

Each criterion is from the [milestone acceptance criteria](implementation.md#milestone-acceptance-criteria).
The cited files ran in the full source suite; native rows also ran on the
physical guest.

| Criterion | Executable evidence |
| --- | --- |
| TUI-created sessions are controllable in desktop and vice versa | `tui.test.ts`, `tui-milestone-combinations.test.ts`, `reconnect.test.ts`, `client-negotiation.test.ts`; hidden desktop `milestone-combinations.spec.ts` over the same SDK |
| Restart loses no admitted/queued messages, drafts, artifacts or promised terminal state | `recovery.test.ts`, `queued-recovery.test.ts`, `draft.test.ts`, `terminal-recovery.test.ts`, `terminal-reattachment.test.ts`, `service-startup-resumption.test.ts` |
| Managed worktrees without coupling worktree and session deletion | `managed-workspaces.test.ts`, `git-managed.test.ts`, `repository-workflow-defaults.test.ts` |
| Queue editing/claiming under concurrent clients | `queued-drafts.test.ts`, `queued-continuation.test.ts`, `delivery.test.ts` |
| Distinct Interrupt, Steer and Queue semantics | `delivery.test.ts`, `active-message-delivery.test.ts` |
| Cancellation stops or reports failure to stop the owned process tree | `supervisor.test.ts`, `program.test.ts`, `command-jobs.test.ts`, `native-tree.test.ts` |
| Artifacts survive source-session archival and deletion | `artifacts.test.ts`, `session-retention.test.ts`, `artifact-materialization.test.ts` |
| Profile isolation of credentials, projects, policies, artifacts | `profiles.test.ts`, `profile-store.test.ts`, `profile-controller.test.ts`, native `native-profiles.test.ts` |
| Dashboard totals trace to immutable events | `telemetry-dashboard.test.ts`, `dashboard-overview.test.ts`, `budget-metering.test.ts` |
| Estimated, provider-reported and billed costs never conflated | `budgets.test.ts`, `provider-pricing.test.ts`, `stream-metrics.test.ts`, `ds4-compatibility.test.ts`; every matrix cell asserts null billed USD |
| Every transition and failure produces a diagnostic event | `operation-telemetry.test.ts`, `worker-failures.test.ts`, `retained-telemetry.test.ts`, `desktop-alerts.test.ts` |
| Unit, integration, migration, restart and cross-client coverage | The full suite's `*-migration`, `*-recovery` and `*-clients` files, plus actual TUI and hidden desktop suites |
| Factory defaults and identical default resolution across clients | `model-defaults.test.ts`, `model-defaults-state.test.ts`, `session-controls.test.ts`, `settings-controls.test.ts` |
| Allowed-env enforcement and the running-Local-turn exception | `profiles.test.ts` (atomic global environment policy), `platform.test.ts`, matrix policy cases |
| No host fallback, unprotected model request or false cleanup on SendBox failure | `sandbox-runtime.test.ts`, `sandbox-recovery.test.ts`, `sandbox-containment.test.ts`; native gates N3/N7 |
| Fixed model and Kupo independent of autonomy, Env and budget | All 10,080 nominal cells; `guided-advice.test.ts`, `questions.test.ts` and the 160 actual-question cases |
| Kupo single, cascade and critique without violating constraints | `kupo.test.ts`, `kupo-combinations.test.ts`, `compound-envs.test.ts`, `candidate-envs.test.ts`; native candidate cases |
| Router, critic and decision calls accounted for and cancellable | `compound-ledger.test.ts`, `compound-cancellation.test.ts`, `kupo-recovery.test.ts`, `decisions-controller-loss.test.ts`, `decisions-transport-loss.test.ts` |
| Real actors and delegation; human/policy wins decision races | `decisions-authority.test.ts`, `decisions-policy.test.ts`, `approval-memory.test.ts`, `questions.test.ts` |
| All six typed attachment types with durable drafts and source permissions | `context-inputs.test.ts`, `document-attachments.test.ts`, `paste-files.test.ts`, `paste-file-state.test.ts` |
| Remote SSH runs agent work and model calls with truthful loss handling | `remote.test.ts`, `remote-transport.test.ts`, `remote-recovery.test.ts`, `profile-remote-roots.test.ts`; 3,360 SSH cells |
| Token/USD caps, all roles, late telemetry and authorized wind-down | `budget-plan-batches.test.ts`, `kupo-budgets.test.ts`, `decisions-budgets.test.ts`, `winddown-commit.test.ts`, `winddown-budget.test.ts` |

### Not claimed

Acceptance uses generated inference and fixtures. It does not claim live
provider/decision quality, calibrated independence or confidence, actual billed
cost, public signing/notarization/distribution, Linux release readiness or a
hosted CI pass. Jev's missing enforceable wire stays blocked; optional Laya is
not a milestone gate.

## Delivered on main, not remaining implementation

| Delivery | Current executable scope and evidence |
| --- | --- |
| #51; closed #36/#37 | Shared runtime/hardware readiness, one-use reviewed executable probes, exact pooled window/effort, finite all-role reservations and reviewed Local/SSH/private-native candidates. Shared sessions, queues, profiles, independent artifacts, worktrees, typed context and Ghostty ownership already exist. |
| #52; closed #7 | Retained exact-PR CI watches, deduplication, original observations, loss/restart recovery and notifications across SDK/CLI/TUI/desktop. [PR/CI contract](architecture/github-workflows.md#protocol93-qualification). |
| #56; #38 is closed | Complete required Local/SSH source cell/criterion mapping, GitHub/input and control repairs. The [matrix](architecture/milestone-combination-matrix.md) retains all 10,080 nominal cells as the opt-in full product; #56 itself disclaimed native acceptance, which the final qualification later completed. |
| #57 | Narrow actual DS4/DeepSeek compatibility and cache-accounting evidence, not a general model-quality/capacity or all-Env claim. [Exact contract](architecture/ds4-compatibility.md). |
| #58; closed #9 | Unified authorized cross-repository GitHub My Work inbox, distinct from the existing active-session dashboard and the session notification Inbox. Refresh is read-only and profile/account/repository-bound. [My Work contract](architecture/my-work.md). |
| #59; selected #23 slice | Original-owner startup/reconnect, background-window lifecycle and opt-in metadata-only OTLP traces/metrics over control-plane records. Export is off by default; logs, content capture and peer/guest-internal auto-instrumentation are not implemented. [Startup](architecture/startup-responsiveness.md) and [OTLP](architecture/otlp-export.md). |
| #60; closed #13 and selected #45 slice | Governed complete Local skill-source admission/provenance/least privilege/revocation, justified complete-source/envelope limits, per-turn checkpoints and reviewed Local/pinned-SSH/private-Sandbox rewind. Also actual named skill-load indicators, session Inbox and centered empty states. [Source/rewind](architecture/skills-and-rewind.md) and [Inbox/load](architecture/session-inbox.md) contracts. |
| #71; closes #63 | All five #63 connection options through the shared service, SDK, desktop and TUI: GitHub Copilot (unchanged), OpenAI-compatible endpoints with custom headers, header-scoped keys and explicit-only models, OpenRouter (key or sign-in), the Anthropic API (key only; Claude.ai sign-in and subscription tokens refused) and OpenAI API keys separate from Sign in with ChatGPT. Separately decided D36 adds off-by-default Claude Agent and Codex Agent harnesses that run the user's own CLI. Tested against generated fakes only, not real accounts. [Hosted provider](architecture/hosted-providers.md) and [agent harness](architecture/agent-harnesses.md) contracts. |
| #72; closes #69 (owner sign-off 2026-11-16) | [D38](architecture/decisions.md#d38-covering-array-milestone-regression): `npm test` runs a checked-in 78-cell covering array (pairwise plus Env x selection x budget/input/effort tuples and the 15 client journeys) and 72 exact manual-Kupo-effort refusals instead of the 10,080-cell product; the full product is opt-in `npm run test:matrix`. Milestone 1's full-product acceptance is not re-qualified or relabeled. [Method and measured times](architecture/milestone-combination-matrix.md#regression-method-covering-array). |
| #81; closes #12 | Optional, off-by-default [Stainless integration](architecture/stainless.md) ([D39](architecture/decisions.md#d39-moguri-owned-stainless-automation)): Info.plist-only detection, a user-run headless compatibility check, owned headless `playwright` batches with a disposable profile and bounded console/network diagnostics, and Open in Stainless for Local previews across SDK, desktop, TUI and CLI. Stainless has no MCP yet; that is #80. |
| #78; closed #45/#23 (2026-11-19) | The remaining applicable #45 AST controls with owner-signed exclusions ([D40](architecture/decisions.md#d40-owasp-agentic-skills-top-10-follow-up-45)) and the remaining #23 OTLP scope ([D41](architecture/decisions.md#d41-otlp-logs-credential-headers-and-coverage-23)), both described below. |
| #86; closes #82 | Protocol 114 Skills and Artifacts tabs next to Automations ([D49](architecture/decisions.md#d49-skills-and-artifacts-workspace-tabs)): skill toggles, digest-bound disabled installs from configured skill sources, built-in toolsets, user- or agent-written script tools, local repeated-task tool suggestions with an off-by-default recurring check, and a metadata-only per-project artifact library linked to each chat. [Contract](architecture/skills-tools-artifacts.md). |
| #90; closes #84 | Settings rail reduced from 11 groups / 37 entries to 7 groups / 28 ([structure](design.md#settings-rail-structure)). Integrations (GitHub, Linear, MCP gateway, sql-not-so-lite, Stainless, Plugins, Marketplace) and Interface (Appearance, Keyboard shortcuts, Voice dictation, Notifications) are single rail entries with WAI-ARIA keyboard tabs; integration tabs show text status from already-loaded state. Item ids, deep links, restored layouts, search, save rules and dirty-state blocking are unchanged; no schema change. Covered by `tests/settings-navigation.test.ts` and the hidden `tests/e2e/settings-navigation.spec.ts`. |

Closed #35 keeps its historical exact-artifact scope. Closed #22 is a completed
Rust feasibility study, not production adoption; #1 is reference material.
No closed implementation/research issue certifies first-milestone acceptance.

## Ordered remaining roadmap

Ordering is triage, not permission to implement or an invented dependency chain.
Delivered #7/#9/#12/#13/#23/#36/#37/#38/#45/#53/#55/#63/#69/#82/#84 do not reappear as new implementation work.
#53's audit, visual system and UI/UX polish are recorded in the [design audit](design-audit.md);
#55 smart compaction is on by default since protocol 110 ([D31 revision](architecture/decisions.md)).

| Order | Actual remaining scope |
| --- | --- |
| 1. Everyday UX and existing integrations | #77 app-wide accessibility verification (screen reader, WCAG 2.2 AA, keyboard/focus, physical-display contrast), deferred from #53. |
| 2. Distribution and docs | #26 Homebrew cask/access/install/update ownership; #14 landing/downloads/user/developer site. The owner chose the MIT license, a hybrid local-build/CI-publish [release process](releasing.md) and a Homebrew cask on 2026-11-19; the repository stays private for now. The cask waits for a published public release, and signing/notarization still needs a decision. |
| 3. Optional providers and automation | #80 Stainless MCP integration once mbianchidev/stainless#22 ships, #34 Laya, #6 recurring/declarative workflows, #8 dependency roundups, #10 continuous personas, #11 bounded specialized presets, #46 Slack mentions, #85 phone steering over Tailscale Serve (scoped paired gateway and PWA client; `/remote` is already the SSH command), #54 GetMoshi integration and #64 global/repository flags for evidence-gated flaky-CI retries (provider status preflight, bounded attempts) and feature-preserving conflict resolution. Existing one-time schedules, exact-PR CI watches (#52), the reviewed rebase/conflict workflow and reviewed compaction are not those broader features. |
| 4. Separate product | #67 `moguri-assistant`, a separate repository embedding the shared SDK as a personal assistant (calendar, mail, messaging, releases, browser and more). Not started here; each external tool needs its own credential, permission and data-handling decision. |

Protocol 112 delivers the remaining #23 scope ([D41](architecture/decisions.md#d41-otlp-logs-credential-headers-and-coverage-23)):
opt-in fixed-template diagnostic logs correlated with trace/span IDs, finite
failure outcomes, correction logs instead of duplicate spans, secret-backend
credential headers bound to the collector origin, measured per-turn overhead and
the [process/Env coverage matrix](architecture/otlp-export.md#process-and-env-coverage-matrix-protocol-112).
SSH-peer and Sandbox-guest internal propagation stay an explicit documented gap,
content capture stays out of scope, and there is still no second ledger.

Protocol 112 also delivers the remaining applicable #45 controls
([D40](architecture/decisions.md#d40-owasp-agentic-skills-top-10-follow-up-45)):
a deterministic source indicator scanner that gates model-approved scripts
(the user may accept the risk) and refuses hidden-character trusted-folder
loads, per-profile saved publisher keys with permanent key/version blocks, and
generated-model AST01 qualification. The project owner signed off on
2026-11-17 on excluding a transparency log/PKI, Local whole-descendant
isolation, malware/semantic scanning beyond the deterministic rules and
live-model testing. Remote reviewed scripts stay unsupported, while Remote
SSH sessions now load skills on demand
([D42](architecture/decisions.md#d42-remote-skill-packages-over-ssh)): the same
admission rules as Local, with the complete admitted package copied to a
digest-named folder on the SSH host and its scripts run through normal command
approval. The
[AST category matrix](architecture/file-access.md#owasp-source-and-review-boundary)
records controls, evidence and those exclusions. Neither change is OWASP
certification or a claim of zero risk. Protocol 112 also lets a user steer move
a running agent command to the background instead of waiting for it
([D43](architecture/decisions.md#d43-steer-backgrounded-commands)), and every
client asks before archiving or deleting running sessions
([D44](architecture/decisions.md#d44-confirm-before-stopping-running-sessions)).
Code Change adds status-gated Address code review, Fix merge conflicts and Fix
CI actions for linked pull requests
([D45](architecture/decisions.md#d45-pull-request-follow-up-actions)).
Archiving now removes a clean, fully pushed session worktree and its local
branch, and restoring recreates it
([D46](architecture/decisions.md#d46-clean-pushed-worktrees-when-archiving)).
An optional virtual disk caps the space new session worktrees can use, cleaning
up archived pushed worktrees and then pausing work when it fills
([D47](architecture/decisions.md#d47-moguri-virtual-disk-for-session-worktrees)).
It covers worktrees only; age/size deletion policies for the encrypted session
store remain deferred. Queued prompts now look like sent prompts, edit in place
with every attachment source, and Send now steers them into the running turn
([D48](architecture/decisions.md#d48-queued-prompts-look-like-sent-prompts-and-edit-in-place)).
Protocol 114 adds Skills and Artifacts tabs next to Automations (#82,
[D49](architecture/decisions.md#d49-skills-and-artifacts-workspace-tabs)):
skill toggles, installs from configured skill sources, toolsets, user- or
agent-written script tools, repeated-task tool suggestions with an optional
recurring check, and a per-project artifact library linked to each chat. A
hosted multi-publisher gallery and recurring prompt/workflow schedules (#6)
remain open.

At the live read the repository is private and has no GitHub releases. It is
MIT-licensed, with a tag-triggered [release process](releasing.md) whose first
run waits for GitHub Actions billing to be fixed. Development macOS
app/DMG/ZIP artifacts are ad-hoc signed, not notarized or public distribution. This audit opens no other-repository PR,
changes no upstream dependency and makes no publication/installation decision.
Future Rust adoption still requires explicit direction, current-protocol parity,
ADRs and a feature-equivalent value/distribution comparison.

## Not silently added to the milestone

The owner subsequently requested the explicitly scoped
[protocol-41 platform extension](architecture/platform-workflows.md):
Sky/Terra/Glacier knowledge, reviewed hooks/repository-backed marketplace,
two-way GitHub/Linear workflows, private/workspace and Python/Rust/Go caches,
and a qualified SendBox requirement for whole-descendant containment.
This request does not change this handoff's first-milestone estimate or
retrospectively qualify older images/archives.

Broader orchestrator/session groups, multi-repo coordination, Porto/database
plugins, scheduling, specialized modes and managed cloud provisioning remain
separate deferred work. Do not silently make them new first-milestone blockers.
The [cloud fleet on Agent Substrate analysis](architecture/cloud-fleet-substrate.md)
records how hosted fleets could follow production SendBox; it is not roadmap work.
