# Permissions and execution

Env chooses where work runs. Autonomy controls tool approval behavior. Read-only mode, hard denials, workspace restrictions, and budgets remain separate boundaries.

## Understand autonomy

| Mode | Behavior |
| --- | --- |
| Manual | Covered native operations use policy. Shell commands and external MCP calls ask unless a matching remembered grant exists. |
| Guided | The model can recommend a choice, but you make the actual answer or approval. |
| Autopilot | Explicitly opting in enables automatic declared tool and command approvals for subsequent work. Hard restrictions still apply. |
| Autopilot Max | Adds the configured, qualified bounded decision layer. Local readiness is required; dedicated Jev and Remote/native Max remain unqualified. |

Selecting a model or opening a session does not opt you into more autonomy. Older bounded Autopilot choices require explicit reselection to adopt automatic approvals.

Factory Manual and Guided policy permits covered native file reads, searches, data queries, and edits without a permission card. Explicit stricter ask or deny rules still win.

`/yolo` is an explicit session-only delegation action. It chooses qualified Max when ready, otherwise Autopilot. It does not change model, Env, budget, read-only mode, or hard policy. A held `/yolo` remains held.

## Use read-only mode

Select read-only in the composer or use:

```sh
moguri session mode read-only --session SESSION_ID
moguri slash '/read-only' --session SESSION_ID
moguri slash '/agent' --session SESSION_ID
```

Read-only disables writes, shell execution, external MCP execution, evolution, and Git mutations. Scoped reads still follow policy.

Changing mode blocks new prohibited actions at the safe boundary. It cannot undo an effect that already started. Side chats cannot promote themselves to agent mode.

## Review and remember approvals

Read the complete command or tool arguments. Approval cards can grant:

- Only the current action.
- A matching action for this session.
- A matching action for this project.
- A matching action across Local projects in the current profile.

Command grants bind exact text or the displayed simple family. Compound shell expressions need their own review. MCP grants bind server configuration, tool, and discovered schema.

**Settings / Guardrails / Remembered approvals** lists and revokes grants. They do not cross profiles or execution environments.

```sh
moguri slash '/approvals' --session SESSION_ID
moguri slash '/approvals revoke APPROVAL_ID' --session SESSION_ID
```

A tool annotation claiming "read-only" is not permission. A model answer or Guided recommendation is not a human approval.

## Allow websites

**Settings / Guardrails / Local website allowlist** accepts an exact hostname or HTTPS/loopback HTTP origin at session, project, or profile-wide Local scope.

```sh
moguri firewall list --session SESSION_ID
moguri firewall add session docs.example.test --session SESSION_ID
moguri firewall remove ALLOWANCE_ID --session SESSION_ID
```

No wildcard, credential, path, query string, or cross-profile allowance is accepted here. Redirects and browser requests stay within the admitted scope.

This allowlist is not an OS firewall for approved Local shell commands. Remote does not inherit Local entries. Sandbox has its own enforced networking policy.

## Local execution

Local runs on your machine in the session's captured workspace or Home boundary. A repository or worktree is not an OS sandbox.

File tools enforce protected paths, denied folders, symlink restrictions, and fresh base digests for writes. Editing a file is not permission to run it. Custom scripts and approved shell commands execute host code without SendBox containment.

An ordinary command belongs to its turn. Detached or daemonizing agent commands are not supported as successful managed work. Command watches have separate captured ownership and deadlines.

Stop targets known owned process groups. It cannot prove cleanup of every detached or reparented descendant, and it does not undo completed writes. Partial or unconfirmed effects require inspection before Resume.

## Set up SSH

Prepare a host you control with the matching packed Moguri build and Node 26.4 or newer within Node 26. The worker command can be `moguri worker --stdio` or an explicit compatible Node executable and installed remote bridge.

Open **Settings / Remote SSH** and provide the target fields:

| Field | Value |
| --- | --- |
| `id`, `name` | Stable target identifier and display label. |
| `host`, `port`, `user` | The explicit SSH destination. |
| `hostKey` | Independently verified complete public-key type and base64, not just a fingerprint. |
| `identityFile` | Explicit user-owned private identity file, mode 0600 or stricter. Its contents are not copied. |
| `stateDir` | Absolute canonical private state directory on the target. |
| `command` | Worker argv array, with one to eight explicit entries. |
| `allowCopilot` | Separate consent to forward short-lived request access to that host. |
| `models` | Explicit endpoint declarations using the model configuration schema. |
| `mcpGrants` | Optional separately reviewed Remote MCP grants. Prefer the grant UI rather than inventing entries. |

Moguri does not provision a cloud host, install a remote package, use ambient SSH configuration, or enable agent forwarding.

1. Verify the host key independently.
2. Save the reviewed target.
3. Choose Probe to verify the installed worker and runtime.
4. Set each project's Canonical remote path.
5. Choose Remote in the session's Env control.
6. Review context transfer and select a compatible model explicitly.

```sh
moguri remote status
moguri remote probe
```

Remote model calls, files, and commands execute on the pinned host. The local service retains history and approvals. `localhost` in a remote endpoint means that host.

Copilot forwarding does not forward refresh credentials or the local keychain. Remote model keys are resource-bound and stored separately through masked inputs or piped stdin.

An unavailable host, changed key, invalid root, or incompatible worker blocks work. Moguri does not substitute your laptop's checkout. Project-free Remote chats have no project filesystem root.

SSH secures transport and chooses a location. It does not provide Sandbox containment.

## Recover Remote work

Use **Owned execution recovery** in Remote settings or Insights to inspect the original run.

```sh
moguri remote reconcile RUN_ID
```

Reconciliation reads original receipts and late usage. It does not launch another worker or replay tools.

If cleanup is unconfirmed, inspect the actual remote processes before an explicit acknowledgement. An acknowledgement records your inspection, not proof of cleanup.

Files, Changes, and Plan use the real SSH root. Remote user terminals also keep their captured host and root across recovery. Local browser previews do not silently tunnel remote localhost ports.

## Set up Sandbox

Managed setup currently targets supported Apple-silicon macOS with Apple Containerization. The app bundles SendBox 0.2.4 and a compatible pinned Linux worker image.

1. Choose Sandbox in Env.
2. Review Set up SendBox, including workspace and network policy.
3. Acknowledge the actual runtime review and choose Enable SendBox.
4. Complete any requested administrator approval yourself.
5. Wait for qualification before switching the original session to Sandbox.

You do not need to run a container build or paste image digests for managed setup. Cancelling preserves the original Env and draft. An admitted setup job is not a ready runtime.

Current physical validation still catches intermittent guest-supervisor startup failures. Historical successful runs or an enabled setting do not qualify every new launch. Unsupported prerequisites and failed checks block work without a Local fallback.

SendBox 0.2.4's default GitHub grant includes GitHub Meta domains and IP ranges, including shared-cloud infrastructure. That is broader than exact-host-only networking and is disclosed during setup. Provider access, tool permissions, and runtime readiness are still separate checks.

```sh
moguri sandbox status
moguri sandbox runs
moguri sandbox setup
moguri sandbox updates
```

Updating the public runtime inventory does not install or activate another version. A changed worker or distribution needs its matching setup review.

## Require containment

**Guardrails / Require qualified SendBox** can require whole-descendant containment for new work:

```sh
moguri containment status
moguri containment require-sandbox --confirm-review
```

This does not change an existing session's Env, select a model, or qualify an old workload. If the required runtime is unavailable, new work remains blocked.

Local and SSH process groups are not a substitute for this boundary.

## Review scripts and proposed source changes

Repository-script review shows the complete exact source before execution approval. Unsafe findings need a separate actual-user force decision, which still cannot override hard policy.

Candidates stage proposed changes separately from the accepted source. Generation, staging, validation, application, and Git publication have different reviews.

```sh
moguri candidate eligibility --session SESSION_ID
moguri candidate list
moguri candidate read CANDIDATE_ID
moguri candidate apply-preview CANDIDATE_ID --session SESSION_ID
```

Do not treat a model's proposal, a passed preview, or staged bytes as your acceptance. Review the exact current source and outcome before applying or publishing.

Available Local, SSH, and native staging transports have their own qualification. Native-model work can have a separately disclosed Local-Git publication boundary, which needs Local policy and a distinct user review.

For access errors or unknown effects, use [troubleshooting](troubleshooting.md).
