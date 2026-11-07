# SDK usage

The SDK powers Moguri's desktop app, CLI, and TUI. Use it to build a client or integrate with the same service contracts, not to bypass approvals or create a second authority over an existing store.

## Install a packed SDK

The package is private and is not published to the npm registry. Obtain a matching source checkout or packed archive from the maintainer.

From the Moguri source root:

```sh
npm ci
npm run build
npm pack
```

Install the resulting archive in a Node 26 consumer:

```sh
npm install /absolute/path/moguri-version.tgz
```

Replace the filename with the actual archive. Native dependencies must match the consumer platform. Operational CLI/native setup needs the normal reviewed lifecycle steps, not `--ignore-scripts`.

When npm's script allowlist is enabled, review the exact file dependency and required native steps. The packed Moguri helper can be approved by package name:

```sh
npm install-scripts ls
npm install-scripts approve moguri
npm rebuild moguri
```

Approval is not proof that an interrupted installation completed. Check the actual outcome before retrying.

## Choose an entrypoint

| Import | Use |
| --- | --- |
| `moguri` | Browser-safe `MoguriSdk`, protocol types, defaults, and `DraftEditor`. |
| `moguri/node` | `connectMoguri`, `createRuntime`, private service discovery, and explicit owned-service lifecycle helpers. |
| `moguri/react` | Renderer-independent `useMoguri` subscription hook. |
| `moguri/mcp` | Outward native MCP bound to one session. |

Importing alone does not start a service, read credentials, or start a model. A browser-safe export is not permission to expose a private service token on a public webpage.

## Connect a Node client

Use private discovery instead of constructing or printing connection metadata:

```js
import { connectMoguri } from "moguri/node";

const sdk = await connectMoguri();
try {
  const settings = sdk.settings.get();
  const snapshot = sdk.getState().snapshot;
  if (!settings || !snapshot) {
    throw new Error("Moguri is not connected.");
  }
  console.log(settings.values.appearance.theme);
  console.log(snapshot.projects.map(({ id, name }) => ({ id, name })));
} finally {
  sdk.disconnect();
}
```

Connection metadata includes a private token. Do not print it, put it in a URL, send it to a model, or give it to plugins. Copilot login, endpoint keys, and the local SDK token have different purposes.

Disconnect closes this client, not the shared service or owned work. A subscription should also dispose its unsubscribe function when the UI unmounts.

## Select an immutable profile

Omitted scope means Default. It does not mean the last profile selected in another UI.

```js
import { connectMoguri } from "moguri/node";

const profileId = process.argv[2];
if (!profileId) {
  throw new Error("Pass a profile ID from moguri profile list.");
}
const sdk = await connectMoguri({ profileId });
try {
  console.log(sdk.profileId);
  const catalogue = await sdk.models.catalogue();
  console.log(catalogue.providers.map(({ id, enabled }) => ({ id, enabled })));
} finally {
  sdk.disconnect();
}
```

`sdk.profiles.open(profileId)` returns a new ready client after checking the profile. The old client and its draft editors retain their original destination.

Flush drafts and block unsaved edits before switching. A profile switch does not copy accounts, context, approvals, or ownership, and cannot escape global restrictions or budget caps.

## Create an idle session

Creating a session is separate from selecting a model or sending a prompt:

```js
import { connectMoguri } from "moguri/node";

const sdk = await connectMoguri();
try {
  const result = await sdk.sessions.create(null, "Demo chat");
  if (!result.id) {
    throw new Error("Session creation did not return an ID.");
  }
  console.log(result.id);
} finally {
  sdk.disconnect();
}
```

`null` creates a project-free chat. A real project ID binds an existing project. Optional new-session control overrides are snapshotted once; they do not rewrite other sessions.

Use the installed declarations for the current `Controls` and `ControlDefaults` types. Do not copy a guessed control object from another protocol version.

## Capability groups

The public facades below share the same policy and owner checks. Use the shipped type declarations for exact argument and result types in your installed build.

| Facades | Main use and limits |
| --- | --- |
| `profiles` | Catalogue, create/update, explicit setup retry/stop/wait, immutable clients, shared defaults and caps. |
| `settings`, `prompt`, `configuration`, `metachat` | Revisioned settings and prompt changes, previews, and human-reviewed configuration proposals. |
| `projects`, `workspaces` | Registered roots, worktrees, project configuration, reviewed imports, and exact filesystem/Git reads. |
| `sessions`, `prompts`, `scheduledPrompts` | Idle creation, saved controls, drafts, queues, schedules, navigation, and source-bound children. |
| `models`, `routing`, `compactions` | Configured model availability, source choice, Kupo policy/history, exact tuning, and reviewed metered compaction. |
| `budgets`, `prices`, `dashboard` | Owning-session/profile/global accounting, reference estimates, reservations, and scoped read projections. |
| `tools`, `approvals`, `webAllowlist`, `scriptReviews` | Typed discovery, exact calls/grants, website scope, and complete script review. Discovery is not permission. |
| `git`, `github`, `linear`, `issues`, `kanban`, `repositories` | Exact-root Git and external workflows, local tickets, retained observations, and explicit attribution. |
| `attachments`, `artifacts`, `plans` | Immutable context, independent retained text, and digest/binding-checked plan saves. |
| `activity`, `agentTerminals`, `telemetry` | Original public operation data and sanitized accounting, not private reasoning or User-console buffers. |
| `memory`, `skills`, `capabilities`, `knowledge`, `hooks`, `marketplace` | Opt-in source retrieval, fresh guidance, reviewed disabled imports, and explicit knowledge promotion. |
| `mcp`, `remote`, `sandbox`, `containment` | Server discovery/auth, pinned transports, readiness, reviewed resource grants, and execution boundaries. |
| `terminal`, `browser`, `chatOutputs`, `apps` | Session-owned consoles, isolated browser authority, interactive HTML, and approved app/Playwright output. |
| `coordination`, `workflows`, `subagents` | Root-bound messages, explicit task commands, and optional tool-less model children. |
| `candidates`, `compound`, `winddown`, `decisions`, `roleSequences` | Separately reviewed proposals, roles, cost, tests, source acceptance, finishing, and retained evidence. |
| `jobs`, `attention`, `runtime`, `application`, `notifications`, `integrations`, `voice` | Owned waits/cancellation, read acknowledgement, lifecycle/settings, and explicit local speech operations. |
| `cache` | Verified exact dependency plans and separately reviewed script-free installs. |

No facade substitutes another profile, Local checkout, provider, or model when the selected authority is unavailable.

## Use the command intake

Frontend slash text uses `sdk.commands.submit`, not eager low-level dispatch. Commands retain their input, queue ordering, current source, and exact UI outcome.

Held text stays inert. UI-only results wait for an attached compatible handler. Claim, choose, and complete operations preserve actual client ownership rather than inventing a rendered view.

`DraftEditor` handles saved text and revisions. Use its current installed methods rather than writing directly to a stale snapshot. Held send behavior is separate from sending a new turn.

For precise command arguments, see [CLI and shortcuts](cli.md#submit-slash-commands).

## Embed an owned runtime

Embedding is an explicit alternative to joining an existing service. Use an unused private directory outside project/worktree roots and verify that no other service owns it.

```js
import { resolve } from "node:path";
import { connectMoguri, createRuntime } from "moguri/node";

const directory = process.argv[2];
if (!directory) {
  throw new Error("Pass an unused private state directory.");
}
const stateDir = resolve(directory);
const runtime = await createRuntime({ stateDir });
let sdk;
try {
  sdk = await connectMoguri({ stateDir, autoStart: false });
  const snapshot = sdk.getState().snapshot;
  if (!snapshot) {
    throw new Error("The embedded runtime is not connected.");
  }
  console.log(snapshot.projects.length);
} finally {
  sdk?.disconnect();
  await runtime.close();
}
```

`runtime.close()` stops that owned runtime and its known work. It is not the same as disconnecting a client. Do not open a second writer on another application's existing database.

## Handle errors and uncertain outcomes

SDK failures can be `ClientError` instances with `code`, `message`, and optional HTTP `status`.

```js
import { ClientError } from "moguri";
import { connectMoguri } from "moguri/node";

let sdk;
try {
  sdk = await connectMoguri();
  const catalogue = await sdk.models.catalogue();
  console.log(catalogue.models.length);
} catch (error) {
  if (error instanceof ClientError) {
    console.error(error.code, error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
} finally {
  sdk?.disconnect();
}
```

| Condition | What to do |
| --- | --- |
| Disconnected client | Reconnect before mutating state. Preserve unsent edits. |
| Stale revision or digest | Reload the actual current source and review again. |
| `query_timeout` | The read exceeded its deadline. Inspect the original scope, then retry the read explicitly if appropriate. |
| `command_pending` | Inspect the original receipt. A timeout did not settle the command. |
| `command_outcome_unknown` | Inspect source effects and the original command receipt before another write. |
| Unready profile or transport | Repair that selected scope. Do not switch to Default or Local as a fallback. |
| Partial or unconfirmed job | Preserve the actual job ID, outcome, and held accounting. |

Command IDs are idempotent. The SDK can inspect an original receipt after a lost response; that is not authorization to resend the external effect.

`jobs.wait` timing out or disconnecting does not cancel the job. Cancellation is a separate explicit operation. Terminal input and resize are ephemeral and must not be replayed through durable command receipts.

## Verify a consumer

From a complete Moguri source checkout, `npm run verify:sdk` packs and installs an independent consumer, checks the public entrypoints, and runs generated service/MCP/native transport checks.

```sh
npm run verify:sdk
```

This is not a personal provider login, microphone recording, weight download, or proof that every native release is qualified. A separately delivered archive retains its own platform and runtime checks.

Keep your SDK, service, workers, and native app compatible. Upgrades preserve state; they do not require deleting history. See [troubleshooting](troubleshooting.md#startup-and-version-mismatches).
