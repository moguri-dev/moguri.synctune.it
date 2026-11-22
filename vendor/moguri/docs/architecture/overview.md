# Initial executable architecture

This is the first working checkpoint, not the completed first milestone.
The implementation specification remains the target; `phase-zero.md` records
what has actually been validated.

## Change contract

Reuse pi-ai (MIT) solely behind the service/worker provider boundary, OpenTUI
(MIT) for terminal rendering, React (MIT) for both clients, Electron (MIT) and
Vite (MIT) for desktop, TypeBox (MIT) for validation, `ws` (MIT) for events,
`node-pty` (MIT) for owned commands, and `@napi-rs/keyring` (MIT) for secrets.
The embedded desktop terminal uses `ghostty-web` (MIT) and Ghostty's actual
WASM core, not a Moguri-written terminal parser/renderer.
Node's SQLite driver avoids an additional database addon. Dependency notices
are retained in installation and packaged dependencies.
The [SDK platform contract](sdk-platform.md) adds the official MCP SDK,
sqlite-vec, Ajv, YAML, ignore and Cheerio; the [license inventory](../third-party.md)
records build-only rasterization and the pinned native speech runtime.

The invariant is one service writer, one append-only event history, and one
shared typed command protocol. Clients cannot approve on behalf of a model,
silently substitute a model/backend, reset accounting, or replay a command
because a connection was lost. Commands carry idempotency IDs; editable data
carries revision checks.

Database migration 1 introduces events, command receipts and content-addressed
attachment snapshots in transactional SQLite migrations. Opening newer state
fails explicitly. Projections rebuild from events. Durable additions require a
migration and recovery tests, not deletion of user state.
Migration 2 adds project-scoped derived repository caches and graph tables.
Migration 3 adds derived dependency-cache object metadata, local board/ticket
and cache-receipt events. Event envelopes remain schema version 1; the client
protocol is version 15. The [workspace contract](workspace-platform.md) records
cache/advisory, read-only integration and recovery boundaries.
Migration 4 adds encrypted retention compartments while preserving prior event
identity/sequence. The [session workspace contract](session-workspace.md)
records held prompts, hard read-only/side modes, project settings, independent
artifacts and deletion/restart boundaries.
Migration 5 adds optional shared model/window/effort controls, per-step
provenance and local context previews; the [composer contract](model-controls.md)
records supported transport qualification and estimate boundaries.
Migration 6 adds nullable project scope and OAuth/configuration/attention events;
the [engagement contract](engagement.md) records exact source consent, reviewed
metachat, credential cleanup and non-authoritative question hints.
Migration 7 adds explicit local endpoints, startup-control provenance and typed
context descriptors without rewriting legacy identities or defaults. The
[runtime foundation](runtime-foundation.md) and [typed-input contract](context-inputs.md)
record model/resource identity, image normalization, exact source consent and
the still-unqualified native execution boundary.
Migration 8 adds the [owned SSH transport](execution-transports.md), pinned
worker/target/root identity, atomic frame receipts and late accounting without
side-effect replay. Native SendBox remains unqualified.
Migration 9 adds [managed Local roots](managed-workspaces.md), per-root writer
leases and consistent filesystem surfaces. Git intent is recorded before effects;
restart reconciles partial state without replay or base-root fallback.
Migration 10 gives typed text artifacts independent encryption, source actors,
revisions and reviewed project retain/export/delete. Legacy event plaintext and
identity survive transactional rekeying; no source-session retention is implied.
Migration 11 adds real structured question/answer state, actual-user endpoint
checks and atomic opt-out answer retention. Heuristics and queued prompts never
become answers or permissions.
Migration 12 adds artifact folder/work-item associations and reviewed Local
repository-copy jobs. Optional new local commits preserve checkout/index;
project deletion revalidates actual copies rather than assuming CLI success.
Migration 13 adds cumulative profile-owned model accounting, atomic
reservations, explicit estimated token/USD preferences and separate hard policy.
Unknown usage is held across stop/restart/source retention; no exact bill or
automatic checkpoint commit is claimed.
Migration 14 adds the [profile authority](profiles.md): immutable scoped
store/controller/SDK views, composite receipts preserving Default identities,
owned setup/retry/stop, isolated secrets/data and global policy/preferences/
budget authority. Switching preserves old editors' destinations and running
work; native preview/notification identities include the profile.
Migration 15 adds [Guided offered-choice advice](engagement.md#guided-advice-and-actual-answers)
from the actual existing solver call. Model recommendations and exact-step
approval guidance remain separate from real user answers/permissions; no
auxiliary inference, automatic decision or ciphertext rewrite is implied.

Both clients share the SDK and subscribe to the same sequenced stream. The
service owns projects, sessions, transcripts, drafts, queue, pending approvals,
policy, settings, capability registry/proposals/jobs and accounting. Desktop-only
panel selection is presentation state. `moguri/node` can discover or explicitly
embed the same runtime without Electron. Public package declarations and
consumption outside the checkout are executable acceptance checks.

Local/core qualified SSH execution, fixed Copilot/configured local models and
Unlimited or explicit estimated budgets are operational. Remote side-panel/executable-extension
transports remain explicitly unavailable.
Manual is default; Guided still needs a human and Autonomous uses only explicit
user grants. Autopilot and unqualified environments remain unavailable.

The agent loop runs in a separate Node process. It receives short-lived
per-request model access through a private IPC channel, never the control-plane
token or refresh credential. Every tool needs exact human approval or an
explicit bounded user delegation. MCP calls always need exact nested-tool
approval, including a fresh schema/server fingerprint. Connectors run in
separate bounded processes, not the authoritative service's JS context.
File tools are project-scoped, reject protected paths and symlink escapes, and
require a base digest before overwriting. Approved shell commands are explicitly
unsandboxed Local execution, not filesystem isolation.

Stopping records requested and acknowledged cancellation before a terminal
outcome. Process groups receive bounded TERM/KILL escalation. Unknown or
surviving work is partial/failed, never successful. Workers clean up on parent
disconnect. Restart reconciliation does not retry model requests, file writes
or shell commands and does not claim unconfirmed cleanup.

Unit, real-HTTP/WebSocket integration, migration, restart, queue/approval race,
worker/process-tree cancellation and cross-client tests establish this contract.
Provider and UI tests use generated fixtures without personal data; live
Copilot authorization is a separate user action.

Repository memory is opt-in local lexical-vector retrieval plus an import/symbol
snapshot graph. Style facts and approved skills are independent of session
retention. Optional tool-less subagents use the same provider and record their
own usage. Proposals never apply themselves; declarative plugins and scripts
cannot widen policy. Local speech is native inference using an explicitly
downloaded, integrity-checked model, with no hosted-ASR path.
